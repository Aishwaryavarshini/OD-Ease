import fetch from 'node-fetch';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

async function fetchSchema() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });
    const data = await res.json();
    console.log('Definitions/Tables in OpenAPI spec:', Object.keys(data.definitions || {}));
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
}

fetchSchema();
