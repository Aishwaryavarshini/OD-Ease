import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function probeTables() {
  const tableNames = ['applications', 'od_applications', 'od_requests', 'odflow_apps', 'odflow_applications', 'od_forms'];
  for (const name of tableNames) {
    const { data, error } = await supabase.from(name).select('*').limit(1);
    if (!error) {
      console.log(`FOUND TABLE: "${name}"! Data:`, data);
    } else {
      console.log(`Table "${name}":`, error.message);
    }
  }
}

probeTables();
