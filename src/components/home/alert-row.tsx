import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import type { Alert, AlertKind } from "@/lib/types";

const TONE: Record<AlertKind, { bar: string; icon: IconName }> = {
  error: { bar: "var(--error)", icon: "alert" },
  warn: { bar: "var(--warning)", icon: "info" },
  success: { bar: "var(--success)", icon: "check" },
  info: { bar: "var(--av-teal)", icon: "info" },
};

/** `compact` clamps the body to one line — used in the home feed preview. */
export function AlertRow({ alert, compact }: { alert: Alert; compact?: boolean }) {
  const tone = TONE[alert.kind] ?? TONE.warn;

  return (
    <Link
      href={`/alerts/${alert.id}`}
      className="mb-2 flex overflow-hidden rounded-card border border-border bg-surface transition-colors hover:bg-bg"
    >
      <div className="w-1 shrink-0" style={{ background: tone.bar }} />
      <div className={`min-w-0 flex-1 ${compact ? "px-3 py-2.5" : "p-3.5"}`}>
        <div className="mb-1 flex items-center gap-2">
          {alert.batch && <span className="caption text-[11px]">{alert.batch}</span>}
          <span className="caption num ml-auto text-[11px]">{alert.time}</span>
        </div>
        <div className={`text-sm font-medium ${compact ? "mb-0.5" : "mb-1"}`}>{alert.title}</div>
        <p
          className="overflow-hidden text-xs leading-[1.55] text-slate-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: compact ? 1 : 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {alert.body}
        </p>
      </div>
      <div className="self-center px-3 text-muted">
        <Icon name="chevron" size={16} />
      </div>
    </Link>
  );
}
