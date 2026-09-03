import Link from "next/link";
import { StatusPill } from "@/components/ui/pill";
import { naira } from "@/lib/format";
import type { Batch, BatchSummary } from "@/lib/types";

const CYCLE_DAYS = 42;

function MicroStat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="flex-1">
      <div className="caption mb-0.5 text-[10px] tracking-[.08em] uppercase">{label}</div>
      <div className="num text-[15px] font-medium" style={{ color: bad ? "var(--error)" : "var(--slate)" }}>
        {value}
      </div>
    </div>
  );
}

/** `primary` outlines the batch currently in focus across the app. */
export function BatchCard({ batch, primary }: { batch: Batch | BatchSummary; primary?: boolean }) {
  const pct = Math.min(100, Math.round((batch.day / CYCLE_DAYS) * 100));

  return (
    <Link
      href={`/batches/${batch.id}`}
      className="mb-2.5 block rounded-[14px] bg-surface p-3.5 transition-shadow"
      style={{
        border: primary ? "1.5px solid var(--av-teal)" : "1px solid var(--border)",
        boxShadow: primary ? "0 1px 0 var(--av-teal-tint)" : "none",
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">{batch.name}</span>
            <span className="caption">·</span>
            <span className="caption truncate text-xs">{batch.breed}</span>
          </div>
          <div className="caption mt-1 text-xs">
            Day {batch.day} of {CYCLE_DAYS} · <span className="num">{batch.alive.toLocaleString("en-NG")}</span> birds
          </div>
        </div>
        <StatusPill status={batch.status} />
      </div>

      <div className="mb-3 flex gap-4">
        <MicroStat label="Cost / bird" value={naira(batch.costPerBird)} />
        <MicroStat label="Mortality" value={`${batch.mortPct.toFixed(1)}%`} bad={batch.mortPct > 5} />
        <MicroStat label="FCR" value={batch.fcr != null ? batch.fcr.toFixed(2) : "—"} />
      </div>

      <div className="av-progress">
        <i style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}
