// Email service using Lambda + SES for better security

export interface EmailData {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
  skipReason?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject_template: string;
  html_body_template: string;
  text_body_template?: string | null;
  variables?: string[] | null;
  is_active?: boolean | null;
  system: boolean;
}

export class EmailService {
  private static instance: EmailService;
  private defaultFrom: string;
  private baseUrl: string;

  private constructor() {
    // This will be set by the consuming app via configure() if needed
    // We can't use Deno.env here as this runs in browser/Node.js, not Deno
    // Note: We now use Supabase Edge Function, so lambdaUrl is not needed
    this.defaultFrom = 'kahuna@raynsecure.com';
    this.baseUrl = '';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public static configure(config: {
    fromEmail?: string;
    baseUrl?: string;
  }): void {
    const instance = EmailService.getInstance();
    if (config.fromEmail) {
      instance.defaultFrom = config.fromEmail;
    }
    if (config.baseUrl) {
      instance.baseUrl = config.baseUrl;
    }
  }

  // Helper method to generate lesson URLs
  public generateLessonUrl(lessonId: string, clientPath?: string): string {
    if (!this.baseUrl) {
      console.warn('Base URL not configured. Please configure EmailService with baseUrl.');
      return `#/lesson/${lessonId}`;
    }
    
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const path = clientPath ? `/${clientPath}` : '';
    return `${base}${path}/#/lesson/${lessonId}`;
  }

  // Template variable substitution with Handlebars-like conditionals and loops support
  // Made public so it can be used in preview
  public substituteVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    // Step 1: Process loops first ({{#each array_key}}...{{/each}})
    // This allows variables inside loops to reference array item properties
    const eachPattern = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    const eachMatches = Array.from(template.matchAll(eachPattern));
    
    // Only process loops if they actually exist in the template
    if (eachMatches.length > 0) {
      console.log('substituteVariables - Found {{#each}} loops:', eachMatches.length, eachMatches.map(m => ({ key: m[1], content: m[2].substring(0, 50) })));
      
      result = result.replace(eachPattern, (_match, arrayKey, loopContent) => {
        console.log(`substituteVariables - Processing {{#each ${arrayKey}}}:`, {
          arrayKey,
          arrayValue: variables[arrayKey],
          isArray: Array.isArray(variables[arrayKey]),
          length: Array.isArray(variables[arrayKey]) ? variables[arrayKey].length : 'N/A',
          loopContent: loopContent.substring(0, 100)
        });
        
        const arrayValue = variables[arrayKey];
        if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
          console.log(`substituteVariables - Skipping {{#each ${arrayKey}}} - not an array or empty`);
          return ''; // Hide loop if array is empty or not an array
        }
        
        // Process each item in the array
        const itemsHtml = arrayValue.map((item: any) => {
          let itemHtml = loopContent;
          // Replace {{property}} with item.property value
          // Handle nested properties like {{lesson_title}} or {{learning_track_title}}
          itemHtml = itemHtml.replace(/\{\{(\w+)\}\}/g, (varMatch: string, propKey: string) => {
            const value = item[propKey] !== undefined ? String(item[propKey] || '') : varMatch;
            return value;
          });
          return itemHtml;
        }).join('');
        
        console.log(`substituteVariables - {{#each ${arrayKey}}} result:`, itemsHtml.substring(0, 200));
        return itemsHtml;
      });
    }
    
    // Step 2: Handle Handlebars conditionals {{#if variable}}...{{/if}}
    // Remove blocks where the condition is false/undefined/null
    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_match, variableName, content) => {
      const value = variables[variableName];
      // Show content if variable is truthy and not empty string
      if (value && value !== '' && value !== 'false' && value !== '0') {
        return content;
      }
      return ''; // Remove the block if condition is false
    });
    
    // Step 3: Substitute all remaining variables (skip arrays - they're handled by loops)
    for (const [key, value] of Object.entries(variables)) {
      if (Array.isArray(value)) {
        // Skip arrays - they're handled by loops above
        continue;
      }
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value || ''));
    }
    
    return result;
  }

  // Fetch template from database
  private async fetchTemplate(
    type: string,
    supabaseClient: any
  ): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await supabaseClient
        .from('email_templates')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('system', { ascending: false }) // Prefer system templates
        .limit(1)
        .single();

      if (error) {
        console.error(`Error fetching template for type ${type}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching template for type ${type}:`, error);
      return null;
    }
  }

  // Send email using template from database
  async sendEmailFromTemplate(
    type: string,
    to: string,
    variables: Record<string, any>,
    supabaseClient?: any,
    options: {
      userId?: string;
      respectPreferences?: boolean;
    } = {}
  ): Promise<SendEmailResult> {
    try {
      const { userId, respectPreferences = true } = options;

      if (respectPreferences && userId && supabaseClient) {
        const preferenceCheck = await this.checkEmailPreferences(
          supabaseClient,
          userId,
          type
        );

        if (!preferenceCheck.allow) {
          return {
            success: false,
            skipped: true,
            skipReason: preferenceCheck.reason || 'preference_blocked',
          };
        }
      }

      // Fetch template from database
      const template = await this.fetchTemplate(type, supabaseClient);

      if (!template) {
        return {
          success: false,
          error: `No active template found for type: ${type}`,
        };
      }

      // Substitute variables in subject and body
      const subject = this.substituteVariables(template.subject_template, variables);
      const htmlBody = this.substituteVariables(template.html_body_template, variables);
      const textBody = template.text_body_template
        ? this.substituteVariables(template.text_body_template, variables)
        : undefined;

      // Send the email
      return await this.sendEmail(
        {
          to,
          subject,
          htmlBody,
          textBody,
        },
        supabaseClient
      );
    } catch (error: any) {
      console.error('Error sending email from template:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email from template',
      };
    }
  }

  async sendEmail(
    emailData: EmailData,
    supabaseClient?: any,
    notificationId?: string
  ): Promise<SendEmailResult> {
    try {
      if (!supabaseClient) {
        throw new Error('Supabase client is required to send email');
      }

      // Call Supabase Edge Function instead of Lambda directly
      // The Edge Function will use AUTH_LAMBDA_URL from Supabase secrets
      const { data, error } = await supabaseClient.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.htmlBody,
          text: emailData.textBody,
        },
      });

      if (error) {
        const errorMessage = error.message || 'Failed to send email via Edge Function';
        if (notificationId && supabaseClient) {
          await this.updateNotificationStatus(
            supabaseClient,
            notificationId,
            'failed',
            undefined,
            errorMessage
          );
        }
        return {
          success: false,
          error: errorMessage,
        };
      }

      // The Edge Function returns { success: true, message: '...' }
      // Extract messageId if available (Edge Function may not return messageId currently)
      const messageId = typeof data?.messageId === 'string' && data.messageId.length > 0
        ? data.messageId
        : undefined;

      if (notificationId && supabaseClient) {
        await this.updateNotificationStatus(
          supabaseClient,
          notificationId,
          'sent',
          messageId
        );
      }

      return {
        success: true,
        messageId,
      };
    } catch (error: any) {
      console.error('Error sending email via Edge Function:', error);
      if (notificationId && supabaseClient) {
        await this.updateNotificationStatus(
          supabaseClient,
          notificationId,
          'failed',
          undefined,
          error.message || 'Failed to send email'
        );
      }
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }
  }

  // Deprecated legacy helpers removed: sendLessonReminder, sendTaskDueReminder, sendAchievementEmail,
  // sendCourseCompletionEmail, sendSystemAlert. Use templates + sendEmailFromTemplate instead.

  // Send email using provided template data directly (for testing)
  async sendEmailWithTemplate(
    subjectTemplate: string,
    htmlBodyTemplate: string,
    textBodyTemplate: string,
    to: string,
    variables: Record<string, any>,
    supabaseClient?: any,
    notificationId?: string
  ): Promise<SendEmailResult> {
    try {
      // Substitute variables in templates
      const subject = this.substituteVariables(subjectTemplate, variables);
      const htmlBody = this.substituteVariables(htmlBodyTemplate, variables);
      const textBody = this.substituteVariables(textBodyTemplate, variables);

      return this.sendEmail({
        to,
        subject,
        htmlBody,
        textBody,
      }, supabaseClient, notificationId);
    } catch (error: any) {
      console.error('Error sending email with template:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email with template',
      };
    }
  }

  // Update notification status in database
  private async updateNotificationStatus(
    supabaseClient: any,
    notificationId: string,
    status: 'sent' | 'failed',
    messageId?: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
      };

      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
      }

      if (messageId) {
        updateData.message_id = messageId;
      }

      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      const { error } = await supabaseClient
        .from('notification_history')
        .update(updateData)
        .eq('id', notificationId);

      if (error) {
        console.error('Failed to update notification status:', error);
      } else {
        console.log(`Notification ${notificationId} status updated to ${status}`);
        // Add delay for testing visibility
        if (status === 'sent') {
          console.log('⏱️ Status update completed - check Recent tab now!');
        }
      }
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  }

  private async checkEmailPreferences(
    supabaseClient: any,
    userId: string,
    notificationType: string
  ): Promise<{ allow: boolean; reason?: string }> {
    try {
      // 1) Try user-level preferences first
      const { data: userPrefs, error: userErr } = await supabaseClient
        .from('email_preferences')
        .select('*') // IMPORTANT: avoid selecting non-existent columns like 'types'
        .eq('user_id', userId)
        .maybeSingle();
  
      if (userErr) {
        console.error('Failed to load email preferences (user-level):', userErr);
        return { allow: true }; // preserve current behavior: don't block sending
      }
  
      // 2) Fallback to org-level preferences (user_id IS NULL)
      let data = userPrefs;
      if (!data) {
        const { data: orgPrefs, error: orgErr } = await supabaseClient
          .from('email_preferences')
          .select('*')
          .is('user_id', null)
          .maybeSingle();
  
        if (orgErr) {
          console.error('Failed to load email preferences (org-level):', orgErr);
          return { allow: true };
        }
  
        data = orgPrefs;
      }
  
      if (!data) return { allow: true };
  
      // Global enable
      const emailEnabled = data.email_enabled ?? true;
      if (!emailEnabled) return { allow: false, reason: 'email_disabled' };
  
      const normalizedType = (notificationType ?? '').toLowerCase();
  
      // If legacy JSON 'types' exists, keep legacy behavior
      if (data.types) {
        const typePreferences = (data.types || {}) as Record<string, { email?: boolean }>;
        const typeConfig =
          typePreferences[normalizedType] || typePreferences[normalizedType.toLowerCase()];
        if (typeConfig && typeConfig.email === false) {
          return { allow: false, reason: 'type_email_disabled' };
        }
      } else {
        // Newer schema: boolean columns (skip checks if the column doesn't exist)
        const isFalse = (v: any) => v === false;
  
        // Track/courses
        if (normalizedType.startsWith('track_') || normalizedType.includes('course')) {
          const flag = data.track_completions ?? data.course_completions;
          if (isFalse(flag)) return { allow: false, reason: 'track_completions_disabled' };
        }
  
        // Achievements/quizzes
        if (normalizedType.startsWith('quiz_') || normalizedType.includes('achievement')) {
          if (isFalse(data.achievements)) return { allow: false, reason: 'achievements_disabled' };
        }
  
        // Lesson reminders
        if (normalizedType.includes('lesson') && normalizedType.includes('reminder')) {
          if (isFalse(data.lesson_reminders)) return { allow: false, reason: 'lesson_reminders_disabled' };
        }
  
        // Task/system (optional)
        if (normalizedType.includes('task')) {
          if (isFalse(data.task_due_dates)) return { allow: false, reason: 'task_due_dates_disabled' };
        }
        if (normalizedType.includes('system')) {
          if (isFalse(data.system_alerts)) return { allow: false, reason: 'system_alerts_disabled' };
        }
      }
  
      // Quiet hours: support both schemas
      const quietHours = data.quiet_hours as
        | { enabled?: boolean; startTime?: string; endTime?: string; timezone?: string }
        | undefined;
  
      if (quietHours?.enabled) {
        // existing legacy quiet_hours object logic can remain as-is
        // ... keep your current quietHours parsing block here ...
      } else if (data.quiet_hours_enabled) {
        // email_preferences schema uses start/end time columns
        const startStr = String(data.quiet_hours_start_time || '22:00:00').slice(0, 5); // HH:mm
        const endStr = String(data.quiet_hours_end_time || '08:00:00').slice(0, 5);
  
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
        const parseHHMM = (v: string) => {
          const [h, m] = v.split(':').map(n => parseInt(n, 10));
          if (Number.isNaN(h) || Number.isNaN(m)) return null;
          return h * 60 + m;
        };
  
        const start = parseHHMM(startStr);
        const end = parseHHMM(endStr);
  
        if (start !== null && end !== null) {
          const inQuietHours =
            start <= end
              ? currentMinutes >= start && currentMinutes < end
              : currentMinutes >= start || currentMinutes < end;
  
          if (inQuietHours) return { allow: false, reason: 'quiet_hours' };
        }
      }
  
      return { allow: true };
    } catch (error) {
      console.error('Error checking email preferences:', error);
      return { allow: true };
    }
  }
}
export const emailService = EmailService.getInstance();

/**
 * Gathers real variables from the database for lesson completion notifications
 * This is used when sending REAL notifications, not previews
 */
export async function gatherLessonCompletedVariables(
  supabaseClient: any,
  event: { 
    user_id: string; 
    lesson_id: string; 
    learning_track_id?: string;
    clientId?: string;
  }
): Promise<Record<string, any>> {
  try {
    // Get user info - use username (which stores email) instead of email column
    const { data: user } = await supabaseClient
      .from('profiles')
      .select('full_name, username')
      .eq('id', event.user_id)
      .single();

    // Get lesson info
    const { data: lesson } = await supabaseClient
      .from('lessons')
      .select('title, description')
      .eq('id', event.lesson_id)
      .single();

    // Get learning track info if available
    let track = null;
    let progress = null;
    let lessonsCompleted = 0;
    let totalLessons = 0;
    let nextLesson = null;
    
    if (event.learning_track_id) {
      track = await supabaseClient
        .from('learning_tracks')
        .select('title')
        .eq('id', event.learning_track_id)
        .single();

      // Get progress in track
      progress = await supabaseClient
        .from('user_learning_track_progress')
        .select('current_lesson_order')
        .eq('user_id', event.user_id)
        .eq('learning_track_id', event.learning_track_id)
        .maybeSingle();

      // Count lessons completed in this track
      const { data: completedLessons } = await supabaseClient
        .from('user_lesson_progress')
        .select('lesson_id')
        .eq('user_id', event.user_id)
        .not('completed_at', 'is', null);

      // Get total lessons in track
      const { data: trackLessons } = await supabaseClient
        .from('learning_track_lessons')
        .select('lesson_id')
        .eq('learning_track_id', event.learning_track_id);

      totalLessons = trackLessons?.length || 0;
      
      // Count how many completed lessons are in this track
      const completedInTrack = completedLessons?.filter((cl: any) => 
        trackLessons?.some((tl: any) => tl.lesson_id === cl.lesson_id)
      ).length || 0;
      lessonsCompleted = completedInTrack;

      // Get next lesson if available
      const currentOrder = progress?.current_lesson_order || 0;
      const { data: nextLessonData } = await supabaseClient
        .from('learning_track_lessons')
        .select('lesson_id, order_index, lessons(title)')
        .eq('learning_track_id', event.learning_track_id)
        .gt('order_index', currentOrder)
        .order('order_index')
        .limit(1)
        .maybeSingle();

      if (nextLessonData) {
        nextLesson = {
          title: (nextLessonData.lessons as any)?.title || 'Next Lesson',
          id: nextLessonData.lesson_id
        };
      }
    }

    // Build client login URL
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://staysecure-learn.raynsecure.com';
    const clientId = event.clientId || 'default';
    const clientPath = clientId !== 'default' ? `/${clientId}` : '';
    const clientLoginUrl = `${origin}${clientPath}/login`;

    // Calculate progress percentage
    const trackProgressPercentage = totalLessons > 0 
      ? Math.round((lessonsCompleted / totalLessons) * 100)
      : 0;

    return {
      user_name: user?.full_name || 'User',
      user_email: user?.username || '',
      lesson_title: lesson?.title || 'Lesson',
      lesson_description: lesson?.description || '',
      learning_track_title: track?.title || '',
      completion_date: new Date().toLocaleDateString('en-US'),
      completion_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      lessons_completed_in_track: lessonsCompleted,
      total_lessons_in_track: totalLessons,
      track_progress_percentage: trackProgressPercentage,
      next_lesson_title: nextLesson?.title || null,
      next_lesson_available: !!nextLesson,
      next_lesson_url: clientLoginUrl, // Always use login URL as per requirement
      client_login_url: clientLoginUrl
    };
  } catch (error) {
    console.error('Error gathering lesson completed variables:', error);
    // Return minimal fallback
    return {
      user_name: 'User',
      lesson_title: 'Lesson',
      client_login_url: 'https://staysecure-learn.raynsecure.com/login'
    };
  }
}
