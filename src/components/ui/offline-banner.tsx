"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/ui/icon";
import { count, QUEUE_CHANGED } from "@/lib/offline/queue";
import { drain } from "@/lib/offline/sync";
import { useOnline } from "@/lib/offline/use-online";

/**
 * Connection and queue state, stated truthfully.
 *
 * This banner used to promise that changes would sync when the connection
 * returned, while nothing was stored and nothing was ever sent. It now reports
 * what is actually held on the phone and what actually happens to it.
 */
export function OfflineBanner() {
  const router = useRouter();
  const online = useOnline();
  const [pending, setPending] = useState(0);
  // React owns the in-flight flag, so nothing sets state synchronously inside
  // the effect that starts a sync.
  const [syncing, startSync] = useTransition();

  const refreshCount = useCallback(() => {
    void count().then(setPending);
  }, []);

  const sync = useCallback(() => {
    if (!navigator.onLine) return;
    startSync(async () => {
      try {
        const outcome = await drain();
        // Metrics are derived from the logs, so a sync changes every number on
        // screen, not just this banner.
        if (outcome.synced > 0) router.refresh();
      } finally {
        refreshCount();
      }
    });
  }, [router, refreshCount]);

  useEffect(() => {
    refreshCount();
    window.addEventListener(QUEUE_CHANGED, refreshCount);
    return () => window.removeEventListener(QUEUE_CHANGED, refreshCount);
  }, [refreshCount]);

  // Coming back online is the moment to send what has been waiting.
  useEffect(() => {
    if (online) sync();
  }, [online, sync]);

  if (online && pending === 0) return null;

  const entries = `${pending} ${pending === 1 ? "entry" : "entries"}`;

  if (!online) {
    return (
      <Banner tone="warn">
        <Icon name="wifi-off" size={14} />
        <span>
          {pending > 0
            ? `No connection. ${entries} saved on this phone, and will send when you are back online.`
            : "No connection. Anything you log is saved here and sent when you are back online."}
        </span>
      </Banner>
    );
  }

  return (
    <Banner tone="teal">
      <Icon name="arrow" size={14} className={syncing ? "av-pulse" : undefined} />
      <span>{syncing ? `Sending ${entries}…` : `${entries} waiting to send.`}</span>
      {!syncing && (
        <button type="button" onClick={sync} className="ml-auto underline">
          Send now
        </button>
      )}
    </Banner>
  );
}

function Banner({ tone, children }: { tone: "warn" | "teal"; children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2 px-4 py-2 text-xs font-medium"
      style={
        tone === "warn"
          ? { background: "var(--warning-soft)", color: "var(--warning-ink)" }
          : { background: "var(--av-teal-tint)", color: "var(--av-teal)" }
      }
    >
      {children}
    </div>
  );
}
