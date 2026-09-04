import { redirect } from "next/navigation";

import { RecordSaleFlow } from "@/components/sale/record-sale-flow";
import { Empty } from "@/components/ui/empty";
import { TopBar } from "@/components/ui/top-bar";
import { toBatch } from "@/lib/api/adapters";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

export const metadata = { title: "Record a sale · Aviro" };

export default async function SalePage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const rows = await api.batches(farm.id);
  const open = rows.find((r) => r.batch.status === "active");

  if (!open) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <TopBar title="Recording a sale" backHref="/batches" />
        <Empty icon="naira" title="No open batch" body="There are no birds to sell yet." />
      </div>
    );
  }

  const batch = toBatch(open.batch, open.metrics);

  return (
    <div>
      <TopBar title="Recording a sale" subtitle={batch.name} backHref={`/batches/${batch.id}`} />
      <RecordSaleFlow batch={batch} />
    </div>
  );
}
