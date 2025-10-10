import React from 'react';
import { Check, Trash2, Clock, AlertCircle, BookOpen, Target, Award, Calendar, Bell } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const isRead = !!notification.readAt;
  const isUrgent = notification.priority === 'urgent';
  const isHigh = notification.priority === 'high';

  const getIcon = () => {
    switch (notification.type) {
      case 'lesson_reminder':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'task_due':
        return <Target className="h-4 w-4 text-orange-500" />;
      case 'system_alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'course_completion':
        return <Award className="h-4 w-4 text-green-500" />;
      case 'assignment_due':
        return <Target className="h-4 w-4 text-purple-500" />;
      case 'meeting_reminder':
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const handleMarkAsRead = async () => {
    if (!isRead) {
      await onMarkAsRead(notification.id);
    }
  };

  const handleDelete = async () => {
    await onDelete(notification.id);
  };

  const handleClick = () => {
    if (!isRead) {
      handleMarkAsRead();
    }
    
    // Navigate to action URL if provided
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  return (
    <div
      className={`p-4 border-l-4 ${getPriorityColor()} hover:bg-gray-50 transition-colors cursor-pointer ${
        isRead ? 'opacity-75' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                {notification.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {!isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead();
                  }}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  aria-label="Mark as read"
                >
                  <Check className="h-3 w-3 text-gray-500" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                aria-label="Delete notification"
              >
                <Trash2 className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
              </span>
            </div>

            {notification.scheduledFor && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Scheduled for {format(notification.scheduledFor, 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            )}

            {isUrgent && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Urgent
              </span>
            )}

            {isHigh && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                High Priority
              </span>
            )}
          </div>

          {/* Metadata display */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {Object.entries(notification.metadata).map(([key, value]) => (
                <span key={key} className="mr-3">
                  <span className="font-medium">{key}:</span> {String(value)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
