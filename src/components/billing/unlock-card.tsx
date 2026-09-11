import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { naira } from "@/lib/format";
import type { ApiBilling } from "@/lib/api/types";

import { PayButton } from "./pay-button";

function longDate(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${iso}T00:00:00`));
}

/**
 * Where a paid tool would be, for a farm that has not paid.
 *
 * Says what the money buys, how long it lasts, and — just as plainly — what
 * never costs anything, so nobody reads the paywall as "the app stops here".
 */
export function UnlockCard({
  billing,
  reason,
}: {
  billing: ApiBilling;
  /** Why they are seeing this, in their words: "The income statement is…" */
  reason: string;
}) {
  const { offer, offer_batch: batch } = billing;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <div className="av-card">
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-[12px] bg-orange-soft/50 text-orange">
          <Icon name="doc" size={22} />
        </div>
        <h1 className="h2 mb-1.5">Money tools</h1>
        <p className="caption mb-4 text-[13px] leading-[1.55]">{reason}</p>

        <ul className="mb-5 flex flex-col gap-2">
          {billing.included.map((item) => (
            <li key={item} className="flex gap-2 text-[14px] leading-[1.5]">
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-teal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {offer && batch ? (
          <>
            <div className="mb-3 rounded-card bg-teal-haze p-3.5">
              <div className="num text-2xl font-medium">{naira(Number(offer.amount))}</div>
              <div className="caption mt-1 text-xs leading-[1.5]">
                {offer.kind === "batch"
                  ? `Once, for ${batch.name}. Covers you until ${longDate(offer.covers_until)} — through the sale and the weeks after, when the bank asks for it.`
                  : `For one month, until ${longDate(offer.covers_until)}. Layers earn every week, so they pay by the month.`}
              </div>
            </div>
            {billing.can_pay ? (
              <PayButton
                batchId={batch.id}
                label={`Pay ${naira(Number(offer.amount))}`}
              />
            ) : (
              <p className="caption text-xs leading-[1.5]">
                Only the farm owner or a manager can pay. Ask them to open this screen.
              </p>
            )}
            <p className="caption mt-2.5 text-center text-xs">
              Card, bank transfer or USSD, through Paystack.
            </p>
          </>
        ) : (
          <p className="caption text-[13px] leading-[1.55]">
            Start a batch first — the money tools are paid for one batch at a time.
          </p>
        )}
      </div>

      <div className="mt-4 px-1">
        <div className="label mb-2">Always free</div>
        <ul className="flex flex-col gap-1.5">
          {billing.always_free.map((item) => (
            <li key={item} className="caption flex gap-2 text-[13px] leading-[1.5]">
              <span className="text-teal">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link href="/" className="av-link mt-4 inline-block text-sm">
          ← Back to the farm
        </Link>
      </div>
    </div>
  );
}
