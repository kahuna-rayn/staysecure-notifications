// Core notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  createdAt: Date;
  scheduledFor?: Date;
  readAt?: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

export type NotificationType = 
  | 'lesson_reminder'
  | 'task_due'
  | 'system_alert'
  | 'achievement'
  | 'course_completion'
  | 'assignment_due'
  | 'meeting_reminder'
  | 'custom';

export type NotificationStatus = 
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'cancelled';

export type NotificationPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

// Notification preferences
export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types: {
    [key in NotificationType]: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
    timezone: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

// Notification template
export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  title: string;
  message: string;
  variables: string[]; // Template variables like {{userName}}, {{lessonTitle}}
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification schedule
export interface NotificationSchedule {
  id: string;
  templateId: string;
  userId: string;
  scheduledFor: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // Every X days/weeks/months
    endDate?: Date;
  };
  conditions?: {
    [key: string]: any;
  };
  status: 'pending' | 'sent' | 'cancelled';
}

// Notification delivery
export interface NotificationDelivery {
  id: string;
  notificationId: string;
  userId: string;
  method: 'email' | 'push' | 'in_app';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  retryCount: number;
}

// Notification analytics
export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  openRate: number;
  clickRate: number;
  byType: {
    [key in NotificationType]: {
      sent: number;
      delivered: number;
      read: number;
    };
  };
  byTime: {
    hour: number;
    sent: number;
    delivered: number;
    read: number;
  }[];
}

// API response types
export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  scheduledFor?: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationRequest {
  id: string;
  status?: NotificationStatus;
  readAt?: Date;
}

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  fromDate?: Date;
  toDate?: Date;
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

// Hook return types
export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refresh: () => void;
}

export interface UseNotificationSettingsReturn {
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: Error | null;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  updateTypePreference: (type: NotificationType, method: 'email' | 'push' | 'inApp', enabled: boolean) => Promise<void>;
}
