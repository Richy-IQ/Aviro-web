import Link from "next/link";
import { BatchCard } from "@/components/home/batch-card";
import { Empty } from "@/components/ui/empty";
import { Fab } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm } from "@/lib/farm-data";

export const metadata = { title: "Batches · Aviro" };

export default function BatchesPage() {
  const farm = makeFarm(CURRENT_DAY);
  const [current] = farm.batches;
  const totalBirds = farm.batches.reduce((sum, b) => sum + b.alive, 0);

  return (
    <div className="mx-auto w-full max-w-5xl pb-28 lg:pb-10">
      <TopBar
        title="Batches"
        subtitle={`${farm.batches.length} active · ${totalBirds.toLocaleString("en-NG")} birds`}
        right={
          <Link href="/batches/new" className="av-btn secondary sm">
            <Icon name="plus" size={16} stroke={2} /> New batch
          </Link>
        }
      />

      {farm.batches.length === 0 ? (
        <Empty
          icon="farm"
          title="No batches yet"
          body="A batch is one set of birds you raise together. Start one and Aviro tracks the cost, feed and profit for you."
        />
      ) : (
        <div className="px-4 pt-4 lg:grid lg:grid-cols-2 lg:gap-x-3 xl:grid-cols-3">
          {farm.batches.map((b) => (
            <BatchCard key={b.id} batch={b} primary={b.id === current.id} />
          ))}
        </div>
      )}

      <Fab href="/batches/new" label="New batch" />
    </div>
  );
}
