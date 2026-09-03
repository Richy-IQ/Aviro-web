import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TopBar } from "@/components/ui/top-bar";
import { naira } from "@/lib/format";

export const metadata = { title: "Markets · Aviro" };

const BUYERS = [
  { name: "Yusuf Cold Storage", loc: "Ibadan · 9km", rate: 3250, verified: true },
  { name: "Daily Need Catering", loc: "Ibadan · 12km", rate: 3180, verified: true },
  { name: "Mama Joy Foods", loc: "Ojoo · 6km", rate: 3100, verified: false },
];

const initials = (n: string) =>
  n.split(" ").slice(0, 2).map((x) => x[0]).join("");

export default function MarketsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Markets" subtitle="Live prices across Nigeria" backHref="/more" />
      <div className="p-4">
        <div className="av-card mb-3 bg-orange-tint" style={{ borderColor: "transparent" }}>
          <span className="label" style={{ color: "var(--av-orange-dark)" }}>
            Heads up
          </span>
          <div className="h3 mt-1" style={{ color: "var(--av-orange-dark)" }}>
            Feed up 4.2% this week in Ibadan
          </div>
          <p className="mt-1 text-[13px] leading-[1.5]" style={{ color: "var(--av-orange-dark)" }}>
            Cargill grower mash is now ₦750/kg at Bodija. Three other mills are still ₦720.
          </p>
        </div>

        <div className="mb-3 overflow-hidden rounded-card border border-border">
          <Link href="/feed-prices" className="av-row">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
              <Icon name="feed" size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">Feed prices</div>
              <div className="caption text-xs">6 markets · cheapest ₦685/kg in Kano</div>
            </div>
            <Icon name="chevron" size={16} style={{ color: "var(--muted)" }} />
          </Link>
          <div className="av-row" style={{ borderTop: "1px solid var(--border)", cursor: "default" }}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-soft-mint text-teal">
              <Icon name="naira" size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">Live broiler · ₦/kg</div>
              <div className="caption text-xs">Lagos 3,200 · Abuja 3,150 · Kano 2,950</div>
            </div>
            <Pill tone="success">+1.4%</Pill>
          </div>
        </div>

        <span className="label">Buyers near you</span>
        <div className="mt-2 overflow-hidden rounded-card border border-border">
          {BUYERS.map((b, i) => (
            <div
              key={b.name}
              className="av-row"
              style={{ borderTop: i ? "1px solid var(--border)" : "none", cursor: "default" }}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-xs font-medium text-white">
                {initials(b.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium">{b.name}</span>
                  {b.verified && <Icon name="check" size={12} style={{ color: "var(--av-teal)" }} />}
                </div>
                <div className="caption mt-0.5 text-[11px]">{b.loc}</div>
              </div>
              <span className="num text-sm font-medium">{naira(b.rate)}/kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
