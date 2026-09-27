import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://envvlypkrqvdepkwbwfi.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!serviceRoleKey) {
  console.log('SUPABASE_SERVICE_ROLE_KEY environment variable is not defined.');
  console.log('Attempting password update using Supabase Auth Client...');
}

const targetAccounts = [
  { email: 'bharanidharan.r@trp.srmtrichy.edu.in', role: 'ODIncharge' },
  { email: 'amudha.j@trp.srmtrichy.edu.in', role: 'HOD' },
];

async function runPasswordUpdate() {
  if (serviceRoleKey) {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log('Listing users using Supabase Auth Admin...');
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('Error listing users:', error.message);
      return;
    }

    const users = data.users || [];
    for (const acc of targetAccounts) {
      const existing = users.find(u => u.email && u.email.toLowerCase() === acc.email.toLowerCase());
      if (existing) {
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password: 'password123',
        });
        if (updateErr) {
          console.error(`Error updating password for ${acc.email}:`, updateErr.message);
        } else {
          console.log(`[SUCCESS] Password updated to password123 for ${acc.email} (ID: ${existing.id})`);
        }
      } else {
        console.log(`User ${acc.email} not found. Creating account...`);
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: acc.email,
          password: 'password123',
          email_confirm: true,
          user_metadata: { role: acc.role, department: 'EEE' },
        });
        if (createErr) {
          console.error(`Error creating user ${acc.email}:`, createErr.message);
        } else {
          console.log(`[SUCCESS] Account created and password set to password123 for ${acc.email} (ID: ${newUser.user.id})`);
        }
      }
    }
  } else {
    console.log('Using standard Auth Client for password update attempt...');
    const supabasePublic = createClient(supabaseUrl, 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT');
    for (const acc of targetAccounts) {
      const { error: signInErr } = await supabasePublic.auth.signInWithPassword({
        email: acc.email,
        password: 'password123',
      });
      if (!signInErr) {
        console.log(`[VERIFIED] User ${acc.email} can already sign in with password123!`);
      } else {
        console.log(`Sign-in test for ${acc.email}: ${signInErr.message}`);
      }
    }
  }
}

runPasswordUpdate();
