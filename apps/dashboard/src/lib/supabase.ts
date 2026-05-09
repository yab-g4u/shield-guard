import { createClient } from '@supabase/supabase-js';

// Using the credentials provided by the user
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://oipmgjomseurmqeaylsc.supabase.co').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcG1nam9tc2V1cm1xZWF5bHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTYyMDAsImV4cCI6MjA5Mzg5MjIwMH0.EZ9qAt1G1E8OEZjahIoSn5yq0n2YcQrTTgqyeoh3iq8';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === '') {
  console.error('Supabase configuration missing or invalid. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
