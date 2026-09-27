import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDB() {
  console.log('Testing connection to Supabase od_applications table...');
  const { data, error } = await supabase.from('od_applications').select('*');
  if (error) {
    console.error('Supabase DB fetch error:', error);
  } else {
    console.log('Successfully connected to od_applications table! Found records:', data?.length);
    console.log('Records:', data);
  }
}

testDB();
