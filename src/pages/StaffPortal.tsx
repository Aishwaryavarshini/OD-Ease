import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOD } from '../context/ODContext';
import { Bell, Home, FileText, CheckCircle, Calendar, PieChart, User as UserIcon, Filter, Database } from 'lucide-react';
import { ODApplication } from '../types';
import { MASTER_CC_MAPPINGS, MASTER_MENTORS } from '../data/masterData';
import { getMasterStudentsSync } from '../lib/masterStudentsService';
import ODApplicationModal from '../components/ODApplicationModal';
import ODReportView from '../components/ODReportView';
import HODMasterDBView from '../components/HODMasterDBView';

const StaffPortal = () => {
  const { user, logout } = useAuth();
  const { applications, updateApplicationStatus } = useOD();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ODApplication | null>(null);

  const userEmail = (user?.email || '').toLowerCase().trim();
  const isHod = user?.role === 'HOD';
  const hodDepartment = isHod ? (user?.department || '') : '';

  const [activeView, setActiveView] = useState<'dashboard' | 'report' | 'calendar' | 'master-db'>(
    isHod ? 'report' : 'dashboard'
  );

  useEffect(() => {
    if (isHod && activeView === 'dashboard') {
      setActiveView('report');
    }
  }, [isHod, activeView]);

  // Check if logged in staff is the student's assigned mentor
  const isAssignedMentor = (app: ODApplication) => {
    if (!user?.email) return false;
    if (app.mentorEmail && app.mentorEmail.toLowerCase().trim() === userEmail) return true;
    const liveStudents = getMasterStudentsSync();
    const studentMaster = liveStudents.find(s => s.registerNumber === app.registerNumber);
    if (studentMaster && studentMaster.mentorEmail.toLowerCase().trim() === userEmail) return true;
    if (app.mentorName && user.name && app.mentorName.toLowerCase().trim() === user.name.toLowerCase().trim()) return true;
    return false;
  };

  // Check if logged in staff is CC or Co-CC for the student's Year and Department
  const isYearCC = (app: ODApplication) => {
    if (!user?.email) return false;
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

  // Staff members see applications from their assigned mentees OR their CC/Co-CC batch
  const relevantApps = applications.filter(app => isAssignedMentor(app) || isYearCC(app));

  const filteredApps = relevantApps.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.event.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'Pending') return app.status.includes('Pending') && matchesSearch;
    if (filter === 'Approved') return app.status === 'Approved' && matchesSearch;
    if (filter === 'Rejected') return app.status === 'Rejected' && matchesSearch;
    return matchesSearch;
  });

  const pendingCount = relevantApps.filter(a => a.status.includes('Pending')).length;
  const approvedCount = relevantApps.filter(a => a.status === 'Approved').length;
  const rejectedCount = relevantApps.filter(a => a.status === 'Rejected').length;

  // Real mentee student count for the mentor
  const mentorData = user?.email ? MASTER_MENTORS[user.email.toLowerCase()] : null;
  const assignedStudentCount = mentorData ? mentorData.studentCount : (user?.studentCount || relevantApps.length);

  const handleApprove = (app: ODApplication) => {
    if (!user) return;
    if (app.approvals.mentor === false) {
      alert('This application was rejected by the mentor. CC approval is blocked. Only OD Incharge can approve.');
      return;
    }
    if (app.status === 'Rejected' || app.status === 'Approved') {
      alert('This application is already finalised.');
      return;
    }

    const canMentorApprove = isAssignedMentor(app) && app.approvals.mentor === undefined;
    const canCcApprove = isYearCC(app) && app.approvals.cc === undefined && (app.approvals.mentor as boolean | undefined) !== false;

    if (canMentorApprove) {
      updateApplicationStatus(app.id, 'Approved', 'Mentor', user.name);
    } else if (canCcApprove) {
      updateApplicationStatus(app.id, 'Approved', 'CC', user.name);
    } else {
      alert('You are not authorised to approve this application at its current stage.');
    }
  };

  const handleReject = (app: ODApplication) => {
    if (!user) return;
    if (app.status === 'Approved' || app.status === 'Rejected') {
      alert('This application is already finalised.');
      return;
    }
    const reason = window.prompt('Please enter the reason for rejection:');
    if (reason !== null) {
      const role = (isAssignedMentor(app) && app.approvals.mentor === undefined) ? 'Mentor' : 'CC';
      updateApplicationStatus(app.id, 'Rejected', role, user.name, reason || 'No reason provided');
    }
  };

  // Show visible status to staff
  const getDisplayStatus = (app: ODApplication) => {
    if (app.status === 'Approved') return <span className="badge badge-approved">Approved</span>;
    if (app.status === 'Rejected') return <span className="badge badge-rejected">Rejected</span>;
    return <span className="badge badge-pending">{app.status}</span>;
  };

  // Determine if this user can still take action
  const canAct = (app: ODApplication) => {
    if (app.status === 'Approved' || app.status === 'Rejected') return false;
    const canMentor = isAssignedMentor(app) && app.approvals.mentor === undefined;
    const canCc = isYearCC(app) && app.approvals.cc === undefined && (app.approvals.mentor as boolean | undefined) !== false;
    return canMentor || canCc;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-full z-20">
        <div className="p-4 border-b flex flex-col items-center py-6">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md">
            TRP
          </div>
          <div className="text-center">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 uppercase">TRP Engineering College</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Trichy</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {!isHod && (
            <button
              onClick={() => setActiveView('dashboard')}
              className={`sidebar-link w-full text-left ${activeView === 'dashboard' ? 'active' : ''}`}
            >
              <Home size={18} className="mr-3"/> Dashboard
            </button>
          )}

          <button
            onClick={() => setActiveView('report')}
            className={`sidebar-link w-full text-left ${activeView === 'report' ? 'active' : ''}`}
          >
            <PieChart size={18} className="mr-3"/> Reports
          </button>

          <button
            onClick={() => setActiveView('calendar')}
            className={`sidebar-link w-full text-left ${activeView === 'calendar' ? 'active' : ''}`}
          >
            <Calendar size={18} className="mr-3"/> Calendar
          </button>

          {isHod && (
            <button
              onClick={() => setActiveView('master-db')}
              className={`sidebar-link w-full text-left ${activeView === 'master-db' ? 'active' : ''}`}
            >
              <Database size={18} className="mr-3"/> Master DB
            </button>
          )}
        </nav>


        <div className="p-4 border-t bg-blue-50/50">
          <div className="flex items-center space-x-3">
             <div className="bg-blue-600 rounded p-1.5 text-white"><CheckCircle size={16} /></div>
             <div>
               <p className="text-sm font-bold text-gray-800">On-Duty</p>
               <p className="text-[10px] text-gray-500">Management System</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center z-10 shrink-0">
          <h1 className="text-xl font-medium text-gray-800 flex items-center">
            <span className="text-gray-400 mr-2">≡</span> Staff Portal
          </h1>
          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-gray-500" />
              {pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{pendingCount > 9 ? '9+' : pendingCount}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow">
                {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.role} | {user?.department}</span>
              </div>
            </div>
            <button onClick={logout} className="text-xs font-medium text-red-500 hover:underline">Logout</button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">

          {/* ===== REPORT VIEW ===== */}
          {activeView === 'report' && (
            <ODReportView
              applications={
                isHod
                  ? applications.filter(
                      a => (a.department || '').trim().toLowerCase() === hodDepartment.trim().toLowerCase()
                    )
                  : relevantApps
              }
            />
          )}

          {/* ===== CALENDAR VIEW ===== */}
          {activeView === 'calendar' && (
            <div className="card p-8 text-center text-gray-500">
              <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
              <h3 className="font-bold text-gray-700 mb-1">OD Calendar</h3>
              <p className="text-sm font-medium">Official academic OD schedule & events.</p>
            </div>
          )}

          {/* ===== MASTER DB VIEW (HOD ONLY) ===== */}
          {activeView === 'master-db' && isHod && (
            <HODMasterDBView />
          )}

          {/* ===== DASHBOARD VIEW ===== */}
          {activeView === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-8 mb-8 border border-blue-100 flex justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-gray-600 text-lg mb-1">Welcome Back,</p>
                  <h2 className="text-3xl font-bold text-blue-900 mb-2">{user?.name}</h2>
                  <p className="text-blue-800/70 font-medium mb-6">Mentor | Department of {user?.department} • {assignedStudentCount} Assigned Mentees</p>
                  <p className="text-gray-600 italic border-l-4 border-blue-400 pl-4">"Support your students. Approve opportunities."</p>
                </div>
                <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 bg-cover bg-left" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80)'}}></div>
                <div className="absolute right-8 top-8 z-10">
                  <div className="text-blue-800 font-bold transform -rotate-6 text-xl opacity-80 font-serif">Building<br/>Brighter Futures</div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card p-6 border-l-4 border-blue-400 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                   <div>
                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3"><FileText size={20}/></div>
                     <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
                     <div className="text-sm text-gray-500">Pending Requests</div>
                   </div>
                   <div className="text-gray-300">›</div>
                </div>
                <div className="card p-6 border-l-4 border-green-400 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                   <div>
                     <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3"><CheckCircle size={20}/></div>
                     <div className="text-2xl font-bold text-gray-900">{approvedCount}</div>
                     <div className="text-sm text-gray-500">Approved (This Month)</div>
                   </div>
                   <div className="text-gray-300">›</div>
                </div>
                <div className="card p-6 border-l-4 border-red-400 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                   <div>
                     <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-3"><CheckCircle size={20} className="transform rotate-45"/></div>
                     <div className="text-2xl font-bold text-gray-900">{rejectedCount}</div>
                     <div className="text-sm text-gray-500">Rejected (This Month)</div>
                   </div>
                   <div className="text-gray-300">›</div>
                </div>
                <div className="card p-6 border-l-4 border-purple-400 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                   <div>
                     <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3"><UserIcon size={20}/></div>
                     <div className="text-2xl font-bold text-gray-900">{assignedStudentCount}</div>
                     <div className="text-sm text-gray-500">Assigned Mentees</div>
                   </div>
                   <div className="text-gray-300">›</div>
                </div>
              </div>

              {/* Recent OD Requests Table */}
              <div className="card flex flex-col shadow-sm">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-900">Recent OD Requests</h3>
                  <p className="text-xs text-gray-400">Click a row to view full application</p>
                </div>

                <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                  <div className="flex space-x-6 px-2">
                    <button onClick={() => setFilter('Pending')} className={`text-sm font-medium pb-1 ${filter === 'Pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Pending ({pendingCount})</button>
                    <button onClick={() => setFilter('Approved')} className={`text-sm font-medium pb-1 ${filter === 'Approved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Approved ({approvedCount})</button>
                    <button onClick={() => setFilter('Rejected')} className={`text-sm font-medium pb-1 ${filter === 'Rejected' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Rejected ({rejectedCount})</button>
                    <button onClick={() => setFilter('All')} className={`text-sm font-medium pb-1 ${filter === 'All' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>All</button>
                  </div>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, register no..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-lg pl-8 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                      <span className="absolute left-2.5 top-2 text-gray-400">🔍</span>
                    </div>
                    <button className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm flex items-center text-gray-600 bg-white">
                      <Filter size={14} className="mr-1.5"/> Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto table-container">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Student Name</th>
                        <th className="p-4 font-semibold">Register No.</th>
                        <th className="p-4 font-semibold">Department</th>
                        <th className="p-4 font-semibold">OD Dates</th>
                        <th className="p-4 font-semibold">Event / Purpose</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">No requests found.</td>
                        </tr>
                      ) : (
                        filteredApps.map(app => (
                          <tr
                            key={app.id}
                            className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedApp(app)}
                          >
                            <td className="p-4 font-medium text-gray-900">{app.studentName}</td>
                            <td className="p-4 text-gray-600">{app.registerNumber}</td>
                            <td className="p-4 text-gray-600">{app.department}</td>
                            <td className="p-4 text-gray-600">
                              <div>{app.fromDate}</div>
                              {app.fromDate !== app.toDate && <div className="text-xs text-gray-400">to {app.toDate}</div>}
                              {app.isFullDay && <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1 rounded">Full Day</span>}
                            </td>
                            <td className="p-4 text-gray-600 max-w-[200px] truncate">{app.event}</td>
                            <td className="p-4">{getDisplayStatus(app)}</td>
                            <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                              {canAct(app) ? (
                                <div className="flex space-x-2 justify-center">
                                  <button onClick={() => handleApprove(app)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition">Approve</button>
                                  <button onClick={() => handleReject(app)} className="bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded text-xs font-medium transition">Reject</button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs italic">
                                  {app.status === 'Approved' ? 'Approved' :
                                   app.status === 'Rejected' ? 'Rejected' :
                                   'Action Taken'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
                  <div>Showing 1 - {filteredApps.length} of {filteredApps.length}</div>
                  <div className="flex space-x-1">
                    <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50">&lt;</button>
                    <button className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center">1</button>
                    <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50">&gt;</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* OD Application Detail Modal */}
      {selectedApp && (
        <ODApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          canAct={canAct(selectedApp)}
          onApprove={() => { handleApprove(selectedApp); setSelectedApp(null); }}
          onReject={() => { handleReject(selectedApp); setSelectedApp(null); }}
        />
      )}
    </div>
  );
};

export default StaffPortal;
