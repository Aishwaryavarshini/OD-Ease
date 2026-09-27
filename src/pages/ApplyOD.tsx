import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOD } from '../context/ODContext';
import { useNavigate } from 'react-router-dom';
import { generateFileKey, storeFile } from '../utils/fileStorage';

const ApplyOD = () => {
  const { user, logout } = useAuth();
  const { addApplication } = useOD();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    fromTime: '',
    toTime: '',
    event: '',
    venue: '',
    reason: ''
  });

  const [isFullDay, setIsFullDay] = useState(false);

  // Supporting document file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Read as base64 fallback
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFileData(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFullDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsFullDay(checked);
    if (checked) {
      setFormData(f => ({ ...f, fromTime: '', toTime: '' }));
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let docKey: string | undefined = undefined;
    let b64Data: string | undefined = fileData ?? undefined;

    if (selectedFile) {
      try {
        docKey = generateFileKey();
        await storeFile(docKey, selectedFile);
      } catch (err) {
        console.error('Failed to store file in IndexedDB:', err);
      }
      if (!b64Data) {
        try {
          b64Data = await readFileAsDataURL(selectedFile);
        } catch (err) {
          console.error('Failed to read file as data URL:', err);
        }
      }
    }

    const res = await addApplication({
      studentId: user.id,
      studentName: user.name,
      registerNumber: user.registerNumber || user.id,
      department: user.department,
      year: user.year || 'III Year',
      mentorName: user.mentorName,
      mentorEmail: user.mentorEmail,
      isFullDay,
      supportingDocumentName: selectedFile?.name,
      supportingDocumentKey: docKey,
      supportingDocumentData: b64Data,
      ...formData
    });

    if (res && res.error) {
      alert(`Submission failed: ${res.error}`);
    } else {
      alert('OD Application submitted successfully!');
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
            TRP
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Student Portal</h1>
            <p className="text-xs text-gray-500">Apply for On-Duty</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/student')} className="btn-secondary text-sm">Dashboard</button>
          <button onClick={logout} className="text-gray-500 hover:text-red-500 text-sm font-medium">Logout</button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Student Portal</div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for On-Duty</h2>
          </div>
          <button className="btn-secondary text-sm shadow-sm">New Application</button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8 border-b pb-4">
          <div className="flex items-center text-blue-600 font-medium">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2">1</div>
            Application
          </div>
          <div className="flex-1 border-t-2 border-gray-200 mx-4"></div>
          <div className="flex items-center text-gray-400 font-medium">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs mr-2">2</div>
            Approval
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Student Details Card */}
          <div className="card p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" disabled value={user?.name || ''} className="input-field bg-gray-50 text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                <input type="text" disabled value={user?.registerNumber || user?.id || ''} className="input-field bg-gray-50 text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input type="text" disabled value={user?.year || 'III Year'} className="input-field bg-gray-50 text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" disabled value={user?.department || ''} className="input-field bg-gray-50 text-gray-600" />
              </div>
              {user?.mentorName && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Mentor</label>
                  <input type="text" disabled value={`${user.mentorName} (${user.mentorEmail || ''})`} className="input-field bg-gray-50 text-gray-600 font-medium" />
                </div>
              )}
            </div>
          </div>

          {/* OD Details Card */}
          <div className="card p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">OD Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required className="input-field" />
              </div>

              {/* Full Day checkbox spanning both columns */}
              <div className="md:col-span-2 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="fullDayCheck"
                  checked={isFullDay}
                  onChange={handleFullDayChange}
                  className="w-4 h-4 rounded text-blue-600 border-gray-300 cursor-pointer"
                />
                <label htmlFor="fullDayCheck" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                  Full Day OD <span className="text-gray-400 font-normal">(disables From/To Time)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Time {isFullDay && <span className="text-gray-400 font-normal">(not required)</span>}
                </label>
                <input
                  type="time"
                  name="fromTime"
                  value={formData.fromTime}
                  onChange={handleChange}
                  required={!isFullDay}
                  disabled={isFullDay}
                  className={`input-field ${isFullDay ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Time {isFullDay && <span className="text-gray-400 font-normal">(not required)</span>}
                </label>
                <input
                  type="time"
                  name="toTime"
                  value={formData.toTime}
                  onChange={handleChange}
                  required={!isFullDay}
                  disabled={isFullDay}
                  className={`input-field ${isFullDay ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event / Purpose</label>
              <input type="text" name="event" value={formData.event} onChange={handleChange} placeholder="e.g. Hackathon, Symposium" required className="input-field" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Event venue / institution" required className="input-field" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Description</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Briefly describe why you require OD..." required className="input-field h-24 resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Document <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-white">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-1.5 px-3 rounded border border-gray-300 mr-3 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-gray-500 text-sm truncate max-w-xs">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Accepted: PDF, JPG, PNG, DOC, DOCX. File is stored with your application and visible to your Mentor and CC.</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mb-8">
            <button
              type="button"
              onClick={() => {
                setFormData({ fromDate: '', toDate: '', fromTime: '', toTime: '', event: '', venue: '', reason: '' });
                setIsFullDay(false);
                setSelectedFile(null);
                setFileData(null);
              }}
              className="btn-secondary px-8"
            >
              Clear
            </button>
            <button type="submit" className="btn-primary px-8 shadow-md">Submit OD Application</button>
          </div>
        </form>

        {/* Approval Flow Section */}
        <div className="mt-8 mb-12">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Approval Flow</h3>
            <span className="text-sm text-gray-400">After submission</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center border-gray-200 bg-white shadow-sm flex flex-col justify-center min-h-[100px]">
              <div className="text-gray-400 text-xs font-bold mb-1">1</div>
              <div className="font-bold text-gray-800 text-sm">Mentor</div>
              <div className="text-gray-500 text-xs">Approval</div>
            </div>
            <div className="card p-4 text-center border-gray-200 bg-white shadow-sm flex flex-col justify-center min-h-[100px]">
              <div className="text-gray-400 text-xs font-bold mb-1">2</div>
              <div className="font-bold text-gray-800 text-sm">CC / Co-CC</div>
              <div className="text-gray-500 text-xs">Any one approves</div>
            </div>
            <div className="card p-4 text-center border-gray-200 bg-white shadow-sm flex flex-col justify-center min-h-[100px]">
              <div className="text-gray-400 text-xs font-bold mb-1">3</div>
              <div className="font-bold text-gray-800 text-sm">OD Incharge</div>
              <div className="text-gray-500 text-xs">Final approval</div>
            </div>
            <div className="card p-4 text-center border-gray-200 bg-white shadow-sm flex flex-col justify-center min-h-[100px]">
              <div className="text-gray-400 text-xs font-bold mb-1">4</div>
              <div className="font-bold text-gray-800 text-sm">HOD</div>
              <div className="text-gray-500 text-xs">Email notified</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ApplyOD;
