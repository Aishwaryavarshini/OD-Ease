import React, { useState, useEffect, useRef } from 'react';
import { MasterStudent } from '../data/masterData';
import {
  getMasterStudentsSync,
  updateMasterStudent,
  initMasterStudents,
  bulkUpsertStudents,
  bulkUpsertStaff,
  fetchMasterStaff,
  provisionAuthAccountsAuto,
} from '../lib/masterStudentsService';
import { Search, Upload, Edit2, CheckCircle, AlertCircle, RefreshCw, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ParsedRow {
  registerNumber: string;
  name: string;
  gender: string;
  year: string;
  department: string;
  mentorName: string;
  mentorEmail: string;
  ccName?: string;
  ccEmail?: string;
  coCcName?: string;
  coCcEmail?: string;
  studentEmail?: string;
  isValid: boolean;
  errors: string[];
}

interface ImportSummary {
  studentsDetected: number;
  staffDetected: number;
  validRecords: number;
  invalidRecords: number;
  newStudentAccounts: number;
  existingStudentAccounts: number;
  newStaffAccounts: number;
  existingStaffAccounts: number;
}

const HODMasterDBView: React.FC = () => {
  const { user } = useAuth();
  const hodDept = user?.department;

  const [students, setStudents] = useState<MasterStudent[]>([]);
  const [existingStaff, setExistingStaff] = useState<{ email: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<MasterStudent>({
    registerNumber: '',
    name: '',
    gender: 'M',
    year: 'II Year',
    department: 'EEE',
    mentorName: '',
    mentorEmail: '',
  });

  // CSV Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [staffListToImport, setStaffListToImport] = useState<{ email: string; name: string; role: string; department: string; year?: string }[]>([]);
  const [validStudentsToImport, setValidStudentsToImport] = useState<MasterStudent[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await initMasterStudents();
    setStudents(data);
    const staff = await fetchMasterStaff();
    setExistingStaff(staff);
    setLoading(false);
  };

  useEffect(() => {
    setStudents(getMasterStudentsSync());
    loadData();
  }, []);

  const handleOpenEditModal = (student: MasterStudent) => {
    setFormData({ ...student });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.registerNumber.trim() || !formData.name.trim()) {
      setMessage({ type: 'error', text: 'Register Number and Student Name are required.' });
      return;
    }

    if (!formData.mentorName.trim() || !formData.mentorEmail.trim()) {
      setMessage({ type: 'error', text: 'Assigned Mentor Name and Email are required.' });
      return;
    }

    setLoading(true);
    const res = await updateMasterStudent(formData);
    setLoading(false);

    if (res.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({
        type: 'success',
        text: 'Student record updated successfully in Supabase backend!',
      });
      setShowEditModal(false);
      loadData();
    }
  };

  // CSV Parse & Validate
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCSV(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const parseCSV = (content: string) => {
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setMessage({ type: 'error', text: 'CSV file must contain a header row and at least one data row.' });
      return;
    }

    // Header mapping (case-insensitive)
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine).map(h => h.trim().toLowerCase());

    const findCol = (possibleNames: string[]) => {
      return headers.findIndex(h => possibleNames.some(name => h.includes(name)));
    };

    const regIdx = findCol(['register', 'regno', 'reg_no', 'reg']);
    const nameIdx = findCol(['name', 'student_name', 'studentname']);
    const genderIdx = findCol(['gender', 'sex']);
    const yearIdx = findCol(['year', 'academic_year', 'academicyear']);
    const deptIdx = findCol(['department', 'dept', 'branch']);
    const mentorNameIdx = findCol(['mentor_name', 'mentorname', 'mentor']);
    const mentorEmailIdx = findCol(['mentor_email', 'mentoremail']);
    const ccNameIdx = findCol(['cc_name', 'ccname']);
    const ccEmailIdx = findCol(['cc_email', 'ccemail']);
    const coCcNameIdx = findCol(['cocc_name', 'coccname', 'co_cc_name']);
    const coCcEmailIdx = findCol(['cocc_email', 'coccemail', 'co_cc_email']);

    const rows: ParsedRow[] = [];
    const seenRegNumbers = new Set<string>();
    const staffMap = new Map<string, { email: string; name: string; role: string; department: string; year?: string }>();

    for (let i = 1; i < lines.length; i++) {
      const colValues = parseCSVLine(lines[i]);
      if (colValues.length === 0 || colValues.every(c => !c.trim())) continue;

      const regNo = regIdx >= 0 ? colValues[regIdx]?.trim() || '' : '';
      const name = nameIdx >= 0 ? colValues[nameIdx]?.trim() || '' : '';
      const gender = genderIdx >= 0 ? colValues[genderIdx]?.trim() || 'M' : 'M';
      const year = yearIdx >= 0 ? colValues[yearIdx]?.trim() || 'II Year' : 'II Year';
      const dept = deptIdx >= 0 ? colValues[deptIdx]?.trim() || 'EEE' : 'EEE';
      const mentorName = mentorNameIdx >= 0 ? colValues[mentorNameIdx]?.trim() || '' : '';
      const mentorEmail = mentorEmailIdx >= 0 ? colValues[mentorEmailIdx]?.trim() || '' : '';
      const ccName = ccNameIdx >= 0 ? colValues[ccNameIdx]?.trim() : '';
      const ccEmail = ccEmailIdx >= 0 ? colValues[ccEmailIdx]?.trim() : '';
      const coCcName = coCcNameIdx >= 0 ? colValues[coCcNameIdx]?.trim() : '';
      const coCcEmail = coCcEmailIdx >= 0 ? colValues[coCcEmailIdx]?.trim() : '';

      const errors: string[] = [];

      // Validation
      if (!regNo) errors.push('Missing Register Number');
      if (!name) errors.push('Missing Student Name');
      if (!mentorName) errors.push('Missing Mentor Name');
      if (!mentorEmail) errors.push('Missing Mentor Email');

      // Check duplicates in CSV
      if (regNo && seenRegNumbers.has(regNo)) {
        errors.push(`Duplicate Register Number in CSV: ${regNo}`);
      } else if (regNo) {
        seenRegNumbers.add(regNo);
      }

      // Generate email if valid register number
      let derivedStudentEmail: string | undefined = undefined;
      const isValidReg = /^\d{8,15}$/.test(regNo);
      if (isValidReg) {
        derivedStudentEmail = `${regNo}@trp.srmtrichy.edu.in`;
      }

      const isValid = errors.length === 0;

      rows.push({
        registerNumber: regNo,
        name,
        gender,
        year,
        department: dept,
        mentorName,
        mentorEmail,
        ccName,
        ccEmail,
        coCcName,
        coCcEmail,
        studentEmail: derivedStudentEmail,
        isValid,
        errors,
      });

      // Extract staff records from valid rows
      if (mentorEmail && mentorName) {
        staffMap.set(mentorEmail.toLowerCase(), {
          email: mentorEmail.toLowerCase(),
          name: mentorName,
          role: 'Mentor',
          department: dept,
        });
      }
      if (ccEmail && ccName) {
        staffMap.set(ccEmail.toLowerCase(), {
          email: ccEmail.toLowerCase(),
          name: ccName,
          role: 'CC',
          department: dept,
          year,
        });
      }
      if (coCcEmail && coCcName) {
        staffMap.set(coCcEmail.toLowerCase(), {
          email: coCcEmail.toLowerCase(),
          name: coCcName,
          role: 'Co-CC',
          department: dept,
          year,
        });
      }
    }

    const validStudents: MasterStudent[] = rows
      .filter(r => r.isValid)
      .map(r => ({
        registerNumber: r.registerNumber,
        name: r.name,
        gender: r.gender,
        year: r.year,
        department: r.department,
        mentorName: r.mentorName,
        mentorEmail: r.mentorEmail,
        ccName: r.ccName,
        ccEmail: r.ccEmail,
        coCcName: r.coCcName,
        coCcEmail: r.coCcEmail,
        studentEmail: r.studentEmail,
      }));

    const extractedStaff = Array.from(staffMap.values());

    // Calculate Summary stats
    const existingRegNos = new Set(students.map(s => s.registerNumber));
    const existingStaffEmails = new Set(existingStaff.map(s => s.email.toLowerCase()));

    let newStudentAccounts = 0;
    let existingStudentAccounts = 0;
    validStudents.forEach(s => {
      if (existingRegNos.has(s.registerNumber)) {
        existingStudentAccounts++;
      } else {
        newStudentAccounts++;
      }
    });

    let newStaffAccounts = 0;
    let existingStaffAccounts = 0;
    extractedStaff.forEach(s => {
      if (existingStaffEmails.has(s.email.toLowerCase())) {
        existingStaffAccounts++;
      } else {
        newStaffAccounts++;
      }
    });

    setParsedRows(rows);
    setValidStudentsToImport(validStudents);
    setStaffListToImport(extractedStaff);
    setSummary({
      studentsDetected: rows.length,
      staffDetected: extractedStaff.length,
      validRecords: validStudents.length,
      invalidRecords: rows.length - validStudents.length,
      newStudentAccounts,
      existingStudentAccounts,
      newStaffAccounts,
      existingStaffAccounts,
    });

    setShowUploadModal(true);
  };

  const parseCSVLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  };

  const handleConfirmImport = async () => {
    if (validStudentsToImport.length === 0) {
      setMessage({ type: 'error', text: 'No valid student records to import.' });
      setShowUploadModal(false);
      return;
    }

    setLoading(true);

    // Enforce HOD Department Isolation if applicable
    const finalStudentsToImport = (hodDept && hodDept !== 'All Departments' && hodDept !== 'All')
      ? validStudentsToImport.map(s => ({ ...s, department: hodDept }))
      : validStudentsToImport;

    const finalStaffToImport = (hodDept && hodDept !== 'All Departments' && hodDept !== 'All')
      ? staffListToImport.map(st => ({ ...st, department: hodDept }))
      : staffListToImport;

    // 1. Bulk upsert students to master_students
    const studentRes = await bulkUpsertStudents(finalStudentsToImport);

    // 2. Bulk upsert staff to master_staff
    if (finalStaffToImport.length > 0) {
      await bulkUpsertStaff(finalStaffToImport);
    }

    // 3. Automatically provision Supabase Auth accounts for students & staff
    const provisionRes = await provisionAuthAccountsAuto(finalStudentsToImport, finalStaffToImport);

    setLoading(false);
    setShowUploadModal(false);

    if (studentRes.error) {
      setMessage({ type: 'error', text: `Import failed: ${studentRes.error}` });
    } else {
      setMessage({
        type: 'success',
        text: `Master Database imported successfully for ${hodDept || 'department'}! Persisted ${studentRes.count} student records and ${finalStaffToImport.length} staff records. Automatically provisioned ${provisionRes.created} new Auth accounts (${provisionRes.existing} existing preserved).`,
      });
      loadData();
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesDept = !hodDept || hodDept === 'All Departments' || hodDept === 'All' || s.department === hodDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.registerNumber.toLowerCase().includes(q) ||
      s.mentorName.toLowerCase().includes(q) ||
      s.mentorEmail.toLowerCase().includes(q);

    const matchesYear = yearFilter === 'All' || s.year === yearFilter;

    return matchesDept && matchesSearch && matchesYear;
  });

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Master Database</h2>
          <p className="text-gray-500 text-sm">
            Authoritative student roster & staff mentor/CC mapping (Persisted in Supabase)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <Upload size={16} />
            <span>Upload CSV</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={18} className="text-green-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
        <div className="flex space-x-2">
          {['All', 'I Year', 'II Year', 'III Year', 'IV Year'].map(y => (
            <button
              key={y}
              onClick={() => setYearFilter(y)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                yearFilter === y
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search register no, name, mentor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Master Students Table */}
      <div className="card shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                <th className="p-4 font-semibold">Register No.</th>
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Gender</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Assigned Mentor</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No student records found in Master DB.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.registerNumber} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-mono font-medium text-gray-900">{student.registerNumber}</td>
                    <td className="p-4 font-bold text-gray-800">{student.name}</td>
                    <td className="p-4 text-gray-600">{student.gender || '—'}</td>
                    <td className="p-4 text-gray-600 font-medium">{student.year}</td>
                    <td className="p-4 text-gray-600">{student.department}</td>
                    <td className="p-4 text-gray-700">
                      <div className="font-medium">{student.mentorName}</div>
                      <div className="text-xs text-gray-400">{student.mentorEmail}</div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenEditModal(student)}
                        className="inline-flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-semibold transition"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t text-sm text-gray-500 flex justify-between items-center">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <span className="text-xs text-gray-400">Source: Supabase DB master_students</span>
        </div>
      </div>

      {/* CSV Preview & Summary Modal */}
      {showUploadModal && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-900 text-white">
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold">CSV Master Database Import Preview</h3>
                  <p className="text-xs text-gray-400">Validate data before confirming database persistence</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Import Summary Grid */}
              <div className="bg-gray-50 border rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Import Analysis Summary
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-gray-500 text-xs">Students Detected</div>
                    <div className="text-xl font-bold text-gray-900">{summary.studentsDetected}</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-gray-500 text-xs">Staff Detected</div>
                    <div className="text-xl font-bold text-purple-900">{summary.staffDetected}</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-gray-500 text-xs">Valid Records</div>
                    <div className="text-xl font-bold text-green-600">{summary.validRecords}</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-gray-500 text-xs">Invalid Records</div>
                    <div className="text-xl font-bold text-red-600">{summary.invalidRecords}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 border-t pt-3">
                  <div>New Student Accounts: <span className="font-bold text-gray-900">{summary.newStudentAccounts}</span></div>
                  <div>Existing Student Accounts: <span className="font-bold text-gray-900">{summary.existingStudentAccounts}</span></div>
                  <div>New Staff Accounts: <span className="font-bold text-gray-900">{summary.newStaffAccounts}</span></div>
                  <div>Existing Staff Accounts: <span className="font-bold text-gray-900">{summary.existingStaffAccounts}</span></div>
                </div>
              </div>

              {/* Data Rows Preview */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Parsed CSV Records ({parsedRows.length} Rows)
                </h4>

                <div className="border rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-100 text-gray-600 sticky top-0">
                      <tr>
                        <th className="p-2 border-b">Status</th>
                        <th className="p-2 border-b">Register No</th>
                        <th className="p-2 border-b">Name</th>
                        <th className="p-2 border-b">Year</th>
                        <th className="p-2 border-b">Mentor</th>
                        <th className="p-2 border-b">Derived Student Email</th>
                        <th className="p-2 border-b">Validation Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {parsedRows.map((row, idx) => (
                        <tr key={idx} className={row.isValid ? 'hover:bg-gray-50' : 'bg-red-50/50'}>
                          <td className="p-2 font-bold">
                            {row.isValid ? (
                              <span className="text-green-600 flex items-center"><CheckCircle size={12} className="mr-1" /> Valid</span>
                            ) : (
                              <span className="text-red-600 flex items-center"><AlertCircle size={12} className="mr-1" /> Invalid</span>
                            )}
                          </td>
                          <td className="p-2 font-mono font-bold text-gray-800">{row.registerNumber || '—'}</td>
                          <td className="p-2 font-medium">{row.name || '—'}</td>
                          <td className="p-2">{row.year}</td>
                          <td className="p-2">{row.mentorName || '—'}</td>
                          <td className="p-2 font-mono text-gray-500">{row.studentEmail || 'Require valid account info'}</td>
                          <td className="p-2 text-red-600">
                            {row.errors.length > 0 ? row.errors.join('; ') : <span className="text-gray-400 font-normal">Ready for import</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-between items-center bg-gray-50">
              <span className="text-xs text-gray-500">
                Note: No database changes take effect until you click <strong>Import Database</strong>.
              </span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={loading || summary.validRecords === 0}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Importing...' : 'Import Database'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Update Student Record</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Register Number
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.registerNumber}
                  className="input-field bg-gray-100 cursor-not-allowed text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Academic Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="input-field"
                  >
                    <option value="I Year">I Year</option>
                    <option value="II Year">II Year</option>
                    <option value="III Year">III Year</option>
                    <option value="IV Year">IV Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
                  Assigned Mentor Details
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mentor Name
                    </label>
                    <input
                      type="text"
                      value={formData.mentorName}
                      onChange={e => setFormData({ ...formData, mentorName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mentor Email
                    </label>
                    <input
                      type="email"
                      value={formData.mentorEmail}
                      onChange={e => setFormData({ ...formData, mentorEmail: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODMasterDBView;

