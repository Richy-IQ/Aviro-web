"use client";

import { all, markFailed, remove, type PendingLog } from "./queue";

/**
 * Draining the queue.
 *
 * Runs when the connection returns and when the app opens. Entries the API
 * rejects on their merits are dropped rather than retried forever — a log the
 * server will never accept would otherwise block every one behind it.
 */

// After this many failures an entry is almost certainly not going to succeed,
// and holding it only hides the problem from the farmer.
const MAX_ATTEMPTS = 5;

export interface SyncOutcome {
  synced: number;
  remaining: number;
  failed: PendingLog[];
}

let draining = false;

export async function drain(): Promise<SyncOutcome> {
  // A second drain while one is running would replay the same entries twice.
  if (draining) return { synced: 0, remaining: (await all()).length, failed: [] };
  draining = true;

  let synced = 0;
  const failed: PendingLog[] = [];

  try {
    for (const entry of await all()) {
      if (entry.attempts >= MAX_ATTEMPTS) {
        failed.push(entry);
        continue;
      }

      try {
        const response = await fetch("/api/sync/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchId: entry.batchId, payload: entry.payload }),
        });

        if (response.ok) {
          await remove(entry.id);
          synced += 1;
          continue;
        }

        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
          retryable?: boolean;
        };

        if (body.retryable === false) {
          // The server will never accept this. Drop it rather than let it
          // block the queue, and surface why.
          await remove(entry.id);
          failed.push({ ...entry, lastError: body.error });
          continue;
        }

        await markFailed(entry, body.error ?? "Could not reach Aviro.");
        // Still offline: stop here rather than hammering every entry.
        break;
      } catch {
        await markFailed(entry, "Could not reach Aviro.");
        break;
      }
    }
  } finally {
    draining = false;
  }

  return { synced, remaining: (await all()).length, failed };
}
