import Link from "next/link";
import { AlertRow } from "@/components/home/alert-row";
import { Greeting } from "@/components/home/greeting";
import { BatchCard } from "@/components/home/batch-card";
import { TodayCard } from "@/components/guide/today-card";
import { Fab } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { HeaderActions } from "@/components/shell/header-actions";
import { Logo } from "@/components/ui/logo";
import { CURRENT_DAY, greetingFor } from "@/lib/current";
import { alertsForDay, makeFarm } from "@/lib/farm-data";

export default function HomePage() {
  const farm = makeFarm(CURRENT_DAY);
  const [current] = farm.batches;
  const alerts = alertsForDay(current);
  const greeting = greetingFor();

  return (
    <div className="mx-auto w-full max-w-5xl pb-28 lg:pb-10">
      {/* Compact header — the sidebar already carries the logo on desktop */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 pt-2 pb-1 lg:hidden">
        <Logo size={26} />
        <HeaderActions />
      </div>

      <div className="px-4 pt-5 pb-2">
        <Greeting name={farm.farmer.first} fallback={greeting} />
        <h1 className="h1 mt-0.5 text-2xl">{farm.farm.name}</h1>
      </div>

      <div className="px-4 pt-2 pb-1">
        <TodayCard day={current.day} type={current.type} />
      </div>

      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <span className="label">Your batches · {farm.batches.length}</span>
        <Link className="av-link" href="/batches">
          See all
        </Link>
      </div>

      <div className="px-4 lg:grid lg:grid-cols-2 lg:gap-x-3 xl:grid-cols-3">
        {farm.batches.map((b) => (
          <BatchCard key={b.id} batch={b} primary={b.id === current.id} />
        ))}
      </div>

      {/* Starting a batch sits with the batches, not buried at the foot of the page */}
      <div className="px-4 pt-1">
        <Link href="/batches/new" className="av-btn primary full">
          <Icon name="plus" size={18} stroke={2} /> Start a new batch
        </Link>
      </div>

      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <span className="label">Needs your attention</span>
        {alerts.length > 0 && (
          <Link className="av-link" href="/alerts">
            See all · {alerts.length}
          </Link>
        )}
      </div>

      <div className="px-4">
        {alerts.length === 0 ? (
          <div className="av-card flex items-center gap-3 p-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-soft-mint text-teal">
              <Icon name="check" size={20} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">All clear</div>
              <div className="caption text-xs">Nothing to action right now.</div>
            </div>
          </div>
        ) : (
          alerts.slice(0, 3).map((a) => <AlertRow key={a.id} alert={a} compact />)
        )}
      </div>

      <Fab href="/log" label="Log today" />
    </div>
  );
}
