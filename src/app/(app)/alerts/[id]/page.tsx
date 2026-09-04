import { notFound, redirect } from "next/navigation";

import { Icon, type IconName } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import type { ApiAlert } from "@/lib/api/types";

const TONE: Record<ApiAlert["kind"], { bg: string; ink: string; icon: IconName }> = {
  error: { bg: "var(--error-soft)", ink: "var(--error)", icon: "alert" },
  warn: { bg: "var(--warning-soft)", ink: "var(--warning-ink)", icon: "info" },
  success: { bg: "var(--soft-mint)", ink: "var(--av-teal)", icon: "check" },
  info: { bg: "var(--av-teal-tint)", ink: "var(--av-teal)", icon: "info" },
};

export default async function AlertDetailPage({ params }: PageProps<"/alerts/[id]">) {
  const { id } = await params;
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  // Alerts are derived rather than stored, so there is no detail endpoint to
  // fetch — the list already carries everything, including the full body.
  const alert = (await api.alerts(farm.id)).find((a) => a.id === id);
  if (!alert) notFound();

  const tone = TONE[alert.kind];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <TopBar title="Alert" backHref="/alerts" />
      <div className="p-4">
        <div className="rounded-card p-4" style={{ background: tone.bg }}>
          <div className="mb-3 flex items-center gap-2.5">
            <div
              className="grid h-9 w-9 place-items-center rounded-[10px] bg-surface"
              style={{ color: tone.ink }}
            >
              <Icon name={tone.icon} size={18} />
            </div>
            {alert.batch_name && <div className="caption text-xs">{alert.batch_name}</div>}
          </div>
          <h2 className="h2" style={{ color: tone.ink }}>
            {alert.title}
          </h2>
        </div>

        <p className="mt-4 text-[15px] leading-[1.6] text-slate-2">{alert.body}</p>

        <div className="mt-6 rounded-card bg-teal-haze p-3.5">
          <div className="label mb-1" style={{ color: "var(--av-teal)" }}>
            What to do
          </div>
          <p className="text-sm text-slate-ink">{alert.action}</p>
        </div>
      </div>
    </div>
  );
}
