import React, { useEffect } from 'react';
import { EmailNotifications } from './EmailNotifications';
import { supabase } from '@/integrations/supabase/client';
// useAuth should be passed as a prop from the consuming app

// Import UI components from LEARN app
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EmailNotificationsWrapperProps {
  useAuth: () => { user: any };
}

export const EmailNotificationsWrapper: React.FC<EmailNotificationsWrapperProps> = ({ useAuth }) => {
  const { user } = useAuth();

  // Get the current user profile for RLS policies
  const [userProfile, setUserProfile] = React.useState<any>(null);
  
  useEffect(() => {
    const getProfile = async () => {
      if (user?.id) {
        // Get Supabase auth user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserProfile(data);
        }
      }
    };
    getProfile();
  }, [user]);

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please log in to access email notifications.</p>
      </div>
    );
  }

  return (
    <EmailNotifications
      supabase={supabase}
      user={{ 
        id: userProfile?.id || user?.id,
        email: user?.email || userProfile?.email
      }}
      awsConfig={{
        lambdaUrl: import.meta.env.VITE_LAMBDA_URL || '',
        fromEmail: import.meta.env.VITE_SES_FROM_EMAIL || 'kahuna@raynsecure.com',
      }}
      Button={Button}
      Card={Card}
      CardContent={CardContent}
      CardDescription={CardDescription}
      CardHeader={CardHeader}
      CardTitle={CardTitle}
      Input={Input}
      Label={Label}
      Switch={Switch}
      Select={Select}
      SelectContent={SelectContent}
      SelectItem={SelectItem}
      SelectTrigger={SelectTrigger}
      SelectValue={SelectValue}
      Textarea={Textarea}
    />
  );
};
