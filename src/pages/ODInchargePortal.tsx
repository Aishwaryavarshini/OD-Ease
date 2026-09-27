import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOD } from '../context/ODContext';
import { Bell, Home, PieChart, RefreshCw, AlertCircle } from 'lucide-react';
import { ODApplication } from '../types';
import ODApplicationModal from '../components/ODApplicationModal';
import ODReportView from '../components/ODReportView';
import {
  canMentorApproveOrReject,
  canCcApproveOrReject,
  canStaffApproveOrReject,
} from '../utils/approvalEligibility';

const ODInchargePortal = () => {
  const { user, logout } = useAuth();
  const { applications, updateApplicationStatus, directApprove, loading, error, refetch } = useOD();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ODApplication | null>(null);
  const [activeView, setActiveView] = useState<'requests' | 'report'>('requests');

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.event.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'Pending') return app.status.includes('Pending') && matchesSearch;
    if (filter === 'Approved') return app.status === 'Approved' && matchesSearch;
    if (filter === 'Rejected') return app.status === 'Rejected' && matchesSearch;
    return matchesSearch;
  });

  const pendingCount = applications.filter(a => a.status.includes('Pending')).length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;

  const handleApprove = (app: ODApplication) => {
    if (!user) return;
    if (canMentorApproveOrReject(app, user)) {
      updateApplicationStatus(app.id, 'Approved', 'Mentor', user.name);
    } else if (canCcApproveOrReject(app, user)) {
      updateApplicationStatus(app.id, 'Approved', 'CC', user.name);
    }
  };

  const handleReject = (app: ODApplication) => {
    if (!user) return;
    const isMentor = canMentorApproveOrReject(app, user);
    const isCc = canCcApproveOrReject(app, user);
    if (!isMentor && !isCc) return;

    const reason = window.prompt("Please enter the reason for rejection:");
    if (reason !== null) {
      const role = isMentor ? 'Mentor' : 'CC';
      updateApplicationStatus(app.id, 'Rejected', role, user.name, reason || 'No reason provided');
    }
  };

  const handleDirectApproval = (app: ODApplication) => {
    directApprove(app.id, user?.name || 'EEE Coordinator');
  };

  // Eligibility: Standard Approve / Reject — only if user is student's assigned Mentor or assigned CC/Co-CC
  const canApproveOrReject = (app: ODApplication): boolean =>
    canStaffApproveOrReject(app, user);

  // Eligibility: "Approval" button — EEE Coordinator final approval authority, available for any application not already Approved (bypasses pending & rejected)
  const canDirectApproval = (app: ODApplication): boolean =>
    app.status !== 'Approved';

  const getStatusBadge = (status: string) => {
    if (status === 'Approved') return <span className="badge badge-approved">Approved</span>;
    if (status === 'Rejected') return <span className="badge badge-rejected">Rejected</span>;
    return <span className="badge badge-pending">{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Loading Dashboard</h3>
            <p className="text-sm text-gray-500 mt-1">Connecting to Supabase database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800 flex flex-col items-center py-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl mb-3 shadow-lg">
            TRP
          </div>
          <div className="text-center">
            <h2 className="text-xs font-bold tracking-wider uppercase">EEE Coordinator Portal</h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveView('requests')}
            className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 text-left transition ${activeView === 'requests' ? 'bg-blue-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Home size={18} className="mr-3"/> All Requests
          </button>
          <button
            onClick={() => setActiveView('report')}
            className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 text-left transition ${activeView === 'report' ? 'bg-blue-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <PieChart size={18} className="mr-3"/> Reports
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center z-10 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">EEE Coordinator Dashboard</h1>
          <div className="flex items-center space-x-6">
            <Bell size={20} className="text-gray-500 cursor-pointer" />
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm">
                OD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">{user?.name}</span>
                <span className="text-xs text-gray-500">EEE Coordinator</span>
              </div>
            </div>
            <button onClick={logout} className="text-xs font-medium text-red-500 hover:underline">Logout</button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <AlertCircle size={18} className="text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={refetch}
                className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg font-medium transition"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* ===== REPORT VIEW ===== */}
          {activeView === 'report' && (
            <ODReportView applications={applications} />
          )}

          {/* ===== ALL REQUESTS VIEW ===== */}
          {activeView === 'requests' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6 border-t-4 border-yellow-400">
                   <div className="text-gray-500 mb-1 text-sm font-medium">Pending Approvals</div>
                   <div className="text-3xl font-bold text-gray-900">{pendingCount}</div>
                </div>
                <div className="card p-6 border-t-4 border-green-400">
                   <div className="text-gray-500 mb-1 text-sm font-medium">Total Approved</div>
                   <div className="text-3xl font-bold text-gray-900">{approvedCount}</div>
                </div>
                <div className="card p-6 border-t-4 border-blue-400">
                   <div className="text-gray-500 mb-1 text-sm font-medium">Total Requests</div>
                   <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
                </div>
              </div>

              <div className="card flex flex-col shadow-sm">
                <div className="p-6 border-b flex justify-between items-center bg-white">
                  <h3 className="font-bold text-lg text-gray-900">Institution Wide OD Requests</h3>
                  <p className="text-xs text-gray-400">Click a row to view full application</p>
                </div>

                <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                  <div className="flex space-x-6 px-2">
                    <button onClick={() => setFilter('All')} className={`text-sm font-medium pb-1 ${filter === 'All' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>All Requests</button>
                    <button onClick={() => setFilter('Pending')} className={`text-sm font-medium pb-1 ${filter === 'Pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Pending</button>
                    <button onClick={() => setFilter('Approved')} className={`text-sm font-medium pb-1 ${filter === 'Approved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Approved</button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="overflow-x-auto table-container">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Student Details</th>
                        <th className="p-4 font-semibold">Event</th>
                        <th className="p-4 font-semibold">Dates</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filteredApps.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No applications found.</td></tr>
                      ) : (
                        filteredApps.map(app => (
                          <tr
                            key={app.id}
                            className="hover:bg-blue-50/20 transition-colors cursor-pointer"
                            onClick={() => setSelectedApp(app)}
                          >
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{app.studentName}</div>
                              <div className="text-xs text-gray-500">{app.registerNumber} • {app.department}</div>
                            </td>
                            <td className="p-4 text-gray-700">{app.event}<br/><span className="text-xs text-gray-400">{app.venue}</span></td>
                            <td className="p-4 text-gray-700">
                              {app.fromDate} {app.fromDate !== app.toDate ? `to ${app.toDate}` : ''}
                              {app.isFullDay && <span className="ml-1 text-[10px] bg-blue-50 text-blue-700 font-semibold px-1 rounded">Full Day</span>}
                            </td>
                            <td className="p-4">
                              {getStatusBadge(app.status)}
                            </td>
                            <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                              {(canApproveOrReject(app) || canDirectApproval(app)) ? (
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                  {canApproveOrReject(app) && (
                                    <button
                                      onClick={() => handleApprove(app)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {canApproveOrReject(app) && (
                                    <button
                                      onClick={() => handleReject(app)}
                                      className="bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded text-xs font-medium transition"
                                    >
                                      Reject
                                    </button>
                                  )}
                                  {canDirectApproval(app) && (
                                    <button
                                      onClick={() => handleDirectApproval(app)}
                                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition"
                                    >
                                      Approval
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs italic">Action Taken</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
          canAct={canApproveOrReject(selectedApp)}
          canDirectApproval={canDirectApproval(selectedApp)}
          onApprove={() => { handleApprove(selectedApp); setSelectedApp(null); }}
          onReject={() => { handleReject(selectedApp); setSelectedApp(null); }}
          onDirectApproval={() => { handleDirectApproval(selectedApp); setSelectedApp(null); }}
        />
      )}
    </div>
  );
};

export default ODInchargePortal;
