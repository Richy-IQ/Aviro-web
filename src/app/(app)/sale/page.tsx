import { RecordSaleFlow } from "@/components/sale/record-sale-flow";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeBatch } from "@/lib/farm-data";

export const metadata = { title: "Record a sale · Aviro" };

export default function SalePage() {
  const batch = makeBatch(CURRENT_DAY);

  return (
    <div>
      <TopBar title="Recording a sale" subtitle={batch.name} backHref={`/batches/${batch.id}`} />
      <RecordSaleFlow batch={batch} />
    </div>
  );
}
