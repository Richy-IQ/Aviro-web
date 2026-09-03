import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm } from "@/lib/farm-data";
import { GUIDES, GUIDE_TYPES, guideFor, phaseForDay } from "@/lib/guide";
import type { BirdType } from "@/lib/types";

export const metadata = {
  title: "Growing guide · Aviro",
  description:
    "Day-by-day guidance for broilers, layers, cockerels and noilers — written for first-time farmers.",
};

export default async function GuidePage({ searchParams }: PageProps<"/guide">) {
  const params = await searchParams;
  const farm = makeFarm(CURRENT_DAY);
  const [batch] = farm.batches;

  const raw = typeof params.bird === "string" ? params.bird : batch.type;
  const type = (GUIDE_TYPES.includes(raw as never) ? raw : "broiler") as Exclude<BirdType, "mixed">;
  const guide = GUIDES[type];

  // Only mark "you are here" when the guide shown matches the batch in hand.
  const showsCurrentBatch = type === guideFor(batch.type).type;
  const currentPhase = showsCurrentBatch ? phaseForDay(batch.day, batch.type) : null;

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Growing guide" subtitle="What to do, and what to watch for" backHref="/more" />

      <div className="p-4">
        {/* Bird type is the first choice, because the job is different for each */}
        <div className="mb-4 flex flex-wrap gap-2">
          {GUIDE_TYPES.map((t) => (
            <Link
              key={t}
              href={`/guide?bird=${t}`}
              scroll={false}
              aria-current={t === type ? "page" : undefined}
              className="av-chip"
              aria-pressed={t === type}
            >
              {GUIDES[t].label}
            </Link>
          ))}
        </div>

        <div className="av-card mb-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="h2">{guide.label}</h2>
            <span className="caption num text-xs">
              {guide.cycleDays} days {guide.cycleGoal}
            </span>
          </div>
          <p className="mt-2 text-[15px] leading-[1.6] text-slate-2">{guide.summary}</p>
          <div className="mt-3 rounded-metric bg-teal-haze p-3">
            <div className="label mb-1" style={{ color: "var(--av-teal)" }}>
              The number that decides it
            </div>
            <p className="text-sm text-slate-ink">{guide.keyMetric}</p>
          </div>
        </div>

        {guide.phases.map((phase) => {
          const isCurrent = currentPhase?.id === phase.id;
          return (
            <section key={phase.id} className="mb-4">
              <div
                className="rounded-card p-4"
                style={{
                  background: isCurrent ? "var(--av-teal-haze)" : "var(--surface)",
                  border: isCurrent ? "1.5px solid var(--av-teal)" : "1px solid var(--border)",
                }}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="label">
                    Days {phase.dayFrom}–{phase.dayTo}
                  </span>
                  {isCurrent && <span className="av-pill teal">You are here</span>}
                </div>
                <h3 className="h2">{phase.name}</h3>
                <p className="mt-1 text-sm text-slate-2">{phase.headline}</p>

                <dl className="mt-3.5 grid gap-2 border-t border-border pt-3 sm:grid-cols-3">
                  <Spec label="Temperature" value={phase.temperature} />
                  <Spec label="Feed" value={phase.feed} />
                  <Spec label="Light" value={phase.light} />
                </dl>
              </div>

              <div className="av-card mt-2.5">
                <div className="label mb-2.5">What to do</div>
                {phase.tasks.map((t, i) => (
                  <div key={t.title} className={i ? "mt-3 border-t border-border pt-3" : ""}>
                    <div className="flex gap-2.5">
                      <Icon
                        name="check"
                        size={16}
                        style={{ color: "var(--av-teal)", flexShrink: 0, marginTop: 2 }}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{t.title}</div>
                        <p className="caption mt-1 text-xs leading-[1.6]">{t.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="av-card mt-2.5">
                <div className="label mb-2.5">What normal looks like</div>
                <ul className="flex flex-col gap-1.5">
                  {phase.normal.map((n) => (
                    <li key={n} className="flex gap-2 text-sm text-slate-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>

              {phase.warnings.length > 0 && (
                <div className="av-card mt-2.5">
                  <div className="label mb-2.5">Warning signs</div>
                  {phase.warnings.map((w, i) => (
                    <div key={w.sign} className={i ? "mt-3 border-t border-border pt-3" : ""}>
                      <div className="flex gap-2.5">
                        <Icon
                          name="alert"
                          size={16}
                          style={{ color: "var(--warning)", flexShrink: 0, marginTop: 2 }}
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{w.sign}</div>
                          <p className="caption mt-1 text-xs leading-[1.6]">{w.meaning}</p>
                          <p className="mt-1.5 text-xs font-medium text-teal">{w.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <p className="caption mt-6 leading-[1.6]">
          General good practice for {guide.label.toLowerCase()} in Nigerian conditions. Where a sign
          points to disease, speak to a veterinarian — Aviro cannot diagnose your flock.
        </p>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="caption text-[10px] tracking-[.08em] uppercase">{label}</dt>
      <dd className="mt-0.5 text-xs text-slate-2">{value}</dd>
    </div>
  );
}
