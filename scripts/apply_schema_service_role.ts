import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudnZseXBrcnF2ZGVwa3did2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzNDE5OCwiZXhwIjoyMTA1NzEwMTk4fQ.VsRYkc7MwcDmnw9mjZi1mjii9nkN5aGJMRvspmTE7gg';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSchemaSetup() {
  console.log('Testing service role key against Supabase REST API...');

  // Check management SQL endpoint or REST endpoint
  const sql = `
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
DROP POLICY IF EXISTS "Allow full access to od_applications" ON public.od_applications;
CREATE POLICY "Allow full access to od_applications" ON public.od_applications FOR ALL USING (true) WITH CHECK (true);

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
DROP POLICY IF EXISTS "Allow full access to master_students" ON public.master_students;
CREATE POLICY "Allow full access to master_students" ON public.master_students FOR ALL USING (true) WITH CHECK (true);

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
DROP POLICY IF EXISTS "Allow full access to master_staff" ON public.master_staff;
CREATE POLICY "Allow full access to master_staff" ON public.master_staff FOR ALL USING (true) WITH CHECK (true);
  `;

  // Test SQL endpoints
  const endpoints = [
    '/rest/v1/rpc/exec_sql',
    '/pg',
    '/rest/v1/sql'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${supabaseUrl}${ep}`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql, sql: sql })
      });
      console.log(`Endpoint ${ep} status:`, res.status);
      const text = await res.text();
      console.log(`Endpoint ${ep} body:`, text.substring(0, 300));
    } catch (e: any) {
      console.log(`Endpoint ${ep} err:`, e.message);
    }
  }
}

runSchemaSetup();
