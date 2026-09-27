import React, { useState } from 'react';
import { ODApplication } from '../types';
import { Calendar as CalendarIcon, MapPin, Clock, Search, Filter } from 'lucide-react';

interface Props {
  applications: ODApplication[];
}

const ODCalendarView: React.FC<Props> = ({ applications }) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Principal / Monitoring view: show approved applications by default
  const approvedApps = applications.filter(a => a.status === 'Approved');

  const departments = Array.from(
    new Set(approvedApps.map(a => a.department).filter(Boolean))
  );

  const filteredApps = approvedApps.filter(app => {
    const matchesDept = selectedDept === 'All' || app.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      app.studentName.toLowerCase().includes(q) ||
      app.event.toLowerCase().includes(q) ||
      app.venue.toLowerCase().includes(q) ||
      app.department.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  // Group applications by From Date
  const groupedByDate: Record<string, ODApplication[]> = {};
  filteredApps.forEach(app => {
    const date = app.fromDate || 'Unscheduled';
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(app);
  });

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => (a > b ? 1 : -1));

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Institution OD Calendar</h2>
          <p className="text-gray-500 text-sm">Official Schedule & On-Duty Monitoring</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search event, student, venue..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="bg-transparent text-gray-700 focus:outline-none font-medium text-sm"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Timeline */}
      {sortedDates.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <CalendarIcon size={48} className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-bold text-gray-700 text-lg mb-1">No Approved OD Events Found</h3>
          <p className="text-sm">There are no approved On-Duty applications matching your current filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="card p-6 border-l-4 border-blue-600 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-sm">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{date}</h3>
                    <span className="text-xs text-gray-500">
                      {groupedByDate[date].length} Approved OD Application(s)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedByDate[date].map(app => (
                  <div
                    key={app.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-sm line-clamp-1">
                          {app.event}
                        </span>
                        <span className="badge badge-approved text-xs shrink-0">
                          Approved
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-blue-900 mb-2">
                        {app.studentName} ({app.registerNumber})
                      </div>

                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <div className="flex items-center space-x-1.5">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate">{app.venue || 'On-Campus'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock size={14} className="text-gray-400 shrink-0" />
                          <span>
                            {app.isFullDay
                              ? 'Full Day'
                              : `${app.fromTime || ''} - ${app.toTime || ''}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-[11px] text-gray-500">
                      <span>Dept: <strong className="text-gray-700">{app.department}</strong></span>
                      <span>Year: <strong className="text-gray-700">{app.year}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ODCalendarView;
