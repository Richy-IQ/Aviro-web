import Link from "next/link";
import { redirect } from "next/navigation";

import { AlertRow } from "@/components/home/alert-row";
import { Greeting } from "@/components/home/greeting";
import { BatchCard } from "@/components/home/batch-card";
import { TodayCard } from "@/components/guide/today-card";
import { HeaderActions } from "@/components/shell/header-actions";
import { Empty } from "@/components/ui/empty";
import { Fab } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { toBatch } from "@/lib/api/adapters";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import { greetingFor } from "@/lib/current";

export default async function HomePage() {
  const farm = await getCurrentFarm();
  // A verified farmer with no farm yet has nothing to show; send them to set up.
  if (!farm) redirect("/setup");

  const [rows, alerts, user] = await Promise.all([
    api.batches(farm.id),
    api.alerts(farm.id),
    api.me(),
  ]);

  const batches = rows.map((row) => toBatch(row.batch, row.metrics));
  const active = batches.filter((b) => b.status !== undefined);
  const current = active[0];
  const firstName = user.first_name || "there";

  return (
    <div className="mx-auto w-full max-w-5xl pb-28 lg:pb-10">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 pt-2 pb-1 lg:hidden">
        <Logo size={26} />
        <HeaderActions />
      </div>

      <div className="px-4 pt-5 pb-2">
        <Greeting name={firstName} fallback={greetingFor()} />
        <h1 className="h1 mt-0.5 text-2xl">{farm.name}</h1>
      </div>

      {current && (
        <div className="px-4 pt-2 pb-1">
          <TodayCard day={current.day} type={current.type} />
        </div>
      )}

      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <span className="label">Your batches · {batches.length}</span>
        {batches.length > 0 && (
          <Link className="av-link" href="/batches">
            See all
          </Link>
        )}
      </div>

      {batches.length === 0 ? (
        <div className="px-4">
          <Empty
            icon="farm"
            title="No batches yet"
            body="A batch is one set of birds you raise together. Start one and Aviro tracks the cost, feed and profit for you."
          />
        </div>
      ) : (
        <div className="px-4 lg:grid lg:grid-cols-2 lg:gap-x-3 xl:grid-cols-3">
          {batches.map((b) => (
            <BatchCard key={b.id} batch={b} primary={b.id === current?.id} />
          ))}
        </div>
      )}

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
          alerts.slice(0, 3).map((a) => (
            <AlertRow
              key={a.id}
              alert={{
                id: a.id,
                kind: a.kind,
                title: a.title,
                body: a.body,
                cta: a.action,
                time: "",
                batch: a.batch_name,
              }}
              compact
            />
          ))
        )}
      </div>

      {current && <Fab href="/log" label="Log today" />}
    </div>
  );
}
