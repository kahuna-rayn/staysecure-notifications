# Lesson Reminders - Quick Start Guide

Get automatic lesson reminders up and running in 5 minutes!

## Prerequisites

- Supabase project set up
- Database migrations applied
- Supabase CLI installed (`npm install -g supabase`)

## Prerequisites

⚠️ **Important**: You need `super_admin` or `client_admin` role to:
- Configure reminder settings
- Test reminders manually
- View reminder history for all users

To check your role:
```sql
SELECT role FROM public.user_roles WHERE user_id = auth.uid();
```

## Quick Setup (5 Steps)

### 1. Enable Extensions (1 minute)

In Supabase Dashboard → Database → Extensions, enable:
- ✅ `pg_cron`
- ✅ `pg_net` (or `http`)

### 2. Run Migrations (1 minute)

```bash
cd supabase
supabase db push
```

Or manually run these migrations in SQL Editor:
- `20251008_lesson_reminders.sql`
- `20251008_lesson_reminders_cron.sql`

### 3. Deploy Edge Function (1 minute)

```bash
supabase functions deploy send-lesson-reminders
```

### 4. Configure Environment (1 minute)

In Supabase SQL Editor, run:

```sql
ALTER DATABASE postgres SET app.settings.supabase_url = 'YOUR_SUPABASE_URL';
ALTER DATABASE postgres SET app.settings.supabase_service_key = 'YOUR_SERVICE_ROLE_KEY';
```

Replace with your actual values from Project Settings → API.

### 5. Test It! (1 minute)

In your app, navigate to Organisation Settings and use the admin UI:

```tsx
import { LessonReminderSettingsWrapper } from '@staysecure/notifications';

<LessonReminderSettingsWrapper organisationId={yourOrgId} />
```

Click "Test Reminders" to send a test batch!

## Verification

Check if it's working:

```sql
-- See the cron job
SELECT * FROM cron.job WHERE jobname = 'send-daily-lesson-reminders';

-- Check reminder history
SELECT * FROM lesson_reminder_history ORDER BY sent_at DESC LIMIT 10;

-- Manually trigger (for testing)
SELECT * FROM trigger_lesson_reminders();
```

## Default Settings

Out of the box, the system:
- ✅ Sends reminders daily at 9 AM UTC
- ✅ Notifies users when lessons become available
- ✅ Sends "coming soon" notifications (3 days ahead)
- ✅ Creates both in-app and email notifications
- ✅ Prevents duplicate reminders

## Customization

### Change Schedule Time

```sql
-- Update cron job to run at 6 AM UTC
SELECT cron.unschedule('send-daily-lesson-reminders');
SELECT cron.schedule(
  'send-daily-lesson-reminders',
  '0 6 * * *',  -- 6 AM UTC
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

### Adjust Reminder Settings

Use the Admin UI or directly update:

```sql
UPDATE lesson_reminder_settings 
SET 
  reminder_time = '08:00:00',  -- 8 AM
  upcoming_days_ahead = 5,      -- Look 5 days ahead
  reminder_frequency = 'daily'  -- Send daily reminders
WHERE organisation_id = 'YOUR_ORG_ID';
```

## Common Issues & Solutions

### ❌ Reminders not sending?

**Check**: Is the cron job running?
```sql
SELECT * FROM cron.job_run_details 
WHERE jobname = 'send-daily-lesson-reminders'
ORDER BY start_time DESC LIMIT 5;
```

**Fix**: Re-create the cron job (see Customization above)

### ❌ Emails not arriving?

**Check**: Email service configured?
```bash
supabase functions logs send-email
```

**Fix**: Verify AWS SES or email provider setup

### ❌ No users getting reminders?

**Check**: Are there eligible users?
```sql
SELECT * FROM get_users_needing_lesson_reminders();
```

**Fix**: Ensure:
- Learning tracks are `active`
- Users are enrolled in tracks
- Lessons are `published`
- Reminder settings are `enabled`

## Next Steps

- 📖 Read the full [LESSON_REMINDERS_SETUP.md](./LESSON_REMINDERS_SETUP.md)
- 🎨 Customize email templates
- 📊 Monitor reminder analytics
- ⚙️ Fine-tune scheduling logic

## Support

Need help? Check:
1. Supabase Dashboard → Edge Functions → Logs
2. Database → SQL Editor → Check queries above
3. Full documentation in `LESSON_REMINDERS_SETUP.md`

---

**Ready to go?** Users will now automatically receive reminders when lessons become available! 🎉
