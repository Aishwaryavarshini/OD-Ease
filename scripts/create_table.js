import fetch from 'node-fetch';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

async function createTable() {
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
      status TEXT,
      isFullDay BOOLEAN,
      isMultipleDays BOOLEAN,
      approvals JSONB,
      approvalHistory JSONB,
      rejectionReason TEXT,
      directApproval BOOLEAN,
      directApprovedBy TEXT,
      directApprovalTimestamp BIGINT,
      timestamp BIGINT
    );
    ALTER TABLE public.od_applications ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow anonymous read write" ON public.od_applications FOR ALL USING (true) WITH CHECK (true);
  `;

  // Test RPC / Query
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query: sql })
  });

  console.log('SQL exec status:', res.status);
  const text = await res.text();
  console.log('SQL exec response:', text);
}

createTable();
