import { redirect } from "next/navigation";

import { AlertRow } from "@/components/home/alert-row";
import { Empty } from "@/components/ui/empty";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

export const metadata = { title: "Alerts · Aviro" };

export default async function AlertsPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const alerts = await api.alerts(farm.id);

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar
        title="What needs attention"
        backHref="/"
        subtitle={alerts.length ? `${alerts.length} open` : undefined}
      />
      <div className="px-4 pt-4">
        {alerts.length === 0 ? (
          <Empty icon="check" title="All clear" body="Nothing needs your attention right now." />
        ) : (
          alerts.map((a) => (
            <AlertRow
              key={a.id}
              alert={{
                id: a.id,
                kind: a.kind,
                title: a.title,
                body: a.body,
                cta: a.action,
                time: "",
                batch: a.batch_name,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
