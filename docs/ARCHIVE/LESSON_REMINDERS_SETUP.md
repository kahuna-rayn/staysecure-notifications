# Lesson Reminders Setup Guide

This guide explains how to set up and use the automatic lesson reminders system in StaySecure Hub.

## Overview

The lesson reminder system automatically sends notifications and emails to users when:
- Lessons become available based on their learning track schedule
- Lessons are coming up soon (configurable)
- Lessons are overdue (optional)

## Architecture

The system consists of several components:

1. **Database Tables**: Track reminder settings and history
2. **Supabase Edge Function**: Processes and sends reminders
3. **Scheduled Job**: Automatically triggers the reminder function daily
4. **Admin UI**: Allows administrators to configure reminder settings

## Setup Instructions

### 1. Run Database Migrations

Apply the migrations to create the necessary database tables and functions:

```bash
# Navigate to your Supabase project
cd supabase

# Run migrations (these should run automatically when you push to Supabase)
# Or manually apply them through the Supabase dashboard SQL editor
```

The migrations create:
- `lesson_reminder_settings` - Per-organisation reminder configuration
- `lesson_reminder_history` - Tracking of sent reminders
- `get_users_needing_lesson_reminders()` - Function to identify users who need reminders
- `trigger_lesson_reminders()` - Manual trigger function for admins

### 2. Enable Required Extensions

In your Supabase dashboard:

1. Go to **Database → Extensions**
2. Enable the following extensions:
   - `pg_cron` - For scheduled jobs
   - `pg_net` or `http` - For HTTP requests to Edge Functions

### 3. Configure Environment Variables

Set the following configuration parameters in your Supabase project:

Go to **Database → Settings** and add:

```sql
-- In the Supabase SQL editor, run:
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://your-project.supabase.co';
ALTER DATABASE postgres SET app.settings.supabase_service_key = 'your-service-role-key';
```

**Important**: Keep your service role key secure and never expose it in client-side code.

### 4. Deploy the Edge Function

Deploy the `send-lesson-reminders` Edge Function:

```bash
# From your project root
supabase functions deploy send-lesson-reminders

# Or if using the Supabase CLI
npx supabase functions deploy send-lesson-reminders
```

### 5. Verify the Cron Job

The cron job is automatically created by the migration. To verify it's running:

```sql
-- Check active cron jobs
SELECT * FROM cron.job;

-- View cron job run history
SELECT * FROM cron.job_run_details 
WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname = 'send-daily-lesson-reminders')
ORDER BY start_time DESC 
LIMIT 10;
```

By default, reminders run daily at 9:00 AM UTC. You can modify the schedule:

```sql
-- Update the cron schedule (e.g., to 6:00 AM UTC)
SELECT cron.schedule(
  'send-daily-lesson-reminders',
  '0 6 * * *',  -- New schedule
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-lesson-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_key')
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

### 6. Configure Reminder Settings (Admin UI)

Administrators can configure reminder settings through the UI:

1. Navigate to your organisation settings
2. Find the "Lesson Reminder Settings" section
3. Configure:
   - **Enable/Disable**: Turn reminders on or off
   - **Reminder Time**: What time of day to send reminders
   - **Reminder Timing**: How many days before lesson becomes available
   - **Reminder Frequency**: Once, daily, or weekly
   - **Include Upcoming**: Send "coming soon" notifications
   - **Look Ahead Days**: How far ahead to look for upcoming lessons

## Usage

### For Administrators

#### Configure Organisation Reminders

```tsx
import { LessonReminderSettingsWrapper } from '@staysecure/notifications';

function OrganisationSettings() {
  return (
    <div>
      <h2>Lesson Reminders</h2>
      <LessonReminderSettingsWrapper organisationId={organisationId} />
    </div>
  );
}
```

#### Manually Trigger Reminders (Testing)

You can manually trigger reminders for testing:

1. Use the "Test Reminders" button in the admin UI
2. Or call the function directly:

```sql
-- As an admin user
SELECT * FROM trigger_lesson_reminders();
```

#### View Reminder History

Check what reminders have been sent:

```sql
-- View recent reminders
SELECT 
  lrh.*,
  u.email,
  l.title as lesson_title,
  lt.title as track_title
FROM lesson_reminder_history lrh
JOIN auth.users u ON u.id = lrh.user_id
JOIN lessons l ON l.id = lrh.lesson_id
LEFT JOIN learning_tracks lt ON lt.id = lrh.learning_track_id
ORDER BY lrh.sent_at DESC
LIMIT 100;
```

### For Users

Users will automatically receive:
- **In-app notifications**: Visible in the notification bell icon
- **Email notifications**: Sent to their registered email address

Users can manage their notification preferences in their account settings to:
- Enable/disable email notifications
- Configure quiet hours
- Choose which types of notifications to receive

## How It Works

### Scheduling Logic

The system calculates lesson availability based on the learning track's schedule type:

1. **Flexible Schedule**: All lessons available immediately
2. **Fixed Dates**: Lessons available on specific dates
3. **Duration Based**: Lessons released based on weeks and lessons per week
4. **Weekly Schedule**: Lessons available on specific days of the week

### Reminder Types

The system sends three types of reminders:

1. **available_now**: Lesson is currently available
2. **available_soon**: Lesson will be available within X days (configurable)
3. **overdue**: Lesson was available but not yet completed (optional)

### Preventing Duplicates

The system prevents duplicate reminders by:
- Checking `lesson_reminder_history` for recent reminders
- Only sending one reminder per lesson per day per user
- Tracking whether email and in-app notifications were successfully sent

## Troubleshooting

### Reminders Not Sending

1. **Check the cron job is running**:
   ```sql
   SELECT * FROM cron.job_run_details 
   WHERE jobname = 'send-daily-lesson-reminders'
   ORDER BY start_time DESC LIMIT 5;
   ```

2. **Verify Edge Function is deployed**:
   ```bash
   supabase functions list
   ```

3. **Check Edge Function logs**:
   ```bash
   supabase functions logs send-lesson-reminders
   ```

4. **Verify reminder settings are enabled**:
   ```sql
   SELECT * FROM lesson_reminder_settings;
   ```

5. **Check for users who should receive reminders**:
   ```sql
   SELECT * FROM get_users_needing_lesson_reminders();
   ```

### Email Notifications Not Sending

1. Verify your email service (AWS SES) is properly configured
2. Check the `send-email` Edge Function is working
3. Verify user email addresses are valid
4. Check email notification preferences for users

### Scheduling Issues

If lessons aren't becoming available as expected:

1. Verify learning track schedule configuration
2. Check user enrollment dates in `user_learning_track_progress`
3. Review the lesson availability calculation in `get_users_needing_lesson_reminders()`

## Customization

### Modify Email Templates

Edit the email template in:
```
supabase/functions/send-lesson-reminders/index.ts
```

Look for the `generateEmailTemplate()` function and customize the HTML.

### Adjust Scheduling Logic

Modify the lesson availability calculation in:
```
supabase/migrations/20251008_lesson_reminders.sql
```

Update the `get_users_needing_lesson_reminders()` function's `lesson_availability` CTE.

### Change Reminder Frequency

Update the cron schedule:
```sql
-- Example: Run every 6 hours
SELECT cron.schedule(
  'send-daily-lesson-reminders',
  '0 */6 * * *',  -- Every 6 hours
  $$ ... $$
);
```

## API Reference

### Database Functions

#### `get_users_needing_lesson_reminders()`

Returns users who need lesson reminders.

**Returns**: Table with columns:
- `user_id`: UUID
- `user_email`: TEXT
- `lesson_id`: UUID
- `lesson_title`: TEXT
- `lesson_description`: TEXT
- `learning_track_id`: UUID
- `learning_track_title`: TEXT
- `available_date`: DATE
- `reminder_type`: TEXT ('available_now', 'available_soon', 'overdue')
- `organisation_id`: UUID

#### `trigger_lesson_reminders()`

Manually triggers the lesson reminder process (admin only).

**Returns**: JSONB with result summary
**Requires**: Admin or owner role

### Edge Function

#### `send-lesson-reminders`

**Endpoint**: `/functions/v1/send-lesson-reminders`  
**Method**: POST  
**Auth**: Service role key required  
**Body**: `{}`

**Response**:
```json
{
  "success": true,
  "processed": 10,
  "sent": 8,
  "failed": 2,
  "errors": ["error messages..."]
}
```

## Security Considerations

1. **RLS Policies**: All tables have Row Level Security enabled
2. **Service Role**: Edge Function uses service role for admin access
3. **Admin Only**: Manual trigger function requires admin role
4. **Email Privacy**: User emails are only accessed server-side
5. **Rate Limiting**: Consider implementing rate limits on reminder sending

## Performance

- The system efficiently queries only users with active enrollments
- Duplicate prevention reduces unnecessary processing
- Batch processing for multiple reminders
- Indexes on frequently queried columns

For large organisations (1000+ users):
- Consider adjusting the cron frequency
- Monitor Edge Function execution time
- Use database query optimization if needed

## Support

For issues or questions:
1. Check the Supabase logs
2. Review the troubleshooting section
3. Contact your system administrator
4. Open an issue in the project repository

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0
