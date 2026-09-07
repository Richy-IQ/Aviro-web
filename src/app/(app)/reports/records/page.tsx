import Link from "next/link";
import { redirect } from "next/navigation";

import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { PERIODS } from "@/lib/statement";

export const metadata = { title: "Download your records · Aviro" };

const DATASETS = [
  {
    key: "logs",
    title: "Daily records",
    sub: "One row per day per batch: feed, deaths, cause, health activity and every cost recorded.",
  },
  {
    key: "sales",
    title: "Sales",
    sub: "One row per sale: birds, weight, revenue, price per kilogram and the buyer.",
  },
] as const;

export default async function RecordsPage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  return (
    <div className="mx-auto w-full max-w-2xl pb-24">
      <TopBar title="Download your records" backHref="/reports" />

      <div className="px-4 pt-4">
        <p className="caption mb-5 text-[13px] leading-[1.55]">
          Your records as a spreadsheet, exactly as you entered them. Nothing here is worked out by
          Aviro — these are the rows the reports are built from, so anyone you give them to can
          check the figures themselves.
        </p>

        {DATASETS.map((d) => (
          <section key={d.key} className="mb-7">
            <h2 className="h3 mb-1">{d.title}</h2>
            <p className="caption mb-3 text-xs leading-[1.5]">{d.sub}</p>
            <div className="flex flex-col gap-2">
              {PERIODS.map((p) => (
                <a
                  key={p.v}
                  href={`/api/records?dataset=${d.key}&period=${p.v}`}
                  className="av-card flex items-center gap-3"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
                    <Icon name="download" size={18} />
                  </div>
                  <span className="flex-1 text-[15px]">{p.label}</span>
                  <span className="caption text-xs">CSV</span>
                </a>
              ))}
            </div>
          </section>
        ))}

        <div className="av-card bg-teal-haze">
          <div className="label mb-1.5">Going to a bank?</div>
          <p className="text-[13px] leading-[1.55]">
            Take the income statement as well. It states the same records as revenue, cost of
            production and gross profit, and says on its face how complete they are.
          </p>
          <Link href="/reports/statement" className="av-btn tertiary sm mt-3">
            Open the income statement
          </Link>
        </div>
      </div>
    </div>
  );
}
