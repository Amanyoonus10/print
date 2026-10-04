// IndexedDB and Blob streaming cache for zero-lag high-performance video & media playback

const DB_NAME = 'face_printing_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

export interface StoredMediaRecord {
  id: string; // e.g. "idb://media_1728000000_abc"
  name: string;
  mimeType: string;
  size: number;
  blob: Blob;
  createdAt: number;
}

// In-memory cache mapping "idb://..." or "data:video/..." to fast GPU-streamable "blob:http..." URLs
const objectUrlCache = new Map<string, string>();
const pendingResolutions = new Map<string, Promise<string>>();

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in browser environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

/**
 * Convert a base64 Data URL to a native binary Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mimeType });
}

/**
 * Save a File or Blob into IndexedDB and get an idb:// URI and immediate streamable blob: URL
 */
export async function saveMediaBlob(
  fileOrBlob: Blob | File,
  filename?: string
): Promise<{ id: string; blobUrl: string }> {
  const db = await getDB();
  const id = `idb://media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const name = filename || (fileOrBlob instanceof File ? fileOrBlob.name : 'uploaded_media');
  const mimeType = fileOrBlob.type || 'video/mp4';

  const record: StoredMediaRecord = {
    id,
    name,
    mimeType,
    size: fileOrBlob.size,
    blob: fileOrBlob,
    createdAt: Date.now(),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  // Create streamable object URL for immediate lag-free GPU playback
  const blobUrl = URL.createObjectURL(fileOrBlob);
  objectUrlCache.set(id, blobUrl);

  return { id, blobUrl };
}

/**
 * Synchronous cache lookup for instant rendering without flash
 */
export function getCachedMediaUrl(src?: string): string | null {
  if (!src) return null;
  return objectUrlCache.get(src) || null;
}

/**
 * Resolves any media source (idb://, data:video/, or standard http/path)
 * into a hardware-accelerated, streamable URL.
 */
export async function resolveMediaUrl(src: string): Promise<string> {
  if (!src) return '';

  // 1. If already cached in memory as an object URL, return immediately
  if (objectUrlCache.has(src)) {
    return objectUrlCache.get(src)!;
  }

  // 2. If it's a deduplicated pending resolution, return the existing promise
  if (pendingResolutions.has(src)) {
    return pendingResolutions.get(src)!;
  }

  const resolvePromise = (async () => {
    try {
      // CASE A: IndexedDB reference (idb://...)
      if (src.startsWith('idb://')) {
        const db = await getDB();
        const record = await new Promise<StoredMediaRecord | undefined>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(src);
          req.onsuccess = () => resolve(req.result as StoredMediaRecord);
          req.onerror = () => reject(req.error);
        });

        if (record && record.blob) {
          const blobUrl = URL.createObjectURL(record.blob);
          objectUrlCache.set(src, blobUrl);
          return blobUrl;
        }
      }

      // CASE B: Legacy Base64 Video (data:video/...)
      // Convert in-memory to native Blob stream to eliminate massive CPU decode lag!
      if (src.startsWith('data:video/')) {
        const blob = dataUrlToBlob(src);
        const blobUrl = URL.createObjectURL(blob);
        objectUrlCache.set(src, blobUrl);

        // Also asynchronously save into IndexedDB to free up future memory
        saveMediaBlob(blob, 'migrated_video.mp4').catch((err) => {
          console.warn('Background migration of data:video to IndexedDB skipped:', err);
        });

        return blobUrl;
      }

      // CASE C: Regular web URL or local path (/videos/..., https://...)
      return src;
    } catch (err) {
      console.warn('Failed to resolve media URL:', src, err);
      return src;
    } finally {
      pendingResolutions.delete(src);
    }
  })();

  pendingResolutions.set(src, resolvePromise);
  return resolvePromise;
}
