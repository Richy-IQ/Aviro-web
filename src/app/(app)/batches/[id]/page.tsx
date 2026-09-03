import { notFound } from "next/navigation";
import Link from "next/link";
import { MetricBig } from "@/components/batch/metric-big";
import { Explain } from "@/components/ui/explain";
import { SellChart } from "@/components/batch/sell-chart";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm } from "@/lib/farm-data";
import { cycleDaysFor, guideFor } from "@/lib/guide";
import { naira, nairaShort } from "@/lib/format";
import type { Batch } from "@/lib/types";

/** Pre-render every batch at build time — these pages are pure data. */
export function generateStaticParams() {
  return makeFarm(CURRENT_DAY).batches.map((b) => ({ id: b.id }));
}

const HERO_BG: Record<Batch["status"], string> = {
  "needs-attention": "var(--error-soft)",
  behind: "var(--warning-soft)",
  ahead: "var(--av-teal-haze)",
  "on-track": "var(--av-teal-haze)",
};

const HERO_INK: Record<Batch["status"], string> = {
  "needs-attention": "var(--error)",
  behind: "var(--warning-ink)",
  ahead: "var(--av-teal)",
  "on-track": "var(--av-teal)",
};

const STATUS_LABEL: Record<Batch["status"], string> = {
  "on-track": "On track",
  ahead: "Ahead",
  behind: "Behind",
  "needs-attention": "Needs attention",
};

export default async function BatchDetailPage({ params }: PageProps<"/batches/[id]">) {
  const { id } = await params;
  const farm = makeFarm(CURRENT_DAY);
  const batch = farm.batches.find((b) => b.id === id);
  if (!batch) notFound();

  // Only the focused batch carries a full day-by-day history in the fixture.
  const full = "days" in batch ? batch : null;
  const cycleDays = cycleDaysFor(batch.type);
  const guide = guideFor(batch.type);
  const last7 = full ? full.days.slice(-7).reverse() : [];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <TopBar
        title={batch.name}
        subtitle={`${batch.breed} · Day ${batch.day} of ${cycleDays}`}
        backHref="/batches"
      />

      <div className="p-4">
        <div
          className="mb-4 rounded-card p-4"
          style={{ background: HERO_BG[batch.status], border: "1px solid transparent" }}
        >
          <div className="caption text-xs text-slate-2">
            Day {batch.day} of ~{cycleDays}
             {guide.cycleGoal}
          </div>
          <div className="mt-1.5 flex items-baseline justify-between gap-3">
            <div className="display text-[32px]" style={{ color: HERO_INK[batch.status] }}>
              {STATUS_LABEL[batch.status]}
            </div>
            {full && (
              <div className="text-right">
                <div className="caption text-[11px]">Streak</div>
                <div className="num font-medium">{full.streak}d</div>
              </div>
            )}
          </div>
          <div className="av-progress mt-3.5">
            <i style={{ width: `${Math.min(100, Math.round((batch.day / cycleDays) * 100))}%` }} />
          </div>
        </div>

        <span className="label">Live numbers</span>
        <div className="mt-2 mb-4 grid grid-cols-2 gap-2.5">
          <MetricBig
            label="Cost per bird"
            value={naira(batch.costPerBird)}
            compare={{ good: false, label: "vs last ₦1,910" }}
            explain="costPerBird"
          />
          <MetricBig
            label="Feed conversion"
            value={batch.fcr != null ? batch.fcr.toFixed(2) : "—"}
            hint="kg feed / kg bird"
            explain="fcr"
          />
          <MetricBig
            label="Mortality"
            value={`${batch.mortPct.toFixed(1)}%`}
            accent={batch.mortPct > 5 ? "var(--error)" : undefined}
            compare={{ good: batch.mortPct < 5, label: "of 5% target" }}
            explain="mortality"
          />
          {full && (
            <MetricBig
              label="Projected profit"
              value={nairaShort(full.projProfit)}
              compare={{ good: true, label: `at day ${full.optimalDay}` }}
              primary
              explain="projectedProfit"
            />
          )}
        </div>

        {full && (
          <>
            <span className="label">Today&rsquo;s log</span>
            <div className="av-card mt-2 mb-4 p-3.5">
              {full.loggedToday ? (
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-soft-mint text-teal">
                    <Icon name="check" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">Logged for today</div>
                    <div className="caption text-xs">FCR improved by 0.02 since yesterday.</div>
                  </div>
                  <Link href="/log" className="av-btn ghost sm">
                    Edit
                  </Link>
                </div>
              ) : (
                <Link href="/log" className="av-btn primary full">
                  <Icon name="plus" size={16} stroke={2} /> Log today
                </Link>
              )}
            </div>

            <span className="label">Sell window</span>
            <div className="av-card mt-2 mb-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <div>
                  <div className="caption">Best day to sell</div>
                  <div className="h3 mt-0.5 flex items-center gap-2">
                    <span>
                      Day <span className="num">{full.optimalDay}</span> · {nairaShort(full.projProfit)} profit
                    </span>
                    <Explain term="sellWindow" />
                  </div>
                </div>
              </div>
              <SellChart data={full.sellWindow} optimalDay={full.optimalDay} height={64} />
            </div>

            <span className="label">Recent activity</span>
            <div className="av-card mt-2 mb-4 p-0">
              {last7.map((d, i) => (
                <div
                  key={d.day}
                  className="flex items-center gap-3 px-3.5 py-3"
                  style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
                >
                  <div className="num caption w-9 font-medium">day {d.day}</div>
                  <div className="flex flex-1 items-center gap-3 text-xs text-slate-2">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="feed" size={12} style={{ color: "var(--av-teal)" }} />
                      <span className="num">{d.feedKg}</span>kg
                    </span>
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: d.died > 5 ? "var(--error)" : "inherit" }}
                    >
                      <Icon name="skull" size={12} />
                      <span className="num">{d.died}</span>
                    </span>
                    {d.medsCost > 0 && <Icon name="pill" size={12} style={{ color: "var(--warning)" }} />}
                  </div>
                  <span className="num text-xs text-slate-ink">
                    {nairaShort(d.feedCost + d.medsCost + d.miscCost)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2 pb-7">
          <Link href="/sale" className="av-btn ghost flex-1">
            <Icon name="naira" size={16} /> Record sale
          </Link>
          <Link href="/log" className="av-btn primary flex-1">
            <Icon name="plus" size={16} stroke={2} /> Log today
          </Link>
        </div>
      </div>
    </div>
  );
}
