import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: string;
  /** CSS color for the value — used to flag a metric that needs attention. */
  accent?: string;
  big?: boolean;
  compare?: { good: boolean; label: string };
}

export function Stat({ label, value, hint, accent, big, compare }: StatProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-3.5">
      <div className="label mb-1.5">{label}</div>
      <span
        className="num block font-medium leading-[1.1] tracking-[-0.015em]"
        style={{ fontSize: big ? 28 : 20, color: accent ?? "var(--slate)" }}
      >
        {value}
      </span>
      {(hint || compare) && (
        <div className="mt-1.5 flex items-center justify-between gap-1.5">
          {hint && <span className="caption flex-1">{hint}</span>}
          {compare && (
            <span
              className="num text-[11px] font-medium"
              style={{ color: compare.good ? "var(--success)" : "var(--error)" }}
            >
              {compare.good ? "▲" : "▼"} {compare.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
