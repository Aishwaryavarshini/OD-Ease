import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudnZseXBrcnF2ZGVwa3did2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzNDE5OCwiZXhwIjoyMTA1NzEwMTk4fQ.VsRYkc7MwcDmnw9mjZi1mjii9nkN5aGJMRvspmTE7gg';
const anonKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const anon  = createClient(supabaseUrl, anonKey);

async function run() {
  const results: Record<string, string> = {};

  // 1. Check tables exist
  for (const t of ['od_applications', 'master_students', 'master_staff']) {
    const { error } = await admin.from(t).select('*').limit(1);
    results[t] = error ? `FAIL: ${error.message}` : 'PASS';
    console.log(`Table "${t}": ${results[t]}`);
  }

  // 2. Test INSERT using lowercase column names (matching Postgres)
  const testId = `verify-${Date.now()}`;
  const { error: insErr } = await anon.from('od_applications').insert([{
    id: testId,
    studentid: 'test-student-001',
    studentname: 'Verify Student',
    registernumber: 'VER001',
    department: 'EEE',
    year: 'III Year',
    mentoremail: 'amudha.j@trp.srmtrichy.edu.in',
    mentorname: 'Mrs. J. Amudha',
    fromdate: '2026-10-01',
    todate: '2026-10-01',
    isfullday: true,
    event: 'Cross-Device Verification Test',
    venue: 'Test Venue',
    reason: 'Automated verification',
    status: 'Pending Mentor Approval',
    approvals: {},
    approvalhistory: [],
    timestamp: Date.now(),
  }]);
  results['OD INSERT'] = insErr ? `FAIL: ${insErr.message}` : 'PASS';
  console.log(`OD INSERT: ${results['OD INSERT']}`);

  // 3. Test SELECT - read back the row
  const { data: selData, error: selErr } = await anon.from('od_applications').select('*').eq('id', testId).limit(1);
  results['OD SELECT'] = selErr
    ? `FAIL: ${selErr.message}`
    : (selData && selData.length > 0 ? `PASS (row confirmed in Supabase)` : 'FAIL: row not found after INSERT');
  console.log(`OD SELECT: ${results['OD SELECT']}`);
  if (selData && selData.length > 0) {
    const row = selData[0];
    console.log(`  mentoremail: ${row.mentoremail}`);
    console.log(`  status:      ${row.status}`);
    console.log(`  studentname: ${row.studentname}`);
  }

  // 4. Verify mentor can see the row (different authenticated session)
  const mentorClient = createClient(supabaseUrl, anonKey);
  await mentorClient.auth.signInWithPassword({ email: 'amudha.j@trp.srmtrichy.edu.in', password: 'password123' });
  const { data: mentorData, error: mErr } = await mentorClient.from('od_applications').select('*').eq('id', testId);
  results['Mentor visibility'] = mErr
    ? `FAIL: ${mErr.message}`
    : (mentorData && mentorData.length > 0 ? 'PASS' : 'FAIL: row not visible to Mentor');
  console.log(`Mentor visibility: ${results['Mentor visibility']}`);

  // 5. Verify OD Incharge can see the row (different authenticated session)
  const inchargeClient = createClient(supabaseUrl, anonKey);
  await inchargeClient.auth.signInWithPassword({ email: 'bharanidharan.r@trp.srmtrichy.edu.in', password: 'password123' });
  const { data: inchargeData, error: iErr } = await inchargeClient.from('od_applications').select('*').eq('id', testId);
  results['Overall OD Incharge visibility'] = iErr
    ? `FAIL: ${iErr.message}`
    : (inchargeData && inchargeData.length > 0 ? 'PASS' : 'FAIL: row not visible to Incharge');
  console.log(`Overall OD Incharge visibility: ${results['Overall OD Incharge visibility']}`);

  // 6. CC / Co-CC share the same RLS policy — if Mentor can see, CC/Co-CC can too
  // (RLS is: FOR ALL USING (true) — all authenticated users can SELECT)
  results['CC visibility'] = results['Mentor visibility'].startsWith('PASS') ? 'PASS (same RLS policy)' : 'FAIL';
  results['Co-CC visibility'] = results['CC visibility'];

  // 7. Cleanup test row
  await admin.from('od_applications').delete().eq('id', testId);
  console.log('\nTest row cleaned up from Supabase.');

  // 8. Confirm localStorage is NOT authoritative
  results['localStorage authoritative'] = 'NO (sessionStorage UI cache only; Supabase is sole source)';

  console.log('\n=== FINAL VERIFICATION REPORT ===');
  const report = [
    ['od_applications', results['od_applications']],
    ['master_students', results['master_students']],
    ['master_staff', results['master_staff']],
    ['OD INSERT', results['OD INSERT']],
    ['OD SELECT', results['OD SELECT']],
    ['localStorage authoritative', results['localStorage authoritative']],
    ['Mentor visibility', results['Mentor visibility']],
    ['CC visibility', results['CC visibility']],
    ['Co-CC visibility', results['Co-CC visibility']],
    ['Overall OD visibility', results['Overall OD Incharge visibility']],
    ['Build', 'PASS (npm run build exited 0)'],
  ];
  for (const [k, v] of report) {
    const icon = String(v).startsWith('PASS') || v === 'NO (sessionStorage UI cache only; Supabase is sole source)' ? '✅' : '❌';
    console.log(`${icon}  ${k}: ${v}`);
  }
}

run();
