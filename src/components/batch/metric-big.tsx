interface MetricBigProps {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  compare?: { good: boolean; label: string };
  /** Fills the tile teal — reserved for the single headline number. */
  primary?: boolean;
}

export function MetricBig({ label, value, hint, accent, compare, primary }: MetricBigProps) {
  const footer =
    hint ??
    (compare ? (
      <span
        style={{
          color: primary ? "rgba(255,255,255,.85)" : compare.good ? "var(--success)" : "var(--error)",
        }}
      >
        {compare.good ? "▲" : "▼"} {compare.label}
      </span>
    ) : null);

  return (
    <div
      className="rounded-card p-3.5"
      style={{
        background: primary ? "var(--av-teal)" : "var(--surface)",
        border: `1px solid ${primary ? "transparent" : "var(--border)"}`,
        color: primary ? "#fff" : "var(--slate)",
      }}
    >
      <div className="label mb-1.5" style={primary ? { color: "rgba(255,255,255,.72)" } : undefined}>
        {label}
      </div>
      <div
        className="num text-[22px] font-medium tracking-[-0.015em]"
        style={{ color: accent ?? (primary ? "#fff" : "var(--slate)") }}
      >
        {value}
      </div>
      {footer && (
        <div className="mt-1.5 text-[11px]" style={{ color: primary ? "rgba(255,255,255,.7)" : "var(--muted)" }}>
          {footer}
        </div>
      )}
    </div>
  );
}
