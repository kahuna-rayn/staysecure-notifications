/**
 * Generic notification service — data-driven approach.
 * All notifications use sendNotificationByEvent(), driven by the notification_rules table.
 *
 * Usage:
 *   sendNotificationByEvent(supabase, 'lesson_completed', { user_id, lesson_id, learning_track_id, clientId })
 *   sendNotificationByEvent(supabase, 'document_assigned', { user_id, document_title, due_days, clientId })
 *
 * To add a new notification type:
 *   1. Add a case to gatherTemplateVariables() below.
 *   2. Insert a row in notification_rules linking the event to an email_template.
 *   No other code changes needed.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { emailService, gatherLessonCompletedVariables } from './emailService';

export interface NotificationContext {
  user_id: string;
  lesson_id?: string;
  learning_track_id?: string;
  task_id?: string;
  review_id?: string;
  score?: number;
  milestone_percentage?: number;
  certificate_id?: string;
  correct_answers?: number;
  total_questions?: number;
  time_taken_seconds?: number;
  manager_id?: string;
  document_title?: string;
  due_days?: number;
  /** Client ID (e.g. "nexus"). Pass explicitly — do NOT rely on window.location here. */
  clientId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send one or more notifications for a given event type.
 * Looks up active rules in notification_rules, checks preferences,
 * gathers variables, and sends via emailService.
 */
export async function sendNotificationByEvent(
  supabase: SupabaseClient,
  eventType: string,
  context: NotificationContext
): Promise<void> {
  try {
    const { user_id } = context;

    if (!user_id) {
      console.warn(`Cannot send ${eventType} notification: no user_id provided`);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user_id)
      .single();

    const userEmail = profile?.username;
    if (!userEmail) {
      console.warn(`Cannot send ${eventType} notification: no email for user ${user_id}`);
      await supabase.from('notification_history').insert({
        user_id,
        trigger_event: eventType,
        status: 'skipped',
        skip_reason: 'no_email',
        error_message: `No email found in profiles.username for user ${user_id}`,
        template_variables: context,
      });
      return;
    }

    const { data: rules, error: rulesError } = await supabase
      .from('notification_rules')
      .select('id, name, email_template_id, trigger_conditions')
      .eq('trigger_event', eventType)
      .eq('is_enabled', true)
      .eq('send_immediately', true);

    if (rulesError) {
      console.error(`Error querying notification rules for ${eventType}:`, rulesError);
      return;
    }

    if (!rules || rules.length === 0) {
      console.debug(`[notifications] No active rules for event: ${eventType}`);
      return;
    }

    for (const rule of rules) {
      try {
        if (rule.trigger_conditions && !checkTriggerConditions(rule.trigger_conditions, context)) {
          console.debug(`[notifications] Trigger conditions not met for rule ${rule.name}`);
          continue;
        }

        // Check email preferences — user-level first, fallback to org-level
        let preferences: {
          email_enabled: boolean;
          track_completions: boolean;
          achievements: boolean;
          lesson_reminders: boolean;
        } | null = null;
        let preferenceSource = 'organization';

        const { data: userPrefs } = await supabase
          .from('email_preferences')
          .select('email_enabled, track_completions, achievements, lesson_reminders')
          .eq('user_id', user_id)
          .maybeSingle();

        if (userPrefs) {
          preferences = userPrefs;
          preferenceSource = 'user';
        } else {
          const { data: orgPrefs, error: orgPrefError } = await supabase
            .from('email_preferences')
            .select('email_enabled, track_completions, achievements, lesson_reminders')
            .is('user_id', null)
            .maybeSingle();

          if (orgPrefError || !orgPrefs) {
            console.error(`Error fetching org preferences for rule ${rule.name}:`, orgPrefError);
            continue;
          }
          preferences = orgPrefs;
        }

        if (!preferences) {
          console.error(`No preferences found for rule ${rule.name}`);
          continue;
        }

        if (preferences.email_enabled === false) {
          await recordNotificationHistory(supabase, {
            user_id, rule_id: rule.id, email_template_id: rule.email_template_id,
            trigger_event: eventType, status: 'skipped',
            skip_reason: `${preferenceSource}_email_disabled`,
          });
          continue;
        }

        // Type-specific preference gate
        let typeEnabled = true;
        let skipReason = '';
        if (['lesson_completed', 'track_milestone_50', 'track_completed'].includes(eventType)) {
          typeEnabled = preferences.track_completions !== false;
          if (!typeEnabled) skipReason = `${preferenceSource}_track_completions_disabled`;
        } else if (eventType === 'quiz_high_score' || eventType.startsWith('quiz_')) {
          typeEnabled = preferences.achievements !== false;
          if (!typeEnabled) skipReason = `${preferenceSource}_achievements_disabled`;
        } else if (eventType === 'document_assigned') {
          const pref = (preferences as Record<string, unknown>).document_notifications;
          typeEnabled = pref !== false;
          if (!typeEnabled) skipReason = `${preferenceSource}_document_notifications_disabled`;
        } else if (eventType === 'document_completed_manager') {
          const pref = (preferences as Record<string, unknown>).document_completed_manager;
          typeEnabled = pref !== false;
          if (!typeEnabled) skipReason = `${preferenceSource}_document_completed_manager_disabled`;
        }

        if (!typeEnabled) {
          await recordNotificationHistory(supabase, {
            user_id, rule_id: rule.id, email_template_id: rule.email_template_id,
            trigger_event: eventType, status: 'skipped', skip_reason: skipReason,
          });
          continue;
        }

        const { data: template, error: templateError } = await supabase
          .from('email_templates')
          .select('id, type, subject_template, html_body_template')
          .eq('id', rule.email_template_id)
          .eq('is_active', true)
          .single();

        if (templateError || !template) {
          console.error(`No template found for rule ${rule.name}:`, templateError);
          continue;
        }

        const templateBody = template.html_body_template || '';
        const variables = await gatherTemplateVariables(supabase, eventType, context, templateBody);

        const result = await emailService.sendEmailFromTemplate(
          template.type,
          userEmail,
          variables,
          supabase,
          { userId: user_id }
        );

        const historyStatus = result.skipped ? 'skipped' : result.success ? 'sent' : 'failed';

        await recordNotificationHistory(supabase, {
          user_id, rule_id: rule.id, email_template_id: rule.email_template_id,
          trigger_event: eventType, template_variables: variables,
          status: historyStatus as 'sent' | 'failed' | 'skipped',
          error_message: result.success || result.skipped ? null : result.error,
          skip_reason: result.skipped ? result.skipReason : undefined,
          sent_at: result.success ? new Date().toISOString() : null,
        });

        if (result.success) {
          console.debug(`[notifications] ✅ ${eventType} sent (rule: ${rule.name})`);
        } else if (result.skipped) {
          console.debug(`[notifications] ⚠️ ${eventType} skipped (rule: ${rule.name}) - ${result.skipReason}`);
        } else {
          console.error(`[notifications] ❌ ${eventType} failed (rule: ${rule.name}):`, result.error);
        }
      } catch (ruleError) {
        console.error(`Error processing rule ${rule.name}:`, ruleError);
      }
    }
  } catch (error) {
    console.error(`Error sending ${eventType} notification:`, error);
    // Don't throw — notification failure must never break the main flow
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Variable gathering — add a new case here to support a new event type
// ─────────────────────────────────────────────────────────────────────────────

export async function gatherTemplateVariables(
  supabase: SupabaseClient,
  eventType: string,
  context: NotificationContext,
  templateText?: string
): Promise<Record<string, unknown>> {
  const clientId = context.clientId;
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://staysecure-learn.raynsecure.com';
  const clientPath = clientId && clientId !== 'default' ? `/${clientId}` : '';
  const clientLoginUrl = `${origin}${clientPath}/login`;

  // ── lesson_completed ──────────────────────────────────────────────────────
  if (eventType === 'lesson_completed' && context.lesson_id) {
    let variables = await gatherLessonCompletedVariables(supabase, {
      user_id: context.user_id,
      lesson_id: context.lesson_id,
      learning_track_id: context.learning_track_id,
      clientId,
    });
    variables = { ...variables, client_login_url: clientLoginUrl };
    if (templateText) {
      variables = await mergeWithLookup(supabase, variables, templateText, context);
    }
    return variables;
  }

  // ── track_milestone_50 / track_completed ──────────────────────────────────
  if ((eventType === 'track_milestone_50' || eventType === 'track_completed') && context.learning_track_id) {
    const { data: trackProgress } = await supabase
      .from('user_learning_track_progress')
      .select('progress_percentage, enrolled_at, started_at')
      .eq('user_id', context.user_id)
      .eq('learning_track_id', context.learning_track_id)
      .single();

    const { data: track } = await supabase
      .from('learning_tracks').select('title').eq('id', context.learning_track_id).single();

    const { data: profile } = await supabase
      .from('profiles').select('full_name').eq('id', context.user_id).single();

    const { data: completedLessons } = await supabase
      .from('user_lesson_progress').select('lesson_id')
      .eq('user_id', context.user_id).not('completed_at', 'is', null);

    const { data: trackLessons } = await supabase
      .from('learning_track_lessons').select('lesson_id')
      .eq('learning_track_id', context.learning_track_id);

    const totalLessons = trackLessons?.length || 0;
    const lessonsCompletedInTrack = completedLessons?.filter(
      (cl: { lesson_id: string }) => trackLessons?.some((tl: { lesson_id: string }) => tl.lesson_id === cl.lesson_id)
    ).length || 0;

    const { data: completedLessonProgress } = await supabase
      .from('user_lesson_progress')
      .select('started_at, completed_at')
      .eq('user_id', context.user_id)
      .not('completed_at', 'is', null)
      .in('lesson_id', trackLessons?.map((tl: { lesson_id: string }) => tl.lesson_id) || []);

    let timeSpentHours = 0;
    if (completedLessonProgress) {
      const totalMs = completedLessonProgress.reduce(
        (sum: number, lp: { started_at?: string; completed_at?: string }) =>
          lp.completed_at && lp.started_at
            ? sum + (new Date(lp.completed_at).getTime() - new Date(lp.started_at).getTime())
            : sum,
        0
      );
      timeSpentHours = Math.round((totalMs / (1000 * 60 * 60)) * 10) / 10;
    }

    let variables: Record<string, unknown> = {
      user_name: profile?.full_name || 'User',
      learning_track_title: track?.title || 'Learning Track',
      track_progress_percentage: trackProgress?.progress_percentage || 0,
      lessons_completed_in_track: lessonsCompletedInTrack,
      total_lessons_in_track: totalLessons,
      time_spent_hours: timeSpentHours,
      client_login_url: clientLoginUrl,
    };
    if (templateText) {
      variables = await mergeWithLookup(supabase, variables, templateText, context);
    }
    return variables;
  }

  // ── quiz_high_score ───────────────────────────────────────────────────────
  if (eventType === 'quiz_high_score' && context.lesson_id) {
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons').select('id, title, lesson_type')
      .eq('id', context.lesson_id).eq('lesson_type', 'quiz').single();

    if (lessonError || !lesson) {
      return { user_id: context.user_id, lesson_id: context.lesson_id, score: context.score || 0, client_login_url: clientLoginUrl };
    }

    const { data: profile } = await supabase
      .from('profiles').select('full_name').eq('id', context.user_id).single();

    let correctAnswers = context.correct_answers;
    let totalQuestions = context.total_questions;
    let timeTakenSeconds = context.time_taken_seconds;

    if (correctAnswers === undefined || totalQuestions === undefined) {
      const { data: attempt } = await supabase
        .from('quiz_attempts')
        .select('correct_answers, total_questions')
        .eq('user_id', context.user_id)
        .eq('lesson_id', context.lesson_id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (correctAnswers === undefined) correctAnswers = attempt?.correct_answers;
      if (totalQuestions === undefined) totalQuestions = attempt?.total_questions;
    }
    if (correctAnswers === undefined || correctAnswers === null) correctAnswers = 0;
    if (totalQuestions === undefined || totalQuestions === null) totalQuestions = 0;
    if (timeTakenSeconds === undefined) timeTakenSeconds = 0;

    const finalTime = timeTakenSeconds || 0;
    const minutes = Math.floor(finalTime / 60);
    const seconds = finalTime % 60;
    let completionTime = 'N/A';
    if (finalTime > 0) {
      if (minutes > 0 && seconds > 0) completionTime = `${minutes}m ${seconds}s`;
      else if (minutes > 0) completionTime = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      else completionTime = `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    let variables: Record<string, unknown> = {
      user_name: profile?.full_name || 'User',
      quiz_title: lesson.title || 'Quiz',
      score: context.score || 0,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      completion_time: completionTime,
      time_taken_seconds: finalTime,
      time_taken_minutes: Math.round((finalTime / 60) * 10) / 10,
      client_login_url: clientLoginUrl,
    };
    if (templateText) {
      variables = await mergeWithLookup(supabase, variables, templateText, context);
    }
    return variables;
  }

  // ── document_assigned ─────────────────────────────────────────────────────
  if (eventType === 'document_assigned') {
    const { data: profile } = await supabase
      .from('profiles').select('full_name').eq('id', context.user_id).single();

    const dueDays = context.due_days || 0;
    const dueDate = dueDays > 0
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() + dueDays);
          return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        })()
      : 'No due date';

    return {
      user_name: profile?.full_name || 'User',
      document_title: context.document_title || '',
      due_date: dueDate,
      due_days: dueDays,
      login_url: clientLoginUrl,
      client_login_url: clientLoginUrl,
    };
  }

  // ── document_completed_manager ────────────────────────────────────────────
  // user_id = manager (the recipient); employee_user_id = who completed the doc
  if (eventType === 'document_completed_manager') {
    const employeeId = context.employee_user_id || context.user_id;

    const { data: employeeProfile } = await supabase
      .from('profiles').select('full_name').eq('id', employeeId).maybeSingle();

    const { data: managerProfile } = await supabase
      .from('profiles').select('full_name').eq('id', context.user_id).maybeSingle();

    const completedAt = context.completed_at
      ? new Date(context.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return {
      manager_name: managerProfile?.full_name || 'Manager',
      employee_name: employeeProfile?.full_name || 'Team member',
      user_name: managerProfile?.full_name || 'Manager',
      document_title: context.document_title || '',
      completed_date: completedAt,
      login_url: clientLoginUrl,
      client_login_url: clientLoginUrl,
    };
  }

  // ── manager_employee_incomplete ───────────────────────────────────────────
  if (eventType === 'manager_employee_incomplete') {
    const managerId = context.manager_id || context.user_id;
    const { data: managerProfile } = await supabase
      .from('profiles').select('full_name').eq('id', managerId).single();
    const { data: employeeProfile } = await supabase
      .from('profiles').select('full_name, username').neq('id', managerId).limit(1).single();
    const { data: sampleLessons } = await supabase.from('lessons').select('id, title').limit(3);

    const incompleteLessons = (sampleLessons || []).map((l: { id: string; title: string }) => ({
      lesson_title: l.title, learning_track_title: 'Cybersecurity Fundamentals', due_date: null,
    }));
    const employeeName = employeeProfile?.full_name || 'Employee Name';
    const employeeEmail = employeeProfile?.username || 'employee@example.com';

    let variables: Record<string, unknown> = {
      manager_name: managerProfile?.full_name || 'Manager Name',
      employee_name: employeeName, employee_email: employeeEmail,
      user_name: employeeName, user_email: employeeEmail,
      reminder_attempts: 3, multiple_attempts: true,
      incomplete_lessons: incompleteLessons,
      total_incomplete_count: incompleteLessons.length,
      client_login_url: clientLoginUrl,
    };
    if (templateText) {
      variables = await mergeWithLookup(supabase, variables, templateText, context);
    }
    return variables;
  }

  // ── default: spread context + look up any missing template variables ──────
  let variables: Record<string, unknown> = {
    user_id: context.user_id,
    client_login_url: clientLoginUrl,
    ...context,
  };
  if (templateText) {
    variables = await mergeWithLookup(supabase, variables, templateText, context);
  }
  return variables;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge provided variables with any missing ones looked up from the DB.
 * Arrays in `variables` are never overwritten.
 */
async function mergeWithLookup(
  supabase: SupabaseClient,
  variables: Record<string, unknown>,
  templateText: string,
  context: NotificationContext
): Promise<Record<string, unknown>> {
  const templateKeys = extractVariableKeys(templateText);
  const providedKeys = new Set(Object.keys(variables));
  const missingKeys = templateKeys.filter(key => {
    if (!providedKeys.has(key)) return true;
    return !Array.isArray(variables[key]);
  });
  if (missingKeys.length === 0) return variables;

  const lookedUp = await lookupTemplateVariables(supabase, missingKeys, context.user_id);
  return { ...lookedUp, ...variables };
}

/**
 * Look up variable values directly from the DB — no @/ imports needed.
 * Order of resolution: computed → user profile → org → key personnel → translations default.
 */
async function lookupTemplateVariables(
  supabase: SupabaseClient,
  variableKeys: string[],
  userId?: string
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  const keyPersonnelRoles: Record<string, string> = {
    dpo_name: 'dpo', dpo_email: 'dpo',
    iso_name: 'iso', iso_email: 'iso',
    cem_name: 'cem', cem_email: 'cem',
    hib_name: 'hib', hib_email: 'hib',
    dpe_name: 'dpe', dpe_email: 'dpe',
  };

  for (const key of variableKeys) {
    try {
      // Computed system vars
      if (key === 'current_date') {
        result[key] = new Date().toISOString().split('T')[0];
        continue;
      }
      if (key === 'current_time') {
        result[key] = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        continue;
      }

      // User profile vars
      if (['user_name', 'first_name', 'last_name'].includes(key) && userId) {
        const { data } = await supabase
          .from('profiles').select('full_name, first_name, last_name').eq('id', userId).maybeSingle();
        if (data) {
          result['user_name'] = data.full_name || 'User';
          if (data.first_name) result['first_name'] = data.first_name;
          if (data.last_name) result['last_name'] = data.last_name;
        }
        continue;
      }

      // Org name
      if (key === 'org_name') {
        const { data } = await supabase.from('org_profile').select('org_name').maybeSingle();
        result[key] = data?.org_name || 'Your Organization';
        continue;
      }

      // Key personnel (dpo_name, iso_email, etc.)
      if (key in keyPersonnelRoles) {
        const roleType = keyPersonnelRoles[key];
        const { data } = await supabase
          .from('org_sig_roles').select('signatory_name, signatory_email')
          .eq('role_type', roleType).maybeSingle();
        if (data) {
          result[key] = key.endsWith('_name')
            ? (data.signatory_name || '')
            : (data.signatory_email || '');
        }
        continue;
      }

      // Everything else — look up from template_variable_translations
      const { data: variable } = await supabase
        .from('template_variables').select('id').eq('key', key).maybeSingle();
      if (variable) {
        const { data: translation } = await supabase
          .from('template_variable_translations')
          .select('default_value')
          .eq('variable_id', variable.id)
          .eq('language_code', 'en')
          .maybeSingle();
        if (translation?.default_value) result[key] = translation.default_value;
      }
    } catch (err) {
      console.error(`[notifications] Error looking up variable "${key}":`, err);
    }
  }

  return result;
}

function extractVariableKeys(template: string): string[] {
  const matches = Array.from(template.matchAll(/\{\{(\w+)\}\}/g));
  return [...new Set(matches.map(m => m[1]))];
}

function checkTriggerConditions(
  conditions: Record<string, unknown>,
  context: NotificationContext
): boolean {
  if (!conditions || typeof conditions !== 'object') return true;
  for (const [key, value] of Object.entries(conditions)) {
    const ctx = context[key];
    if (ctx === undefined || ctx === null) return false;
    if (typeof value === 'string' && value.startsWith('>=')) {
      if (typeof ctx !== 'number' || ctx < parseFloat(value.substring(2))) return false;
    } else if (typeof value === 'string' && value.startsWith('<=')) {
      if (typeof ctx !== 'number' || ctx > parseFloat(value.substring(2))) return false;
    } else if (typeof value === 'string' && value.startsWith('>')) {
      if (typeof ctx !== 'number' || ctx <= parseFloat(value.substring(1))) return false;
    } else if (typeof value === 'string' && value.startsWith('<')) {
      if (typeof ctx !== 'number' || ctx >= parseFloat(value.substring(1))) return false;
    } else if (value !== ctx) {
      return false;
    }
  }
  return true;
}

async function recordNotificationHistory(
  supabase: SupabaseClient,
  data: {
    user_id: string;
    rule_id: string;
    email_template_id: string;
    trigger_event: string;
    template_variables?: Record<string, unknown>;
    status: 'sent' | 'failed' | 'skipped';
    error_message?: string | null;
    skip_reason?: string;
    sent_at?: string | null;
  }
): Promise<void> {
  try {
    await supabase.from('notification_history').insert({
      user_id: data.user_id,
      rule_id: data.rule_id,
      email_template_id: data.email_template_id,
      trigger_event: data.trigger_event,
      template_variables: data.template_variables || {},
      status: data.status,
      error_message: data.error_message,
      skip_reason: data.skip_reason,
      sent_at: data.sent_at,
    });
  } catch (error) {
    console.error('[notifications] Error recording notification history:', error);
  }
}
