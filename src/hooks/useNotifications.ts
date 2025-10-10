import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import type { 
  Notification, 
  NotificationFilters, 
  UseNotificationsReturn,
  CreateNotificationRequest,
  UpdateNotificationRequest 
} from '../types';

export const useNotifications = (filters: NotificationFilters = {}): UseNotificationsReturn => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', filters],
    queryFn: async (): Promise<Notification[]> => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.fromDate) {
        query = query.gte('created_at', filters.fromDate.toISOString());
      }
      if (filters.toDate) {
        query = query.lte('created_at', filters.toDate.toISOString());
      }
      if (filters.unreadOnly) {
        query = query.is('read_at', null);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data?.map(notification => ({
        ...notification,
        createdAt: new Date(notification.created_at),
        scheduledFor: notification.scheduled_for ? new Date(notification.scheduled_for) : undefined,
        readAt: notification.read_at ? new Date(notification.read_at) : undefined,
        expiresAt: notification.expires_at ? new Date(notification.expires_at) : undefined,
      })) || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count', filters.userId],
    queryFn: async (): Promise<number> => {
      if (!filters.userId) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', filters.userId)
        .is('read_at', null);

      if (error) {
        throw new Error(`Failed to fetch unread count: ${error.message}`);
      }

      return count || 0;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Update unread count when data changes
  useEffect(() => {
    if (unreadData !== undefined) {
      setUnreadCount(unreadData);
    }
  }, [unreadData]);

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          read_at: new Date().toISOString(),
          status: 'read'
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      if (!filters.userId) return;

      const { error } = await supabase
        .from('notifications')
        .update({ 
          read_at: new Date().toISOString(),
          status: 'read'
        })
        .eq('user_id', filters.userId)
        .is('read_at', null);

      if (error) {
        throw new Error(`Failed to mark all notifications as read: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  const markAsRead = useCallback(async (id: string) => {
    await markAsReadMutation.mutateAsync(id);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);

  const deleteNotification = useCallback(async (id: string) => {
    await deleteNotificationMutation.mutateAsync(id);
  }, [deleteNotificationMutation]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error: error as Error | null,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };
};

// Hook for creating notifications
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: CreateNotificationRequest): Promise<Notification> => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority || 'normal',
          scheduled_for: notification.scheduledFor?.toISOString(),
          action_url: notification.actionUrl,
          metadata: notification.metadata,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
      }

      return {
        ...data,
        createdAt: new Date(data.created_at),
        scheduledFor: data.scheduled_for ? new Date(data.scheduled_for) : undefined,
        readAt: data.read_at ? new Date(data.read_at) : undefined,
        expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};

// Hook for updating notifications
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: UpdateNotificationRequest): Promise<void> => {
      const updateData: any = {};
      
      if (update.status) {
        updateData.status = update.status;
      }
      if (update.readAt) {
        updateData.read_at = update.readAt.toISOString();
      }

      const { error } = await supabase
        .from('notifications')
        .update(updateData)
        .eq('id', update.id);

      if (error) {
        throw new Error(`Failed to update notification: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};
