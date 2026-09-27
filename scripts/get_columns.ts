import fetch from 'node-fetch';

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudnZseXBrcnF2ZGVwa3did2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzNDE5OCwiZXhwIjoyMTA1NzEwMTk4fQ.VsRYkc7MwcDmnw9mjZi1mjii9nkN5aGJMRvspmTE7gg';

async function getColumns(table: string) {
  const res = await fetch(
    `https://envvlypkrqvdepkwbwfi.supabase.co/rest/v1/${table}?limit=0`,
    {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Accept': 'application/openapi+json'
      }
    }
  );
  const rangeHeader = res.headers.get('content-range');
  const body = await res.text();
  console.log(`\n=== ${table} ===`);
  console.log('Status:', res.status);
  console.log('Range:', rangeHeader);

  // Get schema definition via OpenAPI
  const openApiRes = await fetch(
    `https://envvlypkrqvdepkwbwfi.supabase.co/rest/v1/`,
    {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Accept': 'application/json'
      }
    }
  );
  const openApi = await openApiRes.json() as any;
  const def = openApi?.definitions?.[table];
  if (def?.properties) {
    console.log(`Columns in "${table}":`, Object.keys(def.properties));
  } else {
    console.log('Could not get column list from OpenAPI spec.');
    console.log('Body snippet:', body.substring(0, 300));
  }
}

async function run() {
  await getColumns('od_applications');
  await getColumns('master_students');
  await getColumns('master_staff');
}

run();
