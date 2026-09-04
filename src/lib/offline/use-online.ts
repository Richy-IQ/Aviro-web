"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * Whether the browser believes it has a connection.
 *
 * Read through useSyncExternalStore rather than mirrored into state: it is an
 * external system, and mirroring it means a render where React and the device
 * disagree. Assumed online on the server, so the banner never flashes during
 * hydration.
 */
export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
