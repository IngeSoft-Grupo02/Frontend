const DB_NAME = 'kingstore-draft-design-files';
const DB_VERSION = 1;
const STORE_NAME = 'itemDesignFiles';

interface DraftItemDesignFilesRecord {
  key: string;
  storeSlug: string;
  cartItemId: string;
  files: File[];
  updatedAt: number;
}

function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

function recordKey(storeSlug: string, cartItemId: string): string {
  return `${storeSlug}:${cartItemId}`;
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!isIndexedDBAvailable()) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  return openDatabase().then((db) => new Promise<T | undefined>((resolve, reject) => {
    if (!db) {
      resolve(undefined);
      return;
    }

    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);

    transaction.oncomplete = () => {
      db.close();
      resolve(request ? request.result : undefined);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  }));
}

export async function loadDraftItemDesignFiles(
  storeSlug: string,
  cartItemIds: string[],
): Promise<Record<string, File[]>> {
  const entries = await Promise.all(cartItemIds.map(async (cartItemId) => {
    const record = await withStore<DraftItemDesignFilesRecord | undefined>(
      'readonly',
      (store) => store.get(recordKey(storeSlug, cartItemId)),
    );
    return [cartItemId, record?.files || []] as const;
  }));

  return entries.reduce<Record<string, File[]>>((acc, [cartItemId, files]) => {
    if (files.length > 0) acc[cartItemId] = files;
    return acc;
  }, {});
}

export function saveDraftItemDesignFiles(
  storeSlug: string,
  cartItemId: string,
  files: File[],
): Promise<void> {
  if (files.length === 0) {
    return deleteDraftItemDesignFiles(storeSlug, cartItemId);
  }

  const record: DraftItemDesignFilesRecord = {
    key: recordKey(storeSlug, cartItemId),
    storeSlug,
    cartItemId,
    files,
    updatedAt: Date.now(),
  };

  return withStore('readwrite', (store) => store.put(record)).then(() => undefined);
}

export function deleteDraftItemDesignFiles(
  storeSlug: string,
  cartItemId: string,
): Promise<void> {
  return withStore('readwrite', (store) => store.delete(recordKey(storeSlug, cartItemId)))
    .then(() => undefined);
}

export function deleteDraftItemDesignFilesMany(
  storeSlug: string,
  cartItemIds: string[],
): Promise<void> {
  return Promise.all(cartItemIds.map((cartItemId) => (
    deleteDraftItemDesignFiles(storeSlug, cartItemId)
  ))).then(() => undefined);
}
