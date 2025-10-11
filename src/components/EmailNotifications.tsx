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
  console.log('🎯 EmailNotifications component function called with props:', { user, supabase: !!supabase });
  
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [testEmailType, setTestEmailType] = useState<string>('system_alert');

  // Configure email service with AWS config
  useEffect(() => {
    if (awsConfig) {
      EmailService.configure(awsConfig);
    }
  }, [awsConfig]);

  // Load user preferences
  useEffect(() => {
    console.log('🚀 EmailNotifications component mounted, user:', user);
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      console.log('🔍 Loading preferences for user:', user?.id);
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      console.log('📊 Database response:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading preferences:', error);
        return;
      }

      if (data) {
        console.log('✅ Found existing preferences:', data);
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
        console.log('🔄 Mapped data:', mappedData);
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
        console.log('📋 No existing preferences found, using defaults in UI only');
        setPreferences(defaultPrefs);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPreferences = async (prefs: EmailPreferences) => {
    console.log('🆕 Creating/Upserting default preferences:', prefs);
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
    console.log('💾 Upserting with payload:', dbPayload);
    
    const { error } = await supabase
      .from('email_preferences')
      .upsert(dbPayload, { onConflict: 'user_id' });

    if (error) {
      console.error('❌ Error upserting preferences:', error);
    } else {
      console.log('✅ Successfully upserted default preferences');
    }
  };

  const updatePreferences = async (updates: Partial<EmailPreferences>) => {
    console.log('🔄 updatePreferences called with:', updates);
    console.log('📝 Current preferences before update:', preferences);
    
    const updatedPrefs = { 
      ...preferences, 
      ...updates, 
      userId: user.id // Always use current user ID
    };
    console.log('✨ Updated preferences object:', updatedPrefs);
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
    console.log('💾 Saving to database:', dbPayload);

    const { error } = await supabase
      .from('email_preferences')
      .upsert(dbPayload);

    if (error) {
      console.error('❌ Error updating preferences:', error);
    } else {
      console.log('✅ Successfully saved preferences to database');
    }
  };


  const sendTestEmail = async () => {
    console.log('Send test email clicked. User:', user);
    console.log('AWS Config:', awsConfig ? {
      lambdaUrl: awsConfig.lambdaUrl ? 'Configured' : 'Not configured',
      fromEmail: awsConfig.fromEmail
    } : 'Not provided');
    if (!user || !user.email) {
      console.log('Missing user or email:', { user, email: user?.email });
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

          {/* Test Email Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Test Email Notifications</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Email Type</Label>
                <Select value={testEmailType} onValueChange={setTestEmailType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system_alert">System Alert</SelectItem>
                    <SelectItem value="lesson_reminder">Lesson Reminder</SelectItem>
                    <SelectItem value="task_due">Task Due Date</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="course_completion">Course Completion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={sendTestEmail}
                disabled={sending || !preferences?.emailEnabled}
                className="flex items-center gap-2"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Test Email
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

