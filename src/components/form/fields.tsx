import type { ReactNode, SelectHTMLAttributes } from "react";
import { Icon } from "@/components/ui/icon";

export function FieldLabel({
  children, optional, htmlFor,
}: { children: ReactNode; optional?: boolean; htmlFor?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-slate-ink">
        {children}
      </label>
      {optional && <span className="caption text-[11px]">Optional</span>}
    </div>
  );
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  options: { value: string; label: string }[];
}

/** Native select with the chevron drawn by us — keeps the OS picker on mobile. */
export function Select({ options, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select className="av-input lg appearance-none pr-10" {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted">
        <Icon name="chev-down" size={16} />
      </div>
    </div>
  );
}

/** Text input prefixed with the naira sign, sized for headline amounts. */
export function NairaInput({
  value, onChange, size = "xl", id,
}: { value: number; onChange: (n: number) => void; size?: "lg" | "xl"; id?: string }) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
        style={{ fontSize: size === "xl" ? 18 : 15 }}
      >
        ₦
      </span>
      <input
        id={id}
        className={`av-input ${size}`}
        inputMode="numeric"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
        style={{ paddingLeft: size === "xl" ? 32 : 28 }}
      />
    </div>
  );
}

/** Radio row with a drawn control — the native one is too small for a 48px tap target. */
export function RadioRow({
  label, hint, checked, onSelect, first,
}: { label: string; hint?: string; checked: boolean; onSelect: () => void; first?: boolean }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="flex w-full items-center gap-3 border-0 bg-transparent p-3.5 text-left text-slate-ink"
      style={{ borderTop: first ? "none" : "1px solid var(--border)" }}
    >
      <span
        className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full"
        style={{ border: `2px solid ${checked ? "var(--av-teal)" : "var(--border-strong)"}` }}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-teal" />}
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {hint && <span className="caption text-xs">{hint}</span>}
    </button>
  );
}

/** Card-shaped option used where choices need a subtitle (bird type, health). */
export function ChoiceCard({
  label, sub, selected, onSelect,
}: { label: string; sub?: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className="rounded-card p-3 text-left text-slate-ink"
      style={{
        border: selected ? "2px solid var(--av-teal)" : "1px solid var(--border)",
        background: selected ? "var(--av-teal-haze)" : "var(--surface)",
      }}
    >
      <div className="text-sm font-medium">{label}</div>
      {sub && <div className="caption mt-0.5 text-xs">{sub}</div>}
    </button>
  );
}
