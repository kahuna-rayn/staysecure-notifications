# Notification System - Implementation Guide

## Phase 1: Learning Progress Notifications

This guide provides step-by-step instructions for implementing the template-based notification system.

---

## Prerequisites

- ✅ Existing lesson reminder system working
- ✅ `email_notifications` table exists
- ✅ `email_preferences` table exists
- ✅ Supabase Edge Functions deployed
- ✅ pg_cron extension enabled
- ✅ User role system (`has_role()` function)

---

## Implementation Timeline

**Estimated Total Time**: 4-6 weeks

- Week 1: Database setup and migrations
- Week 2: Template editor UI
- Week 3: Rule builder UI and trigger system
- Week 4: Testing and refinement
- Weeks 5-6: Documentation and rollout

---

## Step 1: Database Setup (Week 1)

### 1.1 Create Migration Files

Create three migration files in `supabase/migrations/`:

**File 1**: `20251015_notification_templates.sql`
```sql
-- See NOTIFICATION_DATABASE_SCHEMA.md for complete SQL
-- Creates notification_templates table
-- Seeds system templates
-- Sets up RLS policies
```

**File 2**: `20251015_notification_rules.sql`
```sql
-- See NOTIFICATION_DATABASE_SCHEMA.md for complete SQL
-- Creates notification_rules table
-- Seeds default rules
-- Sets up RLS policies
```

**File 3**: `20251015_notification_history.sql`
```sql
-- See NOTIFICATION_DATABASE_SCHEMA.md for complete SQL
-- Creates notification_history table
-- Creates helper functions
-- Creates analytics views
```

### 1.2 Seed System Templates

Create: `supabase/migrations/20251015_seed_notification_templates.sql`

```sql
-- Insert system templates for Phase 1
INSERT INTO public.notification_templates 
  (type, name, description, category, subject_template, email_html_template, is_system, available_variables)
VALUES
  -- Lesson Completed
  (
    'lesson_completed',
    'Lesson Completed',
    'Sent when a user completes a lesson',
    'learning_progress',
    '✅ Lesson Complete: {{lesson_title}}',
    '<!-- See LEARNING_PROGRESS_NOTIFICATIONS.md for full HTML -->',
    true, -- System template
    '[
      {"name": "user_name", "type": "string", "description": "User''s full name", "required": true},
      {"name": "lesson_title", "type": "string", "description": "Lesson name", "required": true},
      {"name": "learning_track_title", "type": "string", "description": "Track name", "required": true},
      {"name": "track_progress_percentage", "type": "number", "description": "% complete in track", "required": true}
    ]'::jsonb
  ),
  
  -- Track Milestone 50%
  (
    'track_milestone_50',
    'Track Milestone - 50% Complete',
    'Sent when user reaches halfway point in a learning track',
    'learning_progress',
    '🎯 Halfway There! {{learning_track_title}}',
    '<!-- See LEARNING_PROGRESS_NOTIFICATIONS.md for full HTML -->',
    true,
    '[
      {"name": "user_name", "type": "string", "description": "User''s full name", "required": true},
      {"name": "learning_track_title", "type": "string", "description": "Track name", "required": true},
      {"name": "milestone_percentage", "type": "number", "description": "Milestone reached", "required": true}
    ]'::jsonb
  ),
  
  -- Quiz Passed (High Score)
  (
    'quiz_high_score',
    'Quiz High Score',
    'Sent when user scores 90% or above on a quiz',
    'learning_progress',
    '🌟 Excellent Work! {{score}}% on {{quiz_title}}',
    '<!-- See LEARNING_PROGRESS_NOTIFICATIONS.md for full HTML -->',
    true,
    '[
      {"name": "user_name", "type": "string", "required": true},
      {"name": "quiz_title", "type": "string", "required": true},
      {"name": "score", "type": "number", "required": true},
      {"name": "correct_answers", "type": "number", "required": true},
      {"name": "total_questions", "type": "number", "required": true}
    ]'::jsonb
  );

-- Continue for all 17 template types...
-- See full seed data in separate file
```

### 1.3 Seed Default Rules

Create: `supabase/migrations/20251015_seed_notification_rules.sql`

```sql
-- Create default rules for common scenarios
-- Admins can modify or disable these

INSERT INTO public.notification_rules 
  (name, template_id, trigger_event, trigger_conditions, send_immediately, is_enabled)
SELECT
  'Send notification when lesson completed',
  (SELECT id FROM notification_templates WHERE type = 'lesson_completed'),
  'lesson_completed',
  '{}'::jsonb, -- No conditions, send for all completions
  true,
  true;

INSERT INTO public.notification_rules 
  (name, template_id, trigger_event, trigger_conditions, send_immediately, is_enabled)
SELECT
  'Send notification for 50% track completion',
  (SELECT id FROM notification_templates WHERE type = 'track_milestone_50'),
  'track_milestone_reached',
  '{"milestone_percentage": {"operator": "=", "value": 50}}'::jsonb,
  true,
  true;

INSERT INTO public.notification_rules 
  (name, template_id, trigger_event, trigger_conditions, send_immediately, max_sends_per_user_per_day)
SELECT
  'Send notification for high quiz scores',
  (SELECT id FROM notification_templates WHERE type = 'quiz_high_score'),
  'quiz_completed',
  '{"score": {"operator": ">=", "value": 90}}'::jsonb,
  true,
  5; -- Max 5 quiz notifications per day

-- Continue for all notification types...
```

### 1.4 Run Migrations

```bash
# From your project root
supabase db push

# Or manually in Supabase SQL Editor
# Run each migration file in order
```

### 1.5 Verify Setup

```sql
-- Check templates created
SELECT type, name, is_system, is_active 
FROM notification_templates 
ORDER BY category, type;

-- Should show ~17 system templates

-- Check rules created
SELECT name, trigger_event, is_enabled 
FROM notification_rules;

-- Should show default rules for each notification type
```

---

## Step 2: Edge Functions (Week 2)

### 2.1 Create Notification Trigger Functions

Create separate Edge Functions for each trigger type:

**File**: `supabase/functions/process-lesson-completed/index.ts`
```typescript
// Triggered when user completes a lesson
// Checks rules, populates template, sends notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

interface LessonCompletedEvent {
  user_id: string;
  lesson_id: string;
  learning_track_id: string;
  completed_at: string;
}

serve(async (req) => {
  const event: LessonCompletedEvent = await req.json();
  
  // 1. Get active rules for 'lesson_completed' event
  const { data: rules } = await supabase
    .rpc('get_active_rules_for_event', { p_event_type: 'lesson_completed' });
  
  for (const rule of rules) {
    // 2. Check if user should receive notification
    const { data: check } = await supabase
      .rpc('should_send_notification', {
        p_user_id: event.user_id,
        p_notification_type: rule.template_type,
        p_rule_id: rule.rule_id
      });
    
    if (!check.should_send) {
      // Log skip reason
      await supabase.from('notification_history').insert({
        user_id: event.user_id,
        template_id: rule.template_id,
        rule_id: rule.rule_id,
        trigger_event: 'lesson_completed',
        status: 'skipped',
        skip_reason: check.skip_reason
      });
      continue;
    }
    
    // 3. Gather template variables
    const variables = await gatherLessonCompletedVariables(event);
    
    // 4. Populate template
    const subject = populateTemplate(rule.subject_template, variables);
    const body = populateTemplate(rule.email_html_template, variables);
    
    // 5. Send email
    const emailResult = await supabase.functions.invoke('send-email', {
      body: { to: variables.user_email, subject, html: body }
    });
    
    // 6. Record in email_notifications
    const { data: emailNotif } = await supabase
      .from('email_notifications')
      .insert({
        user_id: event.user_id,
        type: 'lesson_reminder', // Use existing type
        title: subject,
        message: variables.lesson_title,
        email: variables.user_email,
        status: emailResult.error ? 'failed' : 'sent'
      })
      .select()
      .single();
    
    // 7. Record in notification_history
    await supabase.from('notification_history').insert({
      user_id: event.user_id,
      template_id: rule.template_id,
      rule_id: rule.rule_id,
      email_notification_id: emailNotif?.id,
      trigger_event: 'lesson_completed',
      template_variables: variables,
      status: emailResult.error ? 'failed' : 'sent',
      sent_at: emailResult.error ? null : new Date().toISOString(),
      error_message: emailResult.error?.message
    });
  }
  
  return new Response(JSON.stringify({ success: true }));
});

// Helper to gather variables
async function gatherLessonCompletedVariables(event) {
  // Query database for all needed variables
  // Return populated variable object
}

// Helper to populate template with variables
function populateTemplate(template: string, variables: any): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return result;
}
```

### 2.2 Create Trigger Hooks

Add database triggers or modify existing completion logic to call Edge Functions:

```sql
-- Example: Trigger when lesson completed
CREATE OR REPLACE FUNCTION notify_lesson_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Call Edge Function asynchronously
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || 
           '/functions/v1/process-lesson-completed',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_key')
    ),
    body := jsonb_build_object(
      'user_id', NEW.user_id,
      'lesson_id', NEW.lesson_id,
      'learning_track_id', (
        SELECT learning_track_id 
        FROM learning_track_lessons 
        WHERE lesson_id = NEW.lesson_id 
        LIMIT 1
      ),
      'completed_at', NEW.completed_at
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lesson_completed
  AFTER UPDATE OF completed_at ON public.user_lesson_progress
  FOR EACH ROW
  WHEN (OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL)
  EXECUTE FUNCTION notify_lesson_completed();
```

### 2.3 Deploy Edge Functions

```bash
# Deploy each trigger function
supabase functions deploy process-lesson-completed
supabase functions deploy process-quiz-completed
supabase functions deploy process-track-milestone
supabase functions deploy check-assignment-deadlines
supabase functions deploy check-user-inactivity
```

---

## Step 3: Admin UI Components (Week 3)

### 3.1 Template Editor Component

**File**: `src/modules/notifications/src/components/TemplateEditor.tsx`

**Features**:
- Rich text editor for HTML templates
- Variable picker/inserter
- Preview with sample data
- Version history
- Test send functionality

**Key Functions**:
```typescript
- loadTemplate(templateId)
- saveTemplate(template)
- testTemplate(template, testEmail)
- previewTemplate(template, sampleVariables)
- listAvailableVariables(templateType)
```

### 3.2 Rule Builder Component

**File**: `src/modules/notifications/src/components/RuleBuilder.tsx`

**Features**:
- Event type selector
- Condition builder (visual query builder)
- Schedule configuration
- Targeting options (departments, locations, roles)
- Throttling settings
- Enable/disable toggle

**Key Functions**:
```typescript
- loadRule(ruleId)
- saveRule(rule)
- testRule(rule, testUserId)
- validateConditions(conditions)
- previewAffectedUsers(rule)
```

### 3.3 Template Management Screen

**File**: `src/modules/notifications/src/components/TemplateManagement.tsx`

**UI Layout**:
```
┌─ Notification Templates ─────────────────────────────────────┐
│                                                               │
│  [+ Create Template]  [Category: All ▾]  [🔍 Search]        │
│                                                               │
│  ┌─ System Templates (17) ────────────────────────────────┐ │
│  │ 📚 Lesson Completed          [Edit] [Preview] [✓ Active]│ │
│  │ 🎯 Track 50% Milestone       [Edit] [Preview] [✓ Active]│ │
│  │ 🌟 Quiz High Score           [Edit] [Preview] [✓ Active]│ │
│  │ ⏰ Assignment Due (3 days)   [Edit] [Preview] [✓ Active]│ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Custom Templates (3) ─────────────────────────────────┐ │
│  │ 📊 Weekly Progress Summary   [Edit] [Preview] [✓ Active] [Delete]│
│  │ 🎓 Department Leaderboard    [Edit] [Preview] [ ] Inactive] [Delete]│
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  Analytics: 1,234 notifications sent this week                │
└───────────────────────────────────────────────────────────────┘
```

### 3.4 Rule Management Screen

**File**: `src/modules/notifications/src/components/RuleManagement.tsx`

**UI Layout**:
```
┌─ Notification Rules ──────────────────────────────────────────┐
│                                                               │
│  [+ Create Rule]  [Event: All ▾]  [Status: Enabled ▾]       │
│                                                               │
│  ┌─ Active Rules (12) ────────────────────────────────────┐ │
│  │                                                          │ │
│  │ ✓ Lesson Completion Notification               [Edit]  │ │
│  │   When: lesson_completed                                │ │
│  │   Template: Lesson Completed                            │ │
│  │   Last triggered: 2 hours ago (15 times today)          │ │
│  │                                                          │ │
│  │ ✓ Quiz High Score (90%+)                       [Edit]  │ │
│  │   When: quiz_completed AND score >= 90                  │ │
│  │   Template: Quiz High Score                             │ │
│  │   Last triggered: 5 hours ago (3 times today)           │ │
│  │                                                          │ │
│  │ ✓ Assignment Due (3 days)                      [Edit]  │ │
│  │   When: assignment_due_check AND days_until_due = 3     │ │
│  │   Template: Assignment Due (3 days)                     │ │
│  │   Scheduled: Daily at 9:00 AM                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Disabled Rules (2) ───────────────────────────────────┐ │
│  │ ○ User Inactive (30 days)                      [Edit]  │ │
│  │ ○ Quiz Failed Reminder                         [Edit]  │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## Step 4: Template Variable Gathering (Week 3)

### 4.1 Create Variable Gathering Functions

**File**: `supabase/functions/_shared/template-variables.ts`

```typescript
export async function gatherLessonCompletedVariables(
  supabase: any,
  event: { user_id: string; lesson_id: string; learning_track_id: string }
) {
  // Get user info
  const { data: user } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', event.user_id)
    .single();
  
  // Get lesson info
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, description, estimated_duration')
    .eq('id', event.lesson_id)
    .single();
  
  // Get learning track info
  const { data: track } = await supabase
    .from('learning_tracks')
    .select('title')
    .eq('id', event.learning_track_id)
    .single();
  
  // Get progress in track
  const { data: progress } = await supabase
    .from('user_learning_track_progress')
    .select('progress_percentage')
    .eq('user_id', event.user_id)
    .eq('learning_track_id', event.learning_track_id)
    .single();
  
  // Count lessons completed in track
  const { count: lessonsCompleted } = await supabase
    .from('user_lesson_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', event.user_id)
    .not('completed_at', 'is', null);
  
  // Get next lesson if available
  const { data: nextLesson } = await supabase
    .from('learning_track_lessons')
    .select('lesson_id, lessons(title)')
    .eq('learning_track_id', event.learning_track_id)
    .gt('order_index', (
      await supabase
        .from('learning_track_lessons')
        .select('order_index')
        .eq('lesson_id', event.lesson_id)
        .single()
    ).data.order_index)
    .order('order_index')
    .limit(1)
    .single();
  
  return {
    user_name: user.full_name,
    user_email: user.email,
    lesson_title: lesson.title,
    lesson_description: lesson.description,
    learning_track_title: track.title,
    completion_date: new Date().toLocaleDateString(),
    completion_time: new Date().toLocaleTimeString(),
    lessons_completed_in_track: lessonsCompleted,
    track_progress_percentage: progress.progress_percentage,
    next_lesson_title: nextLesson?.lessons?.title || null,
    next_lesson_available: !!nextLesson,
    next_lesson_url: nextLesson 
      ? `${Deno.env.get('SITE_URL')}/lessons/${nextLesson.lesson_id}`
      : null
  };
}
```

### 4.2 Template Processor Utility

**File**: `supabase/functions/_shared/template-processor.ts`

```typescript
export function populateTemplate(
  template: string, 
  variables: Record<string, any>
): string {
  let result = template;
  
  // Simple variable replacement {{variable_name}}
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value ?? ''));
  }
  
  // Handle conditionals {{#if variable}}...{{/if}}
  result = result.replace(
    /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g,
    (match, varName, content) => {
      return variables[varName] ? content : '';
    }
  );
  
  return result;
}

export function validateTemplate(template: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for unclosed tags
  const openIfs = (template.match(/{{#if/g) || []).length;
  const closeIfs = (template.match(/{{\/if}}/g) || []).length;
  
  if (openIfs !== closeIfs) {
    errors.push('Mismatched {{#if}} and {{/if}} tags');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

## Step 5: Admin UI Implementation (Week 3-4)

### 5.1 Template Editor

Key features to implement:
- Load template data
- Rich text editor (TinyMCE, Quill, or similar)
- Variable picker dropdown
- Live preview pane
- Test send to admin's email
- Save validation

### 5.2 Rule Builder

Key features to implement:
- Event type dropdown
- Condition builder (add/remove conditions)
- Schedule configuration
- Targeting options
- Preview affected users count
- Test rule execution

### 5.3 Navigation Integration

Add to your admin/settings navigation:

```tsx
<Tabs>
  <TabsTrigger value="templates">Templates</TabsTrigger>
  <TabsTrigger value="rules">Rules</TabsTrigger>
  <TabsTrigger value="history">History</TabsTrigger>
  <TabsTrigger value="analytics">Analytics</TabsTrigger>
</Tabs>
```

---

## Step 6: Testing (Week 4)

### 6.1 Unit Testing

Test each component:
- Template variable gathering functions
- Template population logic
- Rule condition evaluation
- Permission checking
- Quiet hours logic

### 6.2 Integration Testing

Test end-to-end flows:
1. Complete a lesson → verify notification sent
2. Pass quiz with 95% → verify high score notification
3. Reach 50% milestone → verify milestone notification
4. Assignment 3 days away → verify deadline notification

### 6.3 User Acceptance Testing

- Have test users complete lessons
- Verify emails received
- Check spam folders
- Test opt-out functionality
- Test quiet hours

---

## Step 7: Documentation & Training (Week 5)

### 7.1 Admin Documentation

Create guides for client admins:
- How to edit templates
- How to create custom templates
- How to manage rules
- How to test notifications
- How to read analytics

### 7.2 User Documentation

Update help docs:
- How to manage notification preferences
- How to opt-out of specific notifications
- How to set quiet hours

---

## Step 8: Deployment & Monitoring (Week 6)

### 8.1 Deployment Checklist

- [ ] All migrations applied to production
- [ ] Edge Functions deployed
- [ ] System templates seeded
- [ ] Default rules created and enabled
- [ ] Admin UI deployed and accessible
- [ ] Analytics views created
- [ ] Documentation published

### 8.2 Monitoring

Set up monitoring for:
- Notification delivery rates
- Failed notification counts
- Template usage statistics
- Rule trigger frequencies
- User opt-out rates

```sql
-- Daily monitoring query
SELECT 
  trigger_event,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE status = 'skipped') as skipped
FROM notification_history
WHERE created_at >= CURRENT_DATE
GROUP BY trigger_event;
```

---

## Rollback Plan

If issues arise:

```sql
-- Disable all rules temporarily
UPDATE notification_rules SET is_enabled = false;

-- Or disable specific event types
UPDATE notification_rules SET is_enabled = false 
WHERE trigger_event = 'quiz_completed';

-- Re-enable after fixes
UPDATE notification_rules SET is_enabled = true 
WHERE id = 'rule-id';
```

---

## Appendix: Code Structure

### Recommended File Organization

```
src/modules/notifications/
├── src/
│   ├── components/
│   │   ├── TemplateEditor.tsx
│   │   ├── TemplateList.tsx
│   │   ├── TemplatePreview.tsx
│   │   ├── VariablePicker.tsx
│   │   ├── RuleBuilder.tsx
│   │   ├── RuleList.tsx
│   │   ├── ConditionBuilder.tsx
│   │   ├── NotificationHistory.tsx
│   │   ├── NotificationAnalytics.tsx
│   │   └── NotificationTester.tsx
│   ├── hooks/
│   │   ├── useTemplates.ts
│   │   ├── useRules.ts
│   │   ├── useNotificationHistory.ts
│   │   └── useTemplateVariables.ts
│   ├── lib/
│   │   ├── templateProcessor.ts
│   │   ├── ruleEvaluator.ts
│   │   └── variableValidator.ts
│   └── types/
│       ├── template.ts
│       ├── rule.ts
│       └── notification.ts
└── index.ts
```

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Status**: Implementation Guide - Phase 1
