import React from 'react';
import { ODApplication } from '../types';
import { X, FileText, Download } from 'lucide-react';
import { retrieveFile, openStoredFile } from '../utils/fileStorage';

interface Props {
  app: ODApplication;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDirectApproval?: () => void;
  canAct?: boolean;
  canDirectApproval?: boolean;
}

const ODApplicationModal: React.FC<Props> = ({ app, onClose, onApprove, onReject, onDirectApproval, canAct, canDirectApproval }) => {
  const timeDisplay = app.isFullDay
    ? 'Full Day'
    : `${app.fromTime || '—'} to ${app.toTime || '—'}`;

  // ── Convert a base64 data: URL to a Blob ──────────────────────────────────
  const dataURLtoBlob = (dataURL: string): Blob => {
    const [header, base64] = dataURL.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  };

  const handleOpenDocument = async () => {
    if (!app.supportingDocumentName) return;

    // 1. Try base64 supportingDocumentData from Supabase first (cross-device persistent)
    if (app.supportingDocumentData) {
      try {
        let blob: Blob;
        if (app.supportingDocumentData.startsWith('data:')) {
          blob = dataURLtoBlob(app.supportingDocumentData);
        } else {
          blob = new Blob([app.supportingDocumentData], { type: 'application/octet-stream' });
        }
        openStoredFile({
          key: app.supportingDocumentKey || app.id,
          name: app.supportingDocumentName,
          type: blob.type || 'application/octet-stream',
          blob: blob,
        });
        return;
      } catch (err) {
        console.error('Failed to process base64 document data from Supabase:', err);
      }
    }

    // 2. Fall back to local IndexedDB if available
    if (app.supportingDocumentKey) {
      try {
        const stored = await retrieveFile(app.supportingDocumentKey);
        if (stored && stored.blob) {
          openStoredFile(stored);
          return;
        }
      } catch (err) {
        console.warn('Failed to retrieve file from IndexedDB:', err);
      }
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">OD Application Details</h2>
            <p className="text-xs text-gray-500">Application ID: {app.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Student Details */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Student Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Name</span>
                <span className="font-medium text-gray-900">{app.studentName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Register Number</span>
                <span className="font-medium text-gray-900">{app.registerNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Year</span>
                <span className="font-medium text-gray-900">{app.year}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Department</span>
                <span className="font-medium text-gray-900">{app.department}</span>
              </div>
              {app.mentorName && (
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">Mentor</span>
                  <span className="font-medium text-gray-900">{app.mentorName}</span>
                </div>
              )}
              {app.ccName && (
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">CC / Co-CC</span>
                  <span className="font-medium text-gray-900">{app.ccName}</span>
                </div>
              )}
            </div>
          </section>

          {/* OD Dates & Time */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">OD Period</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">From Date</span>
                <span className="font-medium text-gray-900">{app.fromDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">To Date</span>
                <span className="font-medium text-gray-900">{app.toDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Duration</span>
                <span className="font-medium text-gray-900">
                  {app.isFullDay
                    ? <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">Full Day</span>
                    : timeDisplay}
                </span>
              </div>
            </div>
          </section>

          {/* Event Details */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Event Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Event / Purpose</span>
                <p className="font-medium text-gray-900">{app.event}</p>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Venue</span>
                <p className="font-medium text-gray-900">{app.venue}</p>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Reason / Description</span>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{app.reason}</p>
              </div>
            </div>
          </section>

          {/* Supporting Document */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Supporting Document</h3>
            {app.supportingDocumentName ? (
              <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                <FileText size={20} className="text-blue-600 shrink-0" />
                <span className="text-gray-800 text-sm font-medium flex-1 truncate">{app.supportingDocumentName}</span>
                {(app.supportingDocumentKey || app.supportingDocumentData) && (
                  <button
                    onClick={handleOpenDocument}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 rounded px-2 py-1 bg-white transition cursor-pointer"
                  >
                    <Download size={12} className="mr-1" /> Open / Download
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No document attached.</p>
            )}
          </section>

          {/* Application Status */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Application Status</h3>
            <div>
              <span className={`badge ${app.status === 'Approved' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                {app.status}
              </span>
            </div>
            {app.rejectionReason && app.status === 'Rejected' && (
              <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
                <strong>Rejection reason:</strong> {app.rejectionReason}
              </div>
            )}
          </section>
        </div>

        {/* Footer actions */}
        {(canAct || canDirectApproval) && (
          <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-2xl">
            {canAct && (
              <button
                onClick={() => { onReject?.(); onClose(); }}
                className="bg-white hover:bg-red-50 text-red-500 border border-red-200 px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Reject
              </button>
            )}
            {canAct && (
              <button
                onClick={() => { onApprove?.(); onClose(); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Approve
              </button>
            )}
            {canDirectApproval && (
              <button
                onClick={() => { onDirectApproval?.(); onClose(); }}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Approval
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ODApplicationModal;
