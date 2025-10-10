import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import type { 
  NotificationPreferences, 
  UseNotificationSettingsReturn,
  NotificationType 
} from '../types';

export const useNotificationSettings = (userId: string): UseNotificationSettingsReturn => {
  const queryClient = useQueryClient();

  // Fetch notification preferences
  const {
    data: preferences,
    isLoading,
    error
  } = useQuery({
    queryKey: ['notification-preferences', userId],
    queryFn: async (): Promise<NotificationPreferences> => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no preferences exist, create default ones
        if (error.code === 'PGRST116') {
          return createDefaultPreferences(userId);
        }
        throw new Error(`Failed to fetch notification preferences: ${error.message}`);
      }

      return {
        ...data,
        types: data.types || getDefaultTypePreferences(),
      };
    },
    enabled: !!userId,
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: Partial<NotificationPreferences>): Promise<void> => {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...newPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Failed to update notification preferences: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', userId] });
    },
  });

  // Update specific type preference mutation
  const updateTypePreferenceMutation = useMutation({
    mutationFn: async ({ 
      type, 
      method, 
      enabled 
    }: { 
      type: NotificationType; 
      method: 'email' | 'push' | 'inApp'; 
      enabled: boolean; 
    }): Promise<void> => {
      if (!preferences) return;

      const updatedTypes = {
        ...preferences.types,
        [type]: {
          ...preferences.types[type],
          [method]: enabled,
        },
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          types: updatedTypes,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Failed to update type preference: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', userId] });
    },
  });

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    await updatePreferencesMutation.mutateAsync(newPreferences);
  };

  const updateTypePreference = async (
    type: NotificationType, 
    method: 'email' | 'push' | 'inApp', 
    enabled: boolean
  ) => {
    await updateTypePreferenceMutation.mutateAsync({ type, method, enabled });
  };

  return {
    preferences,
    isLoading,
    error: error as Error | null,
    updatePreferences,
    updateTypePreference,
  };
};

// Helper function to create default preferences
const createDefaultPreferences = async (userId: string): Promise<NotificationPreferences> => {
  const defaultPreferences: NotificationPreferences = {
    userId,
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    types: getDefaultTypePreferences(),
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    frequency: 'immediate',
  };

  const { error } = await supabase
    .from('notification_preferences')
    .insert({
      user_id: userId,
      email_enabled: defaultPreferences.emailEnabled,
      push_enabled: defaultPreferences.pushEnabled,
      in_app_enabled: defaultPreferences.inAppEnabled,
      types: defaultPreferences.types,
      quiet_hours: defaultPreferences.quietHours,
      frequency: defaultPreferences.frequency,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(`Failed to create default preferences: ${error.message}`);
  }

  return defaultPreferences;
};

// Helper function to get default type preferences
const getDefaultTypePreferences = () => ({
  lesson_reminder: { email: true, push: true, inApp: true },
  task_due: { email: true, push: true, inApp: true },
  system_alert: { email: false, push: true, inApp: true },
  achievement: { email: false, push: true, inApp: true },
  course_completion: { email: true, push: true, inApp: true },
  assignment_due: { email: true, push: true, inApp: true },
  meeting_reminder: { email: true, push: true, inApp: true },
  custom: { email: true, push: true, inApp: true },
});

// Hook for checking if notifications are allowed based on preferences
export const useNotificationPermission = (userId: string, type: NotificationType, method: 'email' | 'push' | 'inApp') => {
  const { preferences } = useNotificationSettings(userId);

  if (!preferences) return false;

  // Check if the specific method is enabled globally
  const methodEnabled = preferences[`${method}Enabled` as keyof NotificationPreferences] as boolean;
  if (!methodEnabled) return false;

  // Check if the specific type is enabled for this method
  const typeEnabled = preferences.types[type]?.[method];
  if (typeEnabled === undefined) return true; // Default to true if not specified

  return typeEnabled;
};

// Hook for checking quiet hours
export const useQuietHours = (userId: string) => {
  const { preferences } = useNotificationSettings(userId);

  if (!preferences?.quietHours?.enabled) {
    return { isQuietHours: false };
  }

  const now = new Date();
  const userTimezone = preferences.quietHours.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Convert current time to user's timezone
  const userTime = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
  const currentHour = userTime.getHours();
  const currentMinute = userTime.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  // Parse quiet hours
  const [startHour, startMinute] = preferences.quietHours.startTime.split(':').map(Number);
  const [endHour, endMinute] = preferences.quietHours.endTime.split(':').map(Number);
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  // Check if current time is within quiet hours
  let isQuietHours = false;
  if (startTime <= endTime) {
    // Same day (e.g., 22:00 to 08:00)
    isQuietHours = currentTime >= startTime && currentTime <= endTime;
  } else {
    // Overnight (e.g., 22:00 to 08:00)
    isQuietHours = currentTime >= startTime || currentTime <= endTime;
  }

  return { isQuietHours };
};
