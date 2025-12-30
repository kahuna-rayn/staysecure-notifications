import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  Copy,
  Send,
  Mail,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { emailService } from '../lib/emailService';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject_template: string;
  html_body_template: string;
  text_body_template?: string | null;
  variables?: any;
  is_system: boolean;
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
  isSuperAdmin?: boolean;
  gatherTemplateVariables?: (supabase: any, eventType: string, context: any, templateText?: string) => Promise<Record<string, unknown>>;
  toast?: (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void;
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
  PopoverTrigger,
  isSuperAdmin = false,
  gatherTemplateVariables,
  toast
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
  const [isCreating, setIsCreating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ open: false, type: 'success', message: '' });
  const [previewVariables, setPreviewVariables] = useState<Record<string, unknown> | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Add CSS animation keyframes
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

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

  const handleView = async (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsViewing(true);
    setLoadingPreview(true);
    
    // Always use gatherTemplateVariables to get real data from database
    if (!gatherTemplateVariables) {
      console.error('gatherTemplateVariables is required for preview');
      setLoadingPreview(false);
      return;
    }
    
    try {
      // Query for sample data to use as context - using real data from database
      const { data: sampleUser } = await supabaseClient
        .from('profiles')
        .select('id')
        .limit(1)
        .single();
      
      if (!sampleUser) {
        console.error('No user found for preview');
        setLoadingPreview(false);
        return;
      }
      
      const context: any = { user_id: sampleUser.id };
      
      // Try to get sample lesson_id for lesson-related templates
      if (template.type === 'lesson_completed' || template.type === 'quiz_high_score' || template.type === 'lesson_reminder') {
        const { data: sampleLesson } = await supabaseClient
          .from('lessons')
          .select('id')
          .limit(1)
          .single();
        if (sampleLesson) context.lesson_id = sampleLesson.id;
      }
      
      // Try to get sample learning_track_id for track-related templates
      if (template.type.includes('track_milestone') || template.type === 'lesson_completed') {
        const { data: sampleTrack } = await supabaseClient
          .from('learning_tracks')
          .select('id')
          .limit(1)
          .single();
        if (sampleTrack) context.learning_track_id = sampleTrack.id;
      }
      
      // For manager_employee_incomplete, use current user as manager
      if (template.type === 'manager_employee_incomplete') {
        context.manager_id = sampleUser.id;
      }
      
      // Add score for quiz templates
      if (template.type === 'quiz_high_score') {
        context.score = 95;
      }
      
      // Use gatherTemplateVariables to get real variables from database
      // Pass template HTML body to look up any missing variables from template_variables table
      const templateBody = template.html_body_template || '';
      const variables = await gatherTemplateVariables(supabaseClient, template.type, context, templateBody);
      setPreviewVariables(variables);
    } catch (error) {
      console.error('Error gathering preview variables:', error);
      setPreviewVariables(null);
    } finally {
      setLoadingPreview(false);
    }
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
          subject_template: template.subject_template,
          html_body_template: template.html_body_template,
          text_body_template: template.text_body_template,
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
      setSendingEmail(template.id);
      
      // Get current user's email for testing
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user?.email) {
        setEmailDialog({
          open: true,
          type: 'error',
          message: 'No user email found for testing'
        });
        return;
      }

      // Use gatherTemplateVariables to get real data from database
      // gatherTemplateVariables is required - no fallback to hardcoded values
      if (!gatherTemplateVariables) {
        setEmailDialog({
          open: true,
          type: 'error',
          message: 'gatherTemplateVariables is required for test emails'
        });
        setSendingEmail(null);
        return;
      }
      
      const context: any = { user_id: user.id };
      
      // Try to get sample lesson_id for lesson-related templates
      if (template.type === 'lesson_completed' || template.type === 'quiz_high_score' || template.type === 'lesson_reminder') {
        const { data: sampleLesson } = await supabaseClient
          .from('lessons')
          .select('id')
          .limit(1)
          .single();
        if (sampleLesson) context.lesson_id = sampleLesson.id;
      }
      
      // Try to get sample learning_track_id for track-related templates
      if (template.type.includes('track_milestone') || template.type === 'lesson_completed') {
        const { data: sampleTrack } = await supabaseClient
          .from('learning_tracks')
          .select('id')
          .limit(1)
          .single();
        if (sampleTrack) context.learning_track_id = sampleTrack.id;
      }
      
      // For manager_employee_incomplete, use current user as manager
      if (template.type === 'manager_employee_incomplete') {
        context.manager_id = user.id;
      }
      
      // Add score for quiz templates
      if (template.type === 'quiz_high_score') {
        context.score = 95;
      }
      
      // Pass template HTML body to look up any missing variables from template_variables table
      const templateBody = template.html_body_template || '';
      const templateVariables = await gatherTemplateVariables(supabaseClient, template.type, context, templateBody);
      
      // Create a notification record first to track the test email
      const { data: notificationData, error: notificationError } = await supabaseClient
        .from('notification_history')
        .insert({
          user_id: user.id,
          email_template_id: template.id, // Include the template ID!
          trigger_event: template.type,
          template_variables: templateVariables,
          status: 'pending',
          channel: 'email',
          priority: 'normal'
        })
        .select('id')
        .single();

      if (notificationError) {
        console.error('Failed to create notification record:', notificationError);
        // Continue without notification tracking
      }
      
      // Use the EmailService to send test email with the actual template data
      const { emailService } = await import('../lib/emailService');
      const service = emailService;
      
      // Use the actual template data instead of looking it up by type
      const result = await service.sendEmailWithTemplate(
        template.subject_template,
        template.html_body_template,
        template.text_body_template || '',
        user.email,
        templateVariables,
        supabaseClient,
        notificationData?.id // Pass notification ID for status tracking
      );

      if (result.success) {
        setEmailDialog({
          open: true,
          type: 'success',
          message: `Test email for "${template.name}" sent successfully to ${user.email}`
        });
      } else {
        setEmailDialog({
          open: true,
          type: 'error',
          message: `Failed to send test email for "${template.name}": ${result.error}`
        });
      }
    } catch (err: any) {
      setEmailDialog({
        open: true,
        type: 'error',
        message: `Error sending test email for "${template.name}": ${err.message}`
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const handleCreate = () => {
    setSelectedTemplate({
      id: '',
      name: '',
      type: '',
      subject_template: '',
      html_body_template: '',
      text_body_template: '',
      is_system: false,
      is_active: true,
      created_at: new Date().toISOString()
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      const templateData = {
        name: selectedTemplate.name,
        type: selectedTemplate.type,
        subject_template: selectedTemplate.subject_template,
        html_body_template: selectedTemplate.html_body_template,
        text_body_template: selectedTemplate.text_body_template,
        is_system: selectedTemplate.is_system,
        is_active: selectedTemplate.is_active
      };

      if (isCreating) {
        // Create new template
        const { error } = await supabaseClient
          .from('email_templates')
          .insert(templateData);
        
        if (error) throw error;
        if (toast) {
          toast({ title: 'Template created successfully' });
        } else {
          alert('Template created successfully');
        }
      } else {
        // Update existing template
        const { error } = await supabaseClient
          .from('email_templates')
          .update(templateData)
          .eq('id', selectedTemplate.id);
        
        if (error) throw error;
        if (toast) {
          toast({ title: 'Template updated successfully' });
        } else {
          alert('Template updated successfully');
        }
      }

      setIsEditing(false);
      setIsCreating(false);
      setSelectedTemplate(null);
      loadTemplates();
    } catch (err: any) {
      if (toast) {
        toast({ 
          title: 'Error saving template', 
          description: err.message,
          variant: 'destructive' 
        });
      } else {
        alert(`Error saving template: ${err.message}`);
      }
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject_template.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        {isSuperAdmin ? (
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Template creation requires Super Admin access
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
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
                    <th className="text-left p-4 font-medium">Created</th>
                    <th className="text-left p-4 font-medium">Updated</th>
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
                            {template.subject_template}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getTypeColor(template.type)}>
                          {template.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(template.created_at)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {template.updated_at ? formatDate(template.updated_at) : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
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
                            onClick={() => handleView(template)}
                            title="View Template"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicate(template)}
                            title="Duplicate Template"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendTest(template)}
                            title="Send Test Email"
                            disabled={sendingEmail === template.id}
                          >
                            {sendingEmail === template.id ? (
                              <Loader2 
                                className="h-4 w-4" 
                                style={{ 
                                  animation: 'spin 1s linear infinite',
                                  transformOrigin: 'center'
                                }}
                              />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                          {!template.is_system && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(template)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Template"
                              style={{ backgroundColor: 'orange', color: 'white' }}
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
          setIsCreating(false);
          setSelectedTemplate(null);
        }}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreating ? 'Create Template' : isEditing ? 'Edit Template' : 'Email Preview'}: {selectedTemplate.name || 'New Template'}
              </DialogTitle>
            </DialogHeader>
            {isViewing ? (
              /* Email Preview Mode */
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-white">
                  <div className="border-b pb-2 mb-4">
                    <h3 className="font-semibold text-gray-700">Email Preview</h3>
                    <p className="text-sm text-gray-500">How this email will appear to recipients</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Subject:</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">
                        {loadingPreview ? (
                          'Loading preview...'
                        ) : previewVariables ? (
                          // Use real variables from database via gatherTemplateVariables
                          emailService.substituteVariables(selectedTemplate.subject_template, previewVariables)
                        ) : (
                          'Error loading preview variables'
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email Body:</Label>
                      <div className="mt-1 border rounded bg-white max-h-96 overflow-y-auto">
                        <div 
                          className="p-4 prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: loadingPreview ? (
                              '<div>Loading preview...</div>'
                            ) : previewVariables ? (
                              (() => {
                                // Debug: log what we're passing to substituteVariables
                                console.log('Preview - calling substituteVariables with:', {
                                  template: selectedTemplate.html_body_template.substring(0, 200) + '...',
                                  variables: {
                                    ...previewVariables,
                                    incomplete_lessons: Array.isArray(previewVariables.incomplete_lessons) 
                                      ? `Array(${previewVariables.incomplete_lessons.length})` 
                                      : previewVariables.incomplete_lessons
                                  }
                                });
                                const result = emailService.substituteVariables(selectedTemplate.html_body_template, previewVariables);
                                console.log('Preview - substituteVariables result:', result.substring(0, 500) + '...');
                                return result;
                              })()
                            ) : (
                              '<div>Error loading preview variables</div>'
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => {
                    setIsViewing(false);
                    setSelectedTemplate(null);
                    setPreviewVariables(null);
                  }}>
                    Close Preview
                  </Button>
                </div>
              </div>
            ) : (
              /* Edit/Create Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={selectedTemplate.name}
                      disabled={!isEditing || selectedTemplate.is_system}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTemplate({
                        ...selectedTemplate,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Template Type</Label>
                    <Input
                      id="type"
                      value={selectedTemplate.type}
                      disabled={!isEditing || selectedTemplate.is_system}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTemplate({
                        ...selectedTemplate,
                        type: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={selectedTemplate.subject_template}
                    disabled={!isEditing}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTemplate({
                      ...selectedTemplate,
                      subject_template: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="content">HTML Content</Label>
                  <Textarea
                    id="content"
                    value={selectedTemplate.html_body_template}
                    disabled={!isEditing}
                    rows={10}
                    className="font-mono text-sm"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSelectedTemplate({
                      ...selectedTemplate,
                      html_body_template: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="text-content">Text Content (Optional)</Label>
                  <Textarea
                    id="text-content"
                    value={selectedTemplate.text_body_template || ''}
                    disabled={!isEditing}
                    rows={5}
                    className="font-mono text-sm"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSelectedTemplate({
                      ...selectedTemplate,
                      text_body_template: e.target.value
                    })}
                  />
                </div>
                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                      setSelectedTemplate(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      {isCreating ? 'Create' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Email Send Result Dialog */}
      <Dialog open={emailDialog.open} onOpenChange={(open: boolean) => setEmailDialog({ ...emailDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {emailDialog.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {emailDialog.type === 'success' ? 'Email Sent Successfully' : 'Email Send Failed'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">{emailDialog.message}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setEmailDialog({ ...emailDialog, open: false })}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
