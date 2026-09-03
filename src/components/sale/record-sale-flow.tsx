"use client";

import { useState } from "react";
import Link from "next/link";
import { FieldLabel, NairaInput } from "@/components/form/fields";
import { StepShell } from "@/components/form/step-shell";
import { Icon } from "@/components/ui/icon";
import { naira, nairaShort } from "@/lib/format";
import type { Batch } from "@/lib/types";

const SALE_TYPES = [
  { v: "partial", label: "Partial sale", detail: "Some birds sold. Cycle continues for the rest." },
  { v: "full", label: "Full sale", detail: "All remaining birds sold. The cycle ends and we generate your report." },
] as const;

const BUYER_TYPES = [
  { v: "individual", label: "Individual" },
  { v: "restaurant", label: "Restaurant" },
  { v: "supermarket", label: "Supermarket" },
  { v: "wholesaler", label: "Wholesaler" },
  { v: "other", label: "Other" },
];

const TOTAL = 3;
const TITLES = ["Partial or full sale?", "Sale details", "Who bought?"];

interface SaleData {
  saleType: "partial" | "full";
  birds: number;
  weight: number;
  revenue: number;
  buyerType: string;
  buyerName: string;
  notes: string;
}

export function RecordSaleFlow({ batch }: { batch: Batch }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<SaleData>({
    saleType: "full",
    birds: batch.alive,
    weight: batch.avgWeight,
    revenue: Math.round(batch.alive * batch.avgWeight * batch.marketPricePerKg),
    buyerType: "wholesaler",
    buyerName: "",
    notes: "",
  });

  const patch = (p: Partial<SaleData>) => setData((d) => ({ ...d, ...p }));

  if (done) {
    const profit = data.revenue - batch.totalCost;
    const margin = data.revenue ? ((profit / data.revenue) * 100).toFixed(1) : "0";

    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-[26px] bg-soft-mint text-teal">
            <Icon name="check" size={40} stroke={2.4} />
          </div>
          <h1 className="display text-[30px] text-teal">Sale recorded</h1>
          <p className="caption mt-2">
            {data.birds.toLocaleString("en-NG")} birds · {naira(data.revenue)}
          </p>
        </div>

        {data.saleType === "full" && (
          <div className="mt-8">
            <span className="label">Cycle result</span>
            <div className="mt-2 rounded-card bg-teal p-4 text-white">
              <div className="label" style={{ color: "rgba(255,255,255,.72)" }}>
                Gross profit
              </div>
              <div className="display num mt-1 text-[36px]">{nairaShort(profit)}</div>
              <div className="mt-1 text-[13px]" style={{ color: "rgba(255,255,255,.8)" }}>
                {margin}% margin on {nairaShort(data.revenue)} revenue
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="av-metric">
                <div className="av-metric-l">Total cost</div>
                <div className="av-metric-v num">{nairaShort(batch.totalCost)}</div>
              </div>
              <div className="av-metric">
                <div className="av-metric-l">Cost per bird</div>
                <div className="av-metric-v num">{naira(batch.costPerBird)}</div>
              </div>
              <div className="av-metric">
                <div className="av-metric-l">FCR</div>
                <div className="av-metric-v num">{batch.fcr.toFixed(2)}</div>
              </div>
              <div className="av-metric">
                <div className="av-metric-l">Mortality</div>
                <div className="av-metric-v num">{batch.mortPct.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2">
          <Link href="/reports" className="av-btn primary block">
            See full report
          </Link>
          <Link href="/batches" className="av-btn ghost block">
            Back to batches
          </Link>
        </div>
      </div>
    );
  }

  const perBird = data.birds ? Math.round(data.revenue / data.birds) : null;
  const perKg = data.birds && data.weight ? Math.round(data.revenue / (data.birds * data.weight)) : null;

  return (
    <StepShell
      step={step}
      total={TOTAL}
      title={TITLES[step]}
      onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
      nextLabel={step === TOTAL - 1 ? "Record sale" : "Next"}
      onNext={() => (step === TOTAL - 1 ? setDone(true) : setStep((s) => s + 1))}
    >
      {step === 0 && (
        <div role="radiogroup" aria-label="Sale type">
          {SALE_TYPES.map((o) => {
            const on = data.saleType === o.v;
            return (
              <button
                key={o.v}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => patch({ saleType: o.v })}
                className="mb-2.5 flex w-full items-start gap-3.5 rounded-[14px] p-4.5 text-left text-slate-ink"
                style={{
                  background: on ? "var(--av-teal-haze)" : "var(--surface)",
                  border: on ? "2px solid var(--av-teal)" : "1px solid var(--border)",
                }}
              >
                <span
                  className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full"
                  style={{ border: `2px solid ${on ? "var(--av-teal)" : "var(--border-strong)"}` }}
                >
                  {on && <span className="h-2.5 w-2.5 rounded-full bg-teal" />}
                </span>
                <span>
                  <span className="block text-base font-medium">{o.label}</span>
                  <span className="caption mt-1 block text-[13px] leading-[1.5]">{o.detail}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {step === 1 && (
        <>
          <FieldLabel htmlFor="birds-sold">Number of birds sold</FieldLabel>
          <input
            id="birds-sold"
            className="av-input xl"
            inputMode="numeric"
            value={data.birds || ""}
            onChange={(e) =>
              patch({ birds: Math.min(batch.alive, Number(e.target.value.replace(/\D/g, "")) || 0) })
            }
          />
          <div className="av-help">Max {batch.alive.toLocaleString("en-NG")} (alive in this batch)</div>

          <div className="h-4.5" />
          <FieldLabel htmlFor="avg-weight">Average weight per bird</FieldLabel>
          <div className="relative">
            <input
              id="avg-weight"
              className="av-input lg pr-10"
              inputMode="decimal"
              value={data.weight}
              onChange={(e) => patch({ weight: Number(e.target.value) || 0 })}
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">kg</span>
          </div>
          <div className="av-help">Tip: weigh 5–10 random birds and take the average.</div>

          <div className="h-4.5" />
          <FieldLabel htmlFor="revenue">Total revenue</FieldLabel>
          <NairaInput id="revenue" size="lg" value={data.revenue} onChange={(n) => patch({ revenue: n })} />

          <div className="mt-4 rounded-card bg-bg p-3.5">
            <div className="caption mb-1.5">Cross-check</div>
            <div className="flex justify-between">
              <span className="text-[13px]">₦ per bird</span>
              <span className="num font-medium">{perBird != null ? naira(perBird) : "—"}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[13px]">₦ per kg</span>
              <span className="num font-medium">{perKg != null ? naira(perKg) : "—"}</span>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <FieldLabel>Buyer type</FieldLabel>
          <div className="mb-4.5 flex flex-wrap gap-2">
            {BUYER_TYPES.map((o) => (
              <button
                key={o.v}
                type="button"
                className="av-chip"
                aria-pressed={data.buyerType === o.v}
                onClick={() => patch({ buyerType: o.v })}
              >
                {o.label}
              </button>
            ))}
          </div>

          <FieldLabel htmlFor="buyer-name" optional>
            Buyer name
          </FieldLabel>
          <input
            id="buyer-name"
            className="av-input lg"
            value={data.buyerName}
            onChange={(e) => patch({ buyerName: e.target.value })}
            placeholder="e.g. Yusuf Cold Storage"
          />

          <div className="h-4.5" />
          <FieldLabel htmlFor="notes" optional>
            Notes
          </FieldLabel>
          <textarea
            id="notes"
            value={data.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Anything worth remembering about this sale…"
            className="h-22 w-full resize-none rounded-card border border-border bg-surface p-3.5 text-[15px] leading-normal text-slate-ink outline-none"
          />
        </>
      )}
    </StepShell>
  );
}
