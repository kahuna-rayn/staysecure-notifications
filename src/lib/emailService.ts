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

  // Template variable substitution with Handlebars-like conditionals support
  // Made public so it can be used in preview
  public substituteVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    // First, handle Handlebars conditionals {{#if variable}}...{{/if}}
    // Remove blocks where the condition is false/undefined/null
    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_match, variableName, content) => {
      const value = variables[variableName];
      // Show content if variable is truthy and not empty string
      if (value && value !== '' && value !== 'false' && value !== '0') {
        return content;
      }
      return ''; // Remove the block if condition is false
    });
    
    // Then substitute all remaining variables
    for (const [key, value] of Object.entries(variables)) {
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
      const { data, error } = await supabaseClient
        .from('notification_preferences')
        .select('email_enabled, types, quiet_hours')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Failed to load notification preferences:', error);
        return { allow: true };
      }

      if (!data) {
        return { allow: true };
      }

      const emailEnabled = data.email_enabled ?? true;
      if (!emailEnabled) {
        return { allow: false, reason: 'email_disabled' };
      }

      const typePreferences = (data.types || {}) as Record<
        string,
        { email?: boolean }
      >;

      const normalizedType = notificationType ?? '';
      const typeConfig =
        typePreferences[normalizedType] ||
        typePreferences[normalizedType.toLowerCase()];

      if (typeConfig && typeConfig.email === false) {
        return { allow: false, reason: 'type_email_disabled' };
      }

      const quietHours = data.quiet_hours as
        | {
            enabled?: boolean;
            startTime?: string;
            endTime?: string;
            timezone?: string;
          }
        | undefined;

      if (quietHours?.enabled) {
        const timezone =
          quietHours.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const userTime = new Date(
          now.toLocaleString('en-US', { timeZone: timezone })
        );
        const currentMinutes =
          userTime.getHours() * 60 + userTime.getMinutes();

        const parseTime = (value?: string): number | null => {
          if (!value) return null;
          const [hourStr, minuteStr] = value.split(':');
          const hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);
          if (Number.isNaN(hour) || Number.isNaN(minute)) {
            return null;
          }
          return hour * 60 + minute;
        };

        const start = parseTime(quietHours.startTime);
        const end = parseTime(quietHours.endTime);

        if (start !== null && end !== null) {
          const inQuietHours =
            start <= end
              ? currentMinutes >= start && currentMinutes < end
              : currentMinutes >= start || currentMinutes < end;

          if (inQuietHours) {
            return { allow: false, reason: 'quiet_hours' };
          }
        }
      }

      return { allow: true };
    } catch (error) {
      console.error('Error checking notification preferences:', error);
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
    // Get user info
    const { data: user } = await supabaseClient
      .from('profiles')
      .select('full_name, email')
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
      user_email: user?.email || '',
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
