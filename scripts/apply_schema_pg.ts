import pg from 'pg';

const { Client } = pg;

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudnZseXBrcnF2ZGVwa3did2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzNDE5OCwiZXhwIjoyMTA1NzEwMTk4fQ.VsRYkc7MwcDmnw9mjZi1mjii9nkN5aGJMRvspmTE7gg';

const schema = `
-- Create od_applications
CREATE TABLE IF NOT EXISTS public.od_applications (
  id TEXT PRIMARY KEY,
  studentId TEXT,
  studentName TEXT,
  registerNumber TEXT,
  department TEXT,
  year TEXT,
  mentorName TEXT,
  mentorEmail TEXT,
  studentEmail TEXT,
  fromDate TEXT,
  toDate TEXT,
  fromTime TEXT,
  toTime TEXT,
  event TEXT,
  venue TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Mentor Approval',
  isFullDay BOOLEAN DEFAULT true,
  isMultipleDays BOOLEAN DEFAULT false,
  approvals JSONB DEFAULT '{}'::jsonb,
  approvalHistory JSONB DEFAULT '[]'::jsonb,
  rejectionReason TEXT,
  directApproval BOOLEAN DEFAULT false,
  directApprovedBy TEXT,
  directApprovalTimestamp BIGINT,
  supportingDocumentName TEXT,
  supportingDocumentKey TEXT,
  supportingDocumentData TEXT,
  timestamp BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.od_applications ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'od_applications' AND policyname = 'Allow full access to od_applications'
  ) THEN
    CREATE POLICY "Allow full access to od_applications" ON public.od_applications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Create master_students
CREATE TABLE IF NOT EXISTS public.master_students (
  registerNumber TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT,
  year TEXT NOT NULL,
  department TEXT NOT NULL,
  mentorName TEXT NOT NULL,
  mentorEmail TEXT NOT NULL,
  ccName TEXT,
  ccEmail TEXT,
  coCcName TEXT,
  coCcEmail TEXT,
  studentEmail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.master_students ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'master_students' AND policyname = 'Allow full access to master_students'
  ) THEN
    CREATE POLICY "Allow full access to master_students" ON public.master_students FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Create master_staff
CREATE TABLE IF NOT EXISTS public.master_staff (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.master_staff ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'master_staff' AND policyname = 'Allow full access to master_staff'
  ) THEN
    CREATE POLICY "Allow full access to master_staff" ON public.master_staff FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

const strategies = [
  // Session mode (port 5432) with postgres user + service role JWT
  { host: 'db.envvlypkrqvdepkwbwfi.supabase.co', port: 5432, user: 'postgres', password: serviceRoleKey },
  // Transaction mode (port 6543) with project-ref user + service role JWT
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 6543, user: `postgres.envvlypkrqvdepkwbwfi`, password: serviceRoleKey },
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432, user: `postgres.envvlypkrqvdepkwbwfi`, password: serviceRoleKey },
  { host: 'aws-0-us-east-1.pooler.supabase.com', port: 6543, user: `postgres.envvlypkrqvdepkwbwfi`, password: serviceRoleKey },
  { host: 'aws-0-us-east-1.pooler.supabase.com', port: 5432, user: `postgres.envvlypkrqvdepkwbwfi`, password: serviceRoleKey },
];

async function tryExec(cfg: typeof strategies[0]) {
  const client = new Client({
    ...cfg,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    console.log(`\n✅ CONNECTED to ${cfg.host}:${cfg.port} as ${cfg.user}`);
    await client.query(schema);
    console.log('✅ Schema applied successfully!');
    const res = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;`);
    console.log('Tables now in public schema:', res.rows.map((r: any) => r.tablename));
    await client.end();
    return true;
  } catch (e: any) {
    console.log(`❌ ${cfg.host}:${cfg.port} user="${cfg.user}":`, e.message.substring(0, 120));
    return false;
  }
}

async function run() {
  for (const cfg of strategies) {
    const ok = await tryExec(cfg);
    if (ok) {
      console.log('\n🎉 Schema migration complete!');
      return;
    }
  }
  console.log('\n❌ All connection strategies failed.');
  console.log('Need the Postgres database password from Supabase Dashboard → Project Settings → Database → Database Password');
}

run();
