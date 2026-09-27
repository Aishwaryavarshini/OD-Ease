import pg from 'pg';

const { Client } = pg;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudnZseXBrcnF2ZGVwa3did2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzNDE5OCwiZXhwIjoyMTA1NzEwMTk4fQ.VsRYkc7MwcDmnw9mjZi1mjii9nkN5aGJMRvspmTE7gg';

async function testPgServiceKey() {
  const configs = [
    { host: 'db.envvlypkrqvdepkwbwfi.supabase.co', port: 5432, user: 'postgres', password: serviceRoleKey },
    { host: 'db.envvlypkrqvdepkwbwfi.supabase.co', port: 6543, user: 'postgres.envvlypkrqvdepkwbwfi', password: serviceRoleKey },
    { host: 'db.envvlypkrqvdepkwbwfi.supabase.co', port: 5432, user: 'service_role', password: serviceRoleKey },
    { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 6543, user: 'postgres.envvlypkrqvdepkwbwfi', password: serviceRoleKey },
    { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432, user: 'postgres.envvlypkrqvdepkwbwfi', password: serviceRoleKey },
  ];

  for (const cfg of configs) {
    const client = new Client({
      ...cfg,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000,
    });
    try {
      await client.connect();
      console.log(`\n==================================================`);
      console.log(`CONNECTED SUCCESS TO POSTGRES!`, cfg);
      console.log(`==================================================\n`);
      await client.end();
      return;
    } catch (e: any) {
      console.log(`Failed config ${cfg.host}:${cfg.port} user="${cfg.user}":`, e.message);
    }
  }
}

testPgServiceKey();
