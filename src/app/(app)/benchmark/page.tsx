import { LocationPrompt } from "@/components/settings/location-prompt";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { benchmark, makeBatch } from "@/lib/farm-data";
import { fmtN } from "@/lib/format";

export const metadata = { title: "Benchmark · Aviro" };

export default function BenchmarkPage() {
  const rows = benchmark(makeBatch(CURRENT_DAY));

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Benchmark" backHref="/" subtitle="Your numbers against farms like yours" />
      <div className="px-4 pt-4">
        <LocationPrompt purpose="So we compare you with farms in your area" />
        {rows.map((r) => {
          // Place the farm's value on the p25–p75 band; better is always left.
          const lo = Math.min(r.p25, r.p75);
          const hi = Math.max(r.p25, r.p75);
          const pos = Math.max(0, Math.min(100, ((r.value - lo) / Math.max(1e-6, hi - lo)) * 100));
          const beatsMedian = r.lowerIsBetter ? r.value < r.p50 : r.value > r.p50;
          const fmt = (n: number) => (r.unit === "₦" ? `₦ ${fmtN(n)}` : `${n}${r.unit}`);

          return (
            <div key={r.metric} className="av-card mb-2.5">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-medium">{r.metric}</span>
                <span
                  className="num text-[15px] font-medium"
                  style={{ color: beatsMedian ? "var(--success)" : "var(--warning-ink)" }}
                >
                  {fmt(r.value)}
                </span>
              </div>

              <div className="relative h-1.5 rounded-full bg-border">
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface"
                  style={{ left: `${pos}%`, background: beatsMedian ? "var(--success)" : "var(--warning)" }}
                />
              </div>

              <div className="mt-2 flex justify-between">
                <span className="caption num text-[11px]">{fmt(r.p25)} (top 25%)</span>
                <span className="caption num text-[11px]">median {fmt(r.p50)}</span>
                <span className="caption num text-[11px]">{fmt(r.p75)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
