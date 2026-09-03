"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

/**
 * One overlay that reads correctly at both sizes: a bottom sheet on phones, a
 * right-hand drawer from lg up. Closes on Escape and on backdrop click, traps
 * initial focus, and locks background scroll while open.
 */
export function Sheet({
  open, onClose, title, subtitle, eyebrow, footer, children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center lg:items-stretch lg:justify-end"
      style={{ background: "rgba(15,23,42,0.4)" }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full flex-col rounded-t-2xl bg-surface outline-none lg:max-h-none lg:w-[540px] lg:rounded-none"
        style={{ boxShadow: "-20px 0 60px rgba(15,23,42,0.18)" }}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {eyebrow && <div className="label">{eyebrow}</div>}
            <div className="h2 truncate" style={{ marginTop: eyebrow ? 4 : 0 }}>
              {title}
            </div>
            {subtitle && <div className="caption mt-0.5">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="av-btn ghost h-9 w-9 shrink-0 border-transparent p-0"
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="av-scroll min-h-0 flex-1 px-5 py-5">{children}</div>

        {footer && (
          <footer className="flex justify-end gap-2.5 border-t border-border bg-bg px-5 py-3.5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
