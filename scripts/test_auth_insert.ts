import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthRPC() {
  console.log('Logging in as amudha.j@trp.srmtrichy.edu.in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'amudha.j@trp.srmtrichy.edu.in',
    password: 'password123'
  });

  if (authError) {
    console.error('Auth login failed:', authError.message);
    return;
  }

  console.log('Logged in! User ID:', authData.user.id);

  // Test inserting into od_applications
  const { data: insData, error: insErr } = await supabase.from('od_applications').insert([{
    id: 'test-123',
    studentId: 'TEST',
    studentName: 'Test Student'
  }]);

  console.log('Insert result:', { insData, insErr });
}

testAuthRPC();
