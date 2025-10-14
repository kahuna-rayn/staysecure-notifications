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

  // Template variable substitution
  private substituteVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
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
        updated_at: new Date().toISOString(),
      };

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
      }
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  }
}

export const emailService = EmailService.getInstance();
