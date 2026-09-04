import Link from "next/link";
import { redirect } from "next/navigation";

import { ExportButton } from "@/components/reports/export-sheet";
import { Empty } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import { naira, nairaShort } from "@/lib/format";

export const metadata = { title: "Cycle report · Aviro" };

export default async function ReportsPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const { cycles, totals } = await api.reports(farm.id, "all");

  if (cycles.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <TopBar title="Cycle report" backHref="/money" />
        <Empty
          icon="doc"
          title="No cycles yet"
          body="Once you have run a batch, this is where you see what it earned."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar
        title="Cycle report"
        subtitle={`${cycles.length} ${cycles.length === 1 ? "cycle" : "cycles"}`}
        backHref="/money"
        right={<ExportButton />}
      />

      <div className="p-4">
        <div className="rounded-card bg-teal p-4 text-white">
          <div className="label" style={{ color: "rgba(255,255,255,.72)" }}>
            Across all cycles
          </div>
          <div className="display num mt-1 text-[36px]">{nairaShort(Number(totals.gross_profit))}</div>
          <div className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,.8)" }}>
            {totals.margin}% margin on {nairaShort(Number(totals.revenue))} revenue
          </div>
        </div>

        {cycles.map((c) => {
          const maxLine = Math.max(...c.costs.map((l) => Number(l.amount)), 1);
          return (
            <section key={c.batch_id} className="mt-6">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h2 className="h3">
                  {c.name} · {c.breed}
                </h2>
                {c.is_closed ? (
                  <span className="caption num text-xs">{c.days} days</span>
                ) : (
                  <Pill tone="warn">Still running · projected</Pill>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Figure label={c.is_closed ? "Birds sold" : "Birds alive"} value={c.sold ? c.sold.toLocaleString("en-NG") : "—"} />
                <Figure label="Avg weight" value={c.average_weight_kg ? `${c.average_weight_kg}kg` : "—"} />
                <Figure label="FCR" value={c.feed_conversion ?? "—"} />
                <Figure label="Mortality" value={`${c.mortality_pct}%`} />
              </div>

              <div className="av-card mt-2.5">
                <div className="label mb-2.5">Where the money went</div>
                {c.costs.map((line) => (
                  <div key={line.category} className="mb-3 last:mb-0">
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="text-sm">{line.category}</span>
                      <span className="num text-sm font-medium">
                        {naira(Number(line.amount))}
                        <span className="caption ml-2 text-xs">{line.pct_of_revenue}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                      <div
                        className="h-full rounded-full bg-teal"
                        style={{ width: `${(Number(line.amount) / maxLine) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="av-hr my-3" />
                <Row label="Revenue" value={naira(Number(c.revenue))} />
                <Row label="Cost of production" value={naira(Number(c.total_cost))} />
                <Row
                  label="Gross profit"
                  value={naira(Number(c.gross_profit))}
                  accent={Number(c.gross_profit) >= 0 ? "var(--success)" : "var(--error)"}
                  strong
                />
                <div className="caption num mt-1">
                  {naira(Number(c.cost_per_bird))} per bird
                  {c.cost_per_kg ? ` · ${naira(Number(c.cost_per_kg))} per kg` : ""}
                </div>
              </div>

              {c.insights.length > 0 && (
                <div className="av-card mt-2.5">
                  <div className="label mb-2.5">What this tells you</div>
                  {c.insights.map((note, i) => (
                    <p key={note} className={`text-sm leading-[1.6] text-slate-2 ${i ? "mt-3" : ""}`}>
                      {note}
                    </p>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <Link href="/reports/statement" className="av-btn tertiary full mt-6">
          <Icon name="download" size={16} /> Income statement
        </Link>
      </div>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="av-metric">
      <div className="av-metric-l">{label}</div>
      <div className="av-metric-v num">{value}</div>
    </div>
  );
}

function Row({
  label, value, accent, strong,
}: { label: string; value: string; accent?: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className={`text-sm ${strong ? "font-medium" : ""}`}>{label}</span>
      <span className="num text-sm font-medium" style={accent ? { color: accent } : undefined}>
        {value}
      </span>
    </div>
  );
}
