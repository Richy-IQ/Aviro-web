import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { phaseForDay, todaysFocus } from "@/lib/guide";

const KIND_STYLE: Record<string, { icon: IconName; bg: string; ink: string }> = {
  vaccine: { icon: "syringe", bg: "var(--warning-soft)", ink: "var(--warning-ink)" },
  task: { icon: "check", bg: "var(--av-teal-tint)", ink: "var(--av-teal)" },
  check: { icon: "info", bg: "var(--bg)", ink: "var(--slate-2)" },
};

/**
 * Today's short list. Each row is a link with a chevron, so it reads as
 * something to act on rather than something to study.
 */
export function TodayCard({ day }: { day: number }) {
  const phase = phaseForDay(day);
  const focus = todaysFocus(day);

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5">
        <span className="label">
          Today · day {day} of 42
        </span>
        <Link className="av-link shrink-0 text-[13px]" href="/guide">
          Guide
        </Link>
      </div>

      {focus.map((f) => {
        const s = KIND_STYLE[f.kind];
        return (
          <Link
            key={f.title}
            href={f.href ?? "/guide"}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{ background: s.bg, color: s.ink }}
            >
              <Icon name={s.icon} size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{f.title}</span>
              <span className="caption block truncate text-xs">{f.detail}</span>
            </span>
            <Icon name="chevron" size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
          </Link>
        );
      })}

      <div
        className="flex flex-wrap gap-x-5 gap-y-1 bg-bg px-4 py-2.5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Spec label="Keep at" value={phase.temperature.split(",")[0]} />
        <Spec label="Feeding" value={phase.feed} />
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="caption text-[10px] tracking-[.08em] uppercase">{label} </span>
      <span className="text-xs text-slate-2">{value}</span>
    </div>
  );
}
