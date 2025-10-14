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
      const { data, error } = await supabaseClient
        .from('email_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Show last 100 notifications

      if (error) throw error;
      setNotifications(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson_completed': return 'bg-green-100 text-green-800';
      case 'lesson_reminder': return 'bg-orange-100 text-orange-800';
      case 'quiz_high_score': return 'bg-purple-100 text-purple-800';
      case 'track_milestone': return 'bg-blue-100 text-blue-800';
      case 'system_alert': return 'bg-red-100 text-red-800';
      case 'task_due': return 'bg-yellow-100 text-yellow-800';
      case 'achievement': return 'bg-pink-100 text-pink-800';
      case 'course_completion': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      <td className="p-4">
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(notification.status)}
                          <Badge className={getStatusColor(notification.status)}>
                            {notification.status}
                          </Badge>
                        </div>
                        {notification.status === 'failed' && notification.error_message && (
                          <div className="text-xs text-red-600 mt-1">
                            {notification.error_message}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{notification.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div>{formatDate(notification.created_at)}</div>
                            {notification.sent_at && notification.sent_at !== notification.created_at && (
                              <div className="text-xs text-muted-foreground">
                                Sent: {formatDate(notification.sent_at)}
                              </div>
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

      {/* Summary Stats */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {notifications.filter(n => n.status === 'failed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {notifications.filter(n => n.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
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
    </div>
  );
}
