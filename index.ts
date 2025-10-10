// Export email service
export { emailService, EmailService, type EmailData } from "./src/lib/emailService";

// Export email notifications component
export { EmailNotifications } from "./src/components/EmailNotifications";

// Export lesson reminder settings component
export { LessonReminderSettings } from "./src/components/LessonReminderSettings";

// Export a ready-to-use component that works in any consuming app
export { LessonReminderSettingsPage } from "./src/components/LessonReminderSettingsPage";

// Export types
export interface EmailNotification {
  id: string;
  userId: string;
  type: "lesson_reminder" | "task_due" | "system_alert" | "achievement" | "course_completion";
  title: string;
  message: string;
  email: string;
  status: "pending" | "sent" | "failed";
  scheduledFor?: Date;
  createdAt: Date;
}

export interface EmailPreferences {
  userId: string;
  emailEnabled: boolean;
  lessonReminders: boolean;
  taskDueDates: boolean;
  systemAlerts: boolean;
  achievements: boolean;
  courseCompletions: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}
