import { redirect } from "next/navigation";

import { PrintButton } from "@/components/reports/print-button";
import { Empty } from "@/components/ui/empty";
import { Logo } from "@/components/ui/logo";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import { fmtN, naira } from "@/lib/format";
import { PERIODS, type Period } from "@/lib/statement";

export const metadata = { title: "Income statement · Aviro" };

export default async function StatementPage({ searchParams }: PageProps<"/reports/statement">) {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const params = await searchParams;
  const raw = typeof params.period === "string" ? params.period : "12-mo";
  const period = (PERIODS.some((p) => p.v === raw) ? raw : "12-mo") as Period;

  const [{ cycles, totals }, user] = await Promise.all([
    api.reports(farm.id, period),
    api.me(),
  ]);

  if (cycles.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Empty
          icon="doc"
          title="Nothing to state yet"
          body="Run a batch and your income statement will be here."
        />
      </div>
    );
  }

  const prepared = new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date());

  return (
    <div className="print-sheet mx-auto w-full max-w-3xl p-4 pb-10">
      <div className="no-print mb-4 flex items-center justify-between gap-3">
        <a href="/reports" className="av-link text-sm">
          ← Back to reports
        </a>
        <PrintButton />
      </div>

      <header className="print-avoid-break mb-6 flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <Logo size={24} />
          <h1 className="h2 mt-3">Income statement</h1>
          <p className="caption mt-1">
            {PERIODS.find((p) => p.v === period)?.label} · prepared {prepared}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-medium">{farm.name}</div>
          {farm.location && <div className="caption text-xs">{farm.location}</div>}
          {user.display_name && <div className="caption text-xs">{user.display_name}</div>}
        </div>
      </header>

      <section className="print-avoid-break mb-7">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Figure label="Revenue" value={naira(Number(totals.revenue))} />
          <Figure label="Cost of production" value={naira(Number(totals.total_cost))} />
          <Figure label="Gross profit" value={naira(Number(totals.gross_profit))} strong />
          <Figure label="Margin" value={`${Number(totals.margin).toFixed(1)}%`} />
        </div>
      </section>

      {cycles.map((c) => (
        <section key={c.batch_id} className="print-avoid-break mb-7">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 className="h3">
              {c.name} · {c.breed}
            </h2>
            {!c.is_closed && <span className="av-pill warn">Open cycle · projected</span>}
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium">Line</th>
                <th className="py-2 text-right font-medium">Amount</th>
                <th className="py-2 text-right font-medium">% of revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2">Revenue</td>
                <td className="num py-2 text-right">{naira(Number(c.revenue))}</td>
                <td className="num py-2 text-right text-muted">100.0%</td>
              </tr>
              {c.costs.map((line) => (
                <tr key={line.category} className="border-b border-border">
                  <td className="py-2 pl-4 text-slate-2">{line.category}</td>
                  <td className="num py-2 text-right text-slate-2">
                    ({fmtN(Number(line.amount))})
                  </td>
                  <td className="num py-2 text-right text-muted">
                    {Number(line.pct_of_revenue).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="border-b border-border">
                <td className="py-2 font-medium">Cost of production</td>
                <td className="num py-2 text-right font-medium">({fmtN(Number(c.total_cost))})</td>
                <td className="num py-2 text-right text-muted">
                  {Number(c.revenue)
                    ? ((Number(c.total_cost) / Number(c.revenue)) * 100).toFixed(1)
                    : "0.0"}
                  %
                </td>
              </tr>
              <tr className="border-b-2 border-border-strong">
                <td className="py-2.5 font-medium">Gross profit</td>
                <td
                  className="num py-2.5 text-right font-medium"
                  style={{
                    color: Number(c.gross_profit) >= 0 ? "var(--success)" : "var(--error)",
                  }}
                >
                  {naira(Number(c.gross_profit))}
                </td>
                <td className="num py-2.5 text-right font-medium">
                  {Number(c.margin).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Figure small label={c.is_closed ? "Birds sold" : "Birds alive"} value={fmtN(c.sold)} />
            <Figure small label="Cost per bird" value={naira(Number(c.cost_per_bird))} />
            <Figure small label="Profit per bird" value={naira(Number(c.profit_per_bird))} />
            <Figure
              small
              label="Cost per kg"
              value={c.cost_per_kg ? naira(Number(c.cost_per_kg)) : "—"}
            />
          </div>
        </section>
      ))}

      <footer className="mt-8 border-t border-border pt-3">
        <p className="caption text-[11px] leading-[1.5]">
          Prepared by Aviro from the daily records kept for {farm.name}. Figures for open cycles are
          projections based on current bird weight and today&rsquo;s market price, not booked income.
        </p>
      </footer>
    </div>
  );
}

function Figure({
  label, value, strong, small,
}: { label: string; value: string; strong?: boolean; small?: boolean }) {
  return (
    <div className="av-metric print-avoid-break">
      <div className="av-metric-l">{label}</div>
      <div
        className="av-metric-v num"
        style={{ fontSize: small ? 16 : undefined, color: strong ? "var(--av-teal)" : undefined }}
      >
        {value}
      </div>
    </div>
  );
}
