import React, { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Save, Play } from 'lucide-react';

interface LessonReminderSettingsProps {
  supabase: SupabaseClient;
  // UI components passed as props for flexibility
  Card?: any;
  CardHeader?: any;
  CardTitle?: any;
  CardDescription?: any;
  CardContent?: any;
  Button?: any;
  Switch?: any;
  Input?: any;
  Label?: any;
  Alert?: any;
  AlertDescription?: any;
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

export const LessonReminderSettings: React.FC<LessonReminderSettingsProps> = ({
  supabase,
  Card = 'div',
  CardHeader = 'div',
  CardTitle = 'h3',
  CardDescription = 'p',
  CardContent = 'div',
  Button = 'button',
  Switch = 'input',
  Input = 'input',
  Label = 'label',
  Alert = 'div',
  AlertDescription = 'p',
}) => {
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: true,
    reminder_days_before: 1,
    reminder_time: '09:00:00',
    include_upcoming_lessons: true,
    upcoming_days_ahead: 3,
    max_reminder_attempts: 3,
    reminder_frequency_days: 7,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [testingReminders, setTestingReminders] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the single global configuration row
      const { data, error: fetchError } = await supabase
        .from('lesson_reminder_config')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (fetchError) {
        console.error('Error loading reminder settings:', fetchError);
        throw fetchError;
      }

      if (data) {
        setSettings({
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
      setError(err.message || 'Failed to load reminder settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Always update the single global configuration row
      const { error: updateError } = await supabase
        .from('lesson_reminder_config')
        .update({
          enabled: settings.enabled,
          reminder_days_before: settings.reminder_days_before,
          reminder_time: settings.reminder_time,
          include_upcoming_lessons: settings.include_upcoming_lessons,
          upcoming_days_ahead: settings.upcoming_days_ahead,
          max_reminder_attempts: settings.max_reminder_attempts,
          reminder_frequency_days: settings.reminder_frequency_days,
          updated_at: new Date().toISOString(),
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving reminder settings:', err);
      setError(err.message || 'Failed to save reminder settings');
    } finally {
      setSaving(false);
    }
  };

  const testReminders = async () => {
    try {
      setTestingReminders(true);
      setError(null);

      // First validate admin permissions
      const { data: authData, error: authError } = await supabase
        .rpc('trigger_lesson_reminders');

      if (authError) {
        throw authError;
      }

      console.log('Admin validation result:', authData);

      // Now call the actual Edge Function to send reminders
      const { data, error } = await supabase.functions.invoke('send-lesson-reminders', {
        body: {
          test_mode: true
        }
      });

      if (error) {
        throw error;
      }

      console.log('Lesson reminder result:', data);
      alert(`Test completed! Processed: ${data?.processed || 0}, Sent: ${data?.sent || 0}`);
    } catch (err: any) {
      console.error('Error testing reminders:', err);
      setError(err.message || 'Failed to test reminders');
    } finally {
      setTestingReminders(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p>Loading reminder settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-learning-primary">Lesson Reminder Settings</h2>
      </div>

      {/* Global Settings */}
      <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>Settings saved successfully!</AlertDescription>
            </Alert>
          )}

          {/* Enable/Disable Reminders */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={settings.enabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, enabled: checked })
                }
              />
              <Label htmlFor="enabled">Enable Lesson Reminders</Label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={saveSettings} 
                disabled={saving} 
                size="sm"
                title={saving ? 'Saving...' : 'Save Settings'}
              >
                <Save className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={testReminders}
                disabled={testingReminders}
                size="sm"
                title={testingReminders ? 'Testing...' : 'Test Reminders'}
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>

      {/* Configuration Cards - 3 Column Layout */}
      {settings.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reminder Timing */}
          <Card>
            <CardHeader>
              <CardTitle>Reminder Timing</CardTitle>
              <CardDescription>When to send reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reminder_time">Reminder Time</Label>
                <Input
                  id="reminder_time"
                  type="time"
                  value={settings.reminder_time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({ ...settings, reminder_time: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  What time of day should reminders be sent?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder_days_before">Days Before</Label>
                <Input
                  id="reminder_days_before"
                  type="number"
                  min="0"
                  max="7"
                  value={settings.reminder_days_before}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({
                      ...settings,
                      reminder_days_before: parseInt(e.target.value) || 2,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Send reminders this many days before lesson becomes available
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reminder Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Reminder Limits</CardTitle>
              <CardDescription>Control reminder frequency and attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max_reminder_attempts">Max Attempts</Label>
                <Input
                  id="max_reminder_attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.max_reminder_attempts}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({
                      ...settings,
                      max_reminder_attempts: parseInt(e.target.value) || 3,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of reminders per lesson
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder_frequency_days">Frequency (Days)</Label>
                <Input
                  id="reminder_frequency_days"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.reminder_frequency_days}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({
                      ...settings,
                      reminder_frequency_days: parseInt(e.target.value) || 7,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Days between reminder attempts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lessons</CardTitle>
              <CardDescription>Configure "coming soon" notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include_upcoming"
                  checked={settings.include_upcoming_lessons}
                  onCheckedChange={(checked: boolean) =>
                    setSettings({ ...settings, include_upcoming_lessons: checked })
                  }
                />
                <Label htmlFor="include_upcoming">Include Upcoming Lessons</Label>
              </div>

              {settings.include_upcoming_lessons && (
                <div className="space-y-2">
                  <Label htmlFor="upcoming_days_ahead">Look Ahead Days</Label>
                  <Input
                    id="upcoming_days_ahead"
                    type="number"
                    min="1"
                    max="14"
                    value={settings.upcoming_days_ahead}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSettings({
                        ...settings,
                        upcoming_days_ahead: parseInt(e.target.value) || 3,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Send "coming soon" reminders for lessons available within this many days
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}


      {/* Information */}
      <div className="pt-6">
        <h3 className="text-lg font-semibold text-learning-primary mb-2">How Lesson Reminders Work</h3>
        <p className="text-sm text-muted-foreground mb-4">Understanding the reminder system behavior</p>
        <ul className="text-sm space-y-1 list-disc list-inside text-left">
          <li>Reminders are sent automatically based on learning track schedules</li>
          <li>Uses existing email_notifications system</li>
          <li>Only active, enrolled users receive reminders</li>
          <li>Completed lessons won't trigger reminders</li>
          <li>Users control reminders via their email_preferences (lesson_reminders field)</li>
          <li>Respects user's quiet hours and email_enabled settings</li>
          <li>Maximum 3 reminders per lesson with 7-day intervals</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default LessonReminderSettings;
