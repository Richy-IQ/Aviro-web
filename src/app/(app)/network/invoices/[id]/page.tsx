import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintButton } from "@/components/reports/print-button";
import { Logo } from "@/components/ui/logo";
import { api } from "@/lib/api/resources";
import { fmtN, naira } from "@/lib/format";

export const metadata = { title: "Invoice · Aviro" };

function longDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${iso}T00:00:00`));
}

/**
 * A cooperative's invoice, laid out to be printed and paid by transfer.
 *
 * The invoice number is the thing to quote on the transfer: it is how a
 * payment arriving in the bank is matched to the farms it switches on.
 */
export default async function InvoicePage({ params, searchParams }: PageProps<"/network/invoices/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const orgId = typeof query.org === "string" ? query.org : null;
  if (!orgId) notFound();

  const invoice = await api.invoice(orgId, id).catch(() => null);
  if (!invoice) notFound();

  const { bank } = invoice;
  const hasBank = Boolean(bank.bank && bank.account_number);

  return (
    <div className="print-sheet mx-auto w-full max-w-3xl p-4 pb-10">
      <div className="no-print mb-4 flex items-center justify-between gap-3">
        <Link href={`/network?org=${orgId}`} className="av-link text-sm">
          ← Back to member farms
        </Link>
        <PrintButton />
      </div>

      <header className="mb-6 flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <Logo size={24} />
          <h1 className="h2 mt-3">Invoice {invoice.number}</h1>
          <p className="caption mt-1">Issued {longDate(invoice.issued_on)}</p>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-medium">{invoice.organisation_name}</div>
          <span className={`av-pill mt-1.5 ${invoice.status === "paid" ? "success" : "warn"}`}>
            {invoice.status_label}
          </span>
        </div>
      </header>

      <table className="mb-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 text-left font-medium">Description</th>
            <th className="py-2 text-right font-medium">Farms</th>
            <th className="py-2 text-right font-medium">Per farm</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2.5">
              Aviro money tools for member farms
              <div className="caption text-xs">
                {longDate(invoice.period_start)} to {longDate(invoice.period_end)}
              </div>
            </td>
            <td className="num py-2.5 text-right">{fmtN(invoice.farms_count)}</td>
            <td className="num py-2.5 text-right">{naira(Number(invoice.price_per_farm))}</td>
            <td className="num py-2.5 text-right">{naira(Number(invoice.amount))}</td>
          </tr>
          <tr className="border-b-2 border-border-strong">
            <td className="py-2.5 font-medium" colSpan={3}>
              Total due
            </td>
            <td className="num py-2.5 text-right font-medium">{naira(Number(invoice.amount))}</td>
          </tr>
        </tbody>
      </table>

      {invoice.status !== "paid" && (
        <section className="mb-6">
          <h2 className="h3 mb-2">How to pay</h2>
          {hasBank ? (
            <div className="av-card text-[14px] leading-[1.7]">
              <div>
                Bank: <span className="font-medium">{bank.bank}</span>
              </div>
              <div>
                Account number: <span className="num font-medium">{bank.account_number}</span>
              </div>
              <div>
                Account name: <span className="font-medium">{bank.account_name}</span>
              </div>
              <div className="mt-2">
                Quote <span className="font-medium">{invoice.number}</span> as the transfer
                narration.
              </div>
            </div>
          ) : (
            <p className="text-[14px] leading-[1.55]">
              Contact Aviro for bank details, and quote {invoice.number} with the transfer.
            </p>
          )}
          <p className="caption mt-2 text-xs">Due {longDate(invoice.due_on)}.</p>
        </section>
      )}

      {invoice.status === "paid" && (
        <p className="text-[14px]">Paid on {longDate(invoice.paid_on)}. Thank you.</p>
      )}

      <footer className="mt-8 border-t border-border pt-3">
        <p className="caption text-[11px] leading-[1.5]">
          Once paid, every member farm has Aviro&rsquo;s money tools for the period above — the income
          statement, record downloads and monthly report. The feed plan, daily logging and health
          warnings are free to every farm and are not part of this invoice.
        </p>
      </footer>
    </div>
  );
}
