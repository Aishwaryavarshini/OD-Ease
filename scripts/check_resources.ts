import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkResources() {
  console.log('1. Checking storage buckets...');
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  console.log('Buckets:', { buckets, bErr });

  console.log('2. Checking auth session...');
  const { data: loginData, error: lErr } = await supabase.auth.signInWithPassword({
    email: 'amudha.j@trp.srmtrichy.edu.in',
    password: 'password123'
  });
  console.log('Auth login:', { user: loginData.user?.email, lErr });

  if (loginData.session) {
    console.log('3. Trying to fetch buckets as logged-in user...');
    const { data: userBuckets, error: ubErr } = await supabase.storage.listBuckets();
    console.log('User Buckets:', { userBuckets, ubErr });
  }
}

checkResources();
