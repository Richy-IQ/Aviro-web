import { redirect } from "next/navigation";

import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TopBar } from "@/components/ui/top-bar";
import { Empty } from "@/components/ui/empty";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

export const metadata = { title: "Vaccinations · Aviro" };

export default async function VaccinationsPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const rows = await api.batches(farm.id);
  const open = rows.find((r) => r.batch.status === "active");

  if (!open) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <TopBar title="Vaccinations" backHref="/" />
        <Empty icon="syringe" title="No open batch" body="Start a batch to see its schedule." />
      </div>
    );
  }

  // Scoped to this batch's bird type, so a layer keeper never sees broiler dates.
  const schedule = await api.vaccinations(open.batch.bird_type);
  const day = open.metrics.day_in_cycle;

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar
        title="Vaccinations"
        backHref="/"
        subtitle={`${open.batch.name} · day ${day} of ${open.metrics.cycle_days}`}
      />
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-card border border-border">
          {schedule.map((v) => {
            const done = v.day < day;
            const today = v.day === day;
            return (
              <div key={v.id} className="av-row" style={{ cursor: "default" }}>
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
                  style={{
                    background: done
                      ? "var(--soft-mint)"
                      : today
                        ? "var(--warning-soft)"
                        : "var(--bg)",
                    color: done
                      ? "var(--av-teal)"
                      : today
                        ? "var(--warning-ink)"
                        : "var(--muted)",
                  }}
                >
                  <Icon name={done ? "check" : "syringe"} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="caption text-xs">
                    Day {v.day} · {v.route}
                    {v.notes ? ` · ${v.notes}` : ""}
                  </div>
                </div>
                {today && <Pill tone="warn">Due today</Pill>}
                {done && <Pill tone="success">Done</Pill>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
