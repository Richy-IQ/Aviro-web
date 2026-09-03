import { TopBar } from "@/components/ui/top-bar";
import { naira } from "@/lib/format";
import { FEED_PRICES } from "@/lib/farm-data";

export const metadata = { title: "Feed prices · Aviro" };

export default function FeedPricesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Feed prices" backHref="/" subtitle="Per kg, updated daily" />
      <div className="px-4 pt-4">
        {FEED_PRICES.map((p) => {
          const up = p.trend > 0;
          return (
            <div key={p.market} className="av-card mb-2.5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[15px] font-medium">{p.market}</span>
                <span
                  className="num text-xs font-medium"
                  style={{ color: up ? "var(--error)" : "var(--success)" }}
                >
                  {up ? "▲" : "▼"} {Math.abs(p.trend).toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["starter", "grower", "finisher"] as const).map((k) => (
                  <div key={k} className="av-metric">
                    <div className="av-metric-l">{k}</div>
                    <div className="av-metric-v num">{naira(p[k])}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
