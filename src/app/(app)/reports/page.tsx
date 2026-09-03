import { TopBar } from "@/components/ui/top-bar";
import { PAST_CYCLE } from "@/lib/farm-data";
import { naira, nairaShort } from "@/lib/format";

export const metadata = { title: "Reports · Aviro" };

export default function ReportsPage() {
  const c = PAST_CYCLE;
  const maxLine = Math.max(...c.breakdown.map((b) => b.v));

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Cycle report" subtitle={`${c.name} · ${c.breed} · ${c.days} days`} />

      <div className="p-4">
        <div className="rounded-card bg-teal p-4 text-white">
          <div className="label" style={{ color: "rgba(255,255,255,.72)" }}>
            Gross profit
          </div>
          <div className="display num mt-1 text-[40px]">{nairaShort(c.grossProfit)}</div>
          <div className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,.8)" }}>
            {c.margin}% margin on {nairaShort(c.revenue)} revenue
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="av-metric">
            <div className="av-metric-l">Birds sold</div>
            <div className="av-metric-v num">{c.sold.toLocaleString("en-NG")}</div>
          </div>
          <div className="av-metric">
            <div className="av-metric-l">Avg weight</div>
            <div className="av-metric-v num">{c.avgWeight}kg</div>
          </div>
          <div className="av-metric">
            <div className="av-metric-l">FCR</div>
            <div className="av-metric-v num">{c.fcr}</div>
          </div>
          <div className="av-metric">
            <div className="av-metric-l">Mortality</div>
            <div className="av-metric-v num">{c.mortPct}%</div>
          </div>
        </div>

        <div className="mt-6">
          <span className="label">Where the money went</span>
          <div className="av-card mt-2">
            {c.breakdown.map((line) => (
              <div key={line.k} className="mb-3 last:mb-0">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm">{line.k}</span>
                  <span className="num text-sm font-medium">{naira(line.v)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${(line.v / maxLine) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="av-hr my-3" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Total cost</span>
              <span className="num text-sm font-medium">{naira(c.totalCost)}</span>
            </div>
            <div className="caption mt-1 num">{naira(c.costPerBird)} per bird sold</div>
          </div>
        </div>

        <div className="mt-6">
          <span className="label">What this tells you</span>
          <div className="av-card mt-2">
            {c.insights.map((text, i) => (
              <p key={text} className={`text-sm leading-[1.6] text-slate-2 ${i ? "mt-3" : ""}`}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
