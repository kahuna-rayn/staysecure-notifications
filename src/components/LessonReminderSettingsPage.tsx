import React from 'react';
import { LessonReminderSettings } from './LessonReminderSettings';

// This component is designed to work in any consuming app
// It requires the consuming app to pass UI components and Supabase client
interface LessonReminderSettingsPageProps {
  // Required: Supabase client
  supabaseClient: any;
  // Required: UI components from the consuming app
  uiComponents: {
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
    Badge?: any;
    Select?: any;
    SelectContent?: any;
    SelectItem?: any;
    SelectTrigger?: any;
    SelectValue?: any;
    Separator?: any;
    Tabs?: any;
    TabsContent?: any;
    TabsList?: any;
    TabsTrigger?: any;
  };
}

export const LessonReminderSettingsPage: React.FC<LessonReminderSettingsPageProps> = ({
  supabaseClient,
  uiComponents
}) => {
  return (
    <LessonReminderSettings
      supabase={supabaseClient}
      Card={uiComponents.Card}
      CardHeader={uiComponents.CardHeader}
      CardTitle={uiComponents.CardTitle}
      CardDescription={uiComponents.CardDescription}
      CardContent={uiComponents.CardContent}
      Button={uiComponents.Button}
      Switch={uiComponents.Switch}
      Input={uiComponents.Input}
      Label={uiComponents.Label}
      Alert={uiComponents.Alert}
      AlertDescription={uiComponents.AlertDescription}
      Badge={uiComponents.Badge}
      Select={uiComponents.Select}
      SelectContent={uiComponents.SelectContent}
      SelectItem={uiComponents.SelectItem}
      SelectTrigger={uiComponents.SelectTrigger}
      SelectValue={uiComponents.SelectValue}
      Separator={uiComponents.Separator}
      Tabs={uiComponents.Tabs}
      TabsContent={uiComponents.TabsContent}
      TabsList={uiComponents.TabsList}
      TabsTrigger={uiComponents.TabsTrigger}
    />
  );
};

export default LessonReminderSettingsPage;