import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOD } from '../context/ODContext';
import { useNavigate } from 'react-router-dom';

const StudentPortal = () => {
  const { user, logout } = useAuth();
  const { applications } = useOD();
  const navigate = useNavigate();

  const myApplications = applications.filter(
    app => app.studentId === user?.id || app.registerNumber === user?.registerNumber
  );

  const getStatusBadge = (status: string) => {
    if (status === 'Approved') return <span className="badge badge-approved">Approved</span>;
    if (status === 'Rejected') return <span className="badge badge-rejected">Rejected</span>;
    return <span className="badge badge-pending">{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
            TRP
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Student Portal</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">{user?.name}</span>
          <button onClick={logout} className="text-gray-500 hover:text-red-500 text-sm font-medium">Logout</button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {user?.name}</h2>
            <p className="text-gray-600">{user?.id} • {user?.department} • {user?.year || 'III Year'}{user?.mentorName ? ` • Mentor: ${user.mentorName}` : ''}</p>
          </div>
          <button onClick={() => navigate('/student/apply')} className="btn-primary shadow-md px-6 py-3">
            + Apply for On-Duty
          </button>
        </div>

        <div className="card mb-8">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold text-gray-900">My OD Applications</h3>
          </div>
          <div className="p-0 overflow-x-auto table-container">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium border-b">Event</th>
                  <th className="p-4 font-medium border-b">Date</th>
                  <th className="p-4 font-medium border-b">Venue</th>
                  <th className="p-4 font-medium border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myApplications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No applications found. Apply for OD to get started.</td>
                  </tr>
                ) : (
                  myApplications.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{app.event}</td>
                      <td className="p-4 text-gray-600">{app.fromDate} {app.fromDate !== app.toDate ? `to ${app.toDate}` : ''}</td>
                      <td className="p-4 text-gray-600">{app.venue}</td>
                      <td className="p-4">{getStatusBadge(app.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPortal;
