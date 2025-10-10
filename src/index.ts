// Main exports for the notifications module
export { EmailNotifications } from './components/EmailNotifications';
export { EmailNotificationsWrapper } from './components/EmailNotificationsWrapper';
export { default as LessonReminderSettings } from './components/LessonReminderSettings';
export { default as LessonReminderSettingsPage } from './components/LessonReminderSettingsPage';
export { default as LessonReminderSettingsWrapper } from './components/LessonReminderSettingsWrapper';
export { NotificationCenter } from './components/NotificationCenter';
export { NotificationItem } from './components/NotificationItem';
export { NotificationSettings } from './components/NotificationSettings';

// Hooks
export { useNotificationSettings } from './hooks/useNotificationSettings';
export { useNotifications } from './hooks/useNotifications';

// Types
export * from './types';

// Utils
export * from './utils/supabase';
export * from './lib/emailService';
