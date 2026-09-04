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

    // Never on localhost. Every project on a developer's machine shares that
    // origin, and this worker caches page HTML keyed by URL — so a worker
    // registered here would serve one project's pages to another, and would
    // outlive the server that registered it. Offline behaviour is verified on
    // the deployed site or a device, not against localhost.
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
      // Clean up any worker a previous build left behind on this origin.
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) void registration.unregister();
      });
      return;
    }

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
