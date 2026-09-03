"use client";

import { Icon } from "@/components/ui/icon";

const MAX_DIGITS = 6;

/**
 * Custom keypad rather than a native numeric input. Farmers log in the evening,
 * often one-handed with dusty hands — 56px keys and no OS keyboard popping over
 * the running total.
 */
export function NumPad({
  value, onChange, decimal, zeroKey,
}: { value: string; onChange: (v: string) => void; decimal?: boolean; zeroKey?: boolean }) {
  const tap = (k: string) => {
    let v = value || "";
    if (k === "del") v = v.slice(0, -1);
    else if (k === ".") {
      if (decimal && !v.includes(".")) v += v ? "." : "0.";
    } else if (k === "clear") v = "0";
    else if (v === "0") v = k;
    else v = (v + k).slice(0, MAX_DIGITS);
    onChange(v);
  };

  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    decimal ? "." : zeroKey ? "clear" : "",
    "0",
    "del",
  ];

  return (
    <div className="av-numpad border-0 bg-transparent p-0">
      {keys.map((k, i) => {
        if (!k) return <span key={i} />;
        const isAction = k === "del" || k === "clear" || k === ".";
        return (
          <button
            key={i}
            type="button"
            onClick={() => tap(k)}
            aria-label={k === "del" ? "Delete" : k === "clear" ? "Clear" : k}
            className={`av-numkey${isAction ? " action" : ""}`}
          >
            {k === "del" ? <Icon name="back" size={16} className="mx-auto" /> : k === "clear" ? "Clear" : k}
          </button>
        );
      })}
    </div>
  );
}

export function BigNumDisplay({ value, unit, sub }: { value: string; unit: string; sub?: string }) {
  return (
    <div className="pt-5 pb-4 text-center">
      <div className="num text-[56px] leading-none font-medium tracking-[-0.03em] text-slate-ink">
        {value}
        <span className="ml-2 text-lg font-medium text-muted">{unit}</span>
      </div>
      {sub && <div className="caption mt-2">{sub}</div>}
    </div>
  );
}
