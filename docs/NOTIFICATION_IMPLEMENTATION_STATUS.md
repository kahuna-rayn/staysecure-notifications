# Notification System Implementation Status

## Current State (November 2025)

### ✅ What's Implemented

1. **Notifications Module** (`~/staysecure-hub/notifications`)
   - Standalone git module at `https://github.com/kahuna-rayn/notifications`
   - `emailService.ts` - Email sending utilities
   - `gatherLessonCompletedVariables()` - Database query function for real notification data
   - Template management UI components
   - Handlebars conditional support (`{{#if}}` / `{{/if}}`)
   - RAYN palette color support in templates

2. **LEARN Module Integration** (`~/LEARN/staysecure-learn`)
   - `src/lib/sendNotification.ts` - Helper functions that call notification module
   - Wired to trigger on:
     - ✅ Lesson completion (`LessonViewer.tsx`)
     - ✅ Track milestone 50% (`LearningTrackViewer.tsx`)
     - ✅ Quiz high score ≥90% (`useQuizLogic.ts`)

3. **How It Currently Works**
   ```
   User completes lesson
   ↓
   Progress saved to database
   ↓
   sendLessonCompletedNotification() called directly
   ↓
   gatherLessonCompletedVariables() queries database
   ↓
   emailService.sendEmailFromTemplate() sends email
   ```

### ❌ What's Missing (From Documentation)

The notifications module documentation (`NOTIFICATION_IMPLEMENTATION_GUIDE.md`) describes an architecture that is **not yet implemented**:

1. **Edge Functions** (to be created):
   - `process-lesson-completed`
   - `process-quiz-completed`
   - `process-track-milestone`
   - `check-assignment-deadlines`
   - `check-user-inactivity`

2. **Database Triggers**:
   - Automatic detection of events (lesson completion, quiz completion, etc.)
   - Triggers that call Edge Functions when events occur

3. **Notification Rules Engine**:
   - Database-driven rules for when to send notifications
   - User preference checking
   - Rate limiting and cooldowns
   - Conditional logic

## Two Approaches Comparison

### Approach 1: Direct Code Calls (Current Implementation)

**How it works:**
- Frontend code directly calls `sendNotification.ts` functions
- Functions query database and send emails immediately
- No database triggers or Edge Functions needed

**Pros:**
- ✅ Simple and straightforward
- ✅ Easy to debug (all logic in one place)
- ✅ Immediate feedback (errors visible in console)
- ✅ No additional infrastructure needed
- ✅ Already working and tested

**Cons:**
- ❌ **Scaling Problem**: Requires code changes for EACH new notification type
- ❌ **Scaling Problem**: Must modify multiple files (component, hook, helper function)
- ❌ **Scaling Problem**: Only works if frontend code path is executed
- ❌ **Scaling Problem**: Won't fire from admin tools, bulk imports, or direct DB changes
- ❌ Tightly couples frontend to notification logic
- ❌ Can't easily add rules/conditions without code changes
- ❌ Background jobs (scheduled reminders) require separate mechanism

**Scaling Impact:**
- **5 notification types**: 5 code changes, manageable
- **10 notification types**: 10 code changes, 10+ files to modify
- **20 notification types**: 20 code changes, 20+ files to modify, becomes unmaintainable

**Best for:**
- Immediate notifications (lesson completed, quiz passed)
- **Small number of notification types (< 5)**
- When you want full control over when notifications fire
- When notifications only fire from frontend user actions

---

### Approach 2: Database Triggers + Edge Functions + Cron Jobs (Documented Architecture)

**How it works for immediate events (triggers):**
```sql
-- Database trigger fires when lesson completed
CREATE TRIGGER on_lesson_completed
AFTER INSERT ON user_lesson_progress
FOR EACH ROW
WHEN (NEW.completed_at IS NOT NULL)
EXECUTE FUNCTION notify_lesson_completed();

-- Function calls Edge Function
CREATE FUNCTION notify_lesson_completed()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://project.supabase.co/functions/v1/process-notification',
    body := jsonb_build_object(
      'notification_type', 'lesson_completed',
      'user_id', NEW.user_id,
      'lesson_id', NEW.lesson_id,
      'learning_track_id', ...
    )
  );
  RETURN NEW;
END;
$$;
```

**How it works for scheduled events (cron jobs):**
```sql
-- pg_cron job runs daily at configured time
SELECT cron.schedule(
  'send-lesson-reminders',
  '0 9 * * *',  -- 9 AM daily
  $$
  SELECT net.http_post(
    url := 'https://project.supabase.co/functions/v1/process-scheduled-notifications',
    body := jsonb_build_object('type', 'lesson_reminders')
  );
  $$
);

-- Cron job for manager notifications (runs after reminders)
SELECT cron.schedule(
  'check-manager-notifications',
  '0 10 * * *',  -- 10 AM daily (after reminders)
  $$
  SELECT net.http_post(
    url := 'https://project.supabase.co/functions/v1/process-scheduled-notifications',
    body := jsonb_build_object('type', 'manager_notifications')
  );
  $$
);
```

**Edge Function for scheduled notifications:**
1. Queries `get_users_needing_lesson_reminders()` or similar function
2. For each user, checks `email_preferences`:
   - `reminder_frequency_days` - time since last reminder
   - `max_reminder_attempts` - current attempt count
   - `reminder_time` - time of day to send
3. Tracks attempts in `lesson_reminder_history` table
4. If `attempt_count >= max_reminder_attempts`, triggers manager notification
5. Sends notification via email service

**Reminder Tracking Tables (actual schema):**
```sql
-- Tracks reminder attempts per user/lesson
CREATE TABLE lesson_reminder_history (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  learning_track_id uuid,
  reminder_type text, -- 'available_now', 'available_soon'
  available_date date,
  sent_at timestamp with time zone NOT NULL,
  email_notification_id uuid,
  FOREIGN KEY (user_id) REFERENCES auth.users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Counts reminder attempts (for max_reminder_attempts check)
-- NOTE: Actual schema doesn't have manager_notified column yet - needs to be added
CREATE TABLE lesson_reminder_counts (
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  learning_track_id uuid NOT NULL,
  reminder_count integer DEFAULT 0,
  last_reminder_sent_at timestamp with time zone,
  -- manager_notified boolean DEFAULT false,  -- TODO: Add this column
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

**How Cron Jobs Respect `email_preferences` Settings:**

The Edge Function processes scheduled notifications and checks `email_preferences` for each user:

```sql
-- Example: Cron job calls Edge Function
-- Edge Function then queries:
SELECT 
  lrc.user_id,
  lrc.lesson_id,
  lrc.reminder_count,
  ep.max_reminder_attempts,
  ep.reminder_frequency_days,
  ep.reminder_time,
  ep.lesson_reminders,
  ep.email_enabled
FROM lesson_reminder_counts lrc
INNER JOIN email_preferences ep ON ep.user_id = lrc.user_id
INNER JOIN profiles p ON p.id = lrc.user_id
WHERE 
  -- Lesson is still incomplete
  NOT EXISTS (
    SELECT 1 FROM user_lesson_progress ulp 
    WHERE ulp.user_id = lrc.user_id AND ulp.lesson_id = lrc.lesson_id 
    AND ulp.completed_at IS NOT NULL
  )
  -- Check if enough time has passed since last reminder
  AND (lrc.last_reminder_sent_at IS NULL 
       OR lrc.last_reminder_sent_at < NOW() - (ep.reminder_frequency_days || ' days')::INTERVAL)
  -- Check if we haven't exceeded max attempts
  AND lrc.reminder_count < COALESCE(ep.max_reminder_attempts, 3)
  -- Check if reminders are enabled
  AND COALESCE(ep.lesson_reminders, true) = true
  AND COALESCE(ep.email_enabled, true) = true
  -- Check if current time matches reminder_time (within 1 hour window)
  AND EXTRACT(HOUR FROM NOW()) = EXTRACT(HOUR FROM ep.reminder_time);
```

**For Manager Notifications:**
```sql
-- Query to find users needing manager notifications:
SELECT 
  lrc.user_id,
  lrc.lesson_id,
  lrc.reminder_count,
  ep.max_reminder_attempts,
  p.manager as manager_id,
  mgr.full_name as manager_name,
  mgr.email as manager_email
FROM lesson_reminder_counts lrc
INNER JOIN email_preferences ep ON ep.user_id = lrc.user_id
INNER JOIN profiles p ON p.id = lrc.user_id
INNER JOIN profiles mgr ON mgr.id = p.manager
WHERE 
  -- Lesson is still incomplete
  NOT EXISTS (
    SELECT 1 FROM user_lesson_progress ulp 
    WHERE ulp.user_id = lrc.user_id AND ulp.lesson_id = lrc.lesson_id 
    AND ulp.completed_at IS NOT NULL
  )
  -- Has reached max reminder attempts
  AND lrc.reminder_count >= COALESCE(ep.max_reminder_attempts, 3)
  -- Manager notification not yet sent
  -- AND lrc.manager_notified = false  -- TODO: Add column first
  -- Manager exists
  AND p.manager IS NOT NULL;
```

**Pros:**
- ✅ **Scales Better**: Add new notification type = add one trigger + Edge Function (no frontend code changes)
- ✅ **Scales Better**: Works regardless of how data enters database (frontend, admin tools, bulk imports, scripts)
- ✅ **Scales Better**: Database does the work, not frontend code
- ✅ **Scales Better**: Centralized logic - one Edge Function can handle multiple notification types
- ✅ **Handles scheduled notifications**: Cron jobs handle time-based logic (reminders, manager notifications)
- ✅ **Respects email_preferences**: Config-driven (max_reminder_attempts, reminder_frequency_days, reminder_time)
- ✅ Decoupled from frontend code
- ✅ Rules engine can be configured via UI (no code changes)
- ✅ Notification rules can be configured in database (enable/disable, conditions, etc.)

**Cons:**
- ❌ More complex initial architecture setup (triggers + cron + Edge Functions)
- ❌ Harder to debug (triggers → Edge Functions → logs, or cron → Edge Functions → logs)
- ❌ Requires Edge Functions deployment
- ❌ Database triggers can have slight performance impact (but async, so minimal)
- ❌ More infrastructure to maintain initially (pg_cron setup, monitoring)

**Scaling Impact:**
- **5 notification types**: 3-5 triggers, 1-2 cron jobs, 1-2 Edge Functions (shared logic)
- **10 notification types**: 5-10 triggers, 2-3 cron jobs, 1-2 Edge Functions, still manageable
- **20 notification types**: 10-20 triggers, 3-5 cron jobs, 1-2 Edge Functions, scales linearly
- **Adding new type**: Create trigger/cron + configure, no frontend code changes needed

**Best for:**
- **Many notification types (5+)**
- **When notifications need to fire from multiple sources** (frontend, admin, imports, scripts)
- **Scheduled/background notifications** (reminders, manager alerts, inactivity checks)
- When you want admin-configurable rules (enable/disable, conditions)
- **When you want the database to handle notification logic, not frontend code**

---

## How Triggers and Cron Jobs Work Together

### Quick Answer to Your Questions

**Q: How will triggers work for manager notification? Don't we need a cron job?**

**A:** Yes, you're correct! **Manager notifications require cron jobs, NOT triggers**, because:
- Manager notifications depend on **counting reminder attempts over time**
- They need to check `reminder_count >= max_reminder_attempts` from `email_preferences`
- This requires scheduled checking (daily/hourly), not immediate event triggers

**Q: How do triggers work with sending N notifications as configured in email settings?**

**A:** There are two mechanisms:

1. **For Immediate Events (Triggers)**: Triggers fire immediately, but the Edge Function checks `email_preferences` before sending:
   - `email_enabled` - global toggle
   - `lesson_reminders`, `course_completions`, `achievements`, etc. - type-specific toggles
   - `quiet_hours_enabled`, `quiet_hours_start`, `quiet_hours_end` - time-based filtering
   - `max_sends_per_user_per_day` (from `notification_rules`) - rate limiting

2. **For Scheduled Events (Cron Jobs)**: Cron jobs run at configured times and check `email_preferences` for each user:
   - `reminder_frequency_days` - how often to send reminders
   - `max_reminder_attempts` - when to escalate to manager
   - `reminder_time` - time of day to send
   - `reminder_days_before` - how many days before due date

### Summary Table

| Notification Type | Mechanism | Checks `email_preferences` |
|------------------|-----------|---------------------------|
| Lesson Completed | Database Trigger → Edge Function | ✅ Immediately (email_enabled, course_completions, quiet_hours) |
| Quiz High Score | Database Trigger → Edge Function | ✅ Immediately (email_enabled, achievements, quiet_hours) |
| Lesson Reminders | Cron Job → Edge Function | ✅ Scheduled (reminder_frequency_days, reminder_time, max_reminder_attempts) |
| Manager Notification | Cron Job → Edge Function | ✅ Scheduled (max_reminder_attempts, checks reminder_count) |

---

## Future Notification Types to Implement

Based on `email_preferences` table columns, here are the notification types that need templates/implementations:

### From `email_preferences` Columns

1. ✅ **Lesson Reminders** (`lesson_reminders`, `reminder_days_before`, `reminder_time`) - Already implemented
   - Template: `lesson_reminder`
   - Uses: `reminder_days_before`, `reminder_time`, `include_upcoming_lessons`, `upcoming_days_ahead`
   - Status: ✅ Working

2. ⚠️ **Manager Notification - Employee Incomplete** (`max_reminder_attempts`, `reminder_frequency_days`)
   - Template: `manager_employee_incomplete` - ✅ **Migration created**
   - **Mechanism**: Cron job (NOT trigger) - runs after reminder cron job
   - **How it works**:
     1. Cron job `send-lesson-reminders` runs daily at `reminder_time` (from email_preferences)
     2. Sends reminders, tracks attempts in `lesson_reminder_history`
     3. Cron job `check-manager-notifications` runs after reminders
     4. Queries users where `attempt_count >= max_reminder_attempts` AND `manager_notified = false`
     5. For each user, finds manager via `profiles.manager` FK
     6. Sends manager notification with incomplete lessons list
     7. Sets `manager_notified = true` to prevent duplicate notifications
   - **Variables**: `manager_name`, `employee_name`, `employee_email`, `reminder_attempts`, `incomplete_lessons[]`, `total_incomplete_count`
   - **Status**: ⚠️ Template created, cron job + Edge Function implementation needed

3. ❌ **Task Due Reminders** (`task_due_dates`)
   - Template: `assignment_due` or `task_due_reminder`
   - Trigger: When assignment/task is due (based on `reminder_days_before`)
   - Status: ❌ Not implemented

4. ❌ **System Alerts** (`system_alerts`)
   - Template: `system_alert`
   - Trigger: System-wide alerts (maintenance, security, etc.)
   - Status: ❌ Not implemented

5. ❌ **Achievement Notifications** (`achievements`)
   - Template: `achievement_unlocked`
   - Trigger: When user earns achievement/badge
   - Status: ❌ Not implemented

6. ✅ **Course Completion** (`course_completions`)
   - Template: `track_completed` (or similar)
   - Trigger: When user completes entire learning track
   - Status: ⚠️ Partially implemented (certificate generation exists)

### Additional High Priority
7. **Track Completion** - When user completes entire track
   - Template: `track_completed`
   - Status: ⚠️ Certificate generated, but no email notification

8. **Track Milestones (25%, 75%, 100%)** - More granular progress notifications
   - Template: `track_milestone_25`, `track_milestone_75`, `track_milestone_100`
   - Status: ⚠️ Only 50% milestone implemented

9. **Quiz Failed Reminders** - When user fails quiz multiple times
   - Template: `quiz_failed_reminder`
   - Status: ❌ Not implemented

### Medium Priority
10. **User Inactivity** - No activity for 30 days
    - Template: `user_inactivity`
    - Status: ❌ Not implemented

11. **New Lesson Available** - When next lesson unlocks in scheduled track
    - Template: `lesson_available`
    - Status: ❌ Not implemented

12. **Certificate Earned** - When certificate is generated
    - Template: `certificate_earned`
    - Status: ⚠️ Certificate generation exists, but no email notification

13. ❌ **Certificate Expiration Reminders** - Notify users when certificates are about to expire
    - Template: `certificate_expiring` - ❌ **Not implemented**
    - **Mechanism**: Cron job - runs daily to check certificates expiring within 30/60/90 days
    - **How it should work**:
      1. Cron job runs daily (e.g., 9 AM)
      2. Queries `certificates` table for certificates with `expiry_date` within configured window (30/60/90 days)
      3. Checks `email_preferences` for user (email_enabled, achievements, quiet_hours)
      4. Sends reminder email with certificate details and expiry date
      5. Tracks sent reminders to avoid duplicates (similar to `lesson_reminder_history`)
    - **Database**: Certificates table has `expiry_date` field, UI shows "Expiring Soon" status (within 30 days) but no email notifications
    - **Variables needed**: `user_name`, `certificate_name`, `expiry_date`, `days_until_expiry`, `client_login_url`
    - **Status**: ❌ Not implemented - needs template + cron job + Edge Function

### Low Priority
14. **Weekly Progress Summary** - Digest of week's activity
    - Template: `weekly_progress_summary`
    - Status: ❌ Not implemented

15. **Department Leaderboard** - Gamification notifications
    - Template: `leaderboard_update`
    - Status: ❌ Not implemented

16. **Achievement Unlocked** - Badge/achievement notifications
    - Template: `achievement_unlocked` (same as #5 above)
    - Status: ❌ Not implemented

---

## Recommendation

### Scaling Analysis

**The key question: How many notification types will you have?**

- **< 5 types**: Direct calls are fine, simple and manageable
- **5-10 types**: Hybrid approach recommended (direct calls for immediate events, triggers for scheduled)
- **10+ types**: Database triggers + Edge Functions strongly recommended for scalability

**Why database triggers scale better:**

1. **Less Code Changes**: Adding a new notification type with triggers = create trigger + Edge Function (no frontend changes). With direct calls = modify frontend code in multiple places.

2. **Database Does the Work**: The database detects events automatically, so you don't need to remember to add notification calls in every code path.

3. **Works from Any Source**: Whether data comes from frontend, admin tools, bulk imports, or scripts, triggers fire automatically.

4. **Centralized Logic**: One Edge Function can handle multiple notification types with shared logic, reducing duplication.

5. **Configuration Over Code**: Rules can be configured in database (enable/disable, conditions) rather than hardcoded in frontend.

### For Immediate Needs (Current State)
**Keep the direct call approach** - It's working, simple, and sufficient for the current 3 notification types.

### For Future Scalability (10+ planned notification types)
**Strongly consider migrating to Edge Functions + Triggers** because:
- You have 10+ notification types planned
- You'll need scheduled/background notifications (assignment due, inactivity)
- Database triggers scale better - less code changes per notification type
- You want notifications to fire from any source (frontend, admin, imports)
- You want admin-configurable rules without code deployments

### Hybrid Approach (Recommended)
Use **both** approaches strategically:

1. **Direct calls** for:
   - Immediate user-triggered events (lesson completed, quiz passed)
   - Simple notifications that don't need rules engine
   - When you want explicit control

2. **Edge Functions + Triggers** for:
   - Scheduled notifications (assignment due, inactivity)
   - Background jobs (daily/weekly digests)
   - When notifications need to fire from any source (not just frontend)
   - When you want admin-configurable rules

### Migration Path
1. Keep current direct calls working
2. Build Edge Functions for new notification types
3. Gradually migrate existing notifications if needed
4. Use database triggers only for scheduled/background jobs initially

---

## Implementation Details

### Current Files

**LEARN Module:**
- `src/lib/sendNotification.ts` - Helper functions (NEW)
- `src/components/lesson/LessonViewer.tsx` - Calls notification on completion
- `src/components/dashboard/LearningTrackViewer.tsx` - Calls notification on milestone
- `src/hooks/useQuizLogic.ts` - Calls notification on high score

**Notifications Module:**
- `src/lib/emailService.ts` - Email sending service
- `src/lib/emailService.ts` - `gatherLessonCompletedVariables()` function
- `src/components/EmailTemplateManager.tsx` - Template management UI

### Database Schema
- `email_templates` - Template storage (exists)
- `notification_rules` - Rule configurations (exists, but not used by current implementation)
- `notification_history` - Delivery tracking (exists, but not used by current implementation)
- `email_preferences` - User preferences (exists, should be checked but currently isn't)

### Edge Functions (Not Yet Implemented)
- `supabase/functions/process-lesson-completed/` - Does not exist
- `supabase/functions/process-quiz-completed/` - Does not exist
- `supabase/functions/process-track-milestone/` - Does not exist

---

## Questions to Consider

1. **Do you need admin-configurable rules?** (e.g., "only send lesson completion emails on weekdays")
   - If YES → Edge Functions approach
   - If NO → Direct calls are fine

2. **Do notifications need to fire from database changes?** (e.g., bulk imports, admin actions)
   - If YES → Database triggers needed
   - If NO → Direct calls are fine

3. **How many notification types do you plan to have?**
   - < 5 → Direct calls manageable (current state)
   - 5-10 → Hybrid approach (direct for immediate, triggers for scheduled)
   - **10+ → Edge Functions + Triggers strongly recommended** (you have 10+ planned)

4. **Do you need scheduled/background notifications?**
   - If YES → Edge Functions + pg_cron needed
   - If NO → Direct calls work

---

## Next Steps

1. **Short term**: Keep current implementation, add remaining notification types using direct calls
2. **Medium term**: Evaluate if you need scheduled notifications or admin-configurable rules
3. **Long term**: If scaling, migrate to Edge Functions + Triggers for new notification types

---

## Notes

- The notifications module is standalone and reusable ✅
- The current implementation works but doesn't use the full documented architecture
- Both approaches are valid - choose based on your needs
- You can migrate incrementally (no need to rewrite everything)

