import fetch from 'node-fetch';

async function testManagementAPI() {
  const res = await fetch('https://api.supabase.com/v1/projects/envvlypkrqvdepkwbwfi', {
    headers: {
      'Authorization': 'Bearer sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT'
    }
  });

  console.log('Management API status:', res.status);
  const text = await res.text();
  console.log('Management API body:', text.substring(0, 300));
}

testManagementAPI();
