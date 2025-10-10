import { createClient } from '@supabase/supabase-js';

// This should be configured by the consuming application
// Don't auto-create supabase client - let consuming app provide it
export const supabase = null;

// Helper function to configure Supabase for the notification module
export const configureSupabase = (url: string, anonKey: string) => {
  return createClient(url, anonKey);
};
