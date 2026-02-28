import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseEnabled } from './env.js';

export const supabase = isSupabaseEnabled
  ? createClient(env.supabaseUrl, env.supabaseServiceRole, {
      auth: { persistSession: false }
    })
  : null;
