import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { dateRange, naira, shortDate } from "@/lib/format";
import type { ApiPeriodReport } from "@/lib/api/types";

function Stat({ label, value, sub, bad }: { label: string; value: string; sub?: string; bad?: boolean }) {
  return (
    <div className="av-card flex-1">
      <div className="caption mb-1 text-[10px] tracking-[.08em] uppercase">{label}</div>
      <div
        className="num text-xl font-medium"
        style={{ color: bad ? "var(--error)" : "var(--slate)" }}
      >
        {value}
      </div>
      {sub && <div className="caption mt-0.5 text-xs">{sub}</div>}
    </div>
  );
}

function trend(now: number, before: number): { sub: string; bad: boolean } {
  if (before === 0) return { sub: now === 0 ? "" : "Nothing to compare yet", bad: false };
  if (now === before) return { sub: "Same as last period", bad: false };
  const worse = now > before;
  return { sub: `${worse ? "Up from" : "Down from"} ${before}`, bad: worse };
}

/** The full report. Plain numbers first, then what is coming. */
export function PeriodReport({ report }: { report: ApiPeriodReport }) {
  const deathTrend = trend(report.deaths, report.deaths_before);
  const revenue = Number(report.revenue);

  return (
    <div className="px-4 pb-8">
      <div className="av-card mb-3 bg-teal-haze">
        <div className="label mb-1.5">
          {report.label} · {dateRange(report.starts_on, report.ends_on)}
        </div>
        <p className="text-[15px] leading-[1.5] font-medium">{report.headline}</p>
      </div>

      <div className="mb-2.5 flex gap-2.5">
        <Stat
          label="Birds lost"
          value={report.deaths.toLocaleString("en-NG")}
          sub={deathTrend.sub}
          bad={deathTrend.bad}
        />
        <Stat
          label="Feed used"
          value={Number(report.feed_bags) >= 1 ? `${report.feed_bags} bags` : `${report.feed_kg} kg`}
          sub={`${report.feed_kg} kg`}
        />
      </div>

      <div className="mb-2.5 flex gap-2.5">
        <Stat
          label="Days logged"
          value={`${report.days_logged} of ${report.days_possible}`}
          bad={report.days_logged < report.days_possible / 2}
        />
        <Stat label="Birds on the farm" value={report.birds_alive.toLocaleString("en-NG")} />
      </div>

      {(Number(report.recorded_spend) > 0 || revenue > 0) && (
        <div className="mb-2.5 flex gap-2.5">
          <Stat label="Spent" value={naira(Number(report.recorded_spend))} />
          {revenue > 0 && <Stat label="Sold" value={naira(revenue)} />}
        </div>
      )}

      {report.notes.length > 0 && (
        <div className="av-card mb-3 bg-warning-soft text-warning-ink">
          <ul className="flex flex-col gap-2 text-[13px] leading-[1.5]">
            {report.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.batches.length > 0 && (
        <>
          <div className="label mt-5 mb-2">Batch by batch</div>
          {report.batches.map((b) => (
            <Link key={b.id} href={`/batches/${b.id}`} className="av-card mb-2.5 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{b.name}</div>
                <div className="caption mt-0.5 text-xs">
                  Day {b.day} · {b.birds_alive.toLocaleString("en-NG")} birds ·{" "}
                  {b.days_logged} {b.days_logged === 1 ? "day" : "days"} logged
                </div>
              </div>
              <div className="text-right">
                <div className="num text-[15px] font-medium" style={{ color: b.deaths > 0 ? "var(--error)" : undefined }}>
                  {b.deaths} lost
                </div>
                <div className="caption text-xs">{b.feed_kg} kg</div>
              </div>
            </Link>
          ))}
        </>
      )}

      {report.upcoming.length > 0 && (
        <>
          <div className="label mt-5 mb-2">Coming up</div>
          {report.upcoming.map((u) => (
            <div key={`${u.batch_name}-${u.what}-${u.due_on}`} className="av-card mb-2.5">
              <div className="text-[15px] font-medium">{u.what}</div>
              <div className="caption mt-0.5 text-xs">
                {u.batch_name} · day {u.day} · {shortDate(u.due_on)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/** The same report shrunk to a line, for the home screen. */
export function PeriodCard({ report }: { report: ApiPeriodReport }) {
  return (
    <Link href="/summary" className="av-card flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
        <Icon name="trend" size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="label mb-0.5">{report.label}</div>
        <div className="text-[13px] leading-[1.45]">{report.headline}</div>
      </div>
      <Icon name="chevron" size={16} className="shrink-0 text-muted" />
    </Link>
  );
}
