# Notification System — Implementation Status

**Last Updated**: March 2026

---

## What's Fully Wired (5 event types)

These have a complete chain: call site → `sendNotificationByEvent` → `notification_rules` row → template → variable gatherer → send.

| Event type | Call site | Template | Variables resolved |
|---|---|---|---|
| `lesson_completed` | `LessonViewer.tsx` | `lesson_completed` | `user_name`, `lesson_title`, `learning_track_title`, progress stats |
| `track_milestone_50` | `LearningTrackViewer.tsx` | `track_milestone_50` | `user_name`, `learning_track_title`, progress stats |
| `track_completed` | `LearningTrackViewer.tsx` | `track_completed` | `user_name`, `learning_track_title`, progress stats |
| `quiz_high_score` | `useQuizLogic.ts` (score ≥ 90) | `quiz_high_score` | `user_name`, `quiz_title`, `score`, `correct_answers`, `completion_time` |
| `manager_employee_incomplete` | Edge Function `process-scheduled-notifications` + cron | `manager_employee_incomplete` | `manager_name`, `employee_name/email`, `incomplete_lessons[]` |

---

## Templates Exist but Not Wired (5 types)

These have rows in both `email_templates` and `notification_rules`, but no code fires the event. The rule engine would handle them correctly if `sendNotificationByEvent` were called with the right event type — the missing piece is a call site and a variable gatherer for any context-derived variables.

| Event type | What's missing | Variables needed | Notes |
|---|---|---|---|
| `lesson_reminder` | Call site (cron + Edge Function) | `lesson_title`, `lesson_description`, `track_title`, `lesson_url` from context | Needs `lesson_id` in context; variable gatherer needed for DB lookups |
| `course_completion` | Call site | `course_name` | Nearly identical to `track_completed`; renaming `{{course_name}}` to `{{learning_track_title}}` and reusing `track_completed` event would work today |
| `system_alert` | Call site (manual/admin trigger) | `alert_title`, `alert_message` | These can be passed directly in context — no gatherer needed |
| `task_due` | Call site (cron + Edge Function) | `task_name`, `due_date` | Needs `task_id` in context; gatherer needed for `task_name` |
| `achievement` | Call site (wherever achievements are granted) | `achievement_title`, `achievement_description` | Needs `achievement_id` in context; gatherer needed |

---

## What Needs Building Next

### High priority

**1. Wire `lesson_reminder`**
- The template and rule already exist
- Need: a cron + Edge Function that queries users with upcoming/overdue lessons and calls `sendNotificationByEvent('lesson_reminder', { user_id, lesson_id, ... })`
- Or: wire into the existing `send-lesson-reminders` Edge Function which already does this logic but sends directly rather than going through `sendNotificationByEvent`

**2. Wire `achievement` notifications**
- Need: add `sendNotificationByEvent('achievement', { user_id, achievement_id })` wherever achievements are granted
- Need: add one `if (eventType === 'achievement')` block in `gatherTemplateVariables` to look up `achievement_title` and `achievement_description` from `achievement_id`

### Medium priority

**3. Add remaining event types from `NOTIFICATION_TYPES_REFERENCE.md`**
- Track milestones 25%, 75% — call sites easy to add alongside existing 50% code
- `quiz_passed` (score 70–89%) — add alongside existing `quiz_high_score` trigger
- `task_due` reminders — requires cron/Edge Function and `tasks` table integration

**4. Notification Rules admin UI**
- Currently rules are managed directly in the database
- A `NotificationRulesManager` component (parallel to the existing `EmailTemplateManager`) would let admins enable/disable rules, adjust conditions and cooldowns without a DB console

### Low priority

**5. `variable_gatherer` for remaining event types**
- As new events are added, each needs a `if (eventType === '...')` block in `gatherTemplateVariables` for variables that require DB joins
- Variables passable directly in context (scores, dates, names known at call time) need no gatherer — they flow through the default context spread

---

## How to Add a New Notification (checklist)

### For a new rule on an existing event type
1. Insert a row into `email_templates` (via admin UI)
2. Insert a row into `notification_rules` pointing at the template

That's it — no code changes.

### For a new frontend-triggered event type
1. Insert a row into `email_templates` (via admin UI or SQL)
2. Insert a row into `notification_rules` (SQL, no UI yet)
3. Add `sendNotificationByEvent(supabase, 'your_event', { user_id, ...context })` at the relevant call site
4. If the template uses variables that require DB lookups beyond what `variableSubstitution.ts` handles (e.g. `{{certificate_name}}` from `certificate_id`): add one `if (eventType === 'your_event')` block in `gatherTemplateVariables` in `sendNotification.ts`

### For a new scheduled/cron event type
Same as above, but step 3 is a cron job → Edge Function rather than a frontend call.

---

## Key Files

| File | Purpose |
|---|---|
| `learn/src/lib/sendNotification.ts` | Main notification engine — `sendNotificationByEvent`, `gatherTemplateVariables` |
| `learn/src/lib/variableSubstitution.ts` | Generic variable resolution — user/org/system variables |
| `notifications/src/lib/emailService.ts` | Email sending via AWS SES |
| `notifications/src/components/EmailTemplateManager.tsx` | Admin UI for managing `email_templates` |
| `learn/src/components/EmailNotificationsWrapper.tsx` | Mounts template manager + preferences in the admin panel |
| `learn/supabase/functions/process-scheduled-notifications/` | Edge Function for manager notifications (cron-triggered) |
| `learn/supabase/functions/send-lesson-reminders/` | Edge Function for lesson reminders (cron-triggered) |
