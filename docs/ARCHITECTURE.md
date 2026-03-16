# Notification System — Architecture & Design Decisions

**Last Updated**: March 2026

---

## System Overview

```
Call site (frontend component or Edge Function)
  │
  └─▶ sendNotificationByEvent(supabase, 'event_type', { user_id, ...context })
        │
        ├─ Query notification_rules WHERE trigger_event = eventType AND is_enabled = true
        │
        ├─ For each matching rule:
        │    ├─ Evaluate trigger_conditions (e.g. score >= 90)
        │    ├─ Check email_preferences (user-level, fallback to org-level)
        │    ├─ Fetch email template from email_templates
        │    ├─ Gather template variables → gatherTemplateVariables()
        │    ├─ Send via emailService.sendEmailFromTemplate()
        │    └─ Record in notification_history
        │
        └─ (done — notification failures never throw, they log and continue)
```

All logic lives in `learn/src/lib/sendNotification.ts`. The shared `staysecure-notifications` package provides `emailService` and `gatherLessonCompletedVariables`.

---

## Key Tables

| Table | Role |
|---|---|
| `email_templates` | Template content — subject, HTML body, variable list. Managed via admin UI. |
| `notification_rules` | When to send — links a `trigger_event` to a template, with conditions, cooldown, rate limits. |
| `email_preferences` | User/org toggles — `email_enabled`, `track_completions`, `achievements`, `lesson_reminders`, quiet hours. |
| `notification_history` | Audit trail — every send/skip/fail recorded here. Also used for cooldown checks. |
| `template_variables` | Registry of available `{{variables}}` for the template editor UI. |
| `template_variable_translations` | Default/static values for each variable (used in preview and as fallback). |

---

## Variable Resolution

Template variables (e.g. `{{user_name}}`, `{{lesson_title}}`) are resolved in `gatherTemplateVariables()` in `sendNotification.ts`, then supplemented by `substituteVariables()` in `variableSubstitution.ts`.

### Resolution order

1. **Event-specific gatherer** (hardcoded `if` blocks in `gatherTemplateVariables`) — does live DB lookups for the specific event type (e.g. joins `lessons` table to get `lesson_title` from `lesson_id`)
2. **Default fallback** — spreads the raw context object as variables, then calls `lookupTemplateVariables()` for anything still missing
3. **`substituteVariables` system** — resolves registered system variables via live DB lookups (`user_name` from `profiles`, `org_name` from `org_profile`, key personnel from `org_sig_roles`, etc.)
4. **Static default** — falls back to the value in `template_variable_translations` (used for template preview, not live sends)

### Variables resolved dynamically (no code needed)

These are handled by `variableSubstitution.ts` for any event type automatically:

- **User**: `user_name`, `first_name`, `last_name`, `user_email`, `user_department`
- **Organisation**: `org_name`
- **Key Personnel**: `dpo_name/email`, `iso_name/email`, `cem_name/email`, `hib_name/email`, `dpe_name/email`
- **System**: `current_date`, `current_time`, `client_login_url`, `next_lesson_title`, `next_lesson_url`
- **Static/configured**: `it_support_number`, any user-defined variable in `template_variable_translations`

### Variables requiring event-specific code

Variables that need a DB join from an ID in context (e.g. resolving `lesson_title` from `lesson_id`) require a dedicated `if` block in `gatherTemplateVariables`. Currently implemented for: `lesson_completed`, `track_milestone_50`, `track_completed`, `quiz_high_score`, `manager_employee_incomplete`.

---

## Design Decisions

### 1. Direct frontend calls vs DB triggers as call sites

**Decision**: Frontend components call `sendNotificationByEvent()` directly for immediate user-triggered events. DB triggers + Edge Functions are used only for scheduled/background events (lesson reminders, manager notifications).

**Rationale**: For events that originate in the UI (lesson completion, quiz score), the frontend already has the context in memory (user_id, lesson_id, score, etc.) and can call the notification function with zero latency. DB triggers add infrastructure complexity (pg_net, async, harder to debug) with no benefit for these cases. The `manager_employee_incomplete` notification is scheduled (needs to check after N reminders over time), so a cron → Edge Function is the right pattern there.

**Consequence**: Adding a new frontend-triggered notification requires adding a `sendNotificationByEvent(...)` call at the relevant event site in the component or hook.

---

### 2. Hardcoded case statements vs metadata-driven variable resolution

**Decision**: Variable resolution for event-specific data uses hardcoded `if` blocks in `gatherTemplateVariables()`, not a metadata-driven system.

**Rationale**:

- **Debuggability**: When a variable resolves wrong, you open one function, read the relevant `if` block, and immediately see the DB query. With metadata-driven resolution (e.g. storing `source_table`, `source_column`, `context_id_key` in the DB), debugging is split across two systems.
- **Type safety**: TypeScript knows exactly what `context.lesson_id` is. A generic `context[variable.context_id_key]` lookup is untyped.
- **Computed variables**: Some variables can't be expressed as a simple table/column lookup (e.g. `time_spent_hours` requires aggregation, `completion_time` is a formatted duration). These will always need code. A hybrid of metadata-driven + hardcoded creates two systems to understand.
- **Scale**: At the current volume (~5-10 event types), the if-else chain is readable and maintainable. The tipping point for metadata-driven is typically when non-developers need to add variables without a deployment — that's not the case here.

**What metadata-driven would look like** (if the calculus changes in future): Add `source_table`, `source_column`, `context_id_key` columns to `template_variables`. The `default:` branch in `getBatchVariableValues` reads these and does a generic `supabase.from(source_table).select(source_column).eq('id', context[context_id_key])` lookup. Zero code per new variable type — but debugging requires understanding both the DB config and the generic resolver.

**Consequence**: Adding a new event type with variables that need DB joins requires adding one `if` block to `gatherTemplateVariables()`. Variables that can be passed directly in context (scores, dates, names already known at the call site) require no code — they flow through the default spread.

---

### 3. notification_rules as the configuration layer

**Decision**: `email_templates` stores the content; `notification_rules` stores when/how to send. A template alone does nothing — it must have a matching rule.

**Rationale**: Separates concerns cleanly. The same template could theoretically be triggered by different rules with different conditions (e.g. a "milestone" template used for 25%, 50%, 75% via separate rules with different `trigger_conditions`). Rules also carry operational config (cooldown, rate limiting, send_immediately flag) that doesn't belong on the template.

**Consequence**: Adding a new notification requires both a template row and a rule row. The admin template UI creates the template; there is currently no admin UI for rules (they are inserted directly in the database). A rules management UI is a planned addition.

---

### 4. Email preferences: user-level with org-level fallback

**Decision**: Preference checks query `email_preferences` for the specific user first, then fall back to the organisation-level row (`user_id IS NULL`) if no user preference exists.

**Rationale**: Org admins can set defaults for the whole organisation. Users can override individually. New users automatically inherit org defaults without any setup required.

**Consequence**: An org-level `email_preferences` row with `user_id IS NULL` must always exist. If it's missing, notifications for users without individual preferences are skipped with a logged error.

---

## Module Portability

The notification system is designed to work across LEARN, GOVERN, and any future apps. Key rules:

- `sendNotification.ts` accepts a `supabaseClient` parameter — it never imports the client directly
- `staysecure-notifications` package exports pure functions with injected dependencies
- Event type naming is module-agnostic (`lesson_completed`, not `learn_lesson_completed`) so the same rule engine works cross-app
