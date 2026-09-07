import { redirect } from "next/navigation";

import { PeriodReport } from "@/components/reports/period-report";
import { Empty } from "@/components/ui/empty";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";
import Link from "next/link";

export const metadata = { title: "How the farm is doing · Aviro" };

const PERIODS = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
] as const;

export default async function SummaryPage({ searchParams }: PageProps<"/summary">) {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const params = await searchParams;
  const raw = typeof params.period === "string" ? params.period : "week";
  const period = raw === "month" ? "month" : "week";

  const report = await api.summary(farm.id, period).catch(() => null);

  return (
    <div className="mx-auto w-full max-w-2xl pb-24">
      <TopBar title="How the farm is doing" backHref="/" />

      <div className="flex gap-2 px-4 pt-3 pb-1">
        {PERIODS.map((p) => (
          <Link
            key={p.key}
            href={`/summary?period=${p.key}`}
            className="av-chip"
            aria-pressed={period === p.key}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {report ? (
        <PeriodReport report={report} />
      ) : (
        <Empty
          icon="info"
          title="No report yet"
          body="We could not reach your records just now. Try again in a moment."
        />
      )}
    </div>
  );
}
