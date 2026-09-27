import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudnZseXBrcnF2ZGVwa3did2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzNDE5OCwiZXhwIjoyMTA1NzEwMTk4fQ.VsRYkc7MwcDmnw9mjZi1mjii9nkN5aGJMRvspmTE7gg';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runTest() {
  console.log('1. Checking auth users list via admin API...');
  const { data: usersData, error: uErr } = await supabaseAdmin.auth.admin.listUsers();
  console.log('Users count:', usersData?.users?.length, 'Error:', uErr?.message);

  console.log('2. Listing storage buckets...');
  const { data: buckets, error: bErr } = await supabaseAdmin.storage.listBuckets();
  console.log('Buckets:', buckets, 'Error:', bErr?.message);

  console.log('3. Checking if od_applications table exists...');
  const { data: odData, error: odErr } = await supabaseAdmin.from('od_applications').select('*').limit(1);
  console.log('od_applications check:', { odData, odErr });

  console.log('4. Checking if master_students table exists...');
  const { data: msData, error: msErr } = await supabaseAdmin.from('master_students').select('*').limit(1);
  console.log('master_students check:', { msData, msErr });

  console.log('5. Checking if master_staff table exists...');
  const { data: stData, error: stErr } = await supabaseAdmin.from('master_staff').select('*').limit(1);
  console.log('master_staff check:', { stData, stErr });
}

runTest();
