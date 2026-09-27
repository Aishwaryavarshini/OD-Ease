import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabasePublishableKey = metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

