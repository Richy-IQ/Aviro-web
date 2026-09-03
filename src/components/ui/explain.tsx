"use client";

import { useState } from "react";
import { Sheet } from "@/components/overlay/sheet";
import { Icon } from "@/components/ui/icon";
import { EXPLAINERS, type ExplainerKey } from "@/lib/explainers";

/**
 * A question mark beside a number. One tap explains the term in plain language
 * and says what a good value looks like — so jargon never blocks a first-time
 * farmer from acting on their own data.
 */
export function Explain({ term, light }: { term: ExplainerKey; light?: boolean }) {
  const [open, setOpen] = useState(false);
  const e = EXPLAINERS[term];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`What is ${e.term}?`}
        className="inline-grid h-5 w-5 shrink-0 place-items-center rounded-full align-middle transition-colors"
        style={{
          background: light ? "rgba(255,255,255,.2)" : "var(--bg)",
          color: light ? "rgba(255,255,255,.9)" : "var(--muted)",
        }}
      >
        <Icon name="help" size={13} />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={e.term} subtitle={e.short}>
        <Section label="What it means" body={e.what} />
        <Section label="Why it matters" body={e.why} />
        <div className="rounded-card bg-teal-haze p-3.5">
          <div className="label mb-1.5" style={{ color: "var(--av-teal)" }}>
            What good looks like
          </div>
          <p className="text-sm leading-[1.6] text-slate-ink">{e.good}</p>
        </div>
      </Sheet>
    </>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div className="mb-4">
      <div className="label mb-1.5">{label}</div>
      <p className="text-sm leading-[1.6] text-slate-2">{body}</p>
    </div>
  );
}
