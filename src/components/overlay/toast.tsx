"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

const TOAST_MS = 2800;

type Kind = "ok" | "error";
interface Toast {
  msg: string;
  kind: Kind;
}

const Ctx = createContext<((msg: string, kind?: Kind) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const ping = useCallback((msg: string, kind: Kind = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  return (
    <Ctx.Provider value={ping}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2.5 rounded-metric px-4.5 py-3 text-[13px] font-medium text-white lg:bottom-7"
          style={{
            background: toast.kind === "error" ? "var(--error)" : "var(--slate)",
            boxShadow: "0 12px 32px rgba(15,23,42,0.25)",
          }}
        >
          <Icon name={toast.kind === "error" ? "alert" : "check"} size={16} />
          <span>{toast.msg}</span>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
