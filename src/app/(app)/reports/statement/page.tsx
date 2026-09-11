import Link from "next/link";
import { redirect } from "next/navigation";

import { UnlockCard } from "@/components/billing/unlock-card";
import { PrintButton } from "@/components/reports/print-button";
import { Empty } from "@/components/ui/empty";
import { Logo } from "@/components/ui/logo";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { isPaymentRequired } from "@/lib/api/errors";
import { api } from "@/lib/api/resources";
import { fmtN, naira } from "@/lib/format";
import { PERIODS, isPeriod, type Period } from "@/lib/statement";

export const metadata = { title: "Income statement · Aviro" };

function longDate(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${iso}T00:00:00`));
}

export default async function StatementPage({ searchParams }: PageProps<"/reports/statement">) {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const params = await searchParams;
  const raw = typeof params.period === "string" ? params.period : "12-mo";
  const period: Period = isPeriod(raw) ? raw : "12-mo";

  const [result, user] = await Promise.all([
    api.statement(farm.id, period).then(
      (statement) => ({ statement, error: null }),
      (error: unknown) => ({ statement: null, error }),
    ),
    api.me(),
  ]);

  if (isPaymentRequired(result.error)) {
    return (
      <UnlockCard
        billing={await api.billing(farm.id)}
        reason="The income statement is part of the money tools: a bank-ready summary of what the farm earned and spent, printed or saved as a PDF."
      />
    );
  }
  const statement = result.statement;

  if (!statement) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Empty
          icon="doc"
          title="Nothing to state yet"
          body="Record a sale and your income statement will be here."
          action={{ label: "Back to reports", href: "/reports" }}
        />
      </div>
    );
  }

  const revenue = Number(statement.revenue);

  return (
    <div className="print-sheet mx-auto w-full max-w-3xl p-4 pb-10">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/reports" className="av-link text-sm">
          ← Back to reports
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/reports/records" className="av-btn ghost sm">
            Download records
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="no-print mb-5 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <Link
            key={p.v}
            href={`/reports/statement?period=${p.v}`}
            className="av-chip"
            aria-pressed={period === p.v}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <header className="print-avoid-break mb-6 flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <Logo size={24} />
          <h1 className="h2 mt-3">Income statement</h1>
          <p className="caption mt-1">
            For the period {longDate(statement.starts_on)} to {longDate(statement.ends_on)}
          </p>
          <p className="caption text-xs">Prepared {longDate(statement.prepared_on)}</p>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-medium">{statement.farm_name}</div>
          {statement.farm_location && (
            <div className="caption text-xs">{statement.farm_location}</div>
          )}
          {user.display_name && <div className="caption text-xs">{user.display_name}</div>}
        </div>
      </header>

      <section className="print-avoid-break mb-7">
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
              <td className="py-2 font-medium">Revenue from bird sales</td>
              <td className="num py-2 text-right font-medium">{naira(revenue)}</td>
              <td className="num py-2 text-right text-muted">{revenue ? "100.0%" : "—"}</td>
            </tr>
            {statement.revenue_lines.map((line) => (
              <tr key={line.label} className="border-b border-border">
                <td className="py-2 pl-4 text-slate-2">{line.label}</td>
                <td className="num py-2 text-right text-slate-2">{fmtN(Number(line.amount))}</td>
                <td className="num py-2 text-right text-muted">
                  {Number(line.pct_of_revenue).toFixed(1)}%
                </td>
              </tr>
            ))}

            <tr className="border-b border-border">
              <td className="pt-4 pb-2 font-medium">Cost of production</td>
              <td />
              <td />
            </tr>
            {statement.cost_lines.map((line) => (
              <tr key={line.label} className="border-b border-border">
                <td className="py-2 pl-4 text-slate-2">{line.label}</td>
                <td className="num py-2 text-right text-slate-2">
                  ({fmtN(Number(line.amount))})
                </td>
                <td className="num py-2 text-right text-muted">
                  {Number(line.pct_of_revenue).toFixed(1)}%
                </td>
              </tr>
            ))}
            <tr className="border-b border-border">
              <td className="py-2 font-medium">Total cost of production</td>
              <td className="num py-2 text-right font-medium">
                ({fmtN(Number(statement.total_cost))})
              </td>
              <td className="num py-2 text-right text-muted">
                {revenue ? ((Number(statement.total_cost) / revenue) * 100).toFixed(1) : "0.0"}%
              </td>
            </tr>

            <tr className="border-b-2 border-border-strong">
              <td className="py-2.5 font-medium">Gross profit</td>
              <td
                className="num py-2.5 text-right font-medium"
                style={{
                  color:
                    Number(statement.gross_profit) >= 0 ? "var(--success)" : "var(--error)",
                }}
              >
                {naira(Number(statement.gross_profit))}
              </td>
              <td className="num py-2.5 text-right font-medium">
                {Number(statement.margin).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="print-avoid-break mb-7">
        <h2 className="h3 mb-2.5">Unit economics</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Figure small label="Birds sold" value={fmtN(statement.birds_sold)} />
          <Figure small label="Weight sold" value={`${statement.kg_sold} kg`} />
          <Figure small label="Cost per bird" value={naira(Number(statement.cost_per_bird))} />
          <Figure small label="Profit per bird" value={naira(Number(statement.profit_per_bird))} />
        </div>
      </section>

      {statement.batches.length > 0 && (
        <section className="print-avoid-break mb-7">
          <h2 className="h3 mb-2.5">Flocks held in the period</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium">Batch</th>
                <th className="py-2 text-left font-medium">Stocked</th>
                <th className="py-2 text-right font-medium">Birds</th>
                <th className="py-2 text-right font-medium">Sold</th>
              </tr>
            </thead>
            <tbody>
              {statement.batches.map((b) => (
                <tr key={`${b.name}-${b.started_on}`} className="border-b border-border">
                  <td className="py-2">
                    {b.name} <span className="caption text-xs">· {b.bird_type}</span>
                  </td>
                  <td className="py-2">{longDate(b.started_on)}</td>
                  <td className="num py-2 text-right">{fmtN(b.stocked)}</td>
                  <td className="num py-2 text-right">{fmtN(b.sold)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="print-avoid-break mb-6">
        <h2 className="h3 mb-2">Basis of preparation</h2>
        <ul className="flex list-disc flex-col gap-1.5 pl-4 text-[13px] leading-[1.55]">
          {statement.basis.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="print-avoid-break mb-6">
        <h2 className="h3 mb-2">What this statement does not show</h2>
        <ul className="flex list-disc flex-col gap-1.5 pl-4 text-[13px] leading-[1.55]">
          {statement.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      <footer className="mt-8 border-t border-border pt-3">
        <p className="caption text-[11px] leading-[1.5]">
          Compiled by Aviro from the records kept for {statement.farm_name}. The underlying daily
          records and sales can be exported as a spreadsheet from the same account.
        </p>
        <div className="mt-6 flex gap-10 text-[12px]">
          <div className="flex-1 border-t border-border pt-1.5">Signed, for the farm</div>
          <div className="flex-1 border-t border-border pt-1.5">Date</div>
        </div>
      </footer>
    </div>
  );
}

function Figure({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="av-metric print-avoid-break">
      <div className="av-metric-l">{label}</div>
      <div className="av-metric-v num" style={{ fontSize: small ? 16 : undefined }}>
        {value}
      </div>
    </div>
  );
}
