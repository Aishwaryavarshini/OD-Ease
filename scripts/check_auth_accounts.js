import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseAnonKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStatus() {
  const emails = ['bharanidharan.r@trp.srmtrichy.edu.in', 'amudha.j@trp.srmtrichy.edu.in'];

  for (const email of emails) {
    console.log(`\nChecking login for ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123',
    });

    if (error) {
      console.log(`Sign-in failed for ${email}:`, error.message);
    } else {
      console.log(`SUCCESS! Logged in as ${email}, User ID: ${data.user.id}`);
    }
  }
}

checkStatus();
