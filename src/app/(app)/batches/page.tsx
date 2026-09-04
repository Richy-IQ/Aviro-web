import { redirect } from "next/navigation";

import { BatchCard } from "@/components/home/batch-card";
import { HeaderActions } from "@/components/shell/header-actions";
import { Empty } from "@/components/ui/empty";
import { Fab } from "@/components/ui/fab";
import { TopBar } from "@/components/ui/top-bar";
import { toBatch } from "@/lib/api/adapters";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

export const metadata = { title: "Batches · Aviro" };

export default async function BatchesPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const rows = await api.batches(farm.id);
  const batches = rows.map((row) => toBatch(row.batch, row.metrics));
  const totalBirds = batches.reduce((sum, b) => sum + b.alive, 0);

  return (
    <div className="mx-auto w-full max-w-5xl pb-28 lg:pb-10">
      <TopBar
        title="Batches"
        subtitle={
          batches.length
            ? `${batches.length} active · ${totalBirds.toLocaleString("en-NG")} birds`
            : undefined
        }
        right={<HeaderActions />}
      />

      {batches.length === 0 ? (
        <Empty
          icon="farm"
          title="No batches yet"
          body="A batch is one set of birds you raise together. Start one and Aviro tracks the cost, feed and profit for you."
        />
      ) : (
        <div className="px-4 pt-4 lg:grid lg:grid-cols-2 lg:gap-x-3 xl:grid-cols-3">
          {batches.map((b, i) => (
            <BatchCard key={b.id} batch={b} primary={i === 0} />
          ))}
        </div>
      )}

      <Fab href="/batches/new" label="New batch" />
    </div>
  );
}
