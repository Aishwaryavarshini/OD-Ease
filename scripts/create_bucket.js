import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  console.log('Creating bucket "od_applications"...');
  const { data, error } = await supabase.storage.createBucket('od_applications', {
    public: true,
    fileSizeLimit: 52428800,
  });

  if (error) {
    console.error('Bucket creation error:', error.message);
  } else {
    console.log('Bucket created successfully:', data);
  }
}

createBucket();
