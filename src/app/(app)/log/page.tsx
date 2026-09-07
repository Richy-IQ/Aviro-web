import { redirect } from "next/navigation";

import { DailyLogFlow } from "@/components/log/daily-log-flow";
import { Empty } from "@/components/ui/empty";
import { TopBar } from "@/components/ui/top-bar";
import { toBatch } from "@/lib/api/adapters";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

export const metadata = { title: "Log today · Aviro" };

export default async function LogPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  // The batch in focus is the most recent active one — the same one the home
  // screen leads with, so the FAB always means what the farmer expects.
  const rows = await api.batches(farm.id);
  const open = rows.find((r) => r.batch.status === "active");

  if (!open) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <TopBar title="Log today" backHref="/batches" />
        <Empty
          icon="farm"
          title="No open batch"
          body="Start a batch first, then you can record against it."
          action={{ label: "Start a batch", href: "/batches/new" }}
        />
      </div>
    );
  }

  const batch = toBatch(open.batch, open.metrics);

  // What today should look like: the feed target for the birds still alive,
  // any dose due, and the point at which a day's deaths is worth asking about.
  // A farmer can still log without it, so a failure here must not take the
  // screen down with it.
  const guidance = await api.today(farm.id, batch.id).catch(() => null);

  return (
    <div>
      <TopBar
        title={`Day ${batch.day} · log`}
        subtitle={batch.name}
        backHref={`/batches/${batch.id}`}
      />
      <DailyLogFlow batch={batch} guidance={guidance} />
    </div>
  );
}
