import React, { useState } from 'react';
import { ODApplication } from '../types';
import { Download, FileSpreadsheet, Eye, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

// HOD and Principal email config (connected to notification workflow)
export const HOD_EMAIL = 'amudha.j@trp.srmtrichy.edu.in';
export const PRINCIPAL_EMAIL = 'principal@trp.srmtrichy.edu.in';

interface Props {
  applications: ODApplication[];
}

type ReportFilter = 'All' | 'Approved' | 'Pending' | 'Rejected';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: map a year string to a canonical sheet name
// ─────────────────────────────────────────────────────────────────────────────
const yearToSheet = (year: string): string => {
  const y = (year || '').toLowerCase();
  if (y.includes('i year') || y === '1' || y.startsWith('1st') || y === 'i year') return '1st Year';
  if (y.includes('ii year') || y === '2' || y.startsWith('2nd') || y === 'ii year') return '2nd Year';
  if (y.includes('iii year') || y === '3' || y.startsWith('3rd') || y === 'iii year') return '3rd Year';
  if (y.includes('iv year') || y === '4' || y.startsWith('4th') || y === 'iv year') return '4th Year';
  return year || 'Unknown Year';
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: convert an array of row-objects to a formatted worksheet
// ─────────────────────────────────────────────────────────────────────────────
const toSheet = (rows: Record<string, string>[]) => {
  if (rows.length === 0) {
    // Create an empty sheet with just headers
    return XLSX.utils.aoa_to_sheet([
      ['Student Name','Register Number','Department','Year',
       'From Date','To Date','From Time','To Time','Full Day','Event / Purpose','Venue',
       'Reason / Description','Supporting Document',
       'Overall Status','Submitted At'],
    ]);
  }
  const ws = XLSX.utils.json_to_sheet(rows);
  // Auto-width columns
  const colWidths = Object.keys(rows[0]).map(key => ({
    wch: Math.max(key.length, ...rows.map(r => String(r[key] ?? '').length)) + 2,
  }));
  ws['!cols'] = colWidths;
  return ws;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: convert an ODApplication to an Excel row object
// ─────────────────────────────────────────────────────────────────────────────
const appToRow = (app: ODApplication): Record<string, string> => ({
  'Student Name': app.studentName,
  'Register Number': app.registerNumber,
  'Department': app.department,
  'Year': app.year,
  'From Date': app.fromDate || '',
  'To Date': app.toDate || '',
  'From Time': app.isFullDay ? '—' : (app.fromTime || '—'),
  'To Time': app.isFullDay ? '—' : (app.toTime || '—'),
  'Full Day': app.isFullDay ? 'Yes' : 'No',
  'Event / Purpose': app.event,
  'Venue': app.venue,
  'Reason / Description': app.reason,
  'Supporting Document': app.supportingDocumentName || 'None',
  'Overall Status': app.status,
  'Submitted At': new Date(app.timestamp).toLocaleString(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: save a workbook as a real .xlsx file download
// ─────────────────────────────────────────────────────────────────────────────
const saveWorkbook = (wb: XLSX.WorkBook, filename: string) => {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
};

export const CONFIGURED_DEPARTMENTS = ['EEE', 'ECE', 'CSE', 'AIML', 'Mechanical', 'Civil'];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const ODReportView: React.FC<Props> = ({ applications }) => {
  const { user } = useAuth();
  const [reportFilter, setReportFilter] = useState<ReportFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activePreviewSheet, setActivePreviewSheet] = useState<string>('');

  const userEmail = (user?.email || '').toLowerCase().trim();
  const isHOD = user?.role === 'HOD';
  const hodDept = user?.department || 'HOD';
  const isPrincipal = user?.role === 'Principal';

  // HOD scope: strictly Approved applications only
  const reportApps = isHOD
    ? applications.filter(a => a.status === 'Approved')
    : applications;

  const filtered = reportApps.filter(app => {
    const matchesFilter =
      reportFilter === 'All' ||
      (reportFilter === 'Approved' && app.status === 'Approved') ||
      (reportFilter === 'Pending' && app.status.includes('Pending')) ||
      (reportFilter === 'Rejected' && app.status === 'Rejected');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      app.studentName.toLowerCase().includes(q) ||
      app.registerNumber.toLowerCase().includes(q) ||
      app.event.toLowerCase().includes(q) ||
      app.department.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // ── Standard Export (Mentor / CC / OD Incharge view) ─────────────────────
  const exportStandardExcel = () => {
    const rows = filtered.map(appToRow);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, toSheet(rows), 'OD Report');
    const dateStr = new Date().toISOString().slice(0, 10);
    saveWorkbook(wb, `ODFlow_Report_${dateStr}.xlsx`);
  };

  // ── HOD Export: Approved only, split by Year ──────────────────────────────
  const exportHODExcel = () => {
    const approvedApps = reportApps.filter(a => a.status === 'Approved');
    const yearOrder = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const grouped: Record<string, ODApplication[]> = {};
    yearOrder.forEach(y => { grouped[y] = []; });

    approvedApps.forEach(app => {
      const sheet = yearToSheet(app.year);
      if (!grouped[sheet]) grouped[sheet] = [];
      grouped[sheet].push(app);
    });

    const wb = XLSX.utils.book_new();
    yearOrder.forEach(sheetName => {
      const rows = (grouped[sheetName] || []).map(appToRow);
      XLSX.utils.book_append_sheet(wb, toSheet(rows), sheetName);
    });

    Object.keys(grouped)
      .filter(k => !yearOrder.includes(k) && (grouped[k]?.length ?? 0) > 0)
      .forEach(sheetName => {
        const rows = grouped[sheetName].map(appToRow);
        XLSX.utils.book_append_sheet(wb, toSheet(rows), sheetName.slice(0, 31));
      });

    const dateStr = new Date().toISOString().slice(0, 10);
    saveWorkbook(wb, `${hodDept}_HOD_OD_Report_${dateStr}.xlsx`);
  };

  // ── Principal Export: Approved only, split by Department ─────────────────
  const exportPrincipalExcel = () => {
    const approvedApps = applications.filter(a => a.status === 'Approved');

    const deptsSet = new Set<string>([...CONFIGURED_DEPARTMENTS]);
    approvedApps.forEach(app => {
      if (app.department && app.department.trim()) {
        deptsSet.add(app.department.trim());
      }
    });

    const deptList = Array.from(deptsSet);
    const grouped: Record<string, ODApplication[]> = {};
    deptList.forEach(dept => { grouped[dept] = []; });

    approvedApps.forEach(app => {
      const dept = (app.department || 'EEE').trim();
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(app);
    });

    const wb = XLSX.utils.book_new();
    deptList.forEach(dept => {
      const rows = (grouped[dept] || []).map(appToRow);
      const sheetName = dept.slice(0, 31);
      XLSX.utils.book_append_sheet(wb, toSheet(rows), sheetName);
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    saveWorkbook(wb, `Principal_Institution_OD_Report_${dateStr}.xlsx`);
  };

  // ── Pick which export to run based on logged-in user ─────────────────────
  const handleExport = () => {
    if (isHOD) {
      exportHODExcel();
    } else if (isPrincipal) {
      exportPrincipalExcel();
    } else {
      exportStandardExcel();
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Approved') return <span className="badge badge-approved">Approved</span>;
    if (status === 'Rejected') return <span className="badge badge-rejected">Rejected</span>;
    return <span className="badge badge-pending">{status}</span>;
  };

  const counts = {
    all: reportApps.length,
    approved: reportApps.filter(a => a.status === 'Approved').length,
    pending: reportApps.filter(a => a.status.includes('Pending')).length,
    rejected: reportApps.filter(a => a.status === 'Rejected').length,
  };

  const exportLabel = isHOD
    ? 'Export HOD Report (Year-wise)'
    : isPrincipal
    ? 'Export Principal Report (Dept-wise)'
    : 'Export Excel';

  // ── Compute Preview Data Structure ─────────────────────────────────────────
  const getPreviewSheets = (): { name: string; rows: Record<string, string>[] }[] => {
    if (isHOD) {
      const approvedApps = applications.filter(a => a.status === 'Approved');
      const yearOrder = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
      const grouped: Record<string, ODApplication[]> = {};
      yearOrder.forEach(y => { grouped[y] = []; });
      approvedApps.forEach(app => {
        const sheet = yearToSheet(app.year);
        if (!grouped[sheet]) grouped[sheet] = [];
        grouped[sheet].push(app);
      });
      return yearOrder.map(y => ({
        name: y,
        rows: (grouped[y] || []).map(appToRow)
      }));
    }

    if (isPrincipal) {
      const approvedApps = applications.filter(a => a.status === 'Approved');
      const deptsSet = new Set<string>([...CONFIGURED_DEPARTMENTS]);
      approvedApps.forEach(app => {
        if (app.department && app.department.trim()) {
          deptsSet.add(app.department.trim());
        }
      });
      const deptList = Array.from(deptsSet);
      const grouped: Record<string, ODApplication[]> = {};
      deptList.forEach(dept => { grouped[dept] = []; });
      approvedApps.forEach(app => {
        const dept = (app.department || 'EEE').trim();
        if (!grouped[dept]) grouped[dept] = [];
        grouped[dept].push(app);
      });
      return deptList.map(dept => ({
        name: dept,
        rows: (grouped[dept] || []).map(appToRow)
      }));
    }

    // Standard view
    return [{ name: 'OD Report', rows: filtered.map(appToRow) }];
  };

  const previewSheets = getPreviewSheets();
  const currentSheetName = activePreviewSheet || previewSheets[0]?.name || '';
  const currentSheet = previewSheets.find(s => s.name === currentSheetName) || previewSheets[0] || { name: 'OD Report', rows: [] };

  return (
    <div>
      {/* Report Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">OD Report</h2>
          <p className="text-gray-500 text-sm">Real-time data from the application database</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setActivePreviewSheet(previewSheets[0]?.name || '');
              setShowPreviewModal(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <Eye size={16} />
            <span>Preview Report</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <FileSpreadsheet size={16} />
            <span>{exportLabel}</span>
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {([
          { label: 'Total', count: counts.all, color: 'border-blue-400', filter: 'All' as ReportFilter },
          { label: 'Approved', count: counts.approved, color: 'border-green-400', filter: 'Approved' as ReportFilter },
          { label: 'Pending', count: counts.pending, color: 'border-yellow-400', filter: 'Pending' as ReportFilter },
          { label: 'Rejected', count: counts.rejected, color: 'border-red-400', filter: 'Rejected' as ReportFilter },
        ]).map(({ label, count, color, filter }) => (
          <div
            key={label}
            onClick={() => setReportFilter(filter)}
            className={`card p-4 border-l-4 ${color} cursor-pointer hover:shadow-md transition ${reportFilter === filter ? 'ring-2 ring-blue-300' : ''}`}
          >
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card flex flex-col shadow-sm">
        <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
          <div className="flex space-x-4 px-1">
            {(['All', 'Approved', 'Pending', 'Rejected'] as ReportFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setReportFilter(f)}
                className={`text-sm font-medium pb-1 ${reportFilter === f ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search name, reg no, event…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg pl-3 pr-4 py-1.5 text-sm w-56 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-3 font-semibold">Student</th>
                <th className="p-3 font-semibold">Reg No.</th>
                <th className="p-3 font-semibold">Dept / Year</th>
                <th className="p-3 font-semibold">Mentor</th>
                <th className="p-3 font-semibold">Event</th>
                <th className="p-3 font-semibold">Dates</th>
                <th className="p-3 font-semibold">Duration</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">No records found.</td>
                </tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3 font-medium text-gray-900">{app.studentName}</td>
                    <td className="p-3 text-gray-600">{app.registerNumber}</td>
                    <td className="p-3 text-gray-600">
                      {app.department}<br />
                      <span className="text-xs text-gray-400">{app.year}</span>
                    </td>
                    <td className="p-3 text-gray-600 text-xs">{app.mentorName || '—'}</td>
                    <td className="p-3 text-gray-700 max-w-[180px]">
                      <div className="font-medium">{app.event}</div>
                      <div className="text-xs text-gray-400">{app.venue}</div>
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      {app.fromDate}{app.fromDate !== app.toDate ? ` → ${app.toDate}` : ''}
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      {app.isFullDay
                        ? <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-1.5 py-0.5 rounded">Full Day</span>
                        : `${app.fromTime || '?'} – ${app.toTime || '?'}`}
                    </td>
                    <td className="p-3">{getStatusBadge(app.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t text-sm text-gray-500">
          Showing {filtered.length} of {applications.length} records
        </div>
      </div>

      {/* ── REPORT PREVIEW MODAL ────────────────────────────────────────────── */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {isHOD ? `Report Preview (${hodDept} HOD – Year-wise Sheets)` : isPrincipal ? 'Report Preview (Principal Department-wise Sheets)' : 'OD Report Preview'}
                </h3>
                <p className="text-xs text-gray-500">Inspect full database report columns before downloading Excel</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sheet Tabs if multi-sheet */}
            {previewSheets.length > 1 && (
              <div className="px-6 border-b bg-gray-100 flex space-x-2 overflow-x-auto pt-2">
                {previewSheets.map(sheet => (
                  <button
                    key={sheet.name}
                    onClick={() => setActivePreviewSheet(sheet.name)}
                    className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                      currentSheetName === sheet.name
                        ? 'bg-white text-blue-600 border-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 border-transparent'
                    }`}
                  >
                    {sheet.name} ({sheet.rows.length})
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable Table View of Real Report Data */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase tracking-wider border-b">
                      <th className="p-3 font-bold">#</th>
                      <th className="p-3 font-bold whitespace-nowrap">Student Name</th>
                      <th className="p-3 font-bold whitespace-nowrap">Register Number</th>
                      <th className="p-3 font-bold whitespace-nowrap">Department</th>
                      <th className="p-3 font-bold whitespace-nowrap">Year</th>
                      <th className="p-3 font-bold whitespace-nowrap">From Date</th>
                      <th className="p-3 font-bold whitespace-nowrap">To Date</th>
                      <th className="p-3 font-bold whitespace-nowrap">From Time</th>
                      <th className="p-3 font-bold whitespace-nowrap">To Time</th>
                      <th className="p-3 font-bold whitespace-nowrap">Full Day</th>
                      <th className="p-3 font-bold whitespace-nowrap">Event / Purpose</th>
                      <th className="p-3 font-bold whitespace-nowrap">Venue</th>
                      <th className="p-3 font-bold whitespace-nowrap">Reason / Description</th>
                      <th className="p-3 font-bold whitespace-nowrap">Supporting Doc</th>
                      <th className="p-3 font-bold whitespace-nowrap">Overall Status</th>
                      <th className="p-3 font-bold whitespace-nowrap">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentSheet.rows.length === 0 ? (
                      <tr>
                        <td colSpan={16} className="p-8 text-center text-gray-400 italic">
                          No records present in sheet: {currentSheetName}
                        </td>
                      </tr>
                    ) : (
                      currentSheet.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3 font-medium text-gray-400">{idx + 1}</td>
                          <td className="p-3 font-bold text-gray-900 whitespace-nowrap">{row['Student Name']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['Register Number']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['Department']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['Year']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['From Date']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['To Date']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['From Time']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['To Time']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['Full Day']}</td>
                          <td className="p-3 text-gray-800 font-medium min-w-[150px]">{row['Event / Purpose']}</td>
                          <td className="p-3 text-gray-700 min-w-[120px]">{row['Venue']}</td>
                          <td className="p-3 text-gray-600 max-w-[250px] truncate" title={row['Reason / Description']}>{row['Reason / Description']}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">{row['Supporting Document']}</td>
                          <td className="p-3 whitespace-nowrap">{getStatusBadge(row['Overall Status'])}</td>
                          <td className="p-3 text-gray-500 whitespace-nowrap text-[11px]">{row['Submitted At']}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Total {currentSheet.rows.length} record(s) in {currentSheetName}
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleExport();
                    setShowPreviewModal(false);
                  }}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition"
                >
                  <FileSpreadsheet size={16} />
                  <span>Download Excel File</span>
                  <Download size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ODReportView;

