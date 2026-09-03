import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { alertsForDay, makeBatch, makeFarm } from "@/lib/farm-data";

export const metadata = { title: "More · Aviro" };

const LINKS: { href: string; label: string; icon: IconName; sub: string }[] = [
  { href: "/alerts", label: "Alerts", icon: "bell", sub: "What needs your attention" },
  { href: "/vaccinations", label: "Vaccinations", icon: "syringe", sub: "Schedule for the current batch" },
  { href: "/feed-prices", label: "Feed prices", icon: "trend", sub: "Market rates near you" },
  { href: "/benchmark", label: "Benchmark", icon: "trophy", sub: "How you compare" },
  { href: "/profile", label: "Profile & farm", icon: "user", sub: "Your details" },
];

export default function MorePage() {
  const farm = makeFarm(CURRENT_DAY);
  const alertCount = alertsForDay(makeBatch(CURRENT_DAY)).length;

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="More" />
      <div className="p-4">
        <div className="av-card mb-4 flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal text-base font-medium text-white">
            {farm.farmer.first[0]}
            {farm.farmer.last[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium">
              {farm.farmer.first} {farm.farmer.last}
            </div>
            <div className="caption truncate text-xs">
              {farm.farm.name} · {farm.farm.location}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-card border border-border">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="av-row">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
                <Icon name={l.icon} size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{l.label}</div>
                <div className="caption text-xs">{l.sub}</div>
              </div>
              {l.href === "/alerts" && alertCount > 0 && (
                <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] font-medium text-white">
                  {alertCount}
                </span>
              )}
              <Icon name="chevron" size={16} style={{ color: "var(--muted)" }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
