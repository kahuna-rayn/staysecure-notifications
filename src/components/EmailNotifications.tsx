import React, { useState, useEffect } from 'react';
import { Mail, Send } from 'lucide-react';
import { emailService, EmailService } from '../lib/emailService';

// These should be passed as props or configured externally
interface EmailNotificationsProps {
  // Supabase client - should be passed from the consuming app
  supabase: any;
  // User object - should be passed from the consuming app
  user: any;
  // AWS configuration - should be passed from the consuming app
  awsConfig?: {
    lambdaUrl: string;
    fromEmail: string;
  };
  // UI components - should be passed from the consuming app
  Button: any;
  Card: any;
  CardContent: any;
  CardDescription: any;
  CardHeader: any;
  CardTitle: any;
  Input: any;
  Label: any;
  Switch: any;
  Select: any;
  SelectContent: any;
  SelectItem: any;
  SelectTrigger: any;
  SelectValue: any;
  Textarea: any;
}


interface EmailPreferences {
  id?: string;
  userId?: string; // NULL for org-level, user UUID for user-level
  emailEnabled: boolean;
  taskDueDates: boolean;
  systemAlerts: boolean;
  achievements: boolean;
  courseCompletions: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  // Reminder settings (consolidated from lesson_reminder_config)
  reminderDaysBefore: number;
  reminderTime: string;
  includeUpcomingLessons: boolean;
  upcomingDaysAhead: number;
  maxReminderAttempts: number;
  reminderFrequencyDays: number;
}

// ReminderSettings interface removed - now part of EmailPreferences

export const EmailNotifications: React.FC<EmailNotificationsProps> = ({
  supabase,
  user, // Keep for now for auth context, but not used for preferences
  awsConfig,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
}) => {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  // Removed unused state variables - now using consolidated preferences
  const [testEmailType, setTestEmailType] = useState<string>('system_alert');

  // Configure email service with AWS config
  useEffect(() => {
    if (awsConfig) {
      EmailService.configure(awsConfig);
    }
  }, [awsConfig]);

  // Load user preferences and reminder settings
  useEffect(() => {
    loadPreferences(); // Load org-level preferences (no user dependency)
  }, []);

  const loadPreferences = async () => {
    try {
      // Simple algorithm: load the one org-level row
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .is('user_id', null)
        .single();

      if (error) {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        // Map database columns to component interface
        const mappedData: EmailPreferences = {
          id: data.id,
          userId: data.user_id, // Will be null for org-level
          emailEnabled: data.email_enabled,
          taskDueDates: data.task_due_dates,
          systemAlerts: data.system_alerts,
          achievements: data.achievements,
          courseCompletions: data.course_completions,
          quietHoursEnabled: data.quiet_hours_enabled,
          quietHoursStart: data.quiet_hours_start_time,
          quietHoursEnd: data.quiet_hours_end_time,
          // Reminder settings (now part of the same table)
          reminderDaysBefore: data.reminder_days_before,
          reminderTime: data.reminder_time,
          includeUpcomingLessons: data.include_upcoming_lessons,
          upcomingDaysAhead: data.upcoming_days_ahead,
          maxReminderAttempts: data.max_reminder_attempts,
          reminderFrequencyDays: data.reminder_frequency_days,
        };
        setPreferences(mappedData);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple algorithm: just load existing row, no creation logic needed

  const updatePreferences = async (updates: Partial<EmailPreferences>) => {
    const updatedPrefs = { 
      ...preferences, 
      ...updates, 
      userId: null // Always org-level settings
    };
    setPreferences(updatedPrefs);

    // Get current user for audit fields
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const dbPayload = {
      user_id: null, // Always org-level settings
      email_enabled: updatedPrefs.emailEnabled,
      task_due_dates: updatedPrefs.taskDueDates,
      system_alerts: updatedPrefs.systemAlerts,
      achievements: updatedPrefs.achievements,
      course_completions: updatedPrefs.courseCompletions,
      quiet_hours_enabled: updatedPrefs.quietHoursEnabled,
      quiet_hours_start_time: updatedPrefs.quietHoursStart,
      quiet_hours_end_time: updatedPrefs.quietHoursEnd,
      // Reminder settings (consolidated)
      reminder_days_before: updatedPrefs.reminderDaysBefore,
      reminder_time: updatedPrefs.reminderTime,
      include_upcoming_lessons: updatedPrefs.includeUpcomingLessons,
      upcoming_days_ahead: updatedPrefs.upcomingDaysAhead,
      max_reminder_attempts: updatedPrefs.maxReminderAttempts,
      reminder_frequency_days: updatedPrefs.reminderFrequencyDays,
      // Audit fields
      updated_by: currentUser?.id || null,
    };

    // Update the existing org-level row (user_id IS NULL)
    const { error } = await supabase
      .from('email_preferences')
      .update(dbPayload)
      .is('user_id', null);

    if (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // loadReminderSettings removed - now part of loadPreferences

  // saveReminderSettingsAuto removed - now uses updatePreferences directly

  // saveReminderSettings removed - now uses updatePreferences directly

  const testReminders = async () => {
    try {
      setTestingReminders(true);

      // Call the Edge Function to send test reminders
      const { data, error } = await supabase.functions.invoke('send-lesson-reminders', {
        body: {
          test: true,
          email: user?.email,
        },
      });

      if (error) throw error;

      if (data && data.success) {
        alert(`Test reminders sent successfully! Check your email at ${user?.email}`);
      } else {
        alert(`Test failed: ${data?.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Error testing reminders:', err);
      alert(`Failed to send test reminders: ${err.message}`);
    } finally {
      setTestingReminders(false);
    }
  };


  const sendTestEmail = async () => {
    if (!user || !user.email) {
      return;
    }

    setSending(true);
    try {
      let emailResult;

      // Send different types of test emails based on selection
      switch (testEmailType) {
        case 'lesson_reminder':
          emailResult = await emailService.sendLessonReminder(
            user.email,
            'Introduction to Cybersecurity',
            '2:00 PM today',
            supabase
          );
          break;
        case 'task_due':
          emailResult = await emailService.sendTaskDueReminder(
            user.email,
            'Security Assessment Quiz',
            'Tomorrow at 11:59 PM',
            supabase
          );
          break;
        case 'achievement':
          emailResult = await emailService.sendAchievementEmail(
            user.email,
            'First Lesson Completed',
            'You completed your first cybersecurity lesson!',
            supabase
          );
          break;
        case 'course_completion':
          emailResult = await emailService.sendCourseCompletionEmail(
            user.email,
            'Cybersecurity Fundamentals',
            supabase
          );
          break;
        case 'system_alert':
        default:
          emailResult = await emailService.sendSystemAlert(
            user.email,
            'System Maintenance',
            'Scheduled maintenance will occur tonight at 2 AM EST.',
            supabase
          );
          break;
      }

      if (emailResult.success) {
        // Save to database
        const { error } = await supabase
          .from('email_notifications')
          .insert({
            user_id: user.id,
            type: testEmailType as any,
            title: 'Test Email Notification',
            message: `Test ${testEmailType} email sent successfully.`,
            email: user.email,
            status: 'sent',
          });

        if (error) {
          console.error('Error saving notification:', error);
        }

        alert('Test email sent successfully!');
      } else {
        alert(`Failed to send email: ${emailResult.error}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Error sending test email. Please check console for details.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-learning-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6 text-learning-primary" />
        <h2 className="text-2xl font-bold text-learning-primary">Email Preferences</h2>
      </div>

      {/* Email Preferences */}
      <div className="space-y-6">
          {/* Global Email Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <Label htmlFor="email-enabled">Enable Email Notifications</Label>
            </div>
            <Switch
              id="email-enabled"
              checked={preferences?.emailEnabled || false}
              onCheckedChange={(checked) => updatePreferences({ emailEnabled: checked })}
            />
          </div>

          {/* Reminder Limits - Right below Enable Email Toggle */}
          {preferences?.emailEnabled && (
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
              <div>
                <Label htmlFor="max-attempts" className="text-sm">Max Reminder Attempts</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={preferences?.maxReminderAttempts || 3}
                         onChange={(e) => updatePreferences({ maxReminderAttempts: parseInt(e.target.value) || 3 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reminder-frequency" className="text-sm">Reminder Frequency (Days)</Label>
                <Input
                  id="reminder-frequency"
                  type="number"
                  min="1"
                  max="30"
                  value={preferences?.reminderFrequencyDays || 7}
                         onChange={(e) => updatePreferences({ reminderFrequencyDays: parseInt(e.target.value) || 7 })}
                  className="mt-1"
                />
              </div>
            </div>
          )}


          {/* Notification Type Preferences */}
          {preferences?.emailEnabled && (
            <div className="space-y-4">
              <h4 className="font-medium">Notification Types</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-left">Task Due Dates</Label>
                  <Switch
                    checked={preferences?.taskDueDates || false}
                    onCheckedChange={(checked) => updatePreferences({ taskDueDates: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-left">System Alerts</Label>
                  <Switch
                    checked={preferences?.systemAlerts || false}
                    onCheckedChange={(checked) => updatePreferences({ systemAlerts: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-left">Achievements</Label>
                  <Switch
                    checked={preferences?.achievements || false}
                    onCheckedChange={(checked) => updatePreferences({ achievements: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-left">Course Completions</Label>
                  <Switch
                    checked={preferences?.courseCompletions || false}
                    onCheckedChange={(checked) => updatePreferences({ courseCompletions: checked })}
                  />
                </div>

                {/* Lesson Reminders - Enhanced */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-left font-medium">Lesson Reminders</Label>
                    <Switch
                    checked={preferences?.reminderDaysBefore !== undefined && preferences?.reminderDaysBefore >= 0}
                    onCheckedChange={(checked) => {
                      updatePreferences({ 
                        reminderDaysBefore: checked ? 1 : -1 // -1 means disabled
                      });
                    }}
                    />
                  </div>
                  
                  {preferences?.reminderDaysBefore !== undefined && preferences?.reminderDaysBefore >= 0 && (
                    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="reminder-days" className="text-sm">Days before lesson</Label>
                          <Input
                            id="reminder-days"
                            type="number"
                            min="0"
                            max="7"
                            value={preferences?.reminderDaysBefore || 0}
                            onChange={(e) => updatePreferences({ reminderDaysBefore: parseInt(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reminder-time" className="text-sm">Send at time</Label>
                          <Input
                            id="reminder-time"
                            type="time"
                            value={preferences?.reminderTime || '09:00'}
                            onChange={(e) => updatePreferences({ reminderTime: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upcoming Lessons - Enhanced */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-left font-medium">Upcoming Lessons</Label>
                    <Switch
                      checked={preferences?.includeUpcomingLessons || false}
                      onCheckedChange={(checked) => updatePreferences({ includeUpcomingLessons: checked })}
                    />
                  </div>
                  
                  {preferences?.includeUpcomingLessons && (
                    <div className="pl-4 border-l-2 border-green-200">
                      <div>
                        <Label htmlFor="upcoming-days" className="text-sm">Look ahead days</Label>
                        <Input
                          id="upcoming-days"
                          type="number"
                          min="1"
                          max="14"
                          value={preferences?.upcomingDaysAhead || 3}
                            onChange={(e) => updatePreferences({ upcomingDaysAhead: parseInt(e.target.value) || 3 })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Don't send emails during these hours
                </p>
              </div>
              <Switch
                checked={preferences?.quietHoursEnabled || false}
                onCheckedChange={(checked) => updatePreferences({ quietHoursEnabled: checked })}
              />
            </div>

            {preferences?.quietHoursEnabled && (
              <div className="flex items-center gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={preferences?.quietHoursStart || '22:00'}
                    onChange={(e) => updatePreferences({ quietHoursStart: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={preferences?.quietHoursEnd || '08:00'}
                    onChange={(e) => updatePreferences({ quietHoursEnd: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

