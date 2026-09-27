import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { MASTER_MENTORS, MASTER_CC_MAPPINGS } from '../data/masterData';
import { initMasterStudents, getMasterStudentsSync } from '../lib/masterStudentsService';
import { supabase } from '../lib/supabase';

const COLLEGE_DOMAIN = '@trp.srmtrichy.edu.in';
const OD_INCHARGE_EMAIL = 'bharanidharan.r@trp.srmtrichy.edu.in';
export const PRINCIPAL_EMAIL = 'principal@trp.srmtrichy.edu.in';
export const HOD_EMAIL = 'amudha.j@trp.srmtrichy.edu.in';

export const HOD_MAPPINGS: Record<string, { name: string; department: string }> = {
  // Legacy / named accounts
  'amudha.j@trp.srmtrichy.edu.in':  { name: 'Dr. J. Amudha', department: 'EEE' },
  // Official HOD email accounts
  'hod.eee@trp.srmtrichy.edu.in':   { name: 'HOD EEE',          department: 'EEE' },
  'hod.ece@trp.srmtrichy.edu.in':   { name: 'HOD ECE',          department: 'ECE' },
  'hod.cse@trp.srmtrichy.edu.in':   { name: 'HOD CSE',          department: 'CSE' },
  'hod.aiml@trp.srmtrichy.edu.in':  { name: 'HOD AIML',         department: 'AIML' },
  'hod.ai@trp.srmtrichy.edu.in':    { name: 'HOD AI',           department: 'AI' },
  'hod.mech@trp.srmtrichy.edu.in':  { name: 'HOD Mechanical',   department: 'Mechanical' },
  'hod.civil@trp.srmtrichy.edu.in': { name: 'HOD Civil',        department: 'Civil' },
  'hod.it@trp.srmtrichy.edu.in':    { name: 'HOD IT',           department: 'IT' },
  'hod.mba@trp.srmtrichy.edu.in':   { name: 'HOD MBA',          department: 'MBA' },
  'hod.sh@trp.srmtrichy.edu.in':    { name: 'HOD Science & Humanities', department: 'Science & Humanities' },
};

/**
 * Validates that an email belongs to the college domain.
 * Returns an error message string or null if valid.
 */
export const validateCollegeEmail = (email: string): string | null => {
  if (!email || !email.toLowerCase().trim().endsWith(COLLEGE_DOMAIN)) {
    return 'Please use your official TRP Engineering College email address.';
  }
  return null;
};

/**
 * Looks up user details from Supabase master_students roster based on email.
 */
export const lookupUserByEmail = (email: string): User => {
  const normalizedEmail = email.toLowerCase().trim();
  const prefix = normalizedEmail.split('@')[0];

  // 1. Check Principal Role
  if (normalizedEmail === PRINCIPAL_EMAIL) {
    return {
      email: normalizedEmail,
      role: 'Principal',
      name: 'Principal',
      id: 'STAFF-principal',
      department: 'All Departments',
    };
  }

  // 2. Check OD Incharge (OD Coordinator)
  if (normalizedEmail === OD_INCHARGE_EMAIL) {
    const mentorInfo = MASTER_MENTORS[OD_INCHARGE_EMAIL];
    return {
      email: normalizedEmail,
      role: 'ODIncharge',
      name: 'Mr. R. Bharanidharan',
      id: 'STAFF-bharanidharan.r',
      department: 'EEE',
      studentCount: mentorInfo ? mentorInfo.studentCount : 28,
      isCoCc: true,
      ccYears: ['IV Year'],
    };
  }

  // 3. Check if student in Supabase master_students roster
  const studentsList = getMasterStudentsSync();
  const student = studentsList.find(s => {
    const reg = s.registerNumber.toLowerCase().trim();
    if (reg === prefix) return true;
    const cleanName = s.name.toLowerCase().replace(/[^a-z]/g, '');
    const cleanPrefix = prefix.replace(/[^a-z]/g, '');
    if (cleanPrefix.length > 3 && cleanName.includes(cleanPrefix)) return true;
    return false;
  });

  if (student) {
    return {
      email: normalizedEmail,
      role: 'Student',
      name: student.name,
      id: student.registerNumber,
      registerNumber: student.registerNumber,
      department: student.department || 'EEE',
      year: student.year,
      mentorName: student.mentorName,
      mentorEmail: student.mentorEmail,
    };
  }

  // If email prefix is numeric (e.g. 12 digits register number)
  if (/^\d{8,12}$/.test(prefix)) {
    return {
      email: normalizedEmail,
      role: 'Student',
      name: `Student ${prefix}`,
      id: prefix,
      registerNumber: prefix,
      department: 'EEE',
      year: 'III Year',
    };
  }

  // 4. Check if HOD
  const hodMeta = HOD_MAPPINGS[normalizedEmail];
  if (hodMeta) {
    return {
      email: normalizedEmail,
      role: 'HOD',
      name: hodMeta.name,
      id: `STAFF-${prefix}`,
      department: hodMeta.department,
      isHod: true,
      studentCount: 0,
    };
  }

  // 5. Check if Staff (Mentor / CC / Co-CC)
  const studentsListForStaff = getMasterStudentsSync();
  const ccMatchesFromDB = studentsListForStaff.filter(s => s.ccEmail?.toLowerCase().trim() === normalizedEmail);
  const coCcMatchesFromDB = studentsListForStaff.filter(s => s.coCcEmail?.toLowerCase().trim() === normalizedEmail);

  const fallbackCcMappings = MASTER_CC_MAPPINGS.filter(
    m => m.cc.email.toLowerCase() === normalizedEmail || m.coCc.email.toLowerCase() === normalizedEmail
  );

  const dynamicCcYears = Array.from(new Set([
    ...ccMatchesFromDB.map(s => s.year),
    ...coCcMatchesFromDB.map(s => s.year),
    ...fallbackCcMappings.map(m => m.year)
  ]));

  const isCc = ccMatchesFromDB.length > 0 || fallbackCcMappings.some(m => m.cc.email.toLowerCase() === normalizedEmail);
  const isCoCc = coCcMatchesFromDB.length > 0 || fallbackCcMappings.some(m => m.coCc.email.toLowerCase() === normalizedEmail);

  const mentorInfo = MASTER_MENTORS[normalizedEmail];
  let name = mentorInfo ? mentorInfo.name : '';
  if (!name && ccMatchesFromDB.length > 0 && ccMatchesFromDB[0].ccName) {
    name = ccMatchesFromDB[0].ccName;
  }
  if (!name && coCcMatchesFromDB.length > 0 && coCcMatchesFromDB[0].coCcName) {
    name = coCcMatchesFromDB[0].coCcName;
  }
  if (!name && fallbackCcMappings.length > 0) {
    const match = fallbackCcMappings[0];
    name = match.cc.email.toLowerCase() === normalizedEmail ? match.cc.name : match.coCc.name;
  }
  if (!name) {
    name = prefix
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  return {
    email: normalizedEmail,
    role: 'Staff',
    name,
    id: `STAFF-${prefix}`,
    department: 'EEE',
    studentCount: mentorInfo ? mentorInfo.studentCount : 0,
    isCc,
    isCoCc,
    ccYears: dynamicCcYears,
  };
};

/**
 * Detects the role from the email prefix.
 */
export const detectRole = (email: string): Role | null => {
  const user = lookupUserByEmail(email);
  return user.role;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  forgotPassword: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (newPassword: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const initUserFromEmail = (email: string) => {
    const domainError = validateCollegeEmail(email);
    if (domainError) {
      setUser(null);
      return null;
    }
    const newUser = lookupUserByEmail(email);
    setUser(newUser);
    return newUser;
  };

  useEffect(() => {
    // Initialize Supabase master_students roster
    initMasterStudents().then(() => {
      // Check initial Supabase Auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          initUserFromEmail(session.user.email);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    });

    // Subscribe to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        initUserFromEmail(session.user.email);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Supabase Auth Email/Password Login
   */
  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const domainError = validateCollegeEmail(email);
    if (domainError) return { error: domainError };

    if (!password.trim()) return { error: 'Password is required.' };

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user?.email) {
      const newUser = initUserFromEmail(data.user.email);
      if (!newUser) {
        await supabase.auth.signOut();
        return { error: 'Unauthorized email domain.' };
      }
    }

    return { error: null };
  };

  /**
   * Real Supabase Google OAuth Login using current dynamic origin
   */
  const loginWithGoogle = async (): Promise<{ error: string | null }> => {
    try {
      const redirectTo = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Google login failed' };
    }
  };

  /**
   * Supabase Password Reset Email
   */
  const forgotPassword = async (email: string): Promise<{ error: string | null }> => {
    const domainError = validateCollegeEmail(email);
    if (domainError) return { error: domainError };

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  /**
   * Supabase Password Update
   */
  const resetPassword = async (newPassword: string): Promise<{ error: string | null }> => {
    if (!newPassword || newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
