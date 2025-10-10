# Notification System - Database Schema

## Phase 1: Learning Progress Notifications

### Tables Overview

This schema uses your existing notification infrastructure:
- ✅ Uses existing `email_templates` table (enhanced, not replaced)
- ✅ Uses existing `email_notifications` table
- ✅ Uses existing `email_preferences` table
- 🆕 Adds only 2 new tables (rules and history)

---

## email_templates (Enhanced, Not Replaced)

**Purpose**: Store customizable notification templates  
**Status**: Already exists - just needs minor enhancements  
**Access**: Client admins can edit, system templates can't be deleted

### Current Structure (Already Good!)
```sql
-- Your existing table already has:
- id UUID
- name TEXT
- type TEXT  
- subject_template TEXT
- html_body_template TEXT
- text_body_template TEXT
- variables JSONB  -- Already supports variables!
- is_active BOOLEAN
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

### Minimal Enhancements Needed

```sql
-- Migration: Just add a few columns to existing table
ALTER TABLE public.email_templates 
  ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'learning_progress',
  ADD COLUMN IF NOT EXISTS default_priority TEXT DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS use_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE;

-- Mark existing templates as system templates (can't be deleted)
UPDATE public.email_templates SET is_system = true;

-- Future templates created by admins will have is_system = false

-- Update RLS Policies for Admin-Only Access
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Drop any overly permissive policies if they exist
DROP POLICY IF EXISTS "Public can view templates" ON public.email_templates;
DROP POLICY IF EXISTS "Anyone can manage templates" ON public.email_templates;

-- Admins can view all templates
CREATE POLICY "Admins can view email templates"
  ON public.email_templates FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

-- Admins can update all templates (even system ones)
CREATE POLICY "Admins can update email templates"
  ON public.email_templates FOR UPDATE
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

-- Admins can create custom templates
CREATE POLICY "Admins can create custom email templates"
  ON public.email_templates FOR INSERT
  WITH CHECK (
    (has_role(auth.uid(), 'super_admin'::app_role) OR 
     has_role(auth.uid(), 'client_admin'::app_role))
    AND COALESCE(is_system, false) = false
  );

-- Admins can only delete custom templates (not system)
CREATE POLICY "Admins can delete custom email templates only"
  ON public.email_templates FOR DELETE
  USING (
    (has_role(auth.uid(), 'super_admin'::app_role) OR 
     has_role(auth.uid(), 'client_admin'::app_role))
    AND COALESCE(is_system, false) = false
  );

-- Service role has full access
CREATE POLICY "Service role can manage email templates"
  ON public.email_templates FOR ALL
  USING (true)
  WITH CHECK (true);
```

**REMOVED**: notification_templates table (use existing email_templates instead!)

---

## notification_rules

**Purpose**: Configure when and to whom notifications are sent  
**Status**: New table (references existing email_templates)  
**Access**: Client admins full control

```sql
CREATE TABLE IF NOT EXISTS public.notification_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identification
  type TEXT NOT NULL UNIQUE, 
  /* Type values:
     - 'lesson_reminder' (existing)
     - 'lesson_completed'
     - 'track_milestone_25'
     - 'track_milestone_50'
     - 'track_milestone_75'
     - 'track_milestone_100' (completion)
     - 'quiz_perfect'
     - 'quiz_high_score'
     - 'quiz_passed'
     - 'quiz_failed'
     - 'assignment_due_7days'
     - 'assignment_due_3days'
     - 'assignment_due_1day'
     - 'assignment_overdue'
     - 'user_inactive_7days'
     - 'user_inactive_14days'
     - 'user_inactive_30days'
  */
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'learning_progress', 
  /* Categories:
     - 'learning_progress'
     - 'gamification' (future)
     - 'system'
  */
  
  -- Template Content
  subject_template TEXT NOT NULL,
  email_html_template TEXT NOT NULL,
  email_text_template TEXT, -- Plain text fallback
  
  -- Configuration
  is_system BOOLEAN DEFAULT false, -- System templates can't be deleted
  is_active BOOLEAN DEFAULT true,
  default_priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Variable Documentation (helps template editors know what they can use)
  available_variables JSONB DEFAULT '[]'::jsonb,
  /* Example structure:
  [
    {
      "name": "user_name",
      "type": "string",
      "description": "User's full name",
      "example": "John Doe",
      "required": true
    },
    {
      "name": "lesson_title",
      "type": "string",
      "description": "Name of the lesson",
      "example": "Introduction to Cybersecurity",
      "required": true
    },
    {
      "name": "score",
      "type": "number",
      "description": "Quiz score percentage",
      "example": "95",
      "required": false
    }
  ]
  */
  
  -- Usage Tracking
  use_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1 -- Template versioning
);

-- Indexes
CREATE INDEX idx_templates_type ON public.notification_templates(type);
CREATE INDEX idx_templates_active ON public.notification_templates(is_active);
CREATE INDEX idx_templates_category ON public.notification_templates(category);
CREATE INDEX idx_templates_system ON public.notification_templates(is_system);

-- RLS Policies
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view templates"
  ON public.notification_templates FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

CREATE POLICY "Admins can update templates"
  ON public.notification_templates FOR UPDATE
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

CREATE POLICY "Admins can create custom templates"
  ON public.notification_templates FOR INSERT
  WITH CHECK (
    (has_role(auth.uid(), 'super_admin'::app_role) OR 
     has_role(auth.uid(), 'client_admin'::app_role))
    AND is_system = false
  );

CREATE POLICY "Admins can delete custom templates only"
  ON public.notification_templates FOR DELETE
  USING (
    (has_role(auth.uid(), 'super_admin'::app_role) OR 
     has_role(auth.uid(), 'client_admin'::app_role))
    AND is_system = false
  );

CREATE POLICY "Service role can manage templates"
  ON public.notification_templates FOR ALL
  USING (true)
  WITH CHECK (true);

-- Triggers
CREATE OR REPLACE FUNCTION update_notification_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_template_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_template_updated_at();

-- Comments
COMMENT ON TABLE public.notification_templates IS 
  'Customizable notification templates. System templates cannot be deleted by admins.';
COMMENT ON COLUMN public.notification_templates.available_variables IS 
  'JSON array documenting available template variables for editor UI';
```

---

## notification_rules

**Purpose**: Configure when and to whom notifications are sent  
**Access**: Client admins full control

```sql
CREATE TABLE IF NOT EXISTS public.notification_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference existing email_templates table
  email_template_id UUID NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
  
  -- Identification
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  
  -- Trigger Configuration
  trigger_event TEXT NOT NULL,
  /* Events in Phase 1:
     - 'lesson_completed'
     - 'quiz_completed'
     - 'track_milestone_reached'
     - 'track_completed'
     - 'assignment_due_check' (runs daily)
     - 'user_inactivity_check' (runs daily)
  */
  
  trigger_conditions JSONB DEFAULT '{}'::jsonb,
  /* Example structures:
  
  For quiz_completed:
  {
    "score": {"operator": ">=", "value": 90},
    "attempt_number": {"operator": "=", "value": 1},
    "lesson_type": {"operator": "=", "value": "quiz"}
  }
  
  For track_milestone_reached:
  {
    "milestone_percentage": {"operator": "=", "value": 50}
  }
  
  For assignment_due_check:
  {
    "days_until_due": {"operator": "=", "value": 3},
    "completion_required": {"operator": "=", "value": true}
  }
  
  For user_inactivity_check:
  {
    "days_inactive": {"operator": ">=", "value": 7},
    "has_pending_assignments": {"operator": "=", "value": true}
  }
  */
  
  -- Scheduling
  send_immediately BOOLEAN DEFAULT true,
  schedule_delay_minutes INTEGER DEFAULT 0, -- Delay after trigger
  send_at_time TIME, -- Specific time (e.g., '09:00:00')
  respect_quiet_hours BOOLEAN DEFAULT true,
  
  -- Targeting (all nullable = target all users)
  target_departments UUID[], -- Specific department IDs
  target_locations UUID[], -- Specific location IDs
  target_roles TEXT[], -- Specific user roles
  
  -- Throttling (prevent spam)
  max_sends_per_user_per_day INTEGER, -- NULL = unlimited
  cooldown_hours INTEGER, -- Wait X hours before same notification type
  
  -- Priority Override
  override_priority TEXT, -- Override template's default priority
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  trigger_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_rules_trigger_event ON public.notification_rules(trigger_event);
CREATE INDEX idx_rules_enabled ON public.notification_rules(is_enabled);
CREATE INDEX idx_rules_email_template ON public.notification_rules(email_template_id);
CREATE INDEX idx_rules_last_triggered ON public.notification_rules(last_triggered_at);

-- RLS Policies
ALTER TABLE public.notification_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view rules"
  ON public.notification_rules FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

CREATE POLICY "Admins can manage rules"
  ON public.notification_rules FOR ALL
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

CREATE POLICY "Service role can manage rules"
  ON public.notification_rules FOR ALL
  USING (true)
  WITH CHECK (true);

-- Triggers
CREATE OR REPLACE FUNCTION update_notification_rule_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_rule_updated_at
  BEFORE UPDATE ON public.notification_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_rule_updated_at();

-- Comments
COMMENT ON TABLE public.notification_rules IS 
  'Configuration rules for when notifications are triggered and sent';
COMMENT ON COLUMN public.notification_rules.trigger_conditions IS 
  'JSON object defining conditions that must be met for notification to send';
```

---

## notification_history

**Purpose**: Audit trail of all notification attempts  
**Access**: Users see their own, admins see all

```sql
CREATE TABLE IF NOT EXISTS public.notification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- References to existing tables
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  rule_id UUID REFERENCES public.notification_rules(id) ON DELETE SET NULL,
  email_notification_id UUID REFERENCES public.email_notifications(id) ON DELETE SET NULL,
  
  -- Event Information
  trigger_event TEXT NOT NULL,
  template_variables JSONB, -- Actual variables used in this notification
  /* Example:
  {
    "user_name": "John Doe",
    "lesson_title": "Intro to Security",
    "score": 95
  }
  */
  
  -- Delivery Status
  status TEXT DEFAULT 'pending', 
  /* Status values:
     - 'pending' - Queued for sending
     - 'sent' - Successfully sent
     - 'failed' - Failed to send
     - 'skipped' - Skipped (user preference, quiet hours, etc.)
  */
  
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  skip_reason TEXT, 
  /* Skip reasons:
     - 'user_preference_disabled'
     - 'quiet_hours_active'
     - 'cooldown_period'
     - 'rate_limit_exceeded'
     - 'template_inactive'
     - 'rule_disabled'
  */
  
  -- Metadata
  priority TEXT, -- Priority used for this notification
  channel TEXT DEFAULT 'email', -- 'email', 'in_app', 'both'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_history_user ON public.notification_history(user_id);
CREATE INDEX idx_history_email_template ON public.notification_history(email_template_id);
CREATE INDEX idx_history_rule ON public.notification_history(rule_id);
CREATE INDEX idx_history_created ON public.notification_history(created_at DESC);
CREATE INDEX idx_history_status ON public.notification_history(status);
CREATE INDEX idx_history_trigger_event ON public.notification_history(trigger_event);
CREATE INDEX idx_history_sent_at ON public.notification_history(sent_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_history_user_event ON public.notification_history(user_id, trigger_event);
CREATE INDEX idx_history_status_created ON public.notification_history(status, created_at DESC);

-- RLS Policies
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history"
  ON public.notification_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all history"
  ON public.notification_history FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'client_admin'::app_role)
  );

CREATE POLICY "Service role can manage history"
  ON public.notification_history FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE public.notification_history IS 
  'Complete audit trail of all notification attempts and deliveries';
COMMENT ON COLUMN public.notification_history.template_variables IS 
  'JSON snapshot of variables used to populate this notification';
```

---

## Helper Functions

### Check if User Should Receive Notification

```sql
CREATE OR REPLACE FUNCTION should_send_notification(
  p_user_id UUID,
  p_notification_type TEXT,
  p_rule_id UUID
)
RETURNS TABLE (
  should_send BOOLEAN,
  skip_reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email_enabled BOOLEAN;
  v_lesson_reminders_enabled BOOLEAN;
  v_achievements_enabled BOOLEAN;
  v_course_completions_enabled BOOLEAN;
  v_quiet_hours_enabled BOOLEAN;
  v_quiet_start TIME;
  v_quiet_end TIME;
  v_current_time TIME;
  v_cooldown_hours INTEGER;
  v_last_notification TIMESTAMP;
  v_max_per_day INTEGER;
  v_today_count INTEGER;
BEGIN
  -- Check global email preference
  SELECT 
    COALESCE(email_enabled, true),
    COALESCE(lesson_reminders, true),
    COALESCE(achievements, true),
    COALESCE(course_completions, true),
    COALESCE(quiet_hours_enabled, false),
    quiet_hours_start,
    quiet_hours_end
  INTO
    v_email_enabled,
    v_lesson_reminders_enabled,
    v_achievements_enabled,
    v_course_completions_enabled,
    v_quiet_hours_enabled,
    v_quiet_start,
    v_quiet_end
  FROM public.email_preferences
  WHERE user_id = p_user_id;
  
  -- If no preferences found, default to enabled
  v_email_enabled := COALESCE(v_email_enabled, true);
  
  -- Check if email disabled globally
  IF NOT v_email_enabled THEN
    RETURN QUERY SELECT false, 'user_preference_disabled';
    RETURN;
  END IF;
  
  -- Check type-specific preferences
  IF p_notification_type IN ('lesson_reminder', 'lesson_completed', 'assignment_due_soon') 
     AND NOT v_lesson_reminders_enabled THEN
    RETURN QUERY SELECT false, 'lesson_reminders_disabled';
    RETURN;
  END IF;
  
  IF p_notification_type LIKE 'track_milestone%' 
     AND NOT v_course_completions_enabled THEN
    RETURN QUERY SELECT false, 'course_completions_disabled';
    RETURN;
  END IF;
  
  -- Check quiet hours
  IF v_quiet_hours_enabled AND v_quiet_start IS NOT NULL AND v_quiet_end IS NOT NULL THEN
    v_current_time := LOCALTIME;
    
    -- Handle quiet hours that span midnight
    IF v_quiet_start < v_quiet_end THEN
      IF v_current_time >= v_quiet_start AND v_current_time < v_quiet_end THEN
        RETURN QUERY SELECT false, 'quiet_hours_active';
        RETURN;
      END IF;
    ELSE
      IF v_current_time >= v_quiet_start OR v_current_time < v_quiet_end THEN
        RETURN QUERY SELECT false, 'quiet_hours_active';
        RETURN;
      END IF;
    END IF;
  END IF;
  
  -- Check rule cooldown period
  SELECT cooldown_hours, max_sends_per_user_per_day
  INTO v_cooldown_hours, v_max_per_day
  FROM public.notification_rules
  WHERE id = p_rule_id;
  
  IF v_cooldown_hours IS NOT NULL THEN
    SELECT MAX(created_at)
    INTO v_last_notification
    FROM public.notification_history
    WHERE user_id = p_user_id
      AND rule_id = p_rule_id
      AND status = 'sent';
    
    IF v_last_notification IS NOT NULL 
       AND v_last_notification > NOW() - (v_cooldown_hours || ' hours')::INTERVAL THEN
      RETURN QUERY SELECT false, 'cooldown_period';
      RETURN;
    END IF;
  END IF;
  
  -- Check max sends per day
  IF v_max_per_day IS NOT NULL THEN
    SELECT COUNT(*)
    INTO v_today_count
    FROM public.notification_history
    WHERE user_id = p_user_id
      AND rule_id = p_rule_id
      AND status = 'sent'
      AND created_at >= CURRENT_DATE;
    
    IF v_today_count >= v_max_per_day THEN
      RETURN QUERY SELECT false, 'rate_limit_exceeded';
      RETURN;
    END IF;
  END IF;
  
  -- All checks passed
  RETURN QUERY SELECT true, NULL::TEXT;
  RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION should_send_notification(UUID, TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION should_send_notification(UUID, TEXT, UUID) TO authenticated;
```

### Get Active Rules for Event

```sql
CREATE OR REPLACE FUNCTION get_active_rules_for_event(
  p_event_type TEXT
)
RETURNS TABLE (
  rule_id UUID,
  rule_name TEXT,
  email_template_id UUID,
  template_type TEXT,
  subject_template TEXT,
  html_body_template TEXT,
  template_variables JSONB,
  trigger_conditions JSONB,
  send_immediately BOOLEAN,
  send_at_time TIME,
  default_priority TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    nr.id as rule_id,
    nr.name as rule_name,
    et.id as email_template_id,
    et.type as template_type,
    et.subject_template,
    et.html_body_template,
    et.variables as template_variables,
    nr.trigger_conditions,
    nr.send_immediately,
    nr.send_at_time,
    COALESCE(nr.override_priority, et.default_priority) as default_priority
  FROM public.notification_rules nr
  INNER JOIN public.email_templates et ON nr.email_template_id = et.id
  WHERE nr.is_enabled = true
    AND COALESCE(et.is_active, true) = true
    AND nr.trigger_event = p_event_type
  ORDER BY nr.created_at;
$$;

GRANT EXECUTE ON FUNCTION get_active_rules_for_event(TEXT) TO service_role;
```

---

## Analytics Views

### Daily Notification Summary

```sql
CREATE VIEW public.daily_notification_summary AS
SELECT 
  DATE(created_at) as notification_date,
  trigger_event,
  status,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.notification_history
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), trigger_event, status
ORDER BY notification_date DESC, trigger_event;

-- Grant access to admins
GRANT SELECT ON public.daily_notification_summary TO authenticated;
```

### Template Performance

```sql
CREATE VIEW public.template_performance AS
SELECT 
  et.id,
  et.name,
  et.type,
  COALESCE(et.use_count, 0) as use_count,
  et.last_used_at,
  COUNT(nh.id) as total_sends,
  COUNT(CASE WHEN nh.status = 'sent' THEN 1 END) as successful_sends,
  COUNT(CASE WHEN nh.status = 'failed' THEN 1 END) as failed_sends,
  COUNT(CASE WHEN nh.status = 'skipped' THEN 1 END) as skipped_sends,
  ROUND(
    100.0 * COUNT(CASE WHEN nh.status = 'sent' THEN 1 END) / NULLIF(COUNT(nh.id), 0),
    2
  ) as success_rate
FROM public.email_templates et
LEFT JOIN public.notification_history nh ON nh.email_template_id = et.id
GROUP BY et.id, et.name, et.type, et.use_count, et.last_used_at
ORDER BY total_sends DESC;

-- Grant access to admins
GRANT SELECT ON public.template_performance TO authenticated;
```

---

## Seed Data (System Templates)

Add Phase 1 notification types to existing `email_templates` table.

**New Template Types to Add** (to existing table):
1. `lesson_reminder` (already exists)
2. `lesson_completed`
3. `track_milestone_25`
4. `track_milestone_50`
5. `track_milestone_75`
6. `track_milestone_100`
7. `quiz_perfect`
8. `quiz_high_score`
9. `quiz_passed`
10. `quiz_failed`
11. `assignment_due_7days`
12. `assignment_due_3days`
13. `assignment_due_1day`
14. `assignment_overdue`
15. `user_inactive_7days`
16. `user_inactive_14days`
17. `user_inactive_30days`

---

## Migration Files (Simplified!)

Create these migration files in order:

1. **`20251015_enhance_email_templates.sql`**
   - Adds columns to existing `email_templates` table
   - Updates RLS policies for admin-only access
   - Marks existing templates as system templates

2. **`20251015_notification_rules.sql`**
   - Creates `notification_rules` table
   - Seeds default rules
   - Sets up RLS policies

3. **`20251015_notification_history.sql`**
   - Creates `notification_history` table
   - Creates helper functions
   - Creates analytics views
   - Sets up RLS policies

4. **`20251015_seed_learning_notifications.sql`**
   - Adds 16 new notification types to existing `email_templates`
   - Creates default rules for each type

---

## Integration Notes

### Existing Tables Used (No Changes)
- ✅ `email_templates` - Enhanced with new columns, existing templates preserved
- ✅ `email_notifications` - Works as-is, no changes
- ✅ `email_preferences` - Already has needed fields, no changes
- ✅ `user_learning_track_progress` - Track progress data, read-only
- ✅ `user_lesson_progress` - Lesson completion data, read-only
- ✅ `quiz_attempts` - Quiz scores and attempts, read-only
- ✅ `learning_track_assignments` - Assignment deadlines, read-only

### Summary
- **Enhanced**: 1 table (`email_templates` - add 6 columns)
- **New**: 2 tables (`notification_rules`, `notification_history`)
- **Unchanged**: 6 tables (all learning/notification tables work as-is)

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Status**: Phase 1 Schema Definition
