// IndexedDB + Canvas Optimization Persistent Image Store
// Solves browser localStorage 5MB quota limit so all 14 thumbnails and portrait persist reliably

const DB_NAME = 'PrinceDhakadPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_images';

const PORTRAIT_KEY = 'prince_dhakad_portrait';
const PROJECT_PREFIX = 'prince_dhakad_project_';

// In-memory cache for instant, zero-flicker synchronous access
const memoryCache = new Map<string, string>();

// Listeners for store changes
type StoreListener = () => void;
const listeners = new Set<StoreListener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Image store listener error:', e);
    }
  });
}

export function subscribeToImageStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Open or get IndexedDB database instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

// Get item from IndexedDB
async function idbGet(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('idbGet failed', err);
    return null;
  }
}

// Set item in IndexedDB
async function idbSet(key: string, value: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('idbSet failed', err);
  }
}

// Delete item in IndexedDB
async function idbDelete(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('idbDelete failed', err);
  }
}

// Clear all in IndexedDB
async function idbClear(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('idbClear failed', err);
  }
}

// Populate cache from localStorage synchronously on module import
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const portrait = localStorage.getItem(PORTRAIT_KEY);
    if (portrait) memoryCache.set(PORTRAIT_KEY, portrait);

    for (let i = 1; i <= 14; i++) {
      const key = `${PROJECT_PREFIX}${i}`;
      const val = localStorage.getItem(key);
      if (val) memoryCache.set(key, val);
    }
  }
} catch {
  // Ignore localStorage read errors
}

// Full initialization: reads all items from IndexedDB into memoryCache and migrates localStorage
let initPromise: Promise<void> | null = null;

export function initImageStore(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const db = await openDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.openCursor();

        req.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            if (typeof cursor.key === 'string' && typeof cursor.value === 'string') {
              memoryCache.set(cursor.key, cursor.value);
            }
            cursor.continue();
          } else {
            resolve();
          }
        };

        req.onerror = () => resolve();
      });

      // Also migrate any existing localStorage items into IndexedDB
      if (typeof window !== 'undefined' && window.localStorage) {
        for (const [key, val] of memoryCache.entries()) {
          idbSet(key, val).catch(() => {});
        }
      }

      // If no custom project images in cache, load from /portfolio-images.json bundled in public
      try {
        const res = await fetch('/portfolio-images.json');
        if (res.ok) {
          const bundled = await res.json();
          if (bundled && typeof bundled === 'object') {
            if (bundled.portrait && !memoryCache.has(PORTRAIT_KEY)) {
              memoryCache.set(PORTRAIT_KEY, bundled.portrait);
            }
            if (bundled.projects && typeof bundled.projects === 'object') {
              for (const [k, v] of Object.entries(bundled.projects)) {
                const key = `${PROJECT_PREFIX}${k}`;
                if (!memoryCache.has(key) && typeof v === 'string') {
                  memoryCache.set(key, v);
                }
              }
            }
          }
        }
      } catch {
        // Static portfolio-images.json optional
      }

      notifyListeners();
    } catch (err) {
      console.warn('Failed to initialize IndexedDB store:', err);
    }
  })();

  return initPromise;
}

// Automatically trigger initialization when running in the browser
if (typeof window !== 'undefined') {
  initImageStore().catch(() => {});
}

// Canvas-based image optimizer to prevent bloat and keep previews ultra-sharp
export function compressImageFile(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or gif, return as raw base64 data URL
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // Fallback to original data URL if 2D context fails
          resolve(e.target?.result as string);
          return;
        }

        // Use high quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, otherwise jpeg
        let mimeType = 'image/jpeg';
        if (file.type === 'image/png' && quality >= 0.9) {
          mimeType = 'image/png';
        }

        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to original
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Synchronous and async getters / setters
export function getCustomPortrait(): string | null {
  return memoryCache.get(PORTRAIT_KEY) || null;
}

export function setCustomPortrait(dataUrl: string): void {
  memoryCache.set(PORTRAIT_KEY, dataUrl);
  // Persist to IndexedDB (virtually unlimited quota)
  idbSet(PORTRAIT_KEY, dataUrl).catch(() => {});
  // Try saving to localStorage as best-effort backup
  try {
    localStorage.setItem(PORTRAIT_KEY, dataUrl);
  } catch {
    // Quota reached in localStorage, IndexedDB handles it
  }
  notifyListeners();
}

export function getCustomProjectImage(id: number): string | null {
  const key = `${PROJECT_PREFIX}${id}`;
  return memoryCache.get(key) || null;
}

export function setCustomProjectImage(id: number, dataUrl: string): void {
  const key = `${PROJECT_PREFIX}${id}`;
  memoryCache.set(key, dataUrl);
  // Persist to IndexedDB (virtually unlimited quota)
  idbSet(key, dataUrl).catch(() => {});
  // Try saving to localStorage as best-effort backup
  try {
    localStorage.setItem(key, dataUrl);
  } catch {
    // Quota reached in localStorage, IndexedDB handles it
  }
  notifyListeners();
}

// Combined helpers that compress and persist
export async function compressAndStorePortrait(file: File): Promise<string> {
  const optimized = await compressImageFile(file, 1600, 2000, 0.9);
  setCustomPortrait(optimized);
  return optimized;
}

export async function compressAndStoreProjectImage(id: number, file: File): Promise<string> {
  // YouTube 16:9 or Instagram Reel 9:16
  const optimized = await compressImageFile(file, 1920, 1920, 0.88);
  setCustomProjectImage(id, optimized);
  return optimized;
}

export function clearCustomImages(): void {
  memoryCache.clear();
  idbClear().catch(() => {});
  try {
    localStorage.removeItem(PORTRAIT_KEY);
    for (let i = 1; i <= 14; i++) {
      localStorage.removeItem(`${PROJECT_PREFIX}${i}`);
    }
  } catch {
    // Ignore error
  }
  notifyListeners();
}

// Export all custom images as a JSON string
export function exportAllImagesAsJSON(): string {
  const data: {
    portrait: string | null;
    projects: Record<string, string>;
  } = {
    portrait: memoryCache.get(PORTRAIT_KEY) || null,
    projects: {},
  };

  for (let i = 1; i <= 14; i++) {
    const val = memoryCache.get(`${PROJECT_PREFIX}${i}`);
    if (val) {
      data.projects[String(i)] = val;
    }
  }

  return JSON.stringify(data, null, 2);
}

// Trigger one-click browser download of portfolio-images.json
export function downloadPortfolioBackupFile(): void {
  const json = exportAllImagesAsJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-images.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import JSON file content into IndexedDB and memoryCache
export async function importPortfolioFromJSON(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') return false;

    if (data.portrait && typeof data.portrait === 'string') {
      setCustomPortrait(data.portrait);
    }
    if (data.projects && typeof data.projects === 'object') {
      for (const [idStr, src] of Object.entries(data.projects)) {
        const id = parseInt(idStr, 10);
        if (!isNaN(id) && typeof src === 'string') {
          setCustomProjectImage(id, src);
        }
      }
    }
    notifyListeners();
    return true;
  } catch (err) {
    console.error('Failed to import JSON', err);
    return false;
  }
}

