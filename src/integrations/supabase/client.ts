// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pueymnezdauvxlptdepj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZXltbmV6ZGF1dnhscHRkZXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDA5OTQsImV4cCI6MjA2NzExNjk5NH0.CLbn5nseQYYRAT0jNQo5BduafcQbvylp7ShIPrhwy3c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});