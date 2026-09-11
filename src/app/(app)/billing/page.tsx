import { redirect } from "next/navigation";

import { UnlockCard } from "@/components/billing/unlock-card";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import { naira, shortDate } from "@/lib/format";
import type { ApiAccess } from "@/lib/api/types";

export const metadata = { title: "Money tools · Aviro" };

function coverage(access: ApiAccess): string {
  const until = access.until ? shortDate(access.until) : "";
  if (access.source === "cooperative") return `Paid for by ${access.covered_by} until ${until}.`;
  if (access.source === "month") return `Paid monthly. Covered until ${until}.`;
  return `Paid for ${access.covered_by ?? "this batch"}. Covered until ${until}.`;
}

export default async function BillingPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const billing = await api.billing(farm.id);

  if (!billing.access.active) {
    return (
      <div className="pb-24">
        <TopBar title="Money tools" backHref="/money" />
        <UnlockCard
          billing={billing}
          reason="Pay once for a batch and get the paperwork a bank or cooperative asks for."
        />
        <History billing={billing} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-24">
      <TopBar title="Money tools" backHref="/money" />
      <div className="px-4 pt-4">
        <div className="av-card mb-4 flex gap-3 bg-teal-haze">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-soft-mint text-teal">
            <Icon name="check" size={20} />
          </div>
          <div>
            <div className="text-[15px] font-medium">Money tools are on</div>
            <div className="caption mt-0.5 text-[13px] leading-[1.5]">{coverage(billing.access)}</div>
          </div>
        </div>

        <ul className="mb-2 flex flex-col gap-2">
          {billing.included.map((item) => (
            <li key={item} className="flex gap-2 text-[14px] leading-[1.5]">
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-teal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <History billing={billing} />
    </div>
  );
}

function History({ billing }: { billing: Awaited<ReturnType<typeof api.billing>> }) {
  if (billing.payments.length === 0) return null;
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-4">
      <div className="label mb-2">Payments</div>
      {billing.payments.map((p) => (
        <div key={p.id} className="av-card mb-2.5 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium">
              {p.batch_name ? `${p.batch_name} · ` : ""}
              {p.kind_label}
            </div>
            <div className="caption mt-0.5 text-xs">
              {p.status === "paid" && p.covers_until
                ? `Covered until ${shortDate(p.covers_until)}`
                : p.status_label}
              {" · "}
              {p.reference}
            </div>
          </div>
          <div
            className="num text-[15px] font-medium"
            style={{ color: p.status === "failed" ? "var(--error)" : undefined }}
          >
            {naira(Number(p.amount))}
          </div>
        </div>
      ))}
    </div>
  );
}
