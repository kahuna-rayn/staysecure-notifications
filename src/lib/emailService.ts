// Email service using Lambda + SES for better security
export interface EmailData {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  from?: string;
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
  private lambdaUrl: string;
  private defaultFrom: string;
  private baseUrl: string;

  private constructor() {
    // This will be set by the consuming app
    this.lambdaUrl = '';
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
    lambdaUrl: string;
    fromEmail?: string;
    baseUrl?: string;
  }): void {
    const instance = EmailService.getInstance();
    instance.lambdaUrl = config.lambdaUrl;
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
    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, variableName, content) => {
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
    supabaseClient: any
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
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

  async sendEmail(emailData: EmailData, supabaseClient?: any, notificationId?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // NEW METHOD: Use Supabase Edge Function instead of direct Lambda call
    try {
      // Use provided supabase client or fallback to direct fetch
      if (supabaseClient) {
        const { data, error } = await supabaseClient.functions.invoke('send-email', {
          body: {
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.htmlBody, // Note: Edge Function expects 'html', not 'htmlBody'
          }
        });

        if (error) {
          // Update notification status to 'failed' if notificationId provided
          if (notificationId && supabaseClient) {
            await this.updateNotificationStatus(supabaseClient, notificationId, 'failed', undefined, error.message || 'Failed to send email');
          }
          return {
            success: false,
            error: error.message || 'Failed to send email',
          };
        }

        if (data && data.success) {
          // Update notification status to 'sent' if notificationId provided
          if (notificationId && supabaseClient) {
            // Add small delay for testing visibility
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.updateNotificationStatus(supabaseClient, notificationId, 'sent', data.messageId);
          }
          return {
            success: true,
            messageId: data.messageId,
          };
        } else {
          // Update notification status to 'failed' if notificationId provided
          if (notificationId && supabaseClient) {
            await this.updateNotificationStatus(supabaseClient, notificationId, 'failed', undefined, data?.error || 'Failed to send email');
          }
          return {
            success: false,
            error: data?.error || 'Failed to send email',
          };
        }
      } else {
        // Fallback to direct fetch if no supabase client provided
        const supabaseUrl = (typeof window !== 'undefined' && (window as any).VITE_SUPABASE_URL) || 'https://ufvingocbzegpgjknzhm.supabase.co';
        const supabaseKey = (typeof window !== 'undefined' && (window as any).VITE_SUPABASE_ANON_KEY);
        
        if (!supabaseKey) {
          return {
            success: false,
            error: 'Supabase client not provided and VITE_SUPABASE_ANON_KEY not configured',
          };
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.htmlBody,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Update notification status to 'sent' if notificationId provided
          if (notificationId && supabaseClient) {
            await this.updateNotificationStatus(supabaseClient, notificationId, 'sent', result.messageId);
          }
          return {
            success: true,
            messageId: result.messageId,
          };
        } else {
          // Update notification status to 'failed' if notificationId provided
          if (notificationId && supabaseClient) {
            await this.updateNotificationStatus(supabaseClient, notificationId, 'failed', undefined, result.error || 'Failed to send email');
          }
          return {
            success: false,
            error: result.error || 'Failed to send email',
          };
        }
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      // Update notification status to 'failed' if notificationId provided
      if (notificationId && supabaseClient) {
        await this.updateNotificationStatus(supabaseClient, notificationId, 'failed', undefined, error.message || 'Failed to send email');
      }
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }
  }

  // Template for lesson reminder emails
  async sendLessonReminder(
    to: string,
    lessonTitle: string,
    scheduledTime: string,
    supabaseClient?: any,
    additionalVariables?: Record<string, any>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Try to use database template first
    if (supabaseClient) {
      const variables = {
        lesson_title: lessonTitle,
        scheduled_time: scheduledTime,
        ...additionalVariables,
      };

      const result = await this.sendEmailFromTemplate(
        'lesson_reminder',
        to,
        variables,
        supabaseClient
      );

      // If template found and sent successfully, return
      if (result.success || result.error !== `No active template found for type: lesson_reminder`) {
        return result;
      }
    }

    // Fallback to hardcoded template if no database template exists
    const subject = `Reminder: ${lessonTitle} starts soon`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Lesson Reminder</h2>
        <p>Hello!</p>
        <p>This is a friendly reminder that your lesson <strong>${lessonTitle}</strong> is scheduled to start at <strong>${scheduledTime}</strong>.</p>
        <p>Please make sure you're ready to begin your cybersecurity training session.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Lesson Details:</h3>
          <p><strong>Title:</strong> ${lessonTitle}</p>
          <p><strong>Time:</strong> ${scheduledTime}</p>
        </div>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      htmlBody,
    }, supabaseClient);
  }

  // Template for task due date reminders
  async sendTaskDueReminder(to: string, taskName: string, dueDate: string, supabaseClient?: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Reminder: ${taskName} is due soon`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Task Due Reminder</h2>
        <p>Hello!</p>
        <p>This is a reminder that your task <strong>${taskName}</strong> is due on <strong>${dueDate}</strong>.</p>
        <p>Please complete this task to stay on track with your cybersecurity training.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin-top: 0; color: #dc2626;">Task Details:</h3>
          <p><strong>Task:</strong> ${taskName}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      htmlBody,
    }, supabaseClient);
  }

  // Template for achievement emails
  async sendAchievementEmail(to: string, achievementTitle: string, achievementDescription: string, supabaseClient?: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Congratulations! You've earned: ${achievementTitle}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">🎉 Achievement Unlocked!</h2>
        <p>Congratulations!</p>
        <p>You've successfully earned the achievement: <strong>${achievementTitle}</strong></p>
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #059669;">Achievement Details:</h3>
          <p><strong>Title:</strong> ${achievementTitle}</p>
          <p><strong>Description:</strong> ${achievementDescription}</p>
        </div>
        <p>Keep up the great work in your cybersecurity journey!</p>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      htmlBody,
    }, supabaseClient);
  }

  // Template for course completion emails
  async sendCourseCompletionEmail(to: string, courseName: string, supabaseClient?: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Congratulations! You've completed ${courseName}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">🎓 Course Completed!</h2>
        <p>Congratulations on completing your course!</p>
        <p>You've successfully finished: <strong>${courseName}</strong></p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
          <h3 style="margin-top: 0; color: #7c3aed;">Course Details:</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Status:</strong> ✅ Completed</p>
        </div>
        <p>You're now one step closer to becoming a cybersecurity expert!</p>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      htmlBody,
    }, supabaseClient);
  }

  // Template for system alert emails
  async sendSystemAlert(to: string, alertTitle: string, alertMessage: string, supabaseClient?: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `System Alert: ${alertTitle}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">⚠️ System Alert</h2>
        <p>Hello!</p>
        <p>This is an important system alert regarding: <strong>${alertTitle}</strong></p>
        <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
          <h3 style="margin-top: 0; color: #ea580c;">Alert Details:</h3>
          <p><strong>Title:</strong> ${alertTitle}</p>
          <p><strong>Message:</strong> ${alertMessage}</p>
        </div>
        <p>Please take note of this information.</p>
        <p>Best regards,<br>Your Cybersecurity Training Team</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      htmlBody,
    }, supabaseClient);
  }

  // Send email using provided template data directly (for testing)
  async sendEmailWithTemplate(
    subjectTemplate: string,
    htmlBodyTemplate: string,
    textBodyTemplate: string,
    to: string,
    variables: Record<string, any>,
    supabaseClient?: any,
    notificationId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
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
