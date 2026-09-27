import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSystemTables() {
  const { data, error } = await supabase.rpc('get_tables');
  console.log('rpc get_tables:', { data, error });
}

checkSystemTables();
