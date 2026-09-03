import { PrintButton } from "@/components/reports/print-button";
import { Logo } from "@/components/ui/logo";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm } from "@/lib/farm-data";
import { fmtN, naira } from "@/lib/format";
import { buildStatement, PERIODS, type Period } from "@/lib/statement";

export const metadata = { title: "Income statement · Aviro" };

export default async function StatementPage({ searchParams }: PageProps<"/reports/statement">) {
  const params = await searchParams;
  const raw = typeof params.period === "string" ? params.period : "12-mo";
  const period = (PERIODS.some((p) => p.v === raw) ? raw : "12-mo") as Period;

  const farm = makeFarm(CURRENT_DAY);
  const [batch] = farm.batches;
  const s = buildStatement(batch, period, {
    farmName: farm.farm.name,
    farmerName: `${farm.farmer.first} ${farm.farmer.last}`,
    location: farm.farm.location,
  });

  return (
    <div className="print-sheet mx-auto w-full max-w-3xl p-4 pb-10">
      <div className="no-print mb-4 flex items-center justify-between gap-3">
        <a href="/reports" className="av-link text-sm">
          ← Back to reports
        </a>
        <PrintButton />
      </div>

      {/* Letterhead */}
      <header className="print-avoid-break mb-6 flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <Logo size={24} />
          <h1 className="h2 mt-3">Income statement</h1>
          <p className="caption mt-1">
            {s.periodLabel} · prepared {s.generatedAt}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-medium">{s.farmName}</div>
          <div className="caption text-xs">{s.location}</div>
          <div className="caption text-xs">{s.farmerName}</div>
        </div>
      </header>

      {/* Headline */}
      <section className="print-avoid-break mb-7">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Figure label="Revenue" value={naira(s.totals.revenue)} />
          <Figure label="Cost of production" value={naira(s.totals.totalCost)} />
          <Figure label="Gross profit" value={naira(s.totals.grossProfit)} strong />
          <Figure label="Margin" value={`${s.totals.margin.toFixed(1)}%`} />
        </div>
      </section>

      {/* Per cycle */}
      {s.cycles.map((c) => (
        <section key={c.name} className="print-avoid-break mb-7">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 className="h3">
              {c.name} · {c.breed}
            </h2>
            {!c.closed && (
              <span className="av-pill warn">Open cycle · projected</span>
            )}
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
                <td className="num py-2 text-right">{naira(c.revenue)}</td>
                <td className="num py-2 text-right text-muted">100.0%</td>
              </tr>
              {c.costs.map((l) => (
                <tr key={l.label} className="border-b border-border">
                  <td className="py-2 pl-4 text-slate-2">{l.label}</td>
                  <td className="num py-2 text-right text-slate-2">({fmtN(l.amount)})</td>
                  <td className="num py-2 text-right text-muted">{l.pctOfRevenue.toFixed(1)}%</td>
                </tr>
              ))}
              <tr className="border-b border-border">
                <td className="py-2 font-medium">Cost of production</td>
                <td className="num py-2 text-right font-medium">({fmtN(c.totalCost)})</td>
                <td className="num py-2 text-right text-muted">
                  {c.revenue ? ((c.totalCost / c.revenue) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>
              <tr className="border-b-2 border-border-strong">
                <td className="py-2.5 font-medium">Gross profit</td>
                <td
                  className="num py-2.5 text-right font-medium"
                  style={{ color: c.grossProfit >= 0 ? "var(--success)" : "var(--error)" }}
                >
                  {naira(c.grossProfit)}
                </td>
                <td className="num py-2.5 text-right font-medium">{c.margin.toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Figure small label="Birds sold" value={fmtN(c.birdsSold)} />
            <Figure small label="Cost per bird" value={naira(c.costPerBird)} />
            <Figure small label="Profit per bird" value={naira(c.profitPerBird)} />
            <Figure small label="Cost per kg" value={naira(c.costPerKg)} />
          </div>
        </section>
      ))}

      <footer className="mt-8 border-t border-border pt-3">
        <p className="caption text-[11px] leading-[1.5]">
          Prepared by Aviro from the daily records kept for {s.farmName}. Figures for open cycles are
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
