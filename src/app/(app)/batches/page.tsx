import { BatchCard } from "@/components/home/batch-card";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm } from "@/lib/farm-data";

export const metadata = { title: "Batches · Aviro" };

export default function BatchesPage() {
  const farm = makeFarm(CURRENT_DAY);
  const [current] = farm.batches;
  const totalBirds = farm.batches.reduce((sum, b) => sum + b.alive, 0);

  return (
    <div className="mx-auto w-full max-w-5xl pb-7">
      <TopBar title="Batches" subtitle={`${farm.batches.length} active · ${totalBirds.toLocaleString("en-NG")} birds`} />
      <div className="px-4 pt-4 lg:grid lg:grid-cols-2 lg:gap-x-3 xl:grid-cols-3">
        {farm.batches.map((b) => (
          <BatchCard key={b.id} batch={b} primary={b.id === current.id} />
        ))}
      </div>
    </div>
  );
}
