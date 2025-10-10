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

### 2. Rules Engine
- **Purpose**: Define when and to whom notifications are sent
- **Who manages**: Client Admins
- **Features**:
  - Event-based triggers
  - Conditional logic
  - Scheduling options
  - User targeting (all, departments, locations, roles)
  - Rate limiting and cooldowns

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
- ✅ `email_preferences` - User notification preferences
- ✅ `email_templates` - Legacy email templates (to be migrated)
- ✅ `user_learning_track_progress` - Tracks learning progress
- ✅ `user_lesson_progress` - Tracks lesson completion
- ✅ `quiz_attempts` - Tracks quiz scores

### New Tables (Only 2!)
- ✅ `email_templates` - ENHANCED (not replaced) with `is_system`, `category` columns
- 🆕 `notification_rules` - Rule configurations (when to send)
- 🆕 `notification_history` - Delivery tracking and audit trail

## Security & Permissions

### Client Admin Permissions
- ✅ Create/edit/delete custom templates
- ✅ Edit system templates (content only, not delete)
- ❌ Delete system templates
- ✅ Create/edit/delete notification rules
- ✅ Test notifications (send to self)
- ✅ View notification history and analytics
- ✅ Preview templates with sample data

### User Permissions
- ✅ Control their own notification preferences via `email_preferences`
- ✅ View their notification history
- ❌ Access templates or rules
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
- 🆕 Track milestones (25%, 50%, 75%, 100%)
- 🆕 Quiz performance (pass/fail/perfect)
- 🆕 Track completion
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
