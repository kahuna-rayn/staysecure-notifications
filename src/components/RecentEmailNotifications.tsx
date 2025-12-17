import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';

interface EmailNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  email: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  sent_at?: string;
  error_message?: string;
}

interface RecentEmailNotificationsProps {
  supabaseClient: any;
  Button: any;
  Card: any;
  CardContent: any;
  CardDescription: any;
  CardHeader: any;
  CardTitle: any;
  Input: any;
  Label: any;
  Badge: any;
  Select: any;
  SelectContent: any;
  SelectItem: any;
  SelectTrigger: any;
  SelectValue: any;
  Alert: any;
  AlertDescription: any;
}

export default function RecentEmailNotifications({
  supabaseClient,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription
}: RecentEmailNotificationsProps) {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Load recent notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      // Fetch notifications
      const { data: notifications, error } = await supabaseClient
        .from('notification_history')
        .select('*')
        .order('sent_at', { ascending: false, nullsFirst: false })
        .limit(100); // Show last 100 notifications

      if (error) throw error;

      if (!notifications || notifications.length === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(notifications.map((n: any) => n.user_id))];

      // Fetch user emails from profiles
      // Note: email is stored in username field in profiles table
      const { data: profiles, error: profilesError } = await supabaseClient
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map of user_id -> email
      // Note: username field stores the email address
      const emailMap = new Map<string, string>();
      profiles?.forEach((profile: any) => {
        if (profile.username) {
          emailMap.set(profile.id, profile.username);
        }
      });
      
      // Map notification_history fields to the expected format
      const mappedData = notifications.map((notification: any) => ({
        id: notification.id,
        title: notification.trigger_event.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        message: `Notification of type ${notification.trigger_event}`,
        type: notification.trigger_event,
        status: notification.status,
        email: emailMap.get(notification.user_id) || 'Unknown User',
        sent_at: notification.sent_at,
        error_message: notification.error_message
      }));
      
      setNotifications(mappedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'sent': return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
      case 'failed': return { backgroundColor: '#fecaca', color: '#991b1b', borderColor: '#fca5a5' };
      case 'pending': return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'lesson_completed': return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
      case 'lesson_reminder': return { backgroundColor: '#fed7aa', color: '#9a3412', borderColor: '#fdba74' };
      case 'quiz_high_score': return { backgroundColor: '#e9d5ff', color: '#6b21a8', borderColor: '#d8b4fe' };
      case 'track_milestone': return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
      case 'system_alert': return { backgroundColor: '#fecaca', color: '#991b1b', borderColor: '#fca5a5' };
      case 'task_due': return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
      case 'achievement': return { backgroundColor: '#fce7f3', color: '#be185d', borderColor: '#f9a8d4' };
      case 'course_completion': return { backgroundColor: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' };
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading recent notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4">
        <AlertDescription>Error loading notifications: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-learning-primary">Recent Email Notifications</h2>
          <p className="text-muted-foreground">View sent email notifications and their status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadNotifications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      {notifications.length > 0 && (
        <div className="flex flex-row gap-4">
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => n.status === 'sent').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Sent</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {notifications.filter(n => n.status === 'failed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                  {notifications.filter(n => n.status === 'failed').length > 0 && (
                    <div className="text-xs text-red-700 mt-1 font-medium">
                      Check error messages above
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {notifications.filter(n => n.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                  {notifications.filter(n => n.status === 'pending').length > 0 && (
                    <div className="text-xs text-yellow-700 mt-1 font-medium">
                      Being processed
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {notifications.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lesson_completed">Lesson Completed</SelectItem>
              <SelectItem value="lesson_reminder">Lesson Reminder</SelectItem>
              <SelectItem value="quiz_high_score">Quiz High Score</SelectItem>
              <SelectItem value="track_milestone">Track Milestone</SelectItem>
              <SelectItem value="system_alert">System Alert</SelectItem>
              <SelectItem value="task_due">Task Due</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="course_completion">Course Completion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No notifications match your filters.' 
                : 'No email notifications have been sent yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium">Notification</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Recipient</th>
                    <th className="text-left p-4 font-medium">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="text-left">
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-left">
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                          style={getTypeStyle(notification.type)}
                        >
                          {notification.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(notification.status)}
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                            style={getStatusStyle(notification.status)}
                          >
                            {notification.status}
                          </span>
                        </div>
                        {notification.status === 'failed' && notification.error_message && (
                          <div className="text-xs text-red-600 mt-1">
                            {notification.error_message}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{notification.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {notification.sent_at ? (
                              formatDate(notification.sent_at)
                            ) : (
                              <span className="text-muted-foreground">Not sent</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
