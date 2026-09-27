import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOD } from '../context/ODContext';
import { FileText, Calendar, Bell, LogOut } from 'lucide-react';
import ODReportView from '../components/ODReportView';
import ODCalendarView from '../components/ODCalendarView';

type ViewMode = 'reports' | 'calendar';

const PrincipalPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { applications, loading } = useOD();
  const [activeView, setActiveView] = useState<ViewMode>('reports');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed h-full z-20">
        <div>
          {/* Institution Header */}
          <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              TRP
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xs tracking-wider uppercase">TRP Engineering College</h2>
              <p className="text-[10px] text-gray-500 font-medium">TRICHY</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveView('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeView === 'reports'
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FileText size={18} />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveView('calendar')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeView === 'calendar'
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Calendar size={18} />
              <span>OD Calendar</span>
            </button>
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-blue-50/60 p-3 rounded-xl flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
              OD
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">On-Duty</p>
              <p className="text-[10px] text-gray-500">Management System</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center z-10 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Principal Portal</h1>
            <p className="text-xs text-gray-500">Institution-wide OD Monitoring & Governance</p>
          </div>

          <div className="flex items-center space-x-6">
            <Bell size={20} className="text-gray-500 cursor-pointer hover:text-blue-600 transition" />
            
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                PR
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {user?.name || 'Principal'}
                </span>
                <span className="text-xs text-gray-500">Principal | TRP Engineering College</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-1 text-xs font-semibold text-red-500 hover:text-red-700 transition"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Loading OD records from Supabase...</p>
            </div>
          ) : activeView === 'reports' ? (
            <ODReportView applications={applications} />
          ) : (
            <ODCalendarView applications={applications} />
          )}
        </div>
      </main>
    </div>
  );
};

export default PrincipalPortal;
