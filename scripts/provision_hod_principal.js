/**
 * provision_hod_principal.js
 *
 * Provisions / updates Supabase Auth email+password credentials for all HOD
 * and Principal accounts.  Existing Google-linked users are NOT touched beyond
 * the password being set – their Google identity remains fully functional.
 *
 * Usage (run from the project root):
 *   $env:SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
 *   node scripts/provision_hod_principal.js
 *
 * The service-role key is NEVER committed to the repository or exposed to the
 * frontend – it is read exclusively from the environment at runtime.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://envvlypkrqvdepkwbwfi.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set.');
  console.error('Set it with:');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="<key>"   # PowerShell');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY="<key>" # bash/zsh');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Official accounts ────────────────────────────────────────────────────────
// Add or remove entries here as the institution's account list changes.
// Do NOT hard-code passwords anywhere else; password123 is set only via
// Supabase Auth admin API (server-side, never exposed to the browser).
const TARGET_ACCOUNTS = [
  // Principal & Vice-Principal
  { email: 'principal@trp.srmtrichy.edu.in',   role: 'Principal' },
  { email: 'vp@trp.srmtrichy.edu.in',          role: 'Principal' }, // Vice-Principal

  // HODs
  { email: 'hod.cse@trp.srmtrichy.edu.in',     role: 'HOD', department: 'CSE'   },
  { email: 'hod.civil@trp.srmtrichy.edu.in',   role: 'HOD', department: 'Civil' },
  { email: 'hod.eee@trp.srmtrichy.edu.in',     role: 'HOD', department: 'EEE'   },
  { email: 'hod.mech@trp.srmtrichy.edu.in',    role: 'HOD', department: 'Mech'  },
  { email: 'hod.ece@trp.srmtrichy.edu.in',     role: 'HOD', department: 'ECE'   },
  { email: 'hod.ai@trp.srmtrichy.edu.in',      role: 'HOD', department: 'AI'    },
  { email: 'hod.sh@trp.srmtrichy.edu.in',      role: 'HOD', department: 'SH'    },
  { email: 'hod.mba@trp.srmtrichy.edu.in',     role: 'HOD', department: 'MBA'   },
  { email: 'hod.it@trp.srmtrichy.edu.in',      role: 'HOD', department: 'IT'    },
  { email: 'hod.aiml@trp.srmtrichy.edu.in',    role: 'HOD', department: 'AIML'  },
];

const INITIAL_PASSWORD = 'password123';

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('='.repeat(60));
  console.log('ODFlow – HOD / Principal Auth Provisioning');
  console.log('='.repeat(60));
  console.log(`Supabase URL : ${SUPABASE_URL}`);
  console.log(`Accounts     : ${TARGET_ACCOUNTS.length}`);
  console.log('');

  // Fetch the full user list once to avoid repeated API calls
  const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (listErr) {
    console.error('Failed to list users:', listErr.message);
    process.exit(1);
  }

  const existingUsers = listData?.users ?? [];

  let updated = 0;
  let created = 0;
  let failed  = 0;

  for (const acc of TARGET_ACCOUNTS) {
    const email = acc.email.toLowerCase().trim();
    const existing = existingUsers.find(
      (u) => u.email && u.email.toLowerCase() === email,
    );

    if (existing) {
      // ── User already exists → just set the password ───────────────────────
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
        existing.id,
        { password: INITIAL_PASSWORD },
      );

      if (updateErr) {
        console.error(`[FAIL]    ${email} – update error: ${updateErr.message}`);
        failed++;
      } else {
        console.log(`[UPDATED] ${email} (id: ${existing.id}) – password set`);
        updated++;
      }
    } else {
      // ── User does not exist → create with email+password ─────────────────
      const metadata = {
        role:       acc.role,
        department: acc.department ?? null,
      };

      const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password:      INITIAL_PASSWORD,
        email_confirm: true,
        user_metadata: metadata,
      });

      if (createErr) {
        console.error(`[FAIL]    ${email} – create error: ${createErr.message}`);
        failed++;
      } else {
        console.log(`[CREATED] ${email} (id: ${newUser.user.id}) – password set`);
        created++;
      }
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('PROVISIONING SUMMARY');
  console.log('='.repeat(60));
  console.log(`Updated (existing): ${updated}`);
  console.log(`Created (new):      ${created}`);
  console.log(`Failed:             ${failed}`);
  console.log('');

  if (failed === 0) {
    console.log('✓ All accounts provisioned successfully.');
    console.log('  Each account can now log in with:');
    console.log(`  Email : <official email>  |  Password : ${INITIAL_PASSWORD}`);
    console.log('  Google OAuth remains fully functional for existing Google users.');
  } else {
    console.log(`✗ ${failed} account(s) had errors. Review the output above.`);
    process.exit(1);
  }
}

run();
