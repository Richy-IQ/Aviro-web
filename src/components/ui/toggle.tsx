"use client";

export function Toggle({
  on, onChange, label,
}: { on: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="h-[26px] w-11 shrink-0 rounded-full border-0 p-0.5 transition-colors"
      style={{ background: on ? "var(--av-teal)" : "var(--border-strong)" }}
    >
      <span
        className="block h-[22px] w-[22px] rounded-full bg-white transition-transform"
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,.2)",
          transform: on ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </button>
  );
}
