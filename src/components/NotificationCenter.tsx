import React, { useState } from 'react';
import { Bell, X, Check, Trash2, Settings, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { NotificationSettings } from './NotificationSettings';
import type { NotificationFilters, NotificationType } from '../types';

interface NotificationCenterProps {
  userId: string;
  className?: string;
  maxNotifications?: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  className = '',
  maxNotifications = 50,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<NotificationFilters>({
    userId,
    unreadOnly: false,
    limit: maxNotifications,
  });

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications(filters);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTypeFilter = (type: NotificationType | 'all') => {
    if (type === 'all') {
      setFilters(prev => ({ ...prev, type: undefined }));
    } else {
      setFilters(prev => ({ ...prev, type }));
    }
  };

  const getTypeCount = (type: NotificationType) => {
    return notifications.filter(n => n.type === type).length;
  };

  const unreadNotifications = notifications.filter(n => !n.readAt);

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="border-b border-gray-200">
              <NotificationSettings userId={userId} />
            </div>
          )}

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>
            
            {/* Type Filters */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => handleTypeFilter('all')}
                className={`px-2 py-1 text-xs rounded-full ${
                  !filters.type ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => handleTypeFilter('lesson_reminder')}
                className={`px-2 py-1 text-xs rounded-full ${
                  filters.type === 'lesson_reminder' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Lessons ({getTypeCount('lesson_reminder')})
              </button>
              <button
                onClick={() => handleTypeFilter('task_due')}
                className={`px-2 py-1 text-xs rounded-full ${
                  filters.type === 'task_due' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Tasks ({getTypeCount('task_due')})
              </button>
              <button
                onClick={() => handleTypeFilter('system_alert')}
                className={`px-2 py-1 text-xs rounded-full ${
                  filters.type === 'system_alert' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Alerts ({getTypeCount('system_alert')})
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.unreadOnly || false}
                  onChange={(e) => handleFilterChange({ unreadOnly: e.target.checked })}
                  className="rounded"
                />
                Unread only
              </label>
            </div>
          </div>

          {/* Actions */}
          {unreadNotifications.length > 0 && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                Error loading notifications: {error.message}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={refresh}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
