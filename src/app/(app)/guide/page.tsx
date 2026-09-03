import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { PHASES, phaseForDay } from "@/lib/guide";

export const metadata = {
  title: "Growing guide · Aviro",
  description:
    "A day-by-day guide to raising a healthy, profitable batch of broilers — written for first-time farmers.",
};

export default function GuidePage() {
  const current = phaseForDay(CURRENT_DAY);

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Growing guide" subtitle="What to do, and what to watch for" backHref="/more" />

      <div className="p-4">
        <p className="mb-5 text-[15px] leading-[1.6] text-slate-2">
          A full broiler cycle runs about six weeks. Each stage has a few things that matter far more
          than the rest — get those right and the numbers usually follow.
        </p>

        {PHASES.map((phase) => {
          const isCurrent = phase.id === current.id;
          return (
            <section key={phase.id} className="mb-4">
              <div
                className="rounded-card p-4"
                style={{
                  background: isCurrent ? "var(--av-teal-haze)" : "var(--surface)",
                  border: isCurrent ? "1.5px solid var(--av-teal)" : "1px solid var(--border)",
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="label">
                    Days {phase.dayFrom}–{phase.dayTo}
                  </span>
                  {isCurrent && <span className="av-pill teal">You are here</span>}
                </div>
                <h2 className="h2">{phase.name}</h2>
                <p className="mt-1 text-sm text-slate-2">{phase.headline}</p>

                <dl className="mt-3.5 grid gap-2 border-t border-border pt-3 sm:grid-cols-3">
                  <Spec label="Temperature" value={phase.temperature} />
                  <Spec label="Feed" value={phase.feed} />
                  <Spec label="Light" value={phase.light} />
                </dl>
              </div>

              <div className="mt-2.5 av-card">
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

              <div className="mt-2.5 av-card">
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

              <div className="mt-2.5 av-card">
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
            </section>
          );
        })}

        <p className="caption mt-6 leading-[1.6]">
          This guide covers general good practice for broilers. Where a sign points to disease, speak
          to a veterinarian — Aviro cannot diagnose your flock.
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
