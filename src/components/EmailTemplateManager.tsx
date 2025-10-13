import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  Copy,
  Mail
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject_template: string;
  html_body_template: string;
  text_body_template?: string | null;
  variables?: any;
  system: boolean;
  is_active?: boolean | null;
  created_at: string;
  updated_at?: string | null;
}

interface EmailTemplateManagerProps {
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
  Dialog: any;
  DialogContent: any;
  DialogHeader: any;
  DialogTitle: any;
  DialogTrigger: any;
  Textarea: any;
  Popover: any;
  PopoverContent: any;
  PopoverTrigger: any;
}

export default function EmailTemplateManager({
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
  AlertDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
  Popover,
  PopoverContent,
  PopoverTrigger
}: EmailTemplateManagerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  // Load templates
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleView = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsViewing(true);
  };

  const handleDelete = async (template: EmailTemplate) => {
    if (template.is_system) {
      alert('System templates cannot be deleted');
      return;
    }

    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        const { error } = await supabaseClient
          .from('email_templates')
          .delete()
          .eq('id', template.id);

        if (error) throw error;
        loadTemplates();
      } catch (err: any) {
        alert(`Error deleting template: ${err.message}`);
      }
    }
  };

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      const { error } = await supabaseClient
        .from('email_templates')
        .insert({
          name: `${template.name} (Copy)`,
          type: template.type,
          subject: template.subject,
          content: template.content,
          is_system: false
        });

      if (error) throw error;
      loadTemplates();
    } catch (err: any) {
      alert(`Error duplicating template: ${err.message}`);
    }
  };

  const handleSendTest = async (template: EmailTemplate) => {
    try {
      // Get current user's email for testing
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user?.email) {
        alert('No user email found for testing');
        return;
      }

      // Generate sample variables based on template type
      const sampleVariables = generateSampleVariables(template.type);
      
      // Use the EmailService to send test email
      const { EmailService } = await import('../lib/emailService');
      const service = new EmailService();
      
      const result = await service.sendEmailFromTemplate(
        template.type,
        user.email,
        sampleVariables,
        supabaseClient
      );

      if (result.success) {
        alert(`Test email sent successfully to ${user.email}`);
      } else {
        alert(`Failed to send test email: ${result.error}`);
      }
    } catch (err: any) {
      alert(`Error sending test email: ${err.message}`);
    }
  };

  const generateSampleVariables = (templateType: string) => {
    const baseVariables = {
      user_name: 'John Doe',
      lesson_title: 'Introduction to Cybersecurity',
      learning_track_title: 'Cybersecurity Fundamentals',
      lesson_description: 'Learn the basics of cybersecurity and how to protect digital assets.',
      completion_date: new Date().toLocaleDateString('en-US'),
      completion_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      available_date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      reminder_type: 'Available Now',
      lesson_url: 'http://localhost:8080/#/lesson/sample-lesson-id'
    };

    switch (templateType) {
      case 'lesson_completed':
        return {
          ...baseVariables,
          lessons_completed_in_track: 5,
          total_lessons_in_track: 10,
          track_progress_percentage: 50,
          next_lesson_title: 'Advanced Security Concepts',
          next_lesson_available: true,
          next_lesson_url: 'http://localhost:8080/#/lesson/next-lesson-id'
        };
      case 'track_milestone_50':
        return {
          ...baseVariables,
          milestone_percentage: 50,
          lessons_completed: 5,
          total_lessons: 10,
          time_spent_hours: 12,
          continue_learning_url: 'http://localhost:8080/#/dashboard'
        };
      case 'quiz_high_score':
        return {
          ...baseVariables,
          quiz_title: 'Cybersecurity Basics Quiz',
          score: 95,
          correct_answers: 19,
          total_questions: 20,
          view_results_url: 'http://localhost:8080/#/quiz/results',
          continue_learning_url: 'http://localhost:8080/#/dashboard'
        };
      case 'lesson_reminder':
        return {
          ...baseVariables,
          lesson_description: 'Learn the basics of cybersecurity and how to protect digital assets.',
          reminder_type: 'Available Now'
        };
      default:
        return baseVariables;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'system' && template.is_system) ||
      (statusFilter === 'custom' && !template.is_system);
    
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson_completed': return 'bg-green-100 text-green-800';
      case 'track_milestone': return 'bg-blue-100 text-blue-800';
      case 'quiz_high_score': return 'bg-purple-100 text-purple-800';
      case 'lesson_reminder': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4">
        <AlertDescription>Error loading templates: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-learning-primary">Email Template Management</h2>
          <p className="text-muted-foreground">Create and manage email templates</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-learning-primary hover:bg-learning-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
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
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
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

      {/* Templates List */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'No templates match your search.' : 'Create your first email template to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Template</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Created</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="text-left">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {template.subject}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getTypeColor(template.type)}>
                          {template.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Published</Badge>
                          {template.is_system && (
                            <Badge variant="outline">System</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(template.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(template)}
                            title="View Template"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(template)}
                            title="Edit Template"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendTest(template)}
                            title="Send Test Email"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicate(template)}
                            title="Duplicate Template"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {!template.is_system && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(template)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Template"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Edit/View Dialog */}
      {(isEditing || isViewing) && selectedTemplate && (
        <Dialog open={isEditing || isViewing} onOpenChange={() => {
          setIsEditing(false);
          setIsViewing(false);
          setSelectedTemplate(null);
        }}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Template' : 'View Template'}: {selectedTemplate.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={selectedTemplate.name}
                    disabled={!isEditing || selectedTemplate.is_system}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Template Type</Label>
                  <Input
                    id="type"
                    value={selectedTemplate.type}
                    disabled={!isEditing || selectedTemplate.is_system}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={selectedTemplate.subject}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={selectedTemplate.content}
                  disabled={!isEditing}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setSelectedTemplate(null);
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // TODO: Implement save functionality
                    setIsEditing(false);
                    setSelectedTemplate(null);
                  }}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
