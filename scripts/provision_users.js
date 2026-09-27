import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://envvlypkrqvdepkwbwfi.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in environment.');
  console.error('Please configure SUPABASE_SERVICE_ROLE_KEY in your local environment to run student provisioning.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Load student master data
const masterDataPath = path.join(__dirname, '..', 'src', 'data', 'masterData.ts');
const masterDataContent = fs.readFileSync(masterDataPath, 'utf-8');

// Match MASTER_STUDENTS array from masterData.ts
const match = masterDataContent.match(/export const MASTER_STUDENTS: MasterStudent\[\] = (\[[\s\S]*?\]);/);

if (!match) {
  console.error('ERROR: Could not parse MASTER_STUDENTS from masterData.ts');
  process.exit(1);
}

const students = JSON.parse(match[1]);

async function provision() {
  console.log(`Starting Supabase Auth student provisioning for ${students.length} students...`);

  let totalFound = students.length;
  let alreadyExisting = 0;
  let newlyCreated = 0;
  let errorsCount = 0;
  const errors = [];

  for (const student of students) {
    const regNo = String(student.registerNumber).trim();
    if (!regNo) continue;

    const email = `${regNo}@trp.srmtrichy.edu.in`;

    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true,
        user_metadata: {
          name: student.name,
          registerNumber: regNo,
          role: 'Student',
          department: student.department || 'EEE',
          year: student.year,
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists') || error.status === 422) {
          alreadyExisting++;
        } else {
          errorsCount++;
          errors.push({ email, error: error.message });
          console.warn(`Failed for ${email}:`, error.message);
        }
      } else if (data.user) {
        newlyCreated++;
        console.log(`Created account for ${email}`);
      }
    } catch (err) {
      errorsCount++;
      errors.push({ email, error: err.message });
    }
  }

  console.log('\n==================================================');
  console.log('PROVISIONING REPORT');
  console.log('==================================================');
  console.log(`Students found:   ${totalFound}`);
  console.log(`Already existing: ${alreadyExisting}`);
  console.log(`Newly created:    ${newlyCreated}`);
  console.log(`Errors:           ${errorsCount}`);
  if (errors.length > 0) {
    console.log('Error details:', JSON.stringify(errors, null, 2));
  }
}

provision();
