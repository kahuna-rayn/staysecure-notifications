// Main exports for the notifications module
export { EmailNotifications } from './components/EmailNotifications';
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

// Utils - Supabase should be provided by consuming app
// export * from './utils/supabase';
export * from './lib/emailService';
