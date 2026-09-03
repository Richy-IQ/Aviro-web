"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";

/**
 * Real connectivity banner. Rural coverage is patchy, so a farmer needs to know
 * their evening log is queued rather than lost. Starts hidden and only appears
 * once the browser reports offline — never flashes during hydration.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-2 bg-warning-soft px-4 py-2 text-xs font-medium text-warning-ink"
    >
      <Icon name="wifi-off" size={14} />
      <span>Working offline. Your changes will sync when you&apos;re back online.</span>
    </div>
  );
}
