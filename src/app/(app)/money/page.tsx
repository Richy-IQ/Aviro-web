import Link from "next/link";
import { HeaderActions } from "@/components/shell/header-actions";
import { Icon, type IconName } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm, PAST_CYCLE } from "@/lib/farm-data";
import { naira, nairaShort } from "@/lib/format";

export const metadata = { title: "Money · Aviro" };

const LINKS: { href: string; label: string; icon: IconName; sub: string }[] = [
  { href: "/reports", label: "Cycle report", icon: "doc", sub: "Where the money went, cycle by cycle" },
  { href: "/reports/statement", label: "Income statement", icon: "download", sub: "Print or save as PDF" },
  { href: "/feed-prices", label: "Feed prices", icon: "feed", sub: "Rates across six markets" },
  { href: "/markets", label: "Markets & buyers", icon: "trend", sub: "Live prices and buyers near you" },
  { href: "/benchmark", label: "Benchmark", icon: "trophy", sub: "How you compare with farms like yours" },
];

export default function MoneyPage() {
  const farm = makeFarm(CURRENT_DAY);
  const [current] = farm.batches;

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Money" subtitle="What your farm is earning" right={<HeaderActions />} />

      <div className="p-4">
        {/* The two numbers that answer "am I making money?" — closed, then open */}
        <div className="rounded-card bg-teal p-4 text-white">
          <div className="label" style={{ color: "rgba(255,255,255,.72)" }}>
            Last cycle · {PAST_CYCLE.name}
          </div>
          <div className="display num mt-1 text-[36px]">{nairaShort(PAST_CYCLE.grossProfit)}</div>
          <div className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,.8)" }}>
            {PAST_CYCLE.margin}% margin on {nairaShort(PAST_CYCLE.revenue)} revenue
          </div>
        </div>

        <div className="av-card mt-2.5">
          <div className="label mb-1.5">This cycle · {current.name}, projected</div>
          <div className="num text-[22px] font-medium">{nairaShort(current.projProfit)}</div>
          <div className="caption mt-1 text-xs">
            If you sell on day {current.optimalDay} at today&rsquo;s price. Cost so far{" "}
            <span className="num">{naira(current.totalCost)}</span>.
          </div>
        </div>

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
