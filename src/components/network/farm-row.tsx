import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import type { ApiNetworkFarmRow } from "@/lib/api/types";

/**
 * How each farm reads at a glance.
 *
 * Colour carries the same meaning it does everywhere else in the app: red is
 * losing birds now, amber is something to look into, grey is a pen with no
 * birds in it. A farm that has gone quiet is amber rather than grey — silence
 * is a finding, not an absence.
 */
const STATUS: Record<
  ApiNetworkFarmRow["status"],
  { label: string; ink: string; ground: string }
> = {
  losing: { label: "Losing birds", ink: "var(--error)", ground: "var(--error-soft)" },
  silent: { label: "Not reporting", ink: "var(--warning-ink)", ground: "var(--warning-soft)" },
  behind: { label: "Behind target", ink: "var(--warning-ink)", ground: "var(--warning-soft)" },
  fine: { label: "Reporting", ink: "var(--success)", ground: "var(--soft-mint)" },
  idle: { label: "No birds", ink: "var(--muted)", ground: "var(--bg)" },
};

export function NetworkFarmRow({ row }: { row: ApiNetworkFarmRow }) {
  const status = STATUS[row.status];

  return (
    <div className="av-card mb-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium">{row.name}</div>
          {row.location && <div className="caption mt-0.5 text-xs">{row.location}</div>}
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{ background: status.ground, color: status.ink }}
        >
          {status.label}
        </span>
      </div>

      {row.attention.length > 0 && (
        <ul className="mt-2.5 flex flex-col gap-1">
          {row.attention.map((a) => (
            <li
              key={a}
              className="flex gap-2 text-[13px] leading-[1.5]"
              style={{ color: status.ink }}
            >
              <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex gap-4 border-t border-border pt-2.5">
        <Cell label="Birds" value={row.birds_alive.toLocaleString("en-NG")} />
        <Cell label="Lost" value={String(row.deaths)} bad={row.deaths > 0} />
        <Cell label="Feed" value={`${row.feed_kg} kg`} />
        <Cell label="Days logged" value={`${row.days_logged} of ${row.days_possible}`} />
      </div>
    </div>
  );
}

function Cell({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="flex-1">
      <div className="caption mb-0.5 text-[10px] tracking-[.08em] uppercase">{label}</div>
      <div
        className="num text-[15px] font-medium"
        style={{ color: bad ? "var(--error)" : "var(--slate)" }}
      >
        {value}
      </div>
    </div>
  );
}

/** The network summary, for the home screen of someone who runs one. */
export function NetworkCard({ id, name, headline }: { id: string; name: string; headline: string }) {
  return (
    <Link href={`/network?org=${id}`} className="av-card flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
        <Icon name="farm" size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="label mb-0.5">{name}</div>
        <div className="text-[13px] leading-[1.45]">{headline}</div>
      </div>
      <Icon name="chevron" size={16} className="shrink-0 text-muted" />
    </Link>
  );
}
