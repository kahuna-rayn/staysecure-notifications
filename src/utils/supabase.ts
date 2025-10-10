import { createClient } from '@supabase/supabase-js';

// This should be configured by the consuming application
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key not found. Please configure your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to configure Supabase for the notification module
export const configureSupabase = (url: string, anonKey: string) => {
  return createClient(url, anonKey);
};
