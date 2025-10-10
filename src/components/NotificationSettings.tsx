import React, { useState } from 'react';
import { Settings, Bell, Mail, Smartphone, Clock, Save, X } from 'lucide-react';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import type { NotificationType } from '../types';

interface NotificationSettingsProps {
  userId: string;
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  userId,
  className = '',
}) => {
  const {
    preferences,
    isLoading,
    error,
    updatePreferences,
    updateTypePreference,
  } = useNotificationSettings(userId);

  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-gray-500">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-red-500">Error loading settings: {error.message}</div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-gray-500">No settings found</div>
      </div>
    );
  }

  const handleGlobalToggle = async (method: 'email' | 'push' | 'inApp') => {
    const newValue = !preferences[`${method}Enabled` as keyof typeof preferences];
    await updatePreferences({ [`${method}Enabled`]: newValue });
  };

  const handleTypeToggle = async (type: NotificationType, method: 'email' | 'push' | 'inApp') => {
    await updateTypePreference(type, method, !preferences.types[type][method]);
  };

  const handleQuietHoursToggle = async () => {
    await updatePreferences({
      quietHours: {
        ...preferences.quietHours,
        enabled: !preferences.quietHours.enabled,
      },
    });
  };

  const handleQuietHoursChange = async (field: 'startTime' | 'endTime', value: string) => {
    await updatePreferences({
      quietHours: {
        ...preferences.quietHours,
        [field]: value,
      },
    });
  };

  const handleFrequencyChange = async (frequency: 'immediate' | 'hourly' | 'daily' | 'weekly') => {
    await updatePreferences({ frequency });
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'lesson_reminder':
        return 'Lesson Reminders';
      case 'task_due':
        return 'Task Due Dates';
      case 'system_alert':
        return 'System Alerts';
      case 'achievement':
        return 'Achievements';
      case 'course_completion':
        return 'Course Completions';
      case 'assignment_due':
        return 'Assignment Due Dates';
      case 'meeting_reminder':
        return 'Meeting Reminders';
      case 'custom':
        return 'Custom Notifications';
      default:
        return type;
    }
  };

  const getTypeDescription = (type: NotificationType) => {
    switch (type) {
      case 'lesson_reminder':
        return 'Reminders for upcoming lessons and learning sessions';
      case 'task_due':
        return 'Notifications for tasks and assignments due soon';
      case 'system_alert':
        return 'Important system updates and maintenance alerts';
      case 'achievement':
        return 'Celebrations for completed milestones and achievements';
      case 'course_completion':
        return 'Notifications when you complete courses or modules';
      case 'assignment_due':
        return 'Reminders for upcoming assignment deadlines';
      case 'meeting_reminder':
        return 'Reminders for scheduled meetings and appointments';
      case 'custom':
        return 'Custom notifications from administrators';
      default:
        return '';
    }
  };

  return (
    <div className={`p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notification Settings
        </h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {isExpanded ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
        </button>
      </div>

      {/* Global Settings */}
      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Global Settings</h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailEnabled}
                  onChange={() => handleGlobalToggle('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.pushEnabled}
                  onChange={() => handleGlobalToggle('push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <span className="text-sm">In-App Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.inAppEnabled}
                  onChange={() => handleGlobalToggle('inApp')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Quiet Hours
            </h5>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHours.enabled}
                onChange={handleQuietHoursToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {preferences.quietHours.enabled && (
            <div className="flex items-center gap-2 text-sm">
              <span>From</span>
              <input
                type="time"
                value={preferences.quietHours.startTime}
                onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
              <span>to</span>
              <input
                type="time"
                value={preferences.quietHours.endTime}
                onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          )}
        </div>

        {/* Frequency */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Notification Frequency</h5>
          <div className="flex flex-wrap gap-2">
            {(['immediate', 'hourly', 'daily', 'weekly'] as const).map((frequency) => (
              <button
                key={frequency}
                onClick={() => handleFrequencyChange(frequency)}
                className={`px-3 py-1 text-xs rounded-full ${
                  preferences.frequency === frequency
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Type-specific settings */}
        {isExpanded && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Notification Types</h5>
            <div className="space-y-4">
              {(Object.keys(preferences.types) as NotificationType[]).map((type) => (
                <div key={type} className="border border-gray-200 rounded-lg p-3">
                  <div className="mb-2">
                    <h6 className="text-sm font-medium">{getTypeLabel(type)}</h6>
                    <p className="text-xs text-gray-500">{getTypeDescription(type)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {(['email', 'push', 'inApp'] as const).map((method) => (
                      <div key={method} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 capitalize">{method}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.types[type][method]}
                            onChange={() => handleTypeToggle(type, method)}
                            disabled={!preferences[`${method}Enabled` as keyof typeof preferences]}
                            className="sr-only peer"
                          />
                          <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 ${!preferences[`${method}Enabled` as keyof typeof preferences] ? 'opacity-50' : ''}`}></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
