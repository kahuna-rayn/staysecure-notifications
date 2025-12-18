# Notification System - Template-Based Architecture

## Overview

The StaySecure Hub notification system provides a flexible, template-based approach to sending notifications to users. Client administrators can customize notification templates and configure rules for when notifications are triggered.

## System Architecture

```
┌─────────────────┐
│  Trigger Event  │ (Lesson completed, quiz passed, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notification    │ Check rules and conditions
│ Rules Engine    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Template        │ Populate variables
│ Processor       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Delivery Layer  │ Send via email/in-app
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ email_          │ Store in existing table
│ notifications   │
└─────────────────┘
```

## Core Components

### 1. Templates System
- **Purpose**: Define reusable notification content
- **Who manages**: Client Admins (super_admin, client_admin)
- **Features**:
  - Variable substitution ({{user_name}}, {{lesson_title}}, etc.)
  - HTML email templates
  - In-app notification formats (future)
  - System templates (cannot be deleted, only edited)
  - Custom templates (can create/edit/delete)

### 2. Rules Engine (`notification_rules` table)
- **Purpose**: System-level configuration of notification behavior
- **Who manages**: Super Admins only (not client admins)
- **Features**:
  - Event-based triggers (`trigger_event`)
  - Conditional logic (`trigger_conditions` - e.g., score >= 90)
  - Which template to use (`email_template_id`)
  - Scheduling options (immediate, delayed, quiet hours)
  - Rate limiting and cooldowns (throttling)
  - Enable/disable specific notification types (`is_enabled`)

**Distinction from `email_preferences`:**
- `notification_rules` = System configuration: "What notifications exist and how do they work?"
- `email_preferences` = User opt-in/opt-out: "Does this recipient want to receive them?"

### 3. Delivery System
- **Purpose**: Send notifications via multiple channels
- **Features**:
  - Email (via existing email_notifications)
  - In-app (future: via notifications table)
  - Respects user preferences (email_preferences)
  - Quiet hours support
  - Retry logic for failures

## Integration with Existing System

### Uses Existing Tables
- ✅ `email_notifications` - Stores sent email records
- ✅ `email_preferences` - **User/org opt-in/opt-out preferences** (e.g., "I want achievement emails")
- ✅ `email_templates` - Email template content (subject, body HTML)
- ✅ `user_learning_track_progress` - Tracks learning progress
- ✅ `user_lesson_progress` - Tracks lesson completion
- ✅ `quiz_attempts` - Tracks quiz scores

### New Tables (Only 2!)
- ✅ `email_templates` - ENHANCED (not replaced) with `is_system`, `category` columns
- 🆕 `notification_rules` - System-level rule configurations (super_admin only - when to send)
- 🆕 `notification_history` - Delivery tracking and audit trail

## Security & Permissions

### Super Admin Permissions
- ✅ Create/edit/delete custom templates
- ✅ Edit system templates (content only, not delete)
- ✅ Delete system templates
- ✅ Create/edit/delete notification rules (super_admin only)
- ✅ Test notifications (send to self)
- ✅ View notification history and analytics
- ✅ Preview templates with sample data

### Client Admin Permissions
- ✅ Set organisation preferences
- ✅ View notification history and analytics

### User Permissions (**NOT IMPLEMENTED**)
- ✅ Control their own notification preferences via `email_preferences` (opt-in/opt-out)
- ✅ View their notification history
- ❌ Access templates (client admin configuration) or rules (super admin configuration)
- ❌ Send notifications

### Service Role
- ✅ Full access to all tables (automated notification sending)
- ✅ Bypass RLS policies
- ✅ Create notification history records

## Implementation Phases

### Phase 1: Learning Progress Notifications (Current Release)
**Focus**: Essential learning progress notifications

**Notification Types**:
- ✅ Lesson reminders (already implemented)
- 🆕 Lesson completed
- 🆕 Track milestones (25%, 50%, 75%, 100%) <-- SAME AS TRACK COMPLETION AT 100%, ONLY IMPLEMENTED 50% AND 100%>
- 🆕 Quiz performance (pass/fail/perfect)
- 🆕 Track completion (SEE Track milestones)
- 🆕 Assignment deadlines
- 🆕 Inactivity reminders

**Deliverables**:
- Database migrations for new tables
- System templates for all notification types
- Default notification rules
- Template editor UI for admins
- Rule builder UI for admins
- Testing interface

**Timeline**: 4-6 weeks

See [LEARNING_PROGRESS_NOTIFICATIONS.md](./LEARNING_PROGRESS_NOTIFICATIONS.md) for detailed specifications.

---

### Phase 2: Gamification Notifications (Future Release)
**Focus**: Engagement and motivation through gamification

**Features**:
- Badges and achievements
- Streaks and milestones
- Leaderboard rankings
- Recognition notifications
- Certificates

**Timeline**: Q2-Q4 2026

See [GAMIFICATION_ROADMAP.md](./GAMIFICATION_ROADMAP.md) for detailed roadmap.

## Technical Stack

- **Database**: PostgreSQL (Supabase)
- **Backend**: Supabase Edge Functions (Deno)
- **Frontend**: React + TypeScript
- **Email**: AWS SES (existing integration)
- **Templating**: Handlebars-like syntax ({{variable}})
- **Scheduling**: pg_cron for automated notifications

## Key Design Decisions

### Why Template-Based?
- **Flexibility**: Admins can customize without code changes
- **Reusability**: One template for many notifications
- **Consistency**: Brand voice across all notifications
- **Localization**: Easy to add multi-language support later

### Why Rules Engine?
- **Control**: Admins decide when/who receives notifications
- **Flexibility**: Complex conditions without coding
- **Testing**: Safe to test rules before enabling
- **Throttling**: Built-in spam prevention

### Why Enhance Existing email_templates (Not Replace)?
- **Simplicity**: Use what you already have
- **No Migration**: Existing templates keep working
- **Consistency**: Matches current system architecture
- **Less Code**: Fewer tables = less complexity
- **Backward Compatible**: Nothing breaks

## Data-Driven vs Code-Driven: How They Work Together

The notification system uses a **hybrid approach**: some parts are data-driven (configurable in the database), others are code-driven (implemented in the application code).

### What's Data-Driven (Database Configurable)

**`notification_rules` table controls (Super Admin configuration):**
- ✅ Which templates to use (`email_template_id`)
- ✅ Trigger conditions (`trigger_conditions` JSONB - e.g., `score >= 90`)
- ✅ Whether rule is active (`is_enabled`) - **System-level enable/disable**
- ✅ Scheduling (`send_immediately`, `schedule_delay_minutes`)
- ✅ Throttling (`max_sends_per_user_per_day`, `cooldown_hours`)

**`email_preferences` table controls (Recipient opt-in/opt-out):**
- ✅ Global email enable/disable (`email_enabled`)
- ✅ Category preferences (`track_completions`, `achievements`, `lesson_reminders`)
- ✅ Quiet hours settings

**`email_templates` table controls:**
- ✅ Template content (subject, HTML body)
- ✅ Template variables (documented for admins)

### What's Code-Driven (Hardcoded)

**Preference Mapping** (in `sendNotification.ts`):
- Event type → preference field mapping is hardcoded
- Example: `'track_completed'` always checks `preferences.track_completions`
- Example: `'quiz_high_score'` always checks `preferences.achievements`

**Variable Gathering** (in `sendNotification.ts`):
- Each event type has specific code to fetch data from the database
- Example: `'lesson_completed'` calls `gatherLessonCompletedVariables()`
- Example: `'track_milestone_50'` has inline code to fetch track data
- **Note**: `'track_completed'` currently falls back to basic variables (needs implementation)

### How They Work Together

```
1. Event occurs → Code calls: sendNotificationByEvent('track_completed', {...})
   ↓
2. Code queries: notification_rules WHERE trigger_event = 'track_completed'
   ↓
3. Code checks: Is rule enabled? (notification_rules.is_enabled) ✅ Data-driven
   ↓
4. Code checks: Trigger conditions (notification_rules.trigger_conditions) ✅ Data-driven
   ↓
5. Code checks: Recipient preferences (email_preferences.track_completions) ✅ Data-driven
   ↓
6. Code gathers: Template variables (hardcoded switch statement) ❌ Code-driven
   ↓
7. Code fetches: Email template (notification_rules.email_template_id → email_templates) ✅ Data-driven
   ↓
8. Code sends: Email using template + variables
```

**Key Distinction:**
- **Step 3-4**: `notification_rules` = System-level: "Does this notification type exist and when should it fire?"
- **Step 5**: `email_preferences` = Recipient-level: "Does this user want to receive it?"

### Why This Hybrid Approach?

**Benefits:**
- ✅ **Flexibility for admins**: Create/edit rules and templates without code changes
- ✅ **Consistency**: Variable gathering logic is centralized and tested
- ✅ **Type safety**: Code ensures correct data structures

**Limitations:**
- ⚠️ Adding new event types requires code changes (preference mapping + variable gathering)
- ⚠️ Preference mapping is not configurable - must modify code to change which preference controls which event
- ⚠️ Variable gathering is not extensible - new event types need new code

**Future Enhancement Options:**
- Store preference field mapping in `notification_rules` table
- Create plugin system for variable gathering (more complex but fully data-driven)

## File Structure

```
/Users/naresh/staysecure-hub/
├── NOTIFICATION_SYSTEM_OVERVIEW.md (this file)
├── LEARNING_PROGRESS_NOTIFICATIONS.md (Phase 1 details)
├── GAMIFICATION_ROADMAP.md (Phase 2+ details)
├── NOTIFICATION_IMPLEMENTATION_GUIDE.md (step-by-step)
├── NOTIFICATION_TEMPLATE_EXAMPLES.md (sample templates)
│
├── supabase/
│   ├── migrations/
│   │   ├── 20251015_enhance_email_templates.sql (add columns to existing table)
│   │   ├── 20251015_notification_rules.sql
│   │   ├── 20251015_notification_history.sql
│   │   └── 20251015_seed_learning_notifications.sql
│   └── functions/
│       ├── process-notification-trigger/
│       ├── send-notification/
│       └── calculate-template-variables/
│
└── src/modules/notifications/
    ├── src/
    │   ├── components/
    │   │   ├── TemplateEditor.tsx
    │   │   ├── RuleBuilder.tsx
    │   │   ├── NotificationTester.tsx
    │   │   └── NotificationAnalytics.tsx
    │   ├── hooks/
    │   │   ├── useTemplates.ts
    │   │   ├── useRules.ts
    │   │   └── useNotificationHistory.ts
    │   └── types/
    │       └── notifications.ts
    └── index.ts
```

## Getting Started

1. **Read Phase 1 Documentation**: [LEARNING_PROGRESS_NOTIFICATIONS.md](./LEARNING_PROGRESS_NOTIFICATIONS.md)
2. **Review Implementation Guide**: [NOTIFICATION_IMPLEMENTATION_GUIDE.md](./NOTIFICATION_IMPLEMENTATION_GUIDE.md)
3. **Check Template Examples**: [NOTIFICATION_TEMPLATE_EXAMPLES.md](./NOTIFICATION_TEMPLATE_EXAMPLES.md)
4. **Run Database Migrations**: Follow implementation guide
5. **Build Admin UI**: Start with template editor

## Support

For questions or issues:
1. Check the documentation files
2. Review the implementation guide
3. Test with sample data
4. Contact development team

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Status**: Phase 1 - In Planning
