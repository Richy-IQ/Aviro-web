import { AlertRow } from "@/components/home/alert-row";
import { Empty } from "@/components/ui/empty";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { alertsForDay, makeBatch } from "@/lib/farm-data";

export const metadata = { title: "Alerts · Aviro" };

export default function AlertsPage() {
  const alerts = alertsForDay(makeBatch(CURRENT_DAY));

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="What needs attention" backHref="/" subtitle={`${alerts.length} open`} />
      <div className="px-4 pt-4">
        {alerts.length === 0 ? (
          <Empty icon="check" title="All clear" body="Nothing needs your attention right now." />
        ) : (
          alerts.map((a) => <AlertRow key={a.id} alert={a} />)
        )}
      </div>
    </div>
  );
}
