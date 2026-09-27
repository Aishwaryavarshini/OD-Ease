import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFunc() {
  console.log('Testing rls_auto_enable...');
  const res1 = await supabase.rpc('rls_auto_enable');
  console.log('rls_auto_enable result:', res1);

  // Test other common setup RPCs
  const funcNames = ['exec_sql', 'execute_sql', 'run_sql', 'setup_schema', 'create_tables', 'migrate'];
  for (const fn of funcNames) {
    const res = await supabase.rpc(fn, { sql: 'SELECT 1' });
    if (!res.error || !res.error.message.includes('Could not find')) {
      console.log(`RPC function "${fn}" result:`, res);
    }
  }
}

testFunc();
