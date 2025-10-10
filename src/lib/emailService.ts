// Email service using Lambda + SES for better security
export interface EmailData {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  from?: string;
}

export class EmailService {
  private static instance: EmailService;
  private lambdaUrl: string;
  private defaultFrom: string;

  private constructor() {
    // This will be set by the consuming app
    this.lambdaUrl = '';
    this.defaultFrom = 'kahuna@raynsecure.com';
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
  }): void {
    EmailService.getInstance().lambdaUrl = config.lambdaUrl;
    if (config.fromEmail) {
      EmailService.getInstance().defaultFrom = config.fromEmail;
    }
  }

  async sendEmail(emailData: EmailData, supabaseClient?: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
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
          return {
            success: false,
            error: error.message || 'Failed to send email',
          };
        }

        if (data && data.success) {
          return {
            success: true,
            messageId: data.messageId,
          };
        } else {
          return {
            success: false,
            error: data?.error || 'Failed to send email',
          };
        }
      } else {
        // Fallback to direct fetch if no supabase client provided
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ufvingocbzegpgjknzhm.supabase.co';
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
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
          return {
            success: true,
            messageId: result.messageId,
          };
        } else {
          return {
            success: false,
            error: result.error || 'Failed to send email',
          };
        }
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }
  }

  // Template for lesson reminder emails
  async sendLessonReminder(to: string, lessonTitle: string, scheduledTime: string, supabaseClient?: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
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
}

export const emailService = EmailService.getInstance();
