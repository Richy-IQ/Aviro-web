"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/overlay/sheet";
import { Icon } from "@/components/ui/icon";
import { PERIODS, type Period } from "@/lib/statement";

const INCLUDED = [
  "Revenue and cost of production per cycle",
  "Cost breakdown by category, as a share of revenue",
  "Gross profit and margin",
  "Cost, revenue and profit per bird",
  "Cost per kilogram of meat produced",
];

export function ExportButton() {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("12-mo");
  const router = useRouter();

  return (
    <>
      <button type="button" className="av-btn ghost sm" onClick={() => setOpen(true)}>
        <Icon name="download" size={14} /> Export
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Income statement"
        subtitle="A summary of your records you can print, save or hand to a cooperative or lender."
        footer={
          <>
            <button type="button" className="av-btn ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="av-btn primary"
              onClick={() => router.push(`/reports/statement?period=${period}`)}
            >
              Open statement
            </button>
          </>
        }
      >
        <span className="label">Report period</span>
        <div className="mt-2 mb-4.5 grid grid-cols-3 gap-2">
          {PERIODS.map((o) => {
            const on = period === o.v;
            return (
              <button
                key={o.v}
                type="button"
                aria-pressed={on}
                onClick={() => setPeriod(o.v)}
                className="rounded-metric px-2 py-3 text-[13px] font-medium"
                style={{
                  border: on ? "2px solid var(--av-teal)" : "1px solid var(--border)",
                  background: on ? "var(--av-teal-haze)" : "var(--surface)",
                  color: on ? "var(--av-teal)" : "var(--slate)",
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <span className="label">What&rsquo;s included</span>
        <ul className="mt-2.5 list-none p-0">
          {INCLUDED.map((s, i) => (
            <li
              key={s}
              className="flex gap-2.5 py-2"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <Icon name="check" size={16} style={{ color: "var(--av-teal)", flexShrink: 0 }} />
              <span className="text-[13px]">{s}</span>
            </li>
          ))}
        </ul>

        <p className="av-help">
          Opens a print-ready page. Use your browser&rsquo;s Save as PDF to keep a copy — it works
          offline.
        </p>
      </Sheet>
    </>
  );
}
