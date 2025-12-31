// Main exports for the notifications module
export { EmailNotifications } from './components/EmailNotifications';
// Old lesson reminder components removed - functionality consolidated into EmailNotifications
export { default as EmailTemplateManager } from './components/EmailTemplateManager';
export { default as RecentEmailNotifications } from './components/RecentEmailNotifications';
// REMOVE these legacy exports:
//export { NotificationCenter } from './components/NotificationCenter';
//export { NotificationItem } from './components/NotificationItem';
//export { NotificationSettings } from './components/NotificationSettings';

// Hooks
//export { useNotificationSettings } from './hooks/useNotificationSettings';
export { useNotifications } from './hooks/useNotifications';

// Types
export * from './types';

// Utils - Supabase should be provided by consuming app
// export * from './utils/supabase';
export * from './lib/emailService';
