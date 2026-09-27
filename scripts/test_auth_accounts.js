import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseAnonKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  const emails = [
    'bharanidharan.r@trp.srmtrichy.edu.in',
    'amudha.j@trp.srmtrichy.edu.in'
  ];

  for (const email of emails) {
    console.log(`\nTesting login for: ${email}`);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123',
    });

    if (signInError) {
      console.log(`SignIn error for ${email}:`, signInError.message);

      // Attempt signUp to create account with password123 if not created
      console.log(`Attempting signUp for ${email}...`);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'password123',
      });

      if (signUpError) {
        console.log(`SignUp error for ${email}:`, signUpError.message);
      } else {
        console.log(`SignUp result for ${email}: User ID = ${signUpData.user?.id}, Session = ${!!signUpData.session}`);
      }
    } else {
      console.log(`SignIn SUCCESS for ${email}! User ID = ${signInData.user?.id}`);
    }
  }
}

testAuth();
