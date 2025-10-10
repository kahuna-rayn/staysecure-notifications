import React from 'react';
import { LessonReminderSettings } from './LessonReminderSettings';

// This wrapper is meant to be used in the consuming app
// The consuming app should create its own wrapper that imports
// its UI components and Supabase client

interface LessonReminderSettingsWrapperProps {
  supabase: any;
  Card: any;
  CardHeader: any;
  CardTitle: any;
  CardDescription: any;
  CardContent: any;
  Button: any;
  Switch: any;
  Input: any;
  Label: any;
  Alert: any;
  AlertDescription: any;
  baseUrl?: string;
  clientPath?: string;
}

export const LessonReminderSettingsWrapper: React.FC<LessonReminderSettingsWrapperProps> = ({
  supabase,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Switch,
  Input,
  Label,
  Alert,
  AlertDescription,
  baseUrl,
  clientPath,
}) => {
  return (
    <LessonReminderSettings
      supabase={supabase}
      Card={Card}
      CardHeader={CardHeader}
      CardTitle={CardTitle}
      CardDescription={CardDescription}
      CardContent={CardContent}
      Button={Button}
      Switch={Switch}
      Input={Input}
      Label={Label}
      Alert={Alert}
      AlertDescription={AlertDescription}
      baseUrl={baseUrl}
      clientPath={clientPath}
    />
  );
};

export default LessonReminderSettingsWrapper;
