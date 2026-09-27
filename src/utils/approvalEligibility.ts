import { ODApplication, User } from '../types';
import { MASTER_CC_MAPPINGS } from '../data/masterData';
import { getMasterStudentsSync } from '../lib/masterStudentsService';

/**
 * Checks if the logged-in user is the student's assigned mentor.
 */
export const isAssignedMentor = (app: ODApplication, user: User | null): boolean => {
  if (!user || !user.email) return false;
  const userEmail = user.email.toLowerCase().trim();

  if (app.mentorEmail && app.mentorEmail.toLowerCase().trim() === userEmail) return true;

  const liveStudents = getMasterStudentsSync();
  const studentMaster = liveStudents.find(s => s.registerNumber === app.registerNumber);
  if (studentMaster && studentMaster.mentorEmail.toLowerCase().trim() === userEmail) return true;

  if (app.mentorName && user.name && app.mentorName.toLowerCase().trim() === user.name.toLowerCase().trim()) return true;

  return false;
};

/**
 * Checks if the logged-in user is CC or Co-CC for the student's year and department.
 */
export const isYearCC = (app: ODApplication, user: User | null): boolean => {
  if (!user || !user.email) return false;
  const userEmail = user.email.toLowerCase().trim();
  const userDept = (user.department || 'EEE').trim().toLowerCase();
  const appDept = (app.department || 'EEE').trim().toLowerCase();
  if (appDept !== userDept) return false;

  // 1. Check live master_students roster
  const liveStudents = getMasterStudentsSync();
  const studentMaster = liveStudents.find(s => s.registerNumber === app.registerNumber);
  if (studentMaster) {
    if (studentMaster.ccEmail && studentMaster.ccEmail.toLowerCase().trim() === userEmail) return true;
    if (studentMaster.coCcEmail && studentMaster.coCcEmail.toLowerCase().trim() === userEmail) return true;
  }

  // 2. Fallback to MASTER_CC_MAPPINGS
  return MASTER_CC_MAPPINGS.some(
    m => m.year === app.year &&
      m.department.toLowerCase() === userDept &&
      (m.cc.email.toLowerCase().trim() === userEmail || m.coCc.email.toLowerCase().trim() === userEmail)
  );
};

/**
 * Determines if user can perform standard Mentor Approve/Reject.
 */
export const canMentorApproveOrReject = (app: ODApplication, user: User | null): boolean => {
  if (app.status === 'Approved' || app.status === 'Rejected') return false;
  return isAssignedMentor(app, user) && app.approvals.mentor === undefined;
};

/**
 * Determines if user can perform standard CC/Co-CC Approve/Reject.
 * Allowed even if Mentor is pending, BUT blocked if Mentor rejected.
 */
export const canCcApproveOrReject = (app: ODApplication, user: User | null): boolean => {
  if (app.status === 'Approved' || app.status === 'Rejected') return false;
  if (app.approvals.mentor === false) return false; // Blocked if mentor rejected
  return isYearCC(app, user) && app.approvals.cc === undefined;
};

/**
 * Determines if user can perform standard Approve/Reject (either as Mentor or as CC).
 */
export const canStaffApproveOrReject = (app: ODApplication, user: User | null): boolean => {
  return canMentorApproveOrReject(app, user) || canCcApproveOrReject(app, user);
};
