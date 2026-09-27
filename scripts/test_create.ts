import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCreate() {
  console.log('Testing create table via RPC...');
  const { data: user, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'amudha.j@trp.srmtrichy.edu.in',
    password: 'password123'
  });

  console.log('LoggedIn:', user?.user?.email);

  // Try creating table via PostgREST if any RPC exists
  const rpcNames = ['exec', 'exec_sql', 'query', 'sql', 'create_table'];
  for (const name of rpcNames) {
    const res = await supabase.rpc(name, { query: 'CREATE TABLE IF NOT EXISTS public.od_applications (id TEXT PRIMARY KEY);' });
    console.log(`RPC ${name}:`, res);
  }
}

testCreate();
