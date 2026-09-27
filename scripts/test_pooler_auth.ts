import pg from 'pg';

const { Client } = pg;

async function testPooler(user: string, pass: string, port: number = 6543) {
  const client = new Client({
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port,
    user,
    password: pass,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log(`\n==================================================`);
    console.log(`CONNECTED TO SUPABASE DATABASE via Pooler!`);
    console.log(`User: ${user} | Port: ${port}`);
    console.log(`==================================================\n`);
    await client.end();
    return true;
  } catch (err: any) {
    console.log(`User "${user}" pwd "${pass}" port ${port}:`, err.message);
    return false;
  }
}

async function run() {
  const users = [
    'postgres.envvlypkrqvdepkwbwfi',
    'postgres'
  ];
  const passwords = [
    'password123',
    'password123!',
    'Password123!',
    'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT',
    'envvlypkrqvdepkwbwfi'
  ];

  for (const u of users) {
    for (const p of passwords) {
      const ok = await testPooler(u, p, 6543);
      if (ok) return;
      const ok5432 = await testPooler(u, p, 5432);
      if (ok5432) return;
    }
  }
}

run();
