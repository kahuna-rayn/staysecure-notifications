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
  userId: string;
  emailEnabled: boolean;
  taskDueDates: boolean;
  systemAlerts: boolean;
  achievements: boolean;
  courseCompletions: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface ReminderSettings {
  id?: string;
  enabled: boolean;
  reminder_days_before: number;
  reminder_time: string;
  include_upcoming_lessons: boolean;
  upcoming_days_ahead: number;
  max_reminder_attempts: number;
  reminder_frequency_days: number;
}

export const EmailNotifications: React.FC<EmailNotificationsProps> = ({
  supabase,
  user,
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
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: true,
    reminder_days_before: 1,
    reminder_time: '09:00:00',
    include_upcoming_lessons: true,
    upcoming_days_ahead: 3,
    max_reminder_attempts: 3,
    reminder_frequency_days: 7,
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [savingReminders, setSavingReminders] = useState(false);
  const [testingReminders, setTestingReminders] = useState(false);
  const [testEmailType, setTestEmailType] = useState<string>('system_alert');

  // Configure email service with AWS config
  useEffect(() => {
    if (awsConfig) {
      EmailService.configure(awsConfig);
    }
  }, [awsConfig]);

  // Load user preferences and reminder settings
  useEffect(() => {
    if (user) {
      loadPreferences();
      loadReminderSettings();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        // Map database columns to component interface
        const mappedData: EmailPreferences = {
          userId: data.user_id,
          emailEnabled: data.email_enabled,
          taskDueDates: data.task_due_dates,
          systemAlerts: data.system_alerts,
          achievements: data.achievements,
          courseCompletions: data.course_completions,
          quietHoursEnabled: data.quiet_hours_enabled,
          quietHoursStart: data.quiet_hours_start_time,
          quietHoursEnd: data.quiet_hours_end_time,
        };
        setPreferences(mappedData);
      } else {
        // Set default preferences in UI (don't save to DB yet)
        const defaultPrefs: EmailPreferences = {
          userId: user?.id || '',
          emailEnabled: true,
          taskDueDates: false,
          systemAlerts: false,
          achievements: true,
          courseCompletions: true,
          quietHoursEnabled: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00',
        };
        setPreferences(defaultPrefs);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPreferences = async (prefs: EmailPreferences) => {
    const dbPayload = {
      user_id: prefs.userId,
      email_enabled: prefs.emailEnabled,
      task_due_dates: prefs.taskDueDates,
      system_alerts: prefs.systemAlerts,
      achievements: prefs.achievements,
      course_completions: prefs.courseCompletions,
      quiet_hours_enabled: prefs.quietHoursEnabled,
      quiet_hours_start_time: prefs.quietHoursStart,
      quiet_hours_end_time: prefs.quietHoursEnd,
    };
    
    const { error } = await supabase
      .from('email_preferences')
      .upsert(dbPayload, { onConflict: 'user_id' });

    if (error) {
      console.error('Error upserting preferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<EmailPreferences>) => {
    const updatedPrefs = { 
      ...preferences, 
      ...updates, 
      userId: user.id // Always use current user ID
    };
    setPreferences(updatedPrefs);

    const dbPayload = {
      user_id: user.id, // Always use current user ID
      email_enabled: updatedPrefs.emailEnabled,
      task_due_dates: updatedPrefs.taskDueDates,
      system_alerts: updatedPrefs.systemAlerts,
      achievements: updatedPrefs.achievements,
      course_completions: updatedPrefs.courseCompletions,
      quiet_hours_enabled: updatedPrefs.quietHoursEnabled,
      quiet_hours_start_time: updatedPrefs.quietHoursStart,
      quiet_hours_end_time: updatedPrefs.quietHoursEnd,
    };

    const { error } = await supabase
      .from('email_preferences')
      .upsert(dbPayload);

    if (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const loadReminderSettings = async () => {
    try {
      // Fetch the single global configuration row
      const { data, error: fetchError } = await supabase
        .from('lesson_reminder_config')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (fetchError) {
        console.error('Error loading reminder settings:', fetchError);
        return;
      }

      if (data) {
        setReminderSettings({
          id: data.id,
          enabled: data.enabled,
          reminder_days_before: data.reminder_days_before,
          reminder_time: data.reminder_time,
          include_upcoming_lessons: data.include_upcoming_lessons,
          upcoming_days_ahead: data.upcoming_days_ahead,
          max_reminder_attempts: data.max_reminder_attempts || 3,
          reminder_frequency_days: data.reminder_frequency_days || 7,
        });
      }
    } catch (err: any) {
      console.error('Error loading reminder settings:', err);
    }
  };

  const saveReminderSettings = async () => {
    try {
      setSavingReminders(true);

      // Always update the single global configuration row
      const { error: updateError } = await supabase
        .from('lesson_reminder_config')
        .update({
          enabled: reminderSettings.enabled,
          reminder_days_before: reminderSettings.reminder_days_before,
          reminder_time: reminderSettings.reminder_time,
          include_upcoming_lessons: reminderSettings.include_upcoming_lessons,
          upcoming_days_ahead: reminderSettings.upcoming_days_ahead,
          max_reminder_attempts: reminderSettings.max_reminder_attempts,
          reminder_frequency_days: reminderSettings.reminder_frequency_days,
          updated_at: new Date().toISOString(),
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (updateError) throw updateError;

      alert('Reminder settings saved successfully!');
    } catch (err: any) {
      console.error('Error saving reminder settings:', err);
      alert(`Failed to save reminder settings: ${err.message}`);
    } finally {
      setSavingReminders(false);
    }
  };

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
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
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
                  value={reminderSettings.max_reminder_attempts}
                  onChange={(e) => setReminderSettings(prev => ({ 
                    ...prev, 
                    max_reminder_attempts: parseInt(e.target.value) || 3 
                  }))}
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
                  value={reminderSettings.reminder_frequency_days}
                  onChange={(e) => setReminderSettings(prev => ({ 
                    ...prev, 
                    reminder_frequency_days: parseInt(e.target.value) || 7 
                  }))}
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
                <div className="space-y-3 border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-left font-medium">Lesson Reminders</Label>
                    <Switch
                      checked={reminderSettings.enabled}
                      onCheckedChange={(checked) => setReminderSettings(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                  
                  {reminderSettings.enabled && (
                    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="reminder-days" className="text-sm">Days before lesson</Label>
                          <Input
                            id="reminder-days"
                            type="number"
                            min="0"
                            max="7"
                            value={reminderSettings.reminder_days_before}
                            onChange={(e) => setReminderSettings(prev => ({ 
                              ...prev, 
                              reminder_days_before: parseInt(e.target.value) || 0 
                            }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reminder-time" className="text-sm">Send at time</Label>
                          <Input
                            id="reminder-time"
                            type="time"
                            value={reminderSettings.reminder_time}
                            onChange={(e) => setReminderSettings(prev => ({ 
                              ...prev, 
                              reminder_time: e.target.value 
                            }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upcoming Lessons - Enhanced */}
                <div className="space-y-3 border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-left font-medium">Upcoming Lessons</Label>
                    <Switch
                      checked={reminderSettings.include_upcoming_lessons}
                      onCheckedChange={(checked) => setReminderSettings(prev => ({ 
                        ...prev, 
                        include_upcoming_lessons: checked 
                      }))}
                    />
                  </div>
                  
                  {reminderSettings.include_upcoming_lessons && (
                    <div className="pl-4 border-l-2 border-green-200">
                      <div>
                        <Label htmlFor="upcoming-days" className="text-sm">Look ahead days</Label>
                        <Input
                          id="upcoming-days"
                          type="number"
                          min="1"
                          max="14"
                          value={reminderSettings.upcoming_days_ahead}
                          onChange={(e) => setReminderSettings(prev => ({ 
                            ...prev, 
                            upcoming_days_ahead: parseInt(e.target.value) || 3 
                          }))}
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

