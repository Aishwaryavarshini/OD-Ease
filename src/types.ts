export type Role = 'Student' | 'Staff' | 'ODIncharge' | 'Principal';

export interface User {
  email: string;
  role: Role;
  name: string;
  id: string;
  department: string;
  year?: string;
  registerNumber?: string;
  mentorName?: string;
  mentorEmail?: string;
  studentCount?: number;
  isCc?: boolean;
  isCoCc?: boolean;
  ccYears?: string[];
}

export type ODStatus =
  | 'Pending Mentor Approval'
  | 'Pending CC/Co-CC Approval'
  | 'Pending Overall OD In-charge Approval'
  | 'Approved'
  | 'Rejected';

export interface ApprovalHistoryEntry {
  stage: 'Mentor' | 'CC' | 'ODIncharge' | 'DirectApproval';
  action: 'Approved' | 'Rejected' | 'Direct Approved';
  by: string;
  timestamp: number;
  reason?: string;
}

export interface ODApplication {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  year: string;
  mentorName?: string;
  mentorEmail?: string;
  ccName?: string;
  fromDate: string;
  toDate: string;
  isFullDay?: boolean;
  fromTime: string;
  toTime: string;
  event: string;
  venue: string;
  reason: string;
  supportingDocumentName?: string;
  supportingDocumentKey?: string;   // IndexedDB key for the uploaded file (preferred)
  supportingDocumentData?: string;  // legacy base64 fallback (kept for backward compat)
  status: ODStatus;
  rejectionReason?: string;
  approvals: {
    mentor?: boolean;
    cc?: boolean;
    odIncharge?: boolean;
  };
  directApproval?: boolean;
  directApprovedBy?: string;
  directApprovalTimestamp?: number;
  approvalHistory: ApprovalHistoryEntry[];
  timestamp: number;
}
