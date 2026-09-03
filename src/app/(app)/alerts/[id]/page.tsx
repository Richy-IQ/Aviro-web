import { notFound } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { alertsForDay, makeBatch } from "@/lib/farm-data";
import type { AlertKind } from "@/lib/types";

export function generateStaticParams() {
  return alertsForDay(makeBatch(CURRENT_DAY)).map((a) => ({ id: a.id }));
}

const TONE: Record<AlertKind, { bg: string; ink: string; icon: IconName }> = {
  error: { bg: "var(--error-soft)", ink: "var(--error)", icon: "alert" },
  warn: { bg: "var(--warning-soft)", ink: "var(--warning-ink)", icon: "info" },
  success: { bg: "var(--soft-mint)", ink: "var(--av-teal)", icon: "check" },
  info: { bg: "var(--av-teal-tint)", ink: "var(--av-teal)", icon: "info" },
};

export default async function AlertDetailPage({ params }: PageProps<"/alerts/[id]">) {
  const { id } = await params;
  const alert = alertsForDay(makeBatch(CURRENT_DAY)).find((a) => a.id === id);
  if (!alert) notFound();

  const tone = TONE[alert.kind];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <TopBar title="Alert" backHref="/alerts" />
      <div className="p-4">
        <div className="rounded-card p-4" style={{ background: tone.bg }}>
          <div className="mb-3 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-surface" style={{ color: tone.ink }}>
              <Icon name={tone.icon} size={18} />
            </div>
            <div className="caption text-xs">
              {alert.batch ? `${alert.batch} · ` : ""}
              {alert.time}
            </div>
          </div>
          <h2 className="h2" style={{ color: tone.ink }}>
            {alert.title}
          </h2>
        </div>

        <p className="mt-4 text-[15px] leading-[1.6] text-slate-2">{alert.body}</p>

        <button className="av-btn primary full mt-6">{alert.cta}</button>
      </div>
    </div>
  );
}
