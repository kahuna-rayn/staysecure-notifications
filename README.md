# Notification System Module

A comprehensive, reusable notification system for React applications with support for lessons, tasks, reminders, and other notification types.

## 📚 Complete Documentation

All documentation is now organized in the [`docs/`](./docs/) folder:

**Start Here**:
- 📖 [System Overview](./docs/NOTIFICATION_SYSTEM_OVERVIEW.md) - **Start Here**
- 📋 [Documentation Index](./docs/NOTIFICATION_DOCUMENTATION_INDEX.md) - Complete guide index

**Lesson Reminders** (Current Release):
- [Quick Start Guide](./docs/LESSON_REMINDERS_QUICKSTART.md)
- [Full Setup Guide](./docs/LESSON_REMINDERS_SETUP.md)
- [Security Model](./docs/LESSON_REMINDERS_SECURITY.md)
- [Implementation Summary](./docs/LESSON_REMINDERS_SUMMARY.md)

**Template-Based System** (Next Release):
- 📋 [Learning Progress Notifications](./docs/LEARNING_PROGRESS_NOTIFICATIONS.md)
- 🗄️ [Database Schema](./docs/NOTIFICATION_DATABASE_SCHEMA.md)
- 🔨 [Implementation Guide](./docs/NOTIFICATION_IMPLEMENTATION_GUIDE.md)
- 📧 [Template Examples](./docs/NOTIFICATION_TEMPLATE_EXAMPLES.md)
- 👨‍💼 [Admin Guide](./docs/NOTIFICATION_ADMIN_GUIDE.md)

**Reference**:
- [Notification Types Reference](./docs/NOTIFICATION_TYPES_REFERENCE.md)
- [Database Schema Details](./docs/NOTIFICATION_DATABASE_SCHEMA.md)
- [Files Manifest](./docs/NOTIFICATION_FILES_MANIFEST.md)

## Features

- **Multiple Notification Types**: Lessons, tasks, system alerts, achievements, and more
- **Flexible Delivery Methods**: Email, push notifications, and in-app notifications
- **User Preferences**: Granular control over notification settings per user
- **Quiet Hours**: Configurable do-not-disturb periods
- **Scheduling**: Support for scheduled and recurring notifications
- **Real-time Updates**: Live notification updates with React Query
- **Responsive Design**: Mobile-friendly notification center
- **TypeScript Support**: Full type safety throughout

## Installation

```bash
npm install @yourorg/notification-system
```

## Quick Start

### 1. Setup Supabase

First, ensure you have the required Supabase tables. Run these SQL migrations:

```sql
-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Notification preferences table
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  types JSONB DEFAULT '{}',
  quiet_hours JSONB DEFAULT '{"enabled": false, "startTime": "22:00", "endTime": "08:00", "timezone": "UTC"}',
  frequency TEXT DEFAULT 'immediate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
```

### 2. Configure Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup React Query Provider

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

### 4. Use the Notification Center

```tsx
import { NotificationCenter } from '@yourorg/notification-system';

function Header() {
  return (
    <header>
      <NotificationCenter userId="user-123" />
    </header>
  );
}
```

## Components

### NotificationCenter

The main notification component that displays a bell icon with unread count and opens a dropdown with all notifications.

```tsx
import { NotificationCenter } from '@yourorg/notification-system';

<NotificationCenter 
  userId="user-123"
  maxNotifications={50}
  className="custom-styles"
/>
```

### NotificationItem

Individual notification item component.

```tsx
import { NotificationItem } from '@yourorg/notification-system';

<NotificationItem
  notification={notification}
  onMarkAsRead={handleMarkAsRead}
  onDelete={handleDelete}
/>
```

### NotificationSettings

Settings panel for managing notification preferences.

```tsx
import { NotificationSettings } from '@yourorg/notification-system';

<NotificationSettings userId="user-123" />
```

## Hooks

### useNotifications

Main hook for fetching and managing notifications.

```tsx
import { useNotifications } from '@yourorg/notification-system';

const {
  notifications,
  unreadCount,
  isLoading,
  error,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  refresh,
} = useNotifications({
  userId: 'user-123',
  unreadOnly: false,
  type: 'lesson_reminder',
  limit: 20,
});
```

### useNotificationSettings

Hook for managing user notification preferences.

```tsx
import { useNotificationSettings } from '@yourorg/notification-system';

const {
  preferences,
  isLoading,
  error,
  updatePreferences,
  updateTypePreference,
} = useNotificationSettings('user-123');
```

### useCreateNotification

Hook for creating new notifications.

```tsx
import { useCreateNotification } from '@yourorg/notification-system';

const createNotification = useCreateNotification();

const handleCreateNotification = async () => {
  await createNotification.mutateAsync({
    userId: 'user-123',
    type: 'lesson_reminder',
    title: 'Upcoming Lesson',
    message: 'Your lesson starts in 15 minutes',
    priority: 'high',
    actionUrl: '/lessons/123',
  });
};
```

## Notification Types

The system supports these notification types:

- `lesson_reminder` - Reminders for upcoming lessons
- `task_due` - Task and assignment due dates
- `system_alert` - System updates and maintenance
- `achievement` - Milestone and achievement celebrations
- `course_completion` - Course completion notifications
- `assignment_due` - Assignment deadline reminders
- `meeting_reminder` - Meeting and appointment reminders
- `custom` - Custom notifications from administrators

## Priority Levels

- `low` - Low priority notifications
- `normal` - Standard priority (default)
- `high` - High priority notifications
- `urgent` - Urgent notifications that require immediate attention

## User Preferences

Users can configure:

- **Global Settings**: Enable/disable email, push, and in-app notifications
- **Type-specific Settings**: Control notifications per type and delivery method
- **Quiet Hours**: Set do-not-disturb periods
- **Frequency**: Choose between immediate, hourly, daily, or weekly notifications

## Styling

The components use Tailwind CSS classes and can be customized with:

- Custom className props
- CSS custom properties
- Tailwind configuration overrides

## Database Schema

### notifications table
- `id` - Unique identifier
- `user_id` - User who receives the notification
- `type` - Notification type
- `title` - Notification title
- `message` - Notification message
- `status` - Current status (pending, sent, delivered, read, failed, cancelled)
- `priority` - Priority level
- `created_at` - Creation timestamp
- `scheduled_for` - Scheduled delivery time
- `read_at` - When the notification was read
- `action_url` - URL to navigate to when clicked
- `metadata` - Additional data in JSON format
- `expires_at` - Expiration timestamp

### notification_preferences table
- `user_id` - User identifier
- `email_enabled` - Global email setting
- `push_enabled` - Global push setting
- `in_app_enabled` - Global in-app setting
- `types` - Type-specific preferences (JSON)
- `quiet_hours` - Quiet hours configuration (JSON)
- `frequency` - Notification frequency preference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
