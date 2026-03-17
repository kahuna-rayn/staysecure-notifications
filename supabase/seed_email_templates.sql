-- Email Template Seed / Fix
-- Run once per Supabase instance to replace placeholder HTML with proper templates.
-- Safe to re-run: all statements use INSERT ... ON CONFLICT or UPDATE ... WHERE.

-- ─────────────────────────────────────────────────────────────────────────────
-- Default org-level email_preferences row (user_id IS NULL)
-- Without this row, the Preferences UI silently saves nothing because
-- .update().is('user_id', null) matches zero rows and returns no error.
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO email_preferences (
  user_id, email_enabled, achievements, track_completions,
  lesson_reminders, task_due_dates, system_alerts,
  quiet_hours_enabled, quiet_hours_start_time, quiet_hours_end_time,
  reminder_days_before, reminder_time,
  include_upcoming_lessons, upcoming_days_ahead,
  max_reminder_attempts, reminder_frequency_days
)
SELECT
  NULL, true, false, false,
  true, false, false,
  false, '22:00', '08:00',
  1, '09:00',
  false, 3,
  3, 7
WHERE NOT EXISTS (
  SELECT 1 FROM email_preferences WHERE user_id IS NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- New columns: document_notifications + document_completed_manager
-- Add to email_preferences if they don't already exist.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE email_preferences
  ADD COLUMN IF NOT EXISTS document_notifications       boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS document_completed_manager  boolean DEFAULT true;

-- Back-fill existing rows with the defaults
UPDATE email_preferences
SET
  document_notifications      = COALESCE(document_notifications, true),
  document_completed_manager  = COALESCE(document_completed_manager, true)
WHERE document_notifications IS NULL OR document_completed_manager IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Lesson Completed
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #0d9488;">📚 Lesson Completed!</h2>
  <p>Hi {{user_name}},</p>
  <p>Great work! You have successfully completed:</p>
  <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
    <h3 style="margin-top: 0; color: #0d9488;">{{lesson_title}}</h3>
    <p style="margin: 0; color: #6b7280;">{{lesson_description}}</p>
  </div>
  {{#if learning_track_title}}
  <p>You are working through: <strong>{{learning_track_title}}</strong></p>
  <p>Progress: <strong>{{lessons_completed_in_track}} / {{total_lessons_in_track}} lessons</strong> ({{track_progress_percentage}}%)</p>
  {{/if}}
  {{#if next_lesson_available}}
  <p>Ready for the next one? <a href="{{next_lesson_url}}" style="color: #0d9488;">Continue to {{next_lesson_title}}</a></p>
  {{/if}}
  <p>Completed on {{completion_date}} at {{completion_time}}.</p>
  <p>Keep up the great work!<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'Lesson Completed';

-- ─────────────────────────────────────────────────────────────────────────────
-- Track Completed
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #7c3aed;">🎓 Learning Track Completed!</h2>
  <p>Hi {{user_name}},</p>
  <p>Congratulations — you have completed the entire learning track:</p>
  <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
    <h3 style="margin-top: 0; color: #7c3aed;">{{learning_track_title}}</h3>
    <p style="margin: 0;">Completed on <strong>{{completion_date}}</strong></p>
  </div>
  <p>This is a significant milestone in your cybersecurity journey. Any certificates earned will appear in your profile.</p>
  <p><a href="{{client_login_url}}" style="color: #7c3aed;">View your profile →</a></p>
  <p>Well done!<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'Track Completed';

-- ─────────────────────────────────────────────────────────────────────────────
-- Track Milestone – 50% Complete
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #f59e0b;">🏃 Halfway There!</h2>
  <p>Hi {{user_name}},</p>
  <p>You have reached the halfway point in your learning track:</p>
  <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
    <h3 style="margin-top: 0; color: #f59e0b;">{{learning_track_title}}</h3>
    <p style="margin: 0;">Progress: <strong>50% complete</strong></p>
  </div>
  <p>Keep up the momentum — you are halfway to finishing this track!</p>
  <p><a href="{{client_login_url}}" style="color: #f59e0b;">Continue learning →</a></p>
  <p>You are doing great!<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'Track Milestone - 50% Complete';

-- ─────────────────────────────────────────────────────────────────────────────
-- Quiz High Score Achievement
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #059669;">🏆 New High Score!</h2>
  <p>Hi {{user_name}},</p>
  <p>You just set a new personal best on a quiz:</p>
  <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
    <h3 style="margin-top: 0; color: #059669;">{{quiz_title}}</h3>
    <p><strong>Score:</strong> {{score}}%</p>
    <p style="margin: 0;"><strong>Achieved:</strong> {{completion_date}}</p>
  </div>
  <p>Excellent performance! Keep testing your knowledge.</p>
  <p><a href="{{client_login_url}}" style="color: #059669;">View your progress →</a></p>
  <p>Keep it up!<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'Quiz High Score Achievement';

-- ─────────────────────────────────────────────────────────────────────────────
-- Lesson Reminder
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #0d9488;">⏰ You have a lesson waiting</h2>
  <p>Hi {{user_name}},</p>
  <p>Just a friendly reminder that you have an unfinished lesson:</p>
  <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
    <h3 style="margin-top: 0; color: #0d9488;">{{lesson_title}}</h3>
    {{#if learning_track_title}}
    <p style="margin: 0; color: #6b7280;">Part of: {{learning_track_title}}</p>
    {{/if}}
  </div>
  <p>Staying consistent with your training is the best way to build lasting cybersecurity skills.</p>
  <p><a href="{{client_login_url}}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Resume Lesson</a></p>
  <p>See you there!<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'Lesson Reminder';

-- ─────────────────────────────────────────────────────────────────────────────
-- Task Due Reminder
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #dc2626;">📋 Task Due Soon</h2>
  <p>Hi {{user_name}},</p>
  <p>A task assigned to you is due soon:</p>
  <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
    <h3 style="margin-top: 0; color: #dc2626;">{{task_title}}</h3>
    <p><strong>Due:</strong> {{due_date}}</p>
    <p style="margin: 0; color: #6b7280;">{{task_description}}</p>
  </div>
  <p>Please make sure to complete it before the deadline.</p>
  <p><a href="{{client_login_url}}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Task</a></p>
  <p>Regards,<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'Task Due Reminder';

-- ─────────────────────────────────────────────────────────────────────────────
-- System Alert Email
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #dc2626;">⚠️ System Alert</h2>
  <p>Hi {{user_name}},</p>
  <p>This is an automated system notification:</p>
  <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
    <h3 style="margin-top: 0; color: #dc2626;">{{alert_title}}</h3>
    <p style="margin: 0;">{{alert_message}}</p>
  </div>
  <p>If you have questions, please contact your administrator.</p>
  <p>Regards,<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'System Alert Email';

-- ─────────────────────────────────────────────────────────────────────────────
-- Manager Notification – Employee Incomplete Lessons
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE email_templates SET html_body_template = '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #0d9488;">👥 Team Training Update</h2>
  <p>Hi {{manager_name}},</p>
  <p>The following members of your team have incomplete lessons:</p>
  <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
    {{#each incomplete_employees}}
    <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
      <strong>{{full_name}}</strong>
      <span style="color: #6b7280; margin-left: 8px;">— {{incomplete_count}} lesson(s) pending</span>
    </div>
    {{/each}}
  </div>
  <p>You may want to follow up with your team to help them stay on track.</p>
  <p><a href="{{client_login_url}}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Team Progress</a></p>
  <p>Regards,<br>The StaySecure Team</p>
</div>
', updated_at = now()
WHERE name = 'Manager Notification - Employee Incomplete Lessons';

-- ─────────────────────────────────────────────────────────────────────────────
-- Document Assigned  (new — insert if missing, update if exists)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO email_templates (name, type, subject_template, html_body_template, is_active, is_system)
VALUES (
  'Document Assigned',
  'documents',
  '📄 A new document has been assigned to you: {{document_title}}',
  '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #0d9488;">📄 New Document Assigned</h2>
  <p>Hi {{user_name}},</p>
  <p>A new document has been assigned to you that requires your attention:</p>
  <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
    <h3 style="margin-top: 0; color: #0d9488;">{{document_title}}</h3>
    <p style="margin: 0;"><strong>Due by:</strong> {{due_date}}</p>
  </div>
  <p>Please review the document and mark it as read in your profile once you have done so.</p>
  <p><a href="{{client_login_url}}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Document</a></p>
  <p>Regards,<br>The StaySecure Team</p>
</div>
',
  true,  -- is_active
  true   -- is_system
)
ON CONFLICT (name) DO UPDATE
  SET subject_template   = EXCLUDED.subject_template,
      html_body_template = EXCLUDED.html_body_template,
      is_system          = true,
      updated_at         = now();

-- ─────────────────────────────────────────────────────────────────────────────
-- notification_rules row for document_assigned
-- Links the event name to the 'documents' email template.
-- sendNotificationByEvent('document_assigned', ...) looks this up automatically.
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Document Assigned Notification',
  'Sends email to a user when a document is assigned to them',
  id,
  'document_assigned',
  '{}'::jsonb,
  true,
  true,
  false
FROM email_templates
WHERE type = 'documents' AND is_active = true
LIMIT 1
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Register document-assignment variables in the template_variables registry
-- so they appear in the admin Variable Management UI.
-- Substitution works even without these rows, but registering them helps
-- template authors know what variables are available for the 'documents' type.
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO template_variables (key, category, display_name, is_system, is_active)
VALUES
  ('document_title',   'Document', 'Document Title',          true, true),
  ('due_date',         'Document', 'Document Due Date',        true, true),
  ('due_days',         'Document', 'Days Until Due',           true, true),
  ('completed_date',   'Document', 'Document Completion Date', true, true),
  ('employee_name',    'User',     'Employee Full Name',       true, true),
  ('manager_name',     'User',     'Manager Full Name',        true, true),
  ('login_url',        'System',   'Login URL',                true, true),
  ('client_login_url', 'System',   'Client Login URL',         true, true)
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Email template: Document Completed (Manager notification)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO email_templates (type, name, subject_template, html_body_template, is_active, is_system)
VALUES (
  'document_completed_manager',
  'Document Completed (Manager)',
  'Team Update: {{employee_name}} has completed {{document_title}}',
  '
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #0d9488;">✅ Document Completed</h2>
  <p>Hi {{manager_name}},</p>
  <p>This is a notification that a member of your team has completed a document:</p>
  <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
    <h3 style="margin-top: 0; color: #0d9488;">{{document_title}}</h3>
    <p style="margin: 4px 0;"><strong>Completed by:</strong> {{employee_name}}</p>
    <p style="margin: 4px 0;"><strong>Completed on:</strong> {{completed_date}}</p>
  </div>
  <p>You can view your team''s document compliance status from the admin dashboard.</p>
  <p><a href="{{client_login_url}}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Dashboard</a></p>
  <p>Regards,<br>The StaySecure Team</p>
</div>
',
  true,  -- is_active
  true   -- is_system: platform template, protected from deletion by client admins
)
ON CONFLICT (name) DO UPDATE
  SET subject_template   = EXCLUDED.subject_template,
      html_body_template = EXCLUDED.html_body_template,
      is_system          = true,
      updated_at         = now();

-- ─────────────────────────────────────────────────────────────────────────────
-- notification_rules row for document_completed_manager
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Document Completed Manager Notification',
  'Notifies a manager when a team member marks a document as read/completed',
  id,
  'document_completed_manager',
  '{}'::jsonb,
  true,
  true,
  false
FROM email_templates
WHERE type = 'document_completed_manager' AND is_active = true
LIMIT 1
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- notification_rules for all standard event types
-- Safe to re-run: ON CONFLICT DO NOTHING
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Lesson Completed Notification',
  'Notifies a user when they complete a lesson',
  id, 'lesson_completed', '{}'::jsonb, true, true, false
FROM email_templates WHERE type = 'lesson_completed' AND is_active = true LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Track Completed Notification',
  'Notifies a user when they complete a learning track',
  id, 'track_completed', '{}'::jsonb, true, true, false
FROM email_templates WHERE type = 'track_completed' AND is_active = true LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Document Assigned Notification',
  'Notifies a user when a document is assigned to them',
  id, 'document_assigned', '{}'::jsonb, true, true, false
FROM email_templates WHERE type = 'document_assigned' AND is_active = true LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Track Milestone 50% Notification',
  'Sends email when a user reaches 50% completion of a learning track',
  id, 'track_milestone_50', '{}'::jsonb, true, true, false
FROM email_templates WHERE type = 'track_milestone_50' AND is_active = true LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Quiz High Score Notification',
  'Sends email when a user scores 90% or higher on a quiz',
  id, 'quiz_high_score', '{"score": ">=90"}'::jsonb, true, true, false
FROM email_templates WHERE type = 'quiz_high_score' AND is_active = true LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO notification_rules (name, description, email_template_id, trigger_event, trigger_conditions, is_enabled, send_immediately, respect_quiet_hours)
SELECT
  'Manager Employee Incomplete Lessons Notification',
  'Sends email to manager when employee has not completed required lessons after max reminder attempts',
  id, 'manager_employee_incomplete', '{}'::jsonb, true, true, true
FROM email_templates WHERE type = 'manager_employee_incomplete' AND is_active = true LIMIT 1
ON CONFLICT DO NOTHING;
