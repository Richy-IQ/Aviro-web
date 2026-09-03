import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { phaseForDay, todaysFocus } from "@/lib/guide";

const KIND_STYLE: Record<string, { icon: IconName; bg: string; ink: string }> = {
  vaccine: { icon: "syringe", bg: "var(--warning-soft)", ink: "var(--warning-ink)" },
  task: { icon: "check", bg: "var(--av-teal-tint)", ink: "var(--av-teal)" },
  check: { icon: "info", bg: "var(--bg)", ink: "var(--slate-2)" },
};

/**
 * The novice's anchor: on any given day, the two or three things that actually
 * matter. Server-rendered from the day in the cycle, so it costs nothing.
 */
export function TodayCard({ day }: { day: number }) {
  const phase = phaseForDay(day);
  const focus = todaysFocus(day);

  return (
    <div className="av-card">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <span className="label">Day {day} · {phase.name}</span>
          <div className="h3 mt-1">{phase.headline}</div>
        </div>
        <Link className="av-link shrink-0 text-[13px]" href="/guide">
          Full guide
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {focus.map((f) => {
          const s = KIND_STYLE[f.kind];
          return (
            <div key={f.title} className="flex gap-2.5">
              <div
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                style={{ background: s.bg, color: s.ink }}
              >
                <Icon name={s.icon} size={15} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">{f.title}</div>
                <p className="caption mt-0.5 text-xs leading-[1.55]">{f.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3">
        <Spec label="Temperature" value={phase.temperature} />
        <Spec label="Feed" value={phase.feed} />
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="caption text-[10px] tracking-[.08em] uppercase">{label}</div>
      <div className="text-xs text-slate-2">{value}</div>
    </div>
  );
}
