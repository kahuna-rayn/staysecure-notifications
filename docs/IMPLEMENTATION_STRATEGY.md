# Notification System - Implementation Strategy

**Last Updated**: November 6, 2025  
**Status**: Current State & Future Roadmap  
**Key Update**: Data-driven generic system recommended to avoid scaling nightmare (18 notification types, growing to 50+)

---

## 📋 Table of Contents

1. [Current State](#current-state)
2. [Database Architecture](#database-architecture)
3. [Implementation Approaches](#implementation-approaches)
4. [Future Enhancements](#future-enhancements)
5. [Migration Path](#migration-path)

---

## Current State

### Notification Types Overview

#### ✅ Working (4)

| Type | Mechanism | Template | Notes |
|------|-----------|----------|-------|
| **Lesson Completed** | Direct Call | `lesson_completed` | Missing email_preferences check |
| **Track Milestone 50%** | Direct Call | `track_milestone_50` | Missing email_preferences check |
| **Quiz High Score (≥90%)** | Direct Call | `quiz_high_score` | Missing email_preferences check |
| **Lesson Reminders** | Cron Job | `lesson_reminder` | Respects email_preferences ✅ |

#### ⚠️ Partial / Template Ready (3)

| Type | Mechanism | Template | Status |
|------|-----------|----------|--------|
| **Manager Notification** | Cron Job | `manager_employee_incomplete` | ✅ Implemented (cooldown-based) |
| **Track Completion (100%)** | Direct Call | `track_completed` | Certificate exists, no email |
| **Certificate Earned** | Direct Call | `certificate_earned` | Certificate exists, no email |

#### ❌ Not Implemented (10)

**High Priority:**

| Type | Mechanism | Template |
|------|-----------|----------|
| **Certificate Expiration** | Cron Job | `certificate_expiring` |

**Medium Priority:**

| Type | Mechanism | Template |
|------|-----------|----------|
| **Track Milestone 25%** | Direct Call | `track_milestone_25` |
| **Track Milestone 75%** | Direct Call | `track_milestone_75` |
| **Quiz Failed** | Direct Call/Cron | `quiz_failed_reminder` |
| **Quiz Passed** | Direct Call | `quiz_passed` |
| **Assignment Due** | Cron Job | `assignment_due` |

**Low Priority:**

| Type | Mechanism | Template |
|------|-----------|----------|
| **User Inactivity** | Cron Job | `user_inactivity` |
| **New Lesson Available** | Trigger/Cron | `lesson_available` |
| **Weekly Progress Summary** | Cron Job | `weekly_progress_summary` |
| **Achievement Unlocked** | Direct Call | `achievement_unlocked` |
| **System Alerts** | Direct Call | `system_alert` |

**Status Legend:**
- ✅ **Working** - Fully implemented and functional
- ⚠️ **Partial** - Partially implemented (certificate generated but no email)
- ⚠️ **Template Ready** - Template exists but needs cron + Edge Function
- ❌ **Not Implemented** - Not yet built (template needs to be created)

---

### ✅ What's Implemented and Working

#### 1. Direct Notification Calls (LEARN Module)
**Location**: `~/LEARN/staysecure-learn/src/lib/sendNotification.ts`

**Working Notifications**:
- ✅ **Lesson Completed** - Fired when user completes a lesson
- ✅ **Track Milestone 50%** - Fired when user reaches 50% of learning track
- ✅ **Quiz High Score** - Fired when user scores ≥90% on a quiz

**How It Works**:
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

**Pros**:
- Simple and straightforward
- Easy to debug
- Already working and tested
- No additional infrastructure needed

**Cons**:
- Requires code changes for each new notification type
- Only works from frontend code paths
- Doesn't respect `email_preferences` yet (needs to be added)

#### 2. Lesson Reminder System
**Location**: Database functions and Edge Functions

**Tables Used**:
- `lesson_reminder_history` - Tracks sent reminders
- `lesson_reminder_counts` - Tracks reminder attempt counts
- `email_preferences` - User preferences (email_enabled, lesson_reminders)
- `email_notifications` - Email delivery tracking

**Functions**:
- `get_users_needing_lesson_reminders()` - Identifies users needing reminders
- `trigger_lesson_reminders()` - Manual trigger for admins

**Features**:
- ✅ Respects `email_preferences.lesson_reminders`
- ✅ Respects `email_preferences.email_enabled`
- ✅ Prevents duplicate reminders (24-hour cooldown)
- ✅ Tracks reminder attempts for manager notifications

#### 3. Email Templates System
**Location**: `email_templates` table + UI components

**Features**:
- ✅ Template storage in database
- ✅ Template manager UI (`EmailTemplateManager.tsx`)
- ✅ Variable substitution (`{{variable_name}}`)
- ✅ Handlebars conditionals (`{{#if}}...{{/if}}`)
- ✅ RAYN palette color support
- ✅ Preview functionality

**Templates Available**:
- `lesson_completed` ✅ (in use)
- `track_milestone_50` ✅ (in use)
- `quiz_high_score` ✅ (in use)
- `manager_employee_incomplete` ⚠️ (template created, not wired up)

---

## Database Architecture

### Existing Tables

#### `email_preferences`
**Purpose**: User/org-level notification preferences

**Key Columns**:
- `email_enabled` - Global email toggle
- `lesson_reminders` - Lesson reminder toggle
- `course_completions` - Course completion notifications
- `achievements` - Achievement notifications
- `task_due_dates` - Task due date notifications
- `system_alerts` - System alert notifications
- `quiet_hours_enabled` - Quiet hours toggle
- `quiet_hours_start_time` / `quiet_hours_end_time` - Quiet hours window
- `reminder_days_before` - Days before lesson to send reminder
- `reminder_time` - Time of day to send reminders
- `max_reminder_attempts` - Max reminders before manager notification
- `reminder_frequency_days` - Days between reminder attempts

**Status**: ✅ Table exists, but preferences are **NOT checked** in direct notification calls

#### `email_templates`
**Purpose**: Email notification templates

**Key Columns**:
- `name`, `type` - Template identifier
- `subject_template` - Email subject with variables
- `html_body_template` - HTML body with variables
- `text_body_template` - Plain text body
- `variables` - JSONB array of available variables
- `is_active` - Enable/disable template
- `is_system` - System templates (can't be deleted)

**Status**: ✅ Table exists and is being used

#### `email_notifications`
**Purpose**: Legacy email notification tracking

**Status**: ✅ Table exists (marked as legacy, data migrated to `notification_history`)

#### `lesson_reminder_history`
**Purpose**: Tracks sent lesson reminders

**Key Columns**:
- `user_id`, `lesson_id`, `learning_track_id`
- `reminder_type` - 'available_now' or 'available_soon'
- `available_date` - When lesson becomes available
- `sent_at` - When reminder was sent
- `email_notification_id` - Link to `email_notifications`

**Status**: ✅ Table exists and is being used

#### `lesson_reminder_counts`
**Purpose**: Tracks reminder attempt counts per user/lesson

**Key Columns**:
- `user_id`, `lesson_id`, `learning_track_id`
- `reminder_count` - Number of reminders sent
- `last_reminder_sent_at` - Timestamp of last reminder

**Status**: ✅ Table exists and is being used

#### `notification_rules`
**Purpose**: Rules for when to send notifications

**Status**: ✅ Table exists but **not actively used** in current implementation

#### `notification_history`
**Purpose**: Notification delivery tracking and audit trail

**Status**: ✅ Table exists but **not actively used** in current implementation

### Database Functions

#### `should_send_notification(p_user_id, p_notification_type, p_rule_id)`
**Purpose**: Checks if notification should be sent based on preferences

**Checks**:
- `email_enabled` global toggle
- Type-specific toggles (lesson_reminders, course_completions, etc.)
- Quiet hours settings
- Rate limiting (cooldown_hours, max_sends_per_user_per_day)

**Status**: ✅ Function exists but **NOT called** by current direct notification code

#### `get_users_needing_lesson_reminders()`
**Purpose**: Returns users who need lesson reminders

**Checks**:
- `email_enabled` from `email_preferences`
- Lesson availability dates
- Reminder history (prevents duplicates)
- Reminder frequency settings

**Status**: ✅ Function exists and is being used by lesson reminder system

---

## Implementation Approaches

### Approach 1: Direct Code Calls (Current)

**How it works**:
- Frontend code directly calls `sendNotification.ts` functions
- Functions query database and send emails immediately
- No database triggers or Edge Functions needed

**Current Implementation**:
```typescript
// In LessonViewer.tsx
await sendLessonCompletedNotification(
  supabase,
  user.id,
  lesson.id,
  learningTrackId
);
```

**Pros**:
- ✅ Simple and straightforward
- ✅ Easy to debug
- ✅ Already working and tested
- ✅ No additional infrastructure needed

**Cons**:
- ❌ **Doesn't check `email_preferences`** (needs to be added)
- ❌ Requires code changes for each new notification type
- ❌ Only works from frontend code paths
- ❌ Won't fire from admin tools, bulk imports, or direct DB changes

**Scaling Impact**:
- **5 notification types**: Manageable
- **10 notification types**: 10+ files to modify
- **20 notification types**: Becomes unmaintainable

**Best for**:
- Immediate notifications (lesson completed, quiz passed)
- Small number of notification types (< 5)
- When notifications only fire from frontend user actions

### Approach 2: Data-Driven Generic System (Recommended for Scale) ⭐

**Key Innovation**: ONE generic Edge Function + ONE generic direct call function that queries `notification_rules` table. Adding new notification types requires **zero code changes** - just database configuration.

#### For Scheduled Notifications (Cron Jobs)

**ONE Edge Function** handles ALL scheduled notifications:

```typescript
// Edge Function: process-scheduled-notifications
// Runs on cron job (e.g., every hour)
// Queries notification_rules for active scheduled rules

async function processScheduledNotifications() {
  1. Query notification_rules WHERE
     - is_enabled = true
     - send_immediately = false
     - trigger_event matches scheduled types
     - trigger_conditions match current time/state
     - (Optional: send_at_time matches current time)

  2. For each matching rule:
     - Query users who need this notification (using trigger_conditions logic)
     - For each user, check email_preferences via should_send_notification()
     - Gather template variables (from context or database queries)
     - Send email using template from email_template_id
     - Record in notification_history
}
```

**Cron Job Setup** (ONE cron job for all scheduled notifications):
```sql
SELECT cron.schedule(
  'process-all-scheduled-notifications',
  '0 * * * *',  -- Every hour (or '0 9 * * *' for daily at 9 AM)
  $$
  SELECT net.http_post(
    url := 'https://project.supabase.co/functions/v1/process-scheduled-notifications'
  );
  $$
);
```

#### For Direct Calls (Immediate Events)

**ONE Generic Function** handles ALL immediate notifications:

```typescript
// Generic function: sendNotificationByEvent(eventType, context)
// Called from frontend code, admin tools, bulk imports, etc.

async function sendNotificationByEvent(
  eventType: string,  // e.g., 'lesson_completed', 'quiz_passed', 'task_created', 'review_due'
  context: {
    user_id: string,
    lesson_id?: string,
    task_id?: string,
    review_id?: string,
    score?: number,
    // ... any other context needed
  }
) {
  1. Query notification_rules WHERE
     - is_enabled = true
     - trigger_event = eventType
     - send_immediately = true
     - trigger_conditions match context (e.g., score >= 90)

  2. For each matching rule:
     - Check should_send_notification(user_id, eventType, rule_id)
     - Gather template variables from context + database queries
     - Send email using template from email_template_id
     - Record in notification_history
}
```

**Usage in Frontend**:
```typescript
// Instead of: sendLessonCompletedNotification(...)
// Use: sendNotificationByEvent('lesson_completed', { user_id, lesson_id, ... })

// Instead of: sendQuizHighScoreNotification(...)
// Use: sendNotificationByEvent('quiz_completed', { user_id, lesson_id, score, ... })

// For GOVERN module:
// sendNotificationByEvent('task_review_due', { user_id, task_id, review_id, ... })
// sendNotificationByEvent('review_reminder', { user_id, review_id, days_until_due, ... })
```

#### How It Scales

**Adding a New Notification Type** (e.g., "Task Review Reminder" for GOVERN):

1. **Create email template** (via UI or SQL):
```sql
INSERT INTO email_templates (name, type, subject_template, html_body_template, ...)
VALUES ('Task Review Reminder', 'task_review_due', '...', '...');
```

2. **Create notification rule** (via UI or SQL):
```sql
INSERT INTO notification_rules (
  name,
  trigger_event,
  email_template_id,
  trigger_conditions,
  is_enabled,
  send_immediately
) VALUES (
  'Task Review Reminder (3 days before)',
  'task_review_due',  -- Event type identifier
  (SELECT id FROM email_templates WHERE type = 'task_review_due'),
  '{"days_before": 3}'::jsonb,  -- Condition: send 3 days before due
  true,
  false  -- Scheduled, not immediate
);
```

**That's it!** No code changes, no deployments, no triggers to create.

#### Database Tables Used

- ✅ `notification_rules` - Configuration for when to send (already exists!)
- ✅ `email_templates` - Templates to use (already exists!)
- ✅ `email_preferences` - User preferences (already exists!)
- ✅ `notification_history` - Audit trail (already exists!)
- ✅ `should_send_notification()` - Preference checking (already exists!)

#### Pros:
- ✅ **Zero code changes** for new notification types - just database configuration
- ✅ **Scales infinitely** - add 100 notification types without code changes
- ✅ **Works across modules** - LEARN, GOVERN, future modules use same system
- ✅ **Admin-configurable** - enable/disable, adjust conditions via UI
- ✅ **Respects `email_preferences`** automatically via `should_send_notification()`
- ✅ **Single source of truth** - all notification logic in database
- ✅ **Easy to test** - enable/disable rules, test conditions without deployment
- ✅ **Works from any source** - frontend, admin tools, bulk imports, direct DB changes

#### Cons:
- ❌ More complex initial architecture setup (one-time cost)
- ❌ Harder to debug initially (need to understand rules + conditions)
- ❌ Requires Edge Functions deployment (one-time)
- ❌ Need to design event type naming convention
- ❌ Need to design `trigger_conditions` JSONB schema

#### Scaling Impact:
- **5 notification types**: One function, 5 database rows
- **10 notification types**: One function, 10 database rows
- **50 notification types**: One function, 50 database rows
- **100 notification types**: One function, 100 database rows
- **Adding new type**: One database INSERT, zero code changes

#### Best for:
- ✅ **Many notification types planned** (10+)
- ✅ **Cross-module notifications** (LEARN, GOVERN, future modules)
- ✅ **Admin-configurable notifications** (enable/disable without deployment)
- ✅ **Scheduled notifications** (assignment due, review reminders, expiration)
- ✅ **When you need to scale** without code deployment bottleneck

#### Event Type Naming Convention

To scale across modules, use consistent naming:

```
{module}_{entity}_{action}

Examples:
- learn_lesson_completed
- learn_quiz_passed
- learn_track_milestone_50
- govern_task_review_due
- govern_review_reminder
- govern_task_created
```

Or use module-agnostic names:
```
- lesson_completed
- quiz_passed
- task_review_due
- review_reminder
```

#### Trigger Conditions Examples

The `trigger_conditions` JSONB column allows flexible condition matching:

```jsonb
// For quiz high score: only send if score >= 90
{"score": ">=90"}

// For task review: send 3 days before due
{"days_before": 3}

// For assignment due: send when days_until_due <= 7
{"days_until_due": "<=7"}

// Complex conditions (multiple criteria)
{"score": ">=90", "module": "LEARN", "attempt": ">=2"}

// For scheduled notifications: check time window
{"hour": ">=9", "hour": "<=17"}  // Business hours only
```

---

### Approach 3: Hybrid (Current + Data-Driven)

**Recommended Migration Path**:

1. **Keep current direct calls** for existing 4 working notifications
2. **Build generic data-driven system** for all new notifications
3. **Gradually migrate** existing notifications to generic system
4. **Use generic system** for all GOVERN module notifications

**Implementation**:
- Keep `sendLessonCompletedNotification()` etc. for backward compatibility
- Add `sendNotificationByEvent()` for new notifications
- Migrate existing calls one by one when convenient

---

## Future Enhancements

### High Priority

#### 1. Add Email Preference Checks to Direct Calls ⚠️
**Current**: Direct notification calls don't check `email_preferences`

**Action Required**:
```typescript
// In sendNotification.ts, before sending:
const { data: shouldSend } = await supabase
  .rpc('should_send_notification', {
    p_user_id: userId,
    p_notification_type: 'lesson_completed',
    p_rule_id: null  // No rule for direct calls
  });

if (!shouldSend?.should_send) {
  console.log(`Skipping notification: ${shouldSend?.skip_reason}`);
  return;
}
```

#### 2. Manager Notification System ✅
**Status**: Implemented

**Implementation**:
- Edge Function: `process-scheduled-notifications` in `learn/supabase/functions/`
- Template: `manager_employee_incomplete`
- Cooldown: 120 hours (5 days) default, configurable via `MANAGER_NOTIFICATION_COOLDOWN_HOURS`
- Duplicate prevention: Uses `notification_history` table instead of `manager_notified` column

**Mechanism**: Cron job → Edge Function (cooldown-based, no `manager_notified` column needed)

#### 3. Certificate Expiration Reminders ❌
**Status**: Not implemented

**Required**:
- Email template (`certificate_expiring`)
- Cron job to check certificates expiring within 30/60/90 days
- Tracking table to prevent duplicate reminders
- Edge Function to process and send

**Mechanism**: Cron job - runs daily

### Medium Priority

#### 4. Additional Notification Types ❌
See table above for complete list. Priority items:
- Track completion (100%) - Certificate generated, but no email
- Track milestones (25%, 75%) - Only 50% implemented
- Quiz failed reminders
- Quiz passed (non-high score)
- Assignment due reminders
- Certificate earned notifications

#### 5. Migrate to Triggers + Edge Functions ❌
**When**: When you have 10+ notification types planned

**Steps**:
1. Create Edge Functions for each notification type
2. Create database triggers for immediate events
3. Create cron jobs for scheduled events
4. Migrate existing direct calls gradually
5. Update `notification_rules` table usage

---

## Migration Path

### Phase 1: Fix Current Implementation (1-2 weeks)

1. **Add preference checks to direct calls**
   - Update `sendNotification.ts` to call `should_send_notification()`
   - Test that notifications respect user preferences
   - Verify quiet hours are respected

2. ~~**Implement manager notifications**~~ ✅ **DONE**
   - ~~Add `manager_notified` column~~ → Using cooldown-based approach via `notification_history` instead
   - Edge Function `process-scheduled-notifications` implemented
   - Cooldown: 120 hours (configurable via env var)

3. **Certificate expiration reminders**
   - Create email template
   - Create cron job
   - Create tracking mechanism
   - Test with sample data

### Phase 2: Enhance Current System (2-4 weeks)

1. **Add missing notification types**
   - Track completion (100%)
   - Track milestones (25%, 75%)
   - Quiz failed reminders
   - Certificate earned

2. **Improve template system**
   - Add more template variables
   - Enhance template editor UI
   - Add template versioning (optional)

3. **Analytics and monitoring**
   - Dashboard for notification delivery rates
   - User preference analytics
   - Failed notification tracking

### Phase 3: Migrate to Triggers + Edge Functions (4-6 weeks)

**Only if needed** - When you have 10+ notification types or need scheduled notifications

1. Create Edge Functions for notification processing
2. Create database triggers for immediate events
3. Create cron jobs for scheduled events
4. Gradually migrate existing direct calls
5. Update documentation

---

## Decision Matrix

### When to Use Direct Calls (Current Approach)
- ✅ < 5 notification types
- ✅ Immediate user-triggered events
- ✅ Simple notifications that don't need rules engine
- ✅ When you want explicit control
- ⚠️ **Note**: This approach doesn't scale - each new type requires code changes

### When to Use Data-Driven Generic System (Recommended)
- ✅ **10+ notification types planned** (avoids scaling nightmare)
- ✅ **Cross-module notifications** (LEARN, GOVERN, future modules)
- ✅ **Admin-configurable notifications** (enable/disable without deployment)
- ✅ **Scheduled notifications** (assignment due, review reminders, expiration)
- ✅ **When you need to scale** without code deployment bottleneck
- ✅ **When notifications need to fire from any source** (frontend, admin, bulk imports)

### Recommended Migration Strategy

**Phase 1: Keep Current + Build Generic** (This Month)
- Keep existing 4 direct call notifications working
- Build generic `sendNotificationByEvent()` function
- Build generic `process-scheduled-notifications` Edge Function
- Use generic system for all new notifications

**Phase 2: Migrate Existing** (Next Month)
- Migrate existing direct calls to generic system one by one
- Test each migration thoroughly
- Keep backward compatibility during transition

**Phase 3: Full Generic System** (Future)
- All notifications use generic system
- Remove old direct call functions (or keep as wrappers)
- Single source of truth in `notification_rules` table

---

## Next Steps

### Immediate (This Week)
1. ✅ Archive outdated documentation
2. ✅ Create consolidated implementation strategy
3. ⚠️ Add `email_preferences` checks to direct notification calls
4. ⚠️ Review and update remaining documentation

### Short Term (This Month)
1. **Build generic notification system**
   - Create `sendNotificationByEvent()` generic function
   - Create `process-scheduled-notifications` Edge Function
   - Test with one new notification type (e.g., certificate expiration)
2. **Implement manager notifications** (using generic system)
3. **Implement certificate expiration reminders** (using generic system)
4. **Add missing notification types** via database configuration (not code)

### Medium Term (Next Month)
1. Migrate existing direct calls to generic system
2. Add all remaining notification types via database configuration
3. Build admin UI for managing `notification_rules`
4. Test generic system with GOVERN module notifications

### Long Term (As Needed)
1. All new notifications use generic system (zero code changes)
2. GOVERN module notifications use generic system
3. Build notification analytics dashboard
4. Add more notification types as needed (via database only)

---

## Documentation Structure

### Keep in Main Docs
- `IMPLEMENTATION_STRATEGY.md` (this file) - Current strategy
- `NOTIFICATION_IMPLEMENTATION_STATUS.md` - Current state
- `LESSON_REMINDERS_SECURITY.md` - Security model
- `NOTIFICATION_SYSTEM_OVERVIEW.md` - Architecture overview
- `NOTIFICATION_TYPES_REFERENCE.md` - Notification types reference
- `NOTIFICATION_TEMPLATE_EXAMPLES.md` - Template examples
- `NOTIFICATION_ADMIN_GUIDE.md` - Admin guide
- `START_HERE_NOTIFICATIONS.md` - Entry point

### Moved to ARCHIVE
- `LESSON_REMINDERS_FIX.md` - References non-existent organisations table
- `LESSON_REMINDERS_UPDATES.md` - References non-existent tables
- `LESSON_REMINDERS_OPTIMIZED.md` - References non-existent lesson_reminder_config
- `LESSON_REMINDERS_SETUP.md` - References non-existent lesson_reminder_settings
- `LESSON_REMINDERS_QUICKSTART.md` - References non-existent lesson_reminder_settings
- `NOTIFICATION_IMPLEMENTATION_GUIDE.md` - Outdated architecture from a month ago
- `NOTIFICATION_FINAL_SUMMARY.md` - Outdated summary
- `NOTIFICATION_SIMPLIFIED_SUMMARY.md` - Outdated summary
- `NOTIFICATION_FILES_MANIFEST.md` - Outdated file listing
- `NOTIFICATION_DOCUMENTATION_SUMMARY.md` - Outdated summary

---

**Last Updated**: November 6, 2025  
**Maintained By**: Development Team  
**Questions**: See `NOTIFICATION_IMPLEMENTATION_STATUS.md` for detailed current state

