# Testing RAYN Secure Notification System

## Prerequisites

Before testing, you need:
1. Your Supabase project anon key
2. A test email address
3. Access to Supabase SQL Editor

---

## Test 1: Send Basic Email ✉️

### Option A: Using curl (from terminal)

1. Get your anon key from: https://supabase.com/dashboard/project/ufvingocbzegpgjknzhm/settings/api
2. Edit `test-send-email.sh`:
   - Replace `YOUR_ANON_KEY_HERE` with your actual anon key
   - Replace `YOUR_EMAIL@example.com` with your email
3. Run:
```bash
chmod +x test-send-email.sh
./test-send-email.sh
```

### Option B: Using Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/ufvingocbzegpgjknzhm/sql

Run this SQL:
```sql
-- Test send-email function via SQL
SELECT extensions.http_post(
  'https://ufvingocbzegpgjknzhm.supabase.co/functions/v1/send-email',
  jsonb_build_object(
    'to', 'YOUR_EMAIL@example.com',
    'subject', 'Test Email from RAYN Secure',
    'html', '<h2>Test Email</h2><p>This is a test to verify email sending works!</p>'
  ),
  jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || current_setting('request.jwt.claims', true)::json->>'role'
  )
);
```

**Expected Result**: You should receive an email with:
- ✅ RAYN Secure branding (teal gradient header)
- ✅ RAYN 3D logo
- ✅ Your test message
- ✅ Footer with "© 2025 RAYN Secure"

---

## Test 2: Check Existing Tables 📊

Go to SQL Editor and run:

```sql
-- Check if email_preferences table exists and has data
SELECT COUNT(*) as total_users, 
       COUNT(*) FILTER (WHERE email_enabled = true) as email_enabled
FROM email_preferences;

-- Check email_notifications history
SELECT 
  type,
  status,
  COUNT(*) as count,
  MAX(created_at) as last_sent
FROM email_notifications
GROUP BY type, status
ORDER BY last_sent DESC;

-- Check if lesson_reminder_history exists
SELECT 
  reminder_type,
  COUNT(*) as count,
  MAX(created_at) as last_sent
FROM lesson_reminder_history
GROUP BY reminder_type
ORDER BY last_sent DESC;
```

**Expected Results**:
- Should see user email preferences
- Should see notification history if emails were sent
- Should see lesson reminder history if cron job ran

---

## Test 3: Lesson Reminder System 📚

### Check if cron job is running:

```sql
-- Check pg_cron jobs
SELECT * FROM cron.job;
```

**Expected**: Should see a job for `send-lesson-reminders`

### Manually trigger lesson reminders:

```sql
-- Call the lesson reminder function
SELECT extensions.http_post(
  'https://ufvingocbzegpgjknzhm.supabase.co/functions/v1/send-lesson-reminders',
  '{}'::jsonb,
  jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
  )
);
```

**Or** go to: https://supabase.com/dashboard/project/ufvingocbzegpgjknzhm/functions/send-lesson-reminders

Click "Invoke" button.

**Expected Result**:
- Should check for users with lessons available
- Should send reminder emails if any users need them
- Should log to `lesson_reminder_history` table

---

## Test 4: Check Database Schema 🗄️

Verify all required tables exist:

```sql
-- List all notification-related tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%notification%' 
  OR table_name LIKE '%email%'
  OR table_name LIKE '%lesson_reminder%'
ORDER BY table_name;
```

**Expected Tables**:
- `email_notifications` ✅
- `email_preferences` ✅
- `email_templates` ✅ (if exists)
- `lesson_reminder_history` ✅ (if exists)
- `notification_rules` ❓ (new - not deployed yet)
- `notification_history` ❓ (new - not deployed yet)
- `email_layouts` ❓ (new - not deployed yet)

---

## Test 5: Test User Email Preferences 🔔

### Create test preference (if doesn't exist):

```sql
-- Get your user ID first
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';

-- Insert/update email preferences
INSERT INTO email_preferences (
  user_id,
  email_enabled,
  lesson_reminders,
  task_due_dates,
  achievements,
  course_completions
) VALUES (
  'YOUR_USER_ID',
  true,
  true,
  true,
  true,
  true
)
ON CONFLICT (user_id) 
DO UPDATE SET
  email_enabled = true,
  lesson_reminders = true;
```

### Check preferences:

```sql
SELECT 
  u.email,
  ep.email_enabled,
  ep.lesson_reminders,
  ep.task_due_dates,
  ep.quiet_hours_enabled,
  ep.quiet_hours_start,
  ep.quiet_hours_end
FROM email_preferences ep
JOIN auth.users u ON u.id = ep.user_id
WHERE u.email = 'YOUR_EMAIL@example.com';
```

---

## Test 6: Activation Email 💌

### Trigger via create-user function:

**Note**: Only test this if you're comfortable creating a test user.

Go to: https://supabase.com/dashboard/project/ufvingocbzegpgjknzhm/functions/create-user

Invoke with:
```json
{
  "email": "testuser@example.com",
  "fullName": "Test User",
  "role": "learner",
  "departmentId": "some-dept-id",
  "locationId": "some-location-id"
}
```

**Expected**:
- User created in auth.users
- Activation email sent to testuser@example.com
- Email has RAYN branding
- Contains activation link

---

## Troubleshooting 🔧

### If emails aren't sending:

1. **Check Lambda URL is configured:**
```sql
-- In Supabase SQL Editor
SELECT current_setting('app.settings.auth_lambda_url', true);
```

Should return your Lambda URL. If empty, set it in:
- Supabase Dashboard -> Edge Functions -> Environment Variables
- Add: `AUTH_LAMBDA_URL` = your Lambda URL

2. **Check Lambda logs** (if you have AWS access)

3. **Check Edge Function logs:**
   - Go to: https://supabase.com/dashboard/project/ufvingocbzegpgjknzhm/logs/edge-functions
   - Filter by function name
   - Look for errors

### If lesson reminders aren't working:

1. **Check if users have lessons available:**
```sql
-- Check for lessons that should trigger reminders
SELECT 
  u.email,
  l.title as lesson_title,
  lt.title as track_title,
  ltl.available_date
FROM user_enrollments ue
JOIN learning_tracks lt ON ue.learning_track_id = lt.id
JOIN learning_track_lessons ltl ON ltl.learning_track_id = lt.id
JOIN lessons l ON l.id = ltl.lesson_id
JOIN auth.users u ON u.id = ue.user_id
WHERE ltl.available_date <= CURRENT_DATE
  AND NOT EXISTS (
    SELECT 1 FROM user_lesson_progress ulp 
    WHERE ulp.user_id = ue.user_id 
      AND ulp.lesson_id = l.id 
      AND ulp.completed_at IS NOT NULL
  )
LIMIT 10;
```

2. **Check cron schedule:**
```sql
SELECT * FROM cron.job WHERE jobname LIKE '%lesson%';
```

---

## Success Criteria ✅

Your notification system is working if:

- [ ] Basic email test arrives in inbox with RAYN branding
- [ ] Email preferences table has data
- [ ] Email notifications are being logged
- [ ] Lesson reminder function can be invoked
- [ ] Activation emails are sent when users are created
- [ ] All required tables exist in database

---

## Next Steps

After testing completes:
1. ✅ If everything works → System is ready!
2. ❓ If something fails → Check troubleshooting section
3. 🚀 If you want advanced features → Run new migrations

---

**Last Updated**: October 9, 2025

