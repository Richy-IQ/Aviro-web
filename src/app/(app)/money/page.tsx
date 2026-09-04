import Link from "next/link";
import { redirect } from "next/navigation";

import { HeaderActions } from "@/components/shell/header-actions";
import { Icon, type IconName } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import { naira, nairaShort } from "@/lib/format";

export const metadata = { title: "Money · Aviro" };

const LINKS: { href: string; label: string; icon: IconName; sub: string }[] = [
  { href: "/reports", label: "Cycle report", icon: "doc", sub: "Where the money went, cycle by cycle" },
  { href: "/reports/statement", label: "Income statement", icon: "download", sub: "Print or save as PDF" },
  { href: "/feed-prices", label: "Feed prices", icon: "feed", sub: "Rates across six markets" },
  { href: "/markets", label: "Markets & buyers", icon: "trend", sub: "Live prices and buyers near you" },
  { href: "/benchmark", label: "Benchmark", icon: "trophy", sub: "How you compare with farms like yours" },
];

export default async function MoneyPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const rows = await api.batches(farm.id);
  const open = rows.filter((r) => r.batch.status === "active");
  const closed = rows.filter((r) => r.batch.status === "closed");

  const openProfit = open.reduce((sum, r) => sum + Number(r.metrics.projected_profit ?? 0), 0);
  const openCost = open.reduce((sum, r) => sum + Number(r.metrics.total_cost), 0);
  const leading = open[0];

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Money" subtitle="What your farm is earning" right={<HeaderActions />} />

      <div className="p-4">
        {open.length > 0 ? (
          <div className="rounded-card bg-teal p-4 text-white">
            <div className="label" style={{ color: "rgba(255,255,255,.72)" }}>
              Open cycles · projected
            </div>
            <div className="display num mt-1 text-[36px]">{nairaShort(openProfit)}</div>
            <div className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,.8)" }}>
              {leading?.metrics.sell_window_peaks && leading.metrics.optimal_sell_day
                ? `Best around day ${leading.metrics.optimal_sell_day}. `
                : ""}
              Spent so far {naira(openCost)}.
            </div>
          </div>
        ) : (
          <div className="av-card">
            <div className="label mb-1.5">Nothing running</div>
            <p className="caption text-sm">Start a batch and your numbers will appear here.</p>
          </div>
        )}

        {closed.length > 0 && (
          <div className="av-card mt-2.5">
            <div className="label mb-1.5">Closed cycles</div>
            <div className="num text-[22px] font-medium">{closed.length}</div>
            <div className="caption mt-1 text-xs">
              Open a cycle report to see what each one earned.
            </div>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-card border border-border">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="av-row"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
                <Icon name={l.icon} size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{l.label}</div>
                <div className="caption text-xs">{l.sub}</div>
              </div>
              <Icon name="chevron" size={16} style={{ color: "var(--muted)" }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
