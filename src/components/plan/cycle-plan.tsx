import { Icon } from "@/components/ui/icon";
import { naira, nairaShort } from "@/lib/format";
import type { ApiCyclePlan } from "@/lib/api/types";

/**
 * The whole cycle, laid out.
 *
 * Written for someone who has never raised birds: bags rather than kilograms,
 * real dates rather than day numbers, and the reason for each feed change
 * beside it.
 */

function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${iso}T12:00:00`));
}

function fullDate(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${iso}T12:00:00`));
}

export function CyclePlan({ plan, compact }: { plan: ApiCyclePlan; compact?: boolean }) {
  return (
    <div>
      {/* The headline: what to buy, and what it costs */}
      <div className="rounded-card bg-teal p-4 text-white">
        <div className="label" style={{ color: "rgba(255,255,255,.72)" }}>
          Feed for {plan.stocked.toLocaleString("en-NG")} {plan.bird_type_label.toLowerCase()}
        </div>
        <div className="display num mt-1 text-[34px]">
          {Number(plan.total_bags).toFixed(0)} bags
        </div>
        <div className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,.85)" }}>
          {plan.total_feed_kg} kg over {plan.cycle_days} days · {plan.feed_per_bird_kg} kg per bird
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <div className="av-metric">
          <div className="av-metric-l">Feed will cost about</div>
          <div className="av-metric-v num">{nairaShort(Number(plan.estimated_feed_cost))}</div>
        </div>
        <div className="av-metric">
          <div className="av-metric-l">{plan.cycle_goal}</div>
          <div className="av-metric-v num">{shortDate(plan.ends_on)}</div>
        </div>
      </div>

      {/* Feed changes — the thing most likely to be got wrong */}
      <div className="mt-6">
        <span className="label">What to feed, and when to change</span>
        <div className="mt-2 overflow-hidden rounded-card border border-border">
          {plan.phases.map((phase, i) => (
            <div
              key={phase.name}
              className="bg-surface p-3.5"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-medium">{phase.name}</span>
                <span className="num text-sm font-medium">
                  {Number(phase.bags).toFixed(1)} bags
                </span>
              </div>
              <div className="caption mt-1 text-xs">
                {fullDate(phase.starts_on)} – {fullDate(phase.ends_on)} · day {phase.day_from}–
                {phase.day_to} · {phase.total_kg} kg
              </div>
              <div className="caption mt-1 text-xs">
                {phase.grams_per_bird_start}g per bird a day at the start, rising to{" "}
                {phase.grams_per_bird_end}g
              </div>
              {phase.notes && !compact && (
                <p className="mt-2 text-xs leading-[1.55] text-slate-2">{phase.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vaccinations as dates, because a farmer works from a calendar */}
      {plan.vaccinations.length > 0 && (
        <div className="mt-6">
          <span className="label">Vaccinations · {plan.vaccinations.length}</span>
          <div className="mt-2 overflow-hidden rounded-card border border-border">
            {plan.vaccinations.map((dose, i) => (
              <div
                key={`${dose.day}-${dose.name}`}
                className="flex items-center gap-3 bg-surface p-3.5"
                style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-warning-soft text-warning-ink">
                  <Icon name="syringe" size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{dose.name}</div>
                  <div className="caption text-xs">
                    {fullDate(dose.due_on)} · day {dose.day} · {dose.route}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week by week — how feed is actually bought */}
      {!compact && (
        <div className="mt-6">
          <span className="label">Week by week</span>
          <div className="av-card mt-2 overflow-x-auto p-0">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-medium">Week</th>
                  <th className="p-3 text-left font-medium">From</th>
                  <th className="p-3 text-left font-medium">Feed</th>
                  <th className="p-3 text-right font-medium">Bags</th>
                </tr>
              </thead>
              <tbody>
                {plan.weeks.map((week) => (
                  <tr key={week.week} className="border-b border-border last:border-0">
                    <td className="num p-3">{week.week}</td>
                    <td className="caption p-3">{shortDate(week.starts_on)}</td>
                    <td className="p-3">{week.feed_name}</td>
                    <td className="num p-3 text-right font-medium">
                      {Number(week.bags).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {Number(plan.estimated_chick_cost) > 0 && (
        <div className="av-card mt-6">
          <div className="label mb-2">Money you will need</div>
          <Row label="Chicks" value={naira(Number(plan.estimated_chick_cost))} />
          <Row label="Feed" value={naira(Number(plan.estimated_feed_cost))} />
          <div className="av-hr my-2" />
          <Row label="Total" value={naira(Number(plan.estimated_total_cost))} strong />
          <div className="caption num mt-1">
            About {naira(Number(plan.estimated_cost_per_bird))} per bird, before medicine and
            anything else.
          </div>
        </div>
      )}

      {/* Never let a projection read as a promise */}
      <p className="caption mt-4 leading-[1.6]">{plan.caveat}</p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className={`text-sm ${strong ? "font-medium" : ""}`}>{label}</span>
      <span className="num text-sm font-medium">{value}</span>
    </div>
  );
}
