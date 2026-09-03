import { DailyLogFlow } from "@/components/log/daily-log-flow";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeBatch } from "@/lib/farm-data";

export const metadata = { title: "Log today · Aviro" };

export default function LogPage() {
  const batch = makeBatch(CURRENT_DAY);

  return (
    <div>
      <TopBar title={`Day ${batch.day} · log`} subtitle={batch.name} backHref={`/batches/${batch.id}`} />
      <DailyLogFlow batch={batch} />
    </div>
  );
}
