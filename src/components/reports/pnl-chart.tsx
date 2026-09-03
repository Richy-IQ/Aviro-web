const MAX = 8000;
const BAR_H = 180;

const COST_COLORS: Record<string, string> = {
  feed: "var(--av-teal)",
  chick: "var(--success)",
  meds: "#3B82F6",
  misc: "var(--warning)",
};

const LEGEND = [
  { label: "Feed", color: "var(--av-teal)" },
  { label: "Chicks", color: "var(--success)" },
  { label: "Meds", color: "#3B82F6" },
  { label: "Misc", color: "var(--warning)" },
  { label: "Revenue (—)", color: "var(--slate)" },
];

interface Cycle {
  label: string;
  rev: number;
  costs: Partial<Record<keyof typeof COST_COLORS, number>>;
  projected?: boolean;
}

// Figures in thousands of naira.
const CYCLES: Cycle[] = [
  { label: "Aug", rev: 6800, costs: { feed: 3700, chick: 750, meds: 120, misc: 230 } },
  { label: "Oct", rev: 5400, costs: { feed: 4100, chick: 800, meds: 180, misc: 320 } },
  { label: "Jan", rev: 7100, costs: { feed: 4800, chick: 800, meds: 130, misc: 250 } },
  { label: "Apr", rev: 7384, costs: { feed: 4180, chick: 850, meds: 142, misc: 268 } },
  { label: "Jun", rev: 0, costs: {}, projected: true },
];

/**
 * Cost is stacked, revenue is the rule across the top of each bar — the gap
 * between them is the profit, which is the whole point of the chart.
 */
export function PnLChart() {
  return (
    <div>
      <div className="flex h-[220px] items-end gap-3">
        {CYCLES.map((c) => {
          const totalCost = Object.values(c.costs).reduce<number>((a, b) => a + (b ?? 0), 0);
          const profit = c.rev - totalCost;

          return (
            <div key={c.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="num text-[10px] font-medium"
                style={{ color: profit > 0 ? "var(--success)" : "var(--error)" }}
              >
                {c.projected ? "proj" : `${profit > 0 ? "+" : ""}${(profit / 1000).toFixed(1)}k`}
              </div>

              <div className="relative flex w-full flex-col-reverse" style={{ height: BAR_H }}>
                {c.projected ? (
                  <div
                    style={{
                      height: 140,
                      background:
                        "repeating-linear-gradient(45deg, var(--av-teal-tint) 0 6px, transparent 6px 12px)",
                      border: "1.5px dashed var(--av-teal)",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                ) : (
                  <>
                    {Object.entries(c.costs).map(([k, v]) => (
                      <div key={k} style={{ height: ((v ?? 0) / MAX) * BAR_H, background: COST_COLORS[k] }} />
                    ))}
                    <div
                      className="absolute -right-[3px] -left-[3px] h-0.5 rounded-sm bg-slate-ink"
                      style={{ bottom: (c.rev / MAX) * BAR_H - 1 }}
                    />
                  </>
                )}
              </div>

              <div className="num caption text-[10px]">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3.5">
        {LEGEND.map((x) => (
          <span key={x.label} className="flex items-center gap-1.5 text-[11px] text-slate-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: x.color }} />
            {x.label}
          </span>
        ))}
      </div>
    </div>
  );
}
