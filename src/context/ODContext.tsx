import React, { createContext, useContext, useState, useEffect } from 'react';
import { ODApplication, ODStatus, ApprovalHistoryEntry } from '../types';
import { supabase } from '../lib/supabase';

interface ODContextType {
  applications: ODApplication[];
  loading: boolean;
  error: string | null;
  addApplication: (app: Omit<ODApplication, 'id' | 'status' | 'approvals' | 'approvalHistory' | 'timestamp'>) => Promise<{ error: string | null }>;
  updateApplicationStatus: (id: string, status: ODStatus, role: string, byName: string, rejectReason?: string) => Promise<{ error: string | null }>;
  directApprove: (id: string, byName: string) => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
}

const ODContext = createContext<ODContextType | undefined>(undefined);

export const calculateODStatus = (
  approvals?: { mentor?: boolean; cc?: boolean; odIncharge?: boolean },
  rawStatus?: string
): ODStatus => {
  if (approvals && typeof approvals === 'object') {
    if (approvals.odIncharge === true) {
      return 'Approved';
    }
    if (approvals.odIncharge === false) {
      return 'Rejected';
    }
    if (approvals.cc === true || approvals.cc === false || approvals.mentor === false) {
      return 'Pending Overall OD In-charge Approval';
    }
    if (approvals.mentor === true) {
      return 'Pending CC/Co-CC Approval';
    }
  }

  if (rawStatus === 'Approved') return 'Approved';
  if (rawStatus === 'Rejected') return 'Rejected';
  if (rawStatus === 'Pending CC Approval' || rawStatus === 'Pending CC/Co-CC Approval') {
    return 'Pending CC/Co-CC Approval';
  }
  if (rawStatus === 'Pending OD Incharge Approval' || rawStatus === 'Pending Overall OD In-charge Approval') {
    return 'Pending Overall OD In-charge Approval';
  }

  return 'Pending Mentor Approval';
};

/**
 * Map a raw Supabase row (with lowercase column names) to an ODApplication object.
 * Postgres lowercases all unquoted column names, so we must read both casings for safety.
 */
const mapRowToApp = (row: any): ODApplication => {
  const approvals =
    typeof row.approvals === 'object' && row.approvals ? row.approvals : {};
  return {
    id: String(row.id),
    studentId: row.studentid || row.studentId || '',
    studentName: row.studentname || row.studentName || '',
    registerNumber: row.registernumber || row.registerNumber || '',
    department: row.department || 'EEE',
    year: row.year || 'III Year',
    mentorName: row.mentorname || row.mentorName || undefined,
    mentorEmail: row.mentoremail || row.mentorEmail || undefined,
    fromDate: row.fromdate || row.fromDate || '',
    toDate: row.todate || row.toDate || '',
    isFullDay: row.isfullday ?? row.isFullDay ?? true,
    fromTime: row.fromtime || row.fromTime || '',
    toTime: row.totime || row.toTime || '',
    event: row.event || '',
    venue: row.venue || '',
    reason: row.reason || '',
    supportingDocumentName: row.supportingdocumentname || row.supportingDocumentName || undefined,
    supportingDocumentKey: row.supportingdocumentkey || row.supportingDocumentKey || undefined,
    supportingDocumentData: row.supportingdocumentdata || row.supportingDocumentData || undefined,
    status: calculateODStatus(approvals, row.status),
    rejectionReason: row.rejectionreason || row.rejectionReason || undefined,
    approvals,
    directApproval: row.directapproval || row.directApproval || false,
    directApprovedBy: row.directapprovedby || row.directApprovedBy || undefined,
    directApprovalTimestamp: (row.directapprovaltimestamp || row.directApprovalTimestamp)
      ? Number(row.directapprovaltimestamp || row.directApprovalTimestamp)
      : undefined,
    approvalHistory: Array.isArray(row.approvalhistory || row.approvalHistory)
      ? (row.approvalhistory || row.approvalHistory)
      : [],
    timestamp: Number(row.timestamp) || Date.now(),
  };
};

export const ODProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<ODApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationsFromSupabase = async () => {
    try {
      const { data, error: fetchErr } = await supabase
        .from('od_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) {
        console.error('Supabase fetch od_applications error:', fetchErr.message);
        setError(fetchErr.message || 'Failed to load OD applications from database');
      } else if (data) {
        setError(null);
        const mapped = data.map(mapRowToApp);
        setApplications(mapped);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching od_applications:', err);
      setError(err.message || 'An unexpected error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationsFromSupabase();

    // Realtime subscription: re-fetch on any change to od_applications
    const subscription = supabase
      .channel('public:od_applications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'od_applications' },
        () => {
          fetchApplicationsFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addApplication = async (
    appData: Omit<ODApplication, 'id' | 'status' | 'approvals' | 'approvalHistory' | 'timestamp'>
  ): Promise<{ error: string | null }> => {
    const newId = Math.random().toString(36).substring(2, 10);
    const now = Date.now();

    // Use lowercase column names matching Postgres
    const newAppRow = {
      id: newId,
      studentid: appData.studentId,
      studentname: appData.studentName,
      registernumber: appData.registerNumber,
      department: appData.department,
      year: appData.year,
      mentorname: appData.mentorName || null,
      mentoremail: appData.mentorEmail || null,
      fromdate: appData.fromDate,
      todate: appData.toDate,
      fromtime: appData.fromTime || null,
      totime: appData.toTime || null,
      event: appData.event,
      venue: appData.venue,
      reason: appData.reason,
      isfullday: appData.isFullDay ?? true,
      supportingdocumentname: appData.supportingDocumentName || null,
      supportingdocumentkey: appData.supportingDocumentKey || null,
      supportingdocumentdata: appData.supportingDocumentData || null,
      status: 'Pending Mentor Approval',
      approvals: {},
      approvalhistory: [],
      timestamp: now,
    };

    // Optimistic update so student sees OD immediately
    const optimisticApp: ODApplication = {
      ...appData,
      id: newId,
      status: 'Pending Mentor Approval',
      approvals: {},
      approvalHistory: [],
      timestamp: now,
    };

    setApplications(prev => [optimisticApp, ...prev]);

    const { error: insertErr } = await supabase.from('od_applications').insert([newAppRow]);

    if (insertErr) {
      console.error('Error inserting application to Supabase:', insertErr.message);
      setError(insertErr.message);
      setApplications(prev => prev.filter(a => a.id !== newId));
      return { error: insertErr.message };
    } else {
      await fetchApplicationsFromSupabase();
      return { error: null };
    }
  };

  const updateApplicationStatus = async (
    id: string,
    status: ODStatus,
    role: string,
    byName: string,
    rejectReason?: string
  ): Promise<{ error: string | null }> => {
    const existing = applications.find(a => a.id === id);
    if (!existing) return { error: 'Application not found' };

    const newApprovals = { ...existing.approvals };
    const isReject = status === 'Rejected' || rejectReason !== undefined;

    if (role === 'Mentor') newApprovals.mentor = !isReject;
    if (role === 'CC') newApprovals.cc = !isReject;
    if (role === 'ODIncharge') newApprovals.odIncharge = !isReject;

    const newOverallStatus: ODStatus = calculateODStatus(newApprovals);

    const historyEntry: ApprovalHistoryEntry = {
      stage: role as any,
      action: isReject ? 'Rejected' : 'Approved',
      by: byName,
      timestamp: Date.now(),
      reason: rejectReason,
    };

    const newHistory = [...existing.approvalHistory, historyEntry];
    const finalRejectionReason = isReject
      ? (rejectReason || existing.rejectionReason || 'No reason provided')
      : undefined;

    // Optimistic UI update
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? {
              ...app,
              status: newOverallStatus,
              approvals: newApprovals,
              rejectionReason: finalRejectionReason,
              approvalHistory: newHistory,
            }
          : app
      )
    );

    const { error: updateErr } = await supabase
      .from('od_applications')
      .update({
        status: newOverallStatus,
        approvals: newApprovals,
        rejectionreason: finalRejectionReason || null,
        approvalhistory: newHistory,
      })
      .eq('id', id);

    if (updateErr) {
      console.error('Error updating application in Supabase:', updateErr.message);
      setError(updateErr.message);
      await fetchApplicationsFromSupabase();
      return { error: updateErr.message };
    }
    return { error: null };
  };

  const directApprove = async (id: string, byName: string): Promise<{ error: string | null }> => {
    const existing = applications.find(a => a.id === id);
    if (!existing) return { error: 'Application not found' };

    const now = Date.now();
    const historyEntry: ApprovalHistoryEntry = {
      stage: 'DirectApproval',
      action: 'Direct Approved',
      by: byName,
      timestamp: now,
    };

    const newHistory = [...existing.approvalHistory, historyEntry];
    const newApprovals = { ...existing.approvals, odIncharge: true };

    // Optimistic UI update
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? {
              ...app,
              status: 'Approved' as ODStatus,
              directApproval: true,
              directApprovedBy: byName,
              directApprovalTimestamp: now,
              approvals: newApprovals,
              approvalHistory: newHistory,
            }
          : app
      )
    );

    const { error: updateErr } = await supabase
      .from('od_applications')
      .update({
        status: 'Approved',
        directapproval: true,
        directapprovedby: byName,
        directapprovaltimestamp: now,
        approvals: newApprovals,
        approvalhistory: newHistory,
      })
      .eq('id', id);

    if (updateErr) {
      console.error('Error direct approving application in Supabase:', updateErr.message);
      setError(updateErr.message);
      await fetchApplicationsFromSupabase();
      return { error: updateErr.message };
    }
    return { error: null };
  };

  return (
    <ODContext.Provider
      value={{
        applications,
        loading,
        error,
        addApplication,
        updateApplicationStatus,
        directApprove,
        refetch: fetchApplicationsFromSupabase,
      }}
    >
      {children}
    </ODContext.Provider>
  );
};

export const useOD = () => {
  const context = useContext(ODContext);
  if (!context) throw new Error('useOD must be used within an ODProvider');
  return context;
};
