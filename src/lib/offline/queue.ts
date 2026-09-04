"use client";

/**
 * The offline queue.
 *
 * A farmer standing in a pen at dusk often has no signal. Their log has to
 * survive that, and survive the tab being closed on the walk back — so it goes
 * to IndexedDB rather than memory, and is replayed when the connection returns.
 *
 * This is safe to replay because the API's log endpoint is idempotent per
 * (batch, date): posting the same day twice updates it rather than creating a
 * duplicate. Without that guarantee a retry would corrupt the record.
 */

const DB_NAME = "aviro";
const DB_VERSION = 1;
const STORE = "pending_logs";

export interface PendingLog {
  /** Batch and date together — replacing an entry for the same day, offline too. */
  id: string;
  batchId: string;
  batchName: string;
  loggedOn: string;
  payload: Record<string, unknown>;
  queuedAt: number;
  attempts: number;
  lastError?: string;
}

export const QUEUE_CHANGED = "aviro:queue-changed";

function announce(): void {
  window.dispatchEvent(new Event(QUEUE_CHANGED));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = run(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/** Queue a log, replacing any entry already held for the same batch and day. */
export async function enqueue(
  entry: Omit<PendingLog, "id" | "queuedAt" | "attempts">,
): Promise<void> {
  const record: PendingLog = {
    ...entry,
    id: `${entry.batchId}:${entry.loggedOn}`,
    queuedAt: Date.now(),
    attempts: 0,
  };
  await withStore("readwrite", (store) => store.put(record));
  announce();
}

export async function all(): Promise<PendingLog[]> {
  try {
    const records = await withStore<PendingLog[]>("readonly", (store) => store.getAll());
    return records.sort((a, b) => a.queuedAt - b.queuedAt);
  } catch {
    // Private browsing or blocked storage: nothing is queued, which is the
    // truth as far as this device is concerned.
    return [];
  }
}

export async function count(): Promise<number> {
  return (await all()).length;
}

export async function remove(id: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(id));
  announce();
}

export async function markFailed(entry: PendingLog, error: string): Promise<void> {
  await withStore("readwrite", (store) =>
    store.put({ ...entry, attempts: entry.attempts + 1, lastError: error }),
  );
  announce();
}

export function isSupported(): boolean {
  return typeof indexedDB !== "undefined";
}
