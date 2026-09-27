/**
 * fileStorage.ts
 * IndexedDB-based file storage for OD supporting documents.
 * Stores actual File/Blob objects — no base64 overhead, no localStorage size limit.
 * Files survive page refresh and browser restart (same as localStorage).
 */

const DB_NAME = 'ODFlowFileStore';
const DB_VERSION = 1;
const STORE = 'files';

/** Open (and upgrade if needed) the IndexedDB database. */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE); // key-path = explicit key on put()
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
}

/** Stored record shape. */
export interface StoredFile {
  key: string;
  name: string;
  type: string;
  blob: Blob;
}

/** Generate a unique file key. */
export function generateFileKey(): string {
  return `odfile_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Store a File in IndexedDB.
 * Returns the key used to store it.
 */
export async function storeFile(key: string, file: File): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const record: StoredFile = {
      key,
      name: file.name,
      type: file.type || 'application/octet-stream',
      blob: file, // File extends Blob — stored natively, no encoding
    };
    const req = store.put(record, key);
    req.onsuccess = () => resolve(key);
    req.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

/**
 * Retrieve a stored file by key.
 * Returns null if not found (e.g. different device / cleared storage).
 */
export async function retrieveFile(key: string): Promise<StoredFile | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get(key);
    req.onsuccess = (e) => resolve((e.target as IDBRequest<StoredFile>).result ?? null);
    req.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

/**
 * Delete a stored file by key (cleanup on application deletion, if needed).
 */
export async function deleteFile(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

/**
 * Open or download a StoredFile in the browser.
 * - PDF, images → opens in a new tab for viewing
 * - DOCX, XLSX, PPT, etc. → triggers file download with original filename
 */
export function openStoredFile(stored: StoredFile): void {
  const ext = stored.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = getMimeType(stored.name, stored.type || stored.blob.type);
  const blobWithMime = stored.blob.type === mimeType ? stored.blob : new Blob([stored.blob], { type: mimeType });
  const objectURL = URL.createObjectURL(blobWithMime);
  const viewableInBrowser = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext);

  if (viewableInBrowser) {
    const win = window.open(objectURL, '_blank');
    if (!win) {
      // Popup blocked → download instead
      triggerDownload(objectURL, stored.name);
    }
    setTimeout(() => URL.revokeObjectURL(objectURL), 15000);
  } else {
    triggerDownload(objectURL, stored.name);
    setTimeout(() => URL.revokeObjectURL(objectURL), 4000);
  }
}

function getMimeType(filename: string, existingType?: string): string {
  if (existingType && existingType !== 'application/octet-stream') return existingType;
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls': return 'application/vnd.ms-excel';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default: return existingType || 'application/octet-stream';
  }
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

