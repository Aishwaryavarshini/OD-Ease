import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorageObjects() {
  console.log('Testing storage.objects access...');
  const { data, error } = await supabase.from('objects').select('*').limit(5);
  if (error) {
    console.log('Error querying objects:', error.message);
  } else {
    console.log('Found storage objects:', data);
  }
}

testStorageObjects();
