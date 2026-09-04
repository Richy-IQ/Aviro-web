import { redirect } from "next/navigation";

import { Empty } from "@/components/ui/empty";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import { fmtN } from "@/lib/format";

export const metadata = { title: "Benchmark · Aviro" };

const LABELS: Record<string, { title: string; unit: string }> = {
  feed_conversion: { title: "Feed conversion (FCR)", unit: "" },
  mortality_pct: { title: "Mortality", unit: "%" },
  cost_per_bird: { title: "Cost per bird", unit: "₦" },
};

export default async function BenchmarkPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const rows = await api.batches(farm.id);
  const open = rows.find((r) => r.batch.status === "active");

  if (!open) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <TopBar title="Benchmark" backHref="/money" />
        <Empty icon="trophy" title="No open batch" body="Start a batch to compare your numbers." />
      </div>
    );
  }

  const benchmark = await api.benchmark(farm.id, open.batch.id);

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Benchmark" backHref="/money" subtitle={open.batch.name} />
      <div className="px-4 pt-4">
        {/* Say what the comparison is against. "Below average" only helps if
            you know whether that is your neighbours or a textbook. */}
        <p className="caption mb-4 text-[13px] leading-[1.55]">{benchmark.note}</p>

        {benchmark.rows.length === 0 ? (
          <Empty
            icon="trophy"
            title="Not enough to compare yet"
            body="Log a few more days and your numbers will appear here."
          />
        ) : (
          benchmark.rows.map((r) => {
            const value = Number(r.value);
            const lo = Math.min(r.p25, r.p75);
            const hi = Math.max(r.p25, r.p75);
            const pos = Math.max(0, Math.min(100, ((value - lo) / Math.max(1e-6, hi - lo)) * 100));
            const meta = LABELS[r.metric] ?? { title: r.metric, unit: "" };
            const fmt = (n: number) => (meta.unit === "₦" ? `₦ ${fmtN(n)}` : `${n}${meta.unit}`);

            return (
              <div key={r.metric} className="av-card mb-2.5">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <span className="text-[15px] font-medium">{meta.title}</span>
                  <span
                    className="num text-[15px] font-medium"
                    style={{ color: r.beats_median ? "var(--success)" : "var(--warning-ink)" }}
                  >
                    {fmt(value)}
                  </span>
                </div>

                <div className="relative h-1.5 rounded-full bg-border">
                  <div
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface"
                    style={{
                      left: `${pos}%`,
                      background: r.beats_median ? "var(--success)" : "var(--warning)",
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="caption num text-[11px]">{fmt(r.p25)} (top 25%)</span>
                  <span className="caption num text-[11px]">median {fmt(r.p50)}</span>
                  <span className="caption num text-[11px]">{fmt(r.p75)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
