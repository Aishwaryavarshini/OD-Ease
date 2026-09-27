import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { MasterStudent, MASTER_STUDENTS as INITIAL_MASTER_STUDENTS } from '../data/masterData';

// Shared in-memory master students cache
let cachedMasterStudents: MasterStudent[] = [...INITIAL_MASTER_STUDENTS];
let isInitialized = false;

/**
 * Initializes and fetches master_students from Supabase.
 * If Supabase master_students table is empty, seeds it with initial MASTER_STUDENTS data.
 */
export const initMasterStudents = async (): Promise<MasterStudent[]> => {
  try {
    const { data, error } = await supabase
      .from('master_students')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Supabase master_students fetch error (using fallback data):', error.message);
      return cachedMasterStudents;
    }

    if (data && data.length > 0) {
      // Map lowercase Postgres column names back to camelCase MasterStudent fields
      cachedMasterStudents = data.map((row: any) => ({
        registerNumber: row.registernumber || row.registerNumber || '',
        name: row.name || '',
        gender: row.gender || 'M',
        year: row.year || '',
        department: row.department || 'EEE',
        mentorName: row.mentorname || row.mentorName || '',
        mentorEmail: row.mentoremail || row.mentorEmail || '',
        ccName: row.ccname || row.ccName || undefined,
        ccEmail: row.ccemail || row.ccEmail || undefined,
        coCcName: row.coccname || row.coCcName || undefined,
        coCcEmail: row.coccemail || row.coCcEmail || undefined,
        studentEmail: row.studentemail || row.studentEmail || undefined,
      })) as MasterStudent[];
      isInitialized = true;
      return cachedMasterStudents;
    } else {
      // Seed Supabase with initial master students if table is empty
      console.log('Seeding Supabase master_students table with initial roster...');
      const batchSize = 100;
      for (let i = 0; i < INITIAL_MASTER_STUDENTS.length; i += batchSize) {
        const batch = INITIAL_MASTER_STUDENTS.slice(i, i + batchSize).map(s => ({
          registernumber: s.registerNumber,
          name: s.name,
          gender: s.gender || 'M',
          year: s.year,
          department: s.department || 'EEE',
          mentorname: s.mentorName,
          mentoremail: s.mentorEmail,
          ccname: s.ccName || null,
          ccemail: s.ccEmail || null,
          coccname: s.coCcName || null,
          coccemail: s.coCcEmail || null,
          studentemail: s.studentEmail || null,
        }));
        await supabase.from('master_students').upsert(batch, { onConflict: 'registernumber' });
      }
      cachedMasterStudents = [...INITIAL_MASTER_STUDENTS];
      isInitialized = true;
      return cachedMasterStudents;
    }
  } catch (err) {
    console.error('Failed to initialize master_students from Supabase:', err);
    return cachedMasterStudents;
  }
};

/**
 * Synchronous getter for current master_students cache.
 */
export const getMasterStudentsSync = (): MasterStudent[] => {
  return cachedMasterStudents;
};

/**
 * Adds a new student to Supabase master_students table and updates local cache.
 */
export const addMasterStudent = async (student: MasterStudent): Promise<{ error: string | null }> => {
  try {
    const cleanStudent: MasterStudent = {
      registerNumber: student.registerNumber.trim(),
      name: student.name.trim(),
      gender: student.gender || 'M',
      year: student.year,
      department: student.department || 'EEE',
      mentorName: student.mentorName.trim(),
      mentorEmail: student.mentorEmail.trim().toLowerCase(),
    };

    // Use lowercase column names matching Postgres
    const { error } = await supabase
      .from('master_students')
      .insert([{
        registernumber: cleanStudent.registerNumber,
        name: cleanStudent.name,
        gender: cleanStudent.gender,
        year: cleanStudent.year,
        department: cleanStudent.department,
        mentorname: cleanStudent.mentorName,
        mentoremail: cleanStudent.mentorEmail,
      }]);

    if (error) {
      return { error: error.message };
    }

    // Update in-memory cache
    const existingIdx = cachedMasterStudents.findIndex(s => s.registerNumber === cleanStudent.registerNumber);
    if (existingIdx >= 0) {
      cachedMasterStudents[existingIdx] = cleanStudent;
    } else {
      cachedMasterStudents.unshift(cleanStudent);
    }

    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to add student to Master DB' };
  }
};

/**
 * Updates an existing student in Supabase master_students table and updates local cache.
 */
export const updateMasterStudent = async (student: MasterStudent): Promise<{ error: string | null }> => {
  try {
    const cleanStudent: MasterStudent = {
      registerNumber: student.registerNumber.trim(),
      name: student.name.trim(),
      gender: student.gender || 'M',
      year: student.year,
      department: student.department || 'EEE',
      mentorName: student.mentorName.trim(),
      mentorEmail: student.mentorEmail.trim().toLowerCase(),
    };

    // Use lowercase column names matching Postgres
    const { error } = await supabase
      .from('master_students')
      .update({
        name: cleanStudent.name,
        gender: cleanStudent.gender,
        year: cleanStudent.year,
        department: cleanStudent.department,
        mentorname: cleanStudent.mentorName,
        mentoremail: cleanStudent.mentorEmail,
      })
      .eq('registernumber', cleanStudent.registerNumber);

    if (error) {
      return { error: error.message };
    }

    // Update in-memory cache
    const existingIdx = cachedMasterStudents.findIndex(s => s.registerNumber === cleanStudent.registerNumber);
    if (existingIdx >= 0) {
      cachedMasterStudents[existingIdx] = cleanStudent;
    } else {
      cachedMasterStudents.unshift(cleanStudent);
    }

    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to update student in Master DB' };
  }
};

/**
 * Bulk upserts students into Supabase master_students and refreshes local cache.
 */
export const bulkUpsertStudents = async (students: MasterStudent[]): Promise<{ error: string | null; count: number }> => {
  try {
    // Use lowercase column names matching Postgres
    const cleanStudents = students.map(s => ({
      registernumber: String(s.registerNumber).trim(),
      name: s.name.trim(),
      gender: s.gender || 'M',
      year: s.year,
      department: s.department || 'EEE',
      mentorname: s.mentorName.trim(),
      mentoremail: s.mentorEmail.trim().toLowerCase(),
      ccname: s.ccName?.trim() || null,
      ccemail: s.ccEmail?.trim().toLowerCase() || null,
      coccname: s.coCcName?.trim() || null,
      coccemail: s.coCcEmail?.trim().toLowerCase() || null,
      studentemail: s.studentEmail?.trim().toLowerCase() || null,
    }));

    const batchSize = 100;
    for (let i = 0; i < cleanStudents.length; i += batchSize) {
      const batch = cleanStudents.slice(i, i + batchSize);
      const { error } = await supabase
        .from('master_students')
        .upsert(batch, { onConflict: 'registernumber' });

      if (error) {
        return { error: error.message, count: 0 };
      }
    }

    // Refresh cache
    await initMasterStudents();
    return { error: null, count: cleanStudents.length };
  } catch (err: any) {
    return { error: err.message || 'Bulk student import failed', count: 0 };
  }
};

/**
 * Bulk upserts staff into Supabase master_staff table.
 */
export const bulkUpsertStaff = async (staffList: { email: string; name: string; role: string; department: string; year?: string }[]): Promise<{ error: string | null; count: number }> => {
  try {
    const cleanStaff = staffList.map(s => ({
      email: s.email.trim().toLowerCase(),
      name: s.name.trim(),
      role: s.role,
      department: s.department || 'EEE',
      year: s.year || null,
    }));

    if (cleanStaff.length === 0) return { error: null, count: 0 };

    const batchSize = 100;
    for (let i = 0; i < cleanStaff.length; i += batchSize) {
      const batch = cleanStaff.slice(i, i + batchSize);
      const { error } = await supabase
        .from('master_staff')
        .upsert(batch, { onConflict: 'email' });

      if (error) {
        console.warn('Supabase master_staff upsert notice:', error.message);
      }
    }

    return { error: null, count: cleanStaff.length };
  } catch (err: any) {
    return { error: err.message || 'Bulk staff import failed', count: 0 };
  }
};

/**
 * Fetches all master staff records from Supabase master_staff.
 */
export const fetchMasterStaff = async (): Promise<{ email: string; name: string; role: string; department: string; year?: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('master_staff')
      .select('*');

    if (error || !data) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
};

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabasePublishableKey = metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';

// Isolated auth client for auto provisioning without changing HOD's active session
const tempAuthClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Automatically provisions Supabase Auth accounts for students and staff when HOD imports CSV.
 */
export const provisionAuthAccountsAuto = async (
  students: MasterStudent[],
  staffList: { email: string; name: string; role: string; department: string; year?: string }[]
): Promise<{ created: number; existing: number; errors: number }> => {
  let created = 0;
  let existing = 0;
  let errors = 0;

  // 1. Provision Students
  for (const student of students) {
    const regNo = String(student.registerNumber).trim();
    if (!regNo) continue;
    const email = student.studentEmail || `${regNo}@trp.srmtrichy.edu.in`;

    try {
      const { data, error } = await tempAuthClient.auth.signUp({
        email,
        password: 'password123',
        options: {
          data: {
            name: student.name,
            registerNumber: regNo,
            role: 'Student',
            department: student.department || 'EEE',
            year: student.year,
          },
        },
      });

      if (error) {
        if (error.message.includes('already') || error.message.includes('exists') || error.status === 422) {
          existing++;
        } else {
          errors++;
        }
      } else if (data.user) {
        created++;
      }
    } catch {
      errors++;
    }
  }

  // 2. Provision Staff
  for (const staff of staffList) {
    const email = String(staff.email).trim().toLowerCase();
    if (!email) continue;

    try {
      const { data, error } = await tempAuthClient.auth.signUp({
        email,
        password: 'password123',
        options: {
          data: {
            name: staff.name,
            role: staff.role || 'Staff',
            department: staff.department || 'EEE',
            year: staff.year,
          },
        },
      });

      if (error) {
        if (error.message.includes('already') || error.message.includes('exists') || error.status === 422) {
          existing++;
        } else {
          errors++;
        }
      } else if (data.user) {
        created++;
      }
    } catch {
      errors++;
    }
  }

  return { created, existing, errors };
};


