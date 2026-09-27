import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://envvlypkrqvdepkwbwfi.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in environment.');
  console.error('Please configure SUPABASE_SERVICE_ROLE_KEY in your local environment to run student/staff provisioning.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function provisionFromDB() {
  console.log('==================================================');
  console.log('ODFLOW SUPABASE AUTH PROVISIONING FROM MASTER DB');
  console.log('==================================================\n');

  // 1. Fetch Students from master_students
  console.log('Fetching students from Supabase master_students...');
  const { data: students, error: studentErr } = await supabaseAdmin
    .from('master_students')
    .select('*');

  if (studentErr) {
    console.error('Failed to fetch master_students:', studentErr.message);
  }

  // 2. Fetch Staff from master_staff
  console.log('Fetching staff from Supabase master_staff...');
  const { data: staffList, error: staffErr } = await supabaseAdmin
    .from('master_staff')
    .select('*');

  if (staffErr) {
    console.warn('Notice fetching master_staff:', staffErr.message);
  }

  let studentStats = { total: 0, existing: 0, created: 0, errors: 0 };
  let staffStats = { total: 0, existing: 0, created: 0, errors: 0 };

  // 3. Provision Students
  if (students && students.length > 0) {
    studentStats.total = students.length;
    console.log(`\nProvisioning ${students.length} student accounts...`);

    for (const student of students) {
      const regNo = String(student.registerNumber).trim();
      if (!regNo) continue;

      const email = student.studentEmail || `${regNo}@trp.srmtrichy.edu.in`;

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
            studentStats.existing++;
          } else {
            studentStats.errors++;
            console.warn(`  [Student Fail] ${email}:`, error.message);
          }
        } else if (data.user) {
          studentStats.created++;
          console.log(`  [Student Created] ${email}`);
        }
      } catch (err) {
        studentStats.errors++;
        console.warn(`  [Student Exception] ${email}:`, err.message);
      }
    }
  } else {
    console.log('No student records found in master_students.');
  }

  // 4. Provision Staff
  if (staffList && staffList.length > 0) {
    staffStats.total = staffList.length;
    console.log(`\nProvisioning ${staffList.length} staff accounts...`);

    for (const staff of staffList) {
      const email = String(staff.email).trim().toLowerCase();
      if (!email) continue;

      try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: 'password123',
          email_confirm: true,
          user_metadata: {
            name: staff.name,
            role: staff.role || 'Staff',
            department: staff.department || 'EEE',
            year: staff.year,
          },
        });

        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already exists') || error.status === 422) {
            staffStats.existing++;
          } else {
            staffStats.errors++;
            console.warn(`  [Staff Fail] ${email}:`, error.message);
          }
        } else if (data.user) {
          staffStats.created++;
          console.log(`  [Staff Created] ${email}`);
        }
      } catch (err) {
        staffStats.errors++;
        console.warn(`  [Staff Exception] ${email}:`, err.message);
      }
    }
  } else {
    console.log('No staff records found in master_staff.');
  }

  console.log('\n==================================================');
  console.log('PROVISIONING FINAL SUMMARY REPORT');
  console.log('==================================================');
  console.log(`STUDENTS -> Total: ${studentStats.total} | Existing: ${studentStats.existing} | Created: ${studentStats.created} | Errors: ${studentStats.errors}`);
  console.log(`STAFF    -> Total: ${staffStats.total} | Existing: ${staffStats.existing} | Created: ${staffStats.created} | Errors: ${staffStats.errors}`);
  console.log('==================================================\n');
}

provisionFromDB();
