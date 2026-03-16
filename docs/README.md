# Notification System

Template-based email notification system for the StaySecure platform. Notifications are driven by the `notification_rules` table — adding a rule row for an existing event type requires no code changes.

**Last Updated**: March 2026

---

## How It Works (30-second version)

1. Something calls `sendNotificationByEvent(supabase, 'event_type', { user_id, ...context })`
2. The engine queries `notification_rules` for active rules matching that event type
3. For each matching rule: checks preferences, gathers template variables, sends email, records history
4. Template variables are resolved via `variableSubstitution.ts` — a mix of live DB lookups and static defaults

---

## Documentation

| File | What it covers |
|---|---|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | How the system works end-to-end, key design decisions |
| **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** | What's wired today, what's not, what needs doing next |
| **[NOTIFICATION_TYPES_REFERENCE.md](./NOTIFICATION_TYPES_REFERENCE.md)** | All planned event types and their trigger mechanisms |
| **[NOTIFICATION_ADMIN_GUIDE.md](./NOTIFICATION_ADMIN_GUIDE.md)** | Guide for client admins managing templates and rules |
| **[NOTIFICATION_DATABASE_SCHEMA.md](./NOTIFICATION_DATABASE_SCHEMA.md)** | Database tables, columns, and RLS policies |
| **[NOTIFICATION_TEMPLATE_EXAMPLES.md](./NOTIFICATION_TEMPLATE_EXAMPLES.md)** | Ready-to-use HTML template examples |
| **[LESSON_REMINDERS_SECURITY.md](./LESSON_REMINDERS_SECURITY.md)** | RLS policies and access control model |

---

## Current Status (March 2026)

### Fully working (5 event types)
- `lesson_completed` — fired from `LessonViewer.tsx`
- `track_milestone_50` — fired from `LearningTrackViewer.tsx`
- `track_completed` — fired from `LearningTrackViewer.tsx`
- `quiz_high_score` — fired from `useQuizLogic.ts`
- `manager_employee_incomplete` — fired from Edge Function + cron

### Templates exist but not wired (5 types)
`lesson_reminder`, `course_completion`, `system_alert`, `task_due`, `achievement` — templates exist in `email_templates` and notification rules exist in `notification_rules`, but no call site fires these event types yet.

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for the full breakdown and next steps.
