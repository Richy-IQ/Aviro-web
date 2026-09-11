import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { ApiError } from "@/lib/api/errors";
import { api } from "@/lib/api/resources";
import { shortDate } from "@/lib/format";

export const metadata = { title: "Payment · Aviro" };

/**
 * Where the payment page sends the farmer back to.
 *
 * The reference in the address is only a question: the server asks the
 * provider what actually happened before anything is unlocked. Someone who
 * types a reference into the address bar gets exactly what they paid for.
 */
export default async function PaymentDonePage({ searchParams }: PageProps<"/billing/done">) {
  const params = await searchParams;
  // Paystack sends both `reference` and `trxref`; either identifies the payment.
  const raw = params.reference ?? params.trxref;
  const reference = typeof raw === "string" ? raw : null;

  if (!reference) return <Outcome tone="bad" title="No payment to check" body="Open the money tools and try again." />;

  let result: Awaited<ReturnType<typeof api.confirmPayment>> | null = null;
  let message: string | null = null;
  try {
    result = await api.confirmPayment(reference);
  } catch (error) {
    message = error instanceof ApiError ? error.message : "We could not check this payment just now.";
  }

  if (!result) {
    return <Outcome tone="bad" title="We could not confirm this payment" body={message ?? ""} reference={reference} />;
  }

  const { payment, access } = result;

  if (payment.status === "paid") {
    return (
      <Outcome
        tone="good"
        title="Paid. Money tools are on."
        body={`Covered until ${access.until ? shortDate(access.until) : shortDate(payment.covers_until ?? "")}. Your income statement and downloads are ready.`}
        reference={reference}
        next={{ href: "/reports/statement", label: "Open the income statement" }}
      />
    );
  }

  if (payment.status === "failed") {
    return (
      <Outcome
        tone="bad"
        title="The payment did not go through"
        body="Nothing was unlocked. If money left your account, keep this reference and contact us — we will sort it out."
        reference={reference}
        next={{ href: "/billing", label: "Try again" }}
      />
    );
  }

  // Bank transfers and USSD can take a few minutes to land.
  return (
    <Outcome
      tone="wait"
      title="Waiting for the payment to arrive"
      body="Bank transfers and USSD can take a few minutes. The tools switch on by themselves when it lands — you can close this page."
      reference={reference}
      next={{ href: `/billing/done?reference=${encodeURIComponent(reference)}`, label: "Check again" }}
    />
  );
}

function Outcome({
  tone,
  title,
  body,
  reference,
  next,
}: {
  tone: "good" | "bad" | "wait";
  title: string;
  body: string;
  reference?: string;
  next?: { href: string; label: string };
}) {
  const colour = {
    good: { ground: "var(--soft-mint)", ink: "var(--av-teal)", icon: "check" as const },
    bad: { ground: "var(--error-soft)", ink: "var(--error)", icon: "alert" as const },
    wait: { ground: "var(--warning-soft)", ink: "var(--warning-ink)", icon: "info" as const },
  }[tone];

  return (
    <div className="mx-auto w-full max-w-md px-6 py-14 text-center">
      <div
        className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[18px]"
        style={{ background: colour.ground, color: colour.ink }}
      >
        <Icon name={colour.icon} size={30} />
      </div>
      <h1 className="h2">{title}</h1>
      <p className="caption mx-auto mt-2 max-w-[320px] leading-[1.55]">{body}</p>
      {reference && <p className="caption mt-3 text-xs">Reference {reference}</p>}
      <div className="mx-auto mt-7 flex max-w-[300px] flex-col gap-2">
        {next && (
          <Link href={next.href} className="av-btn primary full">
            {next.label}
          </Link>
        )}
        <Link href="/" className="av-btn ghost full">
          Back to the farm
        </Link>
      </div>
    </div>
  );
}
