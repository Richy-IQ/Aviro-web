import Link from "next/link";

import { NetworkFarmRow } from "@/components/network/farm-row";
import { Empty } from "@/components/ui/empty";
import { TopBar } from "@/components/ui/top-bar";
import { api } from "@/lib/api/resources";
import { naira, shortDate } from "@/lib/format";

export const metadata = { title: "Member farms · Aviro" };

const PERIODS = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
] as const;

export default async function NetworkPage({ searchParams }: PageProps<"/network">) {
  const organisations = await api.organisations().catch(() => []);
  if (organisations.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <TopBar title="Member farms" backHref="/" />
        <Empty
          icon="farm"
          title="You do not run a cooperative"
          body="This screen is for cooperatives and out-grower schemes overseeing member farms."
          action={{ label: "Back to your farm", href: "/" }}
        />
      </div>
    );
  }

  const params = await searchParams;
  const wanted = typeof params.org === "string" ? params.org : null;
  const org = organisations.find((o) => o.id === wanted) ?? organisations[0];
  const period = params.period === "month" ? "month" : "week";

  const [overview, invoices] = await Promise.all([
    api.networkOverview(org.id, period).catch(() => null),
    api.invoices(org.id).catch(() => []),
  ]);
  const settled = overview?.rows.filter((r) => r.attention.length === 0) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl pb-24">
      <TopBar title={org.name} subtitle={`${org.kind} · ${org.farm_count} farms`} backHref="/" />

      {organisations.length > 1 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {organisations.map((o) => (
            <Link
              key={o.id}
              href={`/network?org=${o.id}&period=${period}`}
              className="av-chip"
              aria-pressed={o.id === org.id}
            >
              {o.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-2 px-4 pt-3 pb-1">
        {PERIODS.map((p) => (
          <Link
            key={p.key}
            href={`/network?org=${org.id}&period=${p.key}`}
            className="av-chip"
            aria-pressed={period === p.key}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {!overview ? (
        <Empty
          icon="info"
          title="Could not load the farms"
          body="Try again in a moment."
        />
      ) : (
        <div className="px-4 pt-3">
          <div className="av-card mb-3 bg-teal-haze">
            <div className="label mb-1.5">{overview.label}</div>
            <p className="text-[15px] leading-[1.5] font-medium">{overview.headline}</p>
          </div>

          <div className="mb-4 flex gap-2.5">
            <Stat
              label="Farms reporting"
              value={`${overview.farms_logging} of ${overview.farms_with_birds}`}
              sub={`${overview.logging_rate_pct}%`}
              bad={Number(overview.logging_rate_pct) < 50}
            />
            <Stat label="Birds on the ground" value={overview.birds_alive.toLocaleString("en-NG")} />
          </div>

          <div className="mb-5 flex gap-2.5">
            <Stat
              label="Birds lost"
              value={overview.deaths.toLocaleString("en-NG")}
              sub={
                overview.deaths_before > 0
                  ? `${overview.deaths > overview.deaths_before ? "Up from" : "Down from"} ${overview.deaths_before}`
                  : undefined
              }
              bad={overview.deaths > overview.deaths_before}
            />
            <Stat
              label="Feed used"
              value={
                Number(overview.feed_bags) >= 1
                  ? `${overview.feed_bags} bags`
                  : `${overview.feed_kg} kg`
              }
            />
          </div>

          {/* Rows arrive worst first, so the farms needing a call are simply the
              top of the same list. Showing them twice would make an officer
              read every troubled farm two ways before reaching the quiet ones. */}
          {overview.needs_attention.length > 0 && (
            <>
              <div className="label mb-2">
                Call these first · {overview.needs_attention.length}
              </div>
              {overview.needs_attention.map((row) => (
                <NetworkFarmRow key={row.id} row={row} />
              ))}
            </>
          )}

          {invoices.length > 0 && (
            <>
              <div className="label mt-5 mb-2">Invoices</div>
              {invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/network/invoices/${inv.id}?org=${org.id}`}
                  className="av-card mb-2.5 flex items-center gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-medium">{inv.number}</div>
                    <div className="caption mt-0.5 text-xs">
                      {inv.farms_count} farms · {inv.status_label}
                      {inv.status === "sent" && inv.due_on ? ` · due ${shortDate(inv.due_on)}` : ""}
                    </div>
                  </div>
                  <div className="num text-[15px] font-medium">
                    {naira(Number(inv.amount))}
                  </div>
                </Link>
              ))}
            </>
          )}

          {settled.length > 0 && (
            <>
              <div className="label mt-5 mb-2">
                {overview.needs_attention.length > 0 ? "Nothing to do here" : "Member farms"} ·{" "}
                {settled.length}
              </div>
              {settled.map((row) => (
                <NetworkFarmRow key={row.id} row={row} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({
  label, value, sub, bad,
}: { label: string; value: string; sub?: string; bad?: boolean }) {
  return (
    <div className="av-card flex-1">
      <div className="caption mb-1 text-[10px] tracking-[.08em] uppercase">{label}</div>
      <div className="num text-xl font-medium" style={{ color: bad ? "var(--error)" : undefined }}>
        {value}
      </div>
      {sub && <div className="caption mt-0.5 text-xs">{sub}</div>}
    </div>
  );
}
