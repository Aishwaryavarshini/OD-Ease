import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  console.log('Testing Supabase Storage buckets...');
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.error('Bucket list error:', bErr);
  } else {
    console.log('Buckets:', buckets);
  }

  // Try creating or accessing bucket 'od_data'
  const { data: files, error: fErr } = await supabase.storage.from('od_data').list();
  if (fErr) {
    console.log('Bucket "od_data" error:', fErr.message);
  } else {
    console.log('Bucket "od_data" files:', files);
  }
}

testStorage();
