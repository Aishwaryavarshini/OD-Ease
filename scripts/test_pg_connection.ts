import pg from 'pg';

const { Client } = pg;

async function tryConnect(password: string, port: number = 5432, user: string = 'postgres') {
  const client = new Client({
    host: 'db.envvlypkrqvdepkwbwfi.supabase.co',
    port: port,
    user: user,
    password: password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log(`SUCCESS! Connected with user: "${user}", password: "${password}", port: ${port}`);
    const res = await client.query('SELECT current_database(), current_user;');
    console.log('QueryResult:', res.rows);
    await client.end();
    return true;
  } catch (err: any) {
    console.log(`Failed user="${user}" pwd="${password}" port=${port}:`, err.message);
    return false;
  }
}

async function run() {
  const passwords = [
    'password123',
    'postgres',
    'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT',
    'envvlypkrqvdepkwbwfi',
    'TRPEngineeringCollege2026',
    'ODFlow2026',
    'admin123',
    'Password123!',
    'password123!'
  ];

  const users = ['postgres', 'postgres.envvlypkrqvdepkwbwfi'];

  for (const u of users) {
    for (const p of passwords) {
      const ok = await tryConnect(p, 5432, u);
      if (ok) return;
      const ok6543 = await tryConnect(p, 6543, u);
      if (ok6543) return;
    }
  }
}

run();
