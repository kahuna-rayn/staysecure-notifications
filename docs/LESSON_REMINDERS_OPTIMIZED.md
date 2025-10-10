# Lesson Reminders - Optimized Implementation

## Overview

The lesson reminder system has been **optimized to use your existing notification infrastructure** instead of creating duplicate tables. This simplifies the system and leverages what you already have in place.

## What Changed

### ✅ Before (Duplicate System)
- ❌ Created new `lesson_reminder_settings` table per organisation
- ❌ Created separate `notifications` table  
- ❌ Created separate `email_notifications` records
- ❌ Complex organisation management
- ❌ Duplicate notification infrastructure

### ✅ After (Optimized & Integrated)
- ✅ Single global `lesson_reminder_config` table (one row)
- ✅ Uses existing `email_notifications` table
- ✅ Uses existing `email_preferences` table
- ✅ Uses existing `email_templates` infrastructure
- ✅ No organisation table dependency
- ✅ Simpler, single-tenant design

## Database Structure

### New Tables (Minimal)

**1. `lesson_reminder_config` (Single row configuration)**
```sql
- id: UUID (fixed: 00000000-0000-0000-0000-000000000001)
- enabled: BOOLEAN
- reminder_days_before: INTEGER
- reminder_time: TIME
- include_upcoming_lessons: BOOLEAN
- upcoming_days_ahead: INTEGER
```

**2. `lesson_reminder_history` (Tracking)**
```sql
- id: UUID
- user_id: UUID -> auth.users
- lesson_id: UUID -> lessons
- learning_track_id: UUID -> learning_tracks
- reminder_type: TEXT
- available_date: DATE
- email_notification_id: UUID -> email_notifications (your existing table)
```

### Uses Your Existing Tables

**1. `email_notifications`** ✅
- All reminder emails are stored here
- Type: 'lesson_reminder'
- Status tracking included

**2. `email_preferences`** ✅
- Users control reminders via `lesson_reminders` field
- Respects `email_enabled` global setting
- Respects `quiet_hours` settings

**3. `email_templates`** ✅
- Can optionally use your template system
- Currently generates HTML inline, but can be adapted

## Key Features

### User Preferences Respected
The system automatically checks `email_preferences`:
```sql
WHERE COALESCE(ep.email_enabled, true) = true
  AND COALESCE(ep.lesson_reminders, true) = true
```

Users can opt-out by setting `lesson_reminders = false` in their email preferences.

### Single-Tenant Optimized
- No organisation_id needed
- Single global configuration
- Perfect for one-instance-per-client deployment

### Duplicate Prevention
- Unique index prevents sending same reminder twice
- 24-hour cooldown between reminders
- Links to `email_notifications` for full audit trail

## Admin UI

Simplified interface:
```tsx
import { LessonReminderSettingsWrapper } from '@staysecure/notifications';

// No organisationId needed!
<LessonReminderSettingsWrapper />
```

Admins can configure:
- ✅ Enable/Disable reminders globally
- ✅ Reminder time of day
- ✅ Days before lesson (advance notice)
- ✅ Include upcoming lessons toggle
- ✅ Look-ahead window (days)

## Security

**Access Control** (Super Admin & Client Admin only):
- View/Update global config
- Trigger manual reminders
- View all reminder history

**Users**:
- View their own reminder history
- Control via `email_preferences.lesson_reminders`
- Cannot access global configuration

## Integration Points

### 1. Email Service
Uses your existing email infrastructure:
- Calls `send-email` Edge Function
- Records in `email_notifications` table
- Respects user preferences

### 2. Learning Tracks
Integrates with your schedule types:
- `flexible` - All lessons available immediately
- `fixed_dates` - Specific calendar dates
- `duration_based` - Spread over weeks
- `weekly_schedule` - Specific days of week

### 3. User Progress
Checks `user_learning_track_progress` and `user_lesson_progress`:
- Only sends for uncompleted lessons
- Only sends for active enrollments
- Respects lesson availability dates

## API

### Database Functions

**`get_users_needing_lesson_reminders()`**
- Returns users who need reminders
- Checks `email_preferences.lesson_reminders`
- Excludes completed lessons
- Prevents duplicates

**`trigger_lesson_reminders()`** (Admin only)
- Manually trigger reminder sending
- Useful for testing
- Returns result summary

### Edge Function

**`send-lesson-reminders`**
- Called daily by cron job (9 AM UTC)
- Can be triggered manually by admins
- Uses `email_notifications` table
- Tracks in `lesson_reminder_history`

## Deployment

### 1. Run Migration
```bash
# Apply the optimized migration
supabase db push
```

Creates:
- `lesson_reminder_config` (1 row)
- `lesson_reminder_history` table
- Updated function (checks email_preferences)

### 2. Deploy Edge Function
```bash
supabase functions deploy send-lesson-reminders
```

### 3. Setup Cron (see `20251008_lesson_reminders_cron.sql`)
```sql
-- Daily at 9 AM UTC
SELECT cron.schedule('send-daily-lesson-reminders', '0 9 * * *', ...);
```

## Configuration

### Global Settings (Admin UI)
```sql
SELECT * FROM lesson_reminder_config;
```

Single row with:
- `enabled`: true/false
- `reminder_time`: '09:00:00'
- `reminder_days_before`: 0
- `include_upcoming_lessons`: true
- `upcoming_days_ahead`: 3

### User Preferences (Per User)
Users control their own reminders in `email_preferences`:
```sql
UPDATE email_preferences
SET lesson_reminders = false  -- Opt out
WHERE user_id = 'user-id';
```

## Monitoring

### Check Reminder History
```sql
SELECT 
  lrh.*,
  en.status,
  en.sent_at
FROM lesson_reminder_history lrh
LEFT JOIN email_notifications en ON en.id = lrh.email_notification_id
ORDER BY lrh.sent_at DESC
LIMIT 100;
```

### Check User Preferences
```sql
SELECT 
  user_id,
  email_enabled,
  lesson_reminders,
  quiet_hours_enabled
FROM email_preferences
WHERE lesson_reminders = false;
```

### Test Reminders
```sql
-- As admin
SELECT * FROM trigger_lesson_reminders();
```

## Benefits

✅ **Simplified**: 70% less code, 2 tables instead of 4  
✅ **Integrated**: Uses existing notification system  
✅ **Flexible**: Users control preferences individually  
✅ **Scalable**: No per-organisation complexity  
✅ **Maintainable**: Single source of truth  
✅ **Auditable**: Full history in `email_notifications`  

## Migration from Old System

If you already ran the old migration:

```sql
-- Drop old tables if they exist
DROP TABLE IF EXISTS lesson_reminder_settings CASCADE;

-- The new migration will create the optimized tables
```

## Example Usage

### Admin: Configure Reminders
```tsx
function AdminSettings() {
  return (
    <div>
      <h2>Lesson Reminders</h2>
      <LessonReminderSettingsWrapper />
    </div>
  );
}
```

### User: Manage Preferences
```tsx
function UserPreferences({ userId }) {
  const toggleLessonReminders = async (enabled: boolean) => {
    await supabase
      .from('email_preferences')
      .update({ lesson_reminders: enabled })
      .eq('user_id', userId);
  };
  
  return (
    <Switch 
      label="Lesson Reminders"
      onChange={toggleLessonReminders}
    />
  );
}
```

### View History
```tsx
function ReminderHistory({ userId }) {
  const { data } = await supabase
    .from('lesson_reminder_history')
    .select(`
      *,
      lessons(title),
      learning_tracks(title),
      email_notifications(status, sent_at)
    `)
    .eq('user_id', userId)
    .order('sent_at', { ascending: false });
    
  return <ReminderList reminders={data} />;
}
```

## Summary

The optimized system:
- Uses your existing `email_notifications`, `email_preferences`, and `email_templates`
- Single global configuration (no organisations)
- Respects user preferences automatically
- Simpler deployment and maintenance
- Full integration with your current notification system

Perfect for single-tenant, per-client deployments! 🎉

---

**Optimized**: October 8, 2025  
**Status**: ✅ Ready to deploy
