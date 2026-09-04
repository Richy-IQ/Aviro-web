"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that lets the app open with no connection.
 *
 * Only in production: in development the worker would serve stale bundles and
 * make every change look like it did not apply.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // An app that cannot register a worker still works; it just will not
      // open offline. Nothing here is worth interrupting the farmer for.
    });
  }, []);

  return null;
}

/**
 * Empties the cached pages. Called on sign-out, because these phones are
 * shared and one farmer's numbers must not survive into the next person's
 * session.
 */
export async function clearCachedPages(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.getRegistration();
  registration?.active?.postMessage({ type: "CLEAR_PAGE_CACHE" });
}
