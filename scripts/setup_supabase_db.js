import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseAnonKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOrSetupTable() {
  console.log('Checking Supabase od_applications table...');
  const { data, error } = await supabase.from('od_applications').select('*').limit(1);

  if (error) {
    console.log('Table od_applications check result:', error.message);
    console.log('If table does not exist, run supabase_schema.sql in your Supabase SQL Editor.');
  } else {
    console.log('Table public.od_applications exists and is accessible! Found rows:', data?.length);
  }
}

checkOrSetupTable();
