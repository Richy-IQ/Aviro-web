"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { naira } from "@/lib/format";
import type { Batch } from "@/lib/types";
import { BigNumDisplay, NumPad } from "./numpad";

const KG_PER_BAG = 25;
const CAUSES = ["Sudden death", "Disease symptoms", "Predator", "Other"];
const HEALTH_OPTIONS = [
  { v: "none", label: "Nothing today" },
  { v: "vaccine", label: "Gave a vaccine" },
  { v: "medicine", label: "Gave medicine" },
  { v: "vet", label: "Vet visited" },
];
const STEP_TITLES = [
  "How much feed today?",
  "Any birds died today?",
  "Any health activity today?",
  "Any other expenses today?",
];
const STEP_SUBTITLES = ["", "Default is zero.", "", "Skip if there were none."];
const TOTAL_STEPS = 4;

interface LogData {
  feedQty: string;
  feedUnit: "bags" | "kg";
  deaths: string;
  cause: string | null;
  health: string;
  expenses: string;
}

export function DailyLogFlow({ batch }: { batch: Batch }) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<LogData>({
    feedQty: "",
    feedUnit: "bags",
    deaths: "0",
    cause: null,
    health: "none",
    expenses: "0",
  });

  const patch = (p: Partial<LogData>) => setData((d) => ({ ...d, ...p }));

  const feedKgToday =
    data.feedUnit === "bags" ? (Number(data.feedQty) || 0) * KG_PER_BAG : Number(data.feedQty) || 0;
  const deaths = Number(data.deaths) || 0;

  if (saved) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-soft-mint text-teal">
          <Icon name="check" size={30} />
        </div>
        <h1 className="h2">Logged for day {batch.day}</h1>
        <p className="caption mx-auto mt-2 max-w-[300px] leading-[1.55]">
          {feedKgToday.toLocaleString("en-NG")} kg of feed
          {deaths > 0 ? ` and ${deaths} ${deaths === 1 ? "death" : "deaths"}` : ", no deaths"} recorded.
          That&rsquo;s a {batch.streak + 1} day streak.
        </p>
        <Link href={`/batches/${batch.id}`} className="av-btn primary mt-6">
          Back to {batch.name}
        </Link>
      </div>
    );
  }

  if (step === TOTAL_STEPS) {
    const expense = Number(data.expenses) || 0;
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col">
        <div className="px-4 pt-4">
          <h1 className="h1 mb-1.5 text-2xl">Does this look right?</h1>
          <p className="caption mb-4">Day {batch.day} · check before saving.</p>
        </div>
        <div className="px-4">
          <ReviewRow label="Feed" value={`${feedKgToday.toLocaleString("en-NG")} kg`} sub={data.feedUnit === "bags" ? `${data.feedQty || 0} bags` : undefined} onEdit={() => setStep(0)} />
          <ReviewRow label="Deaths" value={`${deaths}`} sub={data.cause ?? undefined} bad={deaths > 5} onEdit={() => setStep(1)} />
          <ReviewRow label="Health" value={HEALTH_OPTIONS.find((h) => h.v === data.health)?.label ?? "—"} onEdit={() => setStep(2)} />
          <ReviewRow label="Other expenses" value={naira(expense)} onEdit={() => setStep(3)} />
        </div>
        <div className="flex gap-2 p-4">
          <button type="button" onClick={() => setStep(3)} className="av-btn ghost flex-1">
            Back
          </button>
          <button type="button" onClick={() => setSaved(true)} className="av-btn primary flex-[2]">
            <Icon name="check" size={16} stroke={2} /> Save log
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="px-4 pt-3">
        <div className="av-progress">
          <i style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 pb-4">
        <h1 className="h1 mb-1.5 text-2xl">{STEP_TITLES[step]}</h1>
        {STEP_SUBTITLES[step] && <p className="caption mb-4">{STEP_SUBTITLES[step]}</p>}

        {step === 0 && (
          <>
            <div className="mb-4.5 flex rounded-[10px] bg-bg p-[3px]">
              {(["bags", "kg"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => patch({ feedUnit: u })}
                  className="flex-1 rounded-lg px-2 py-2.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: data.feedUnit === u ? "var(--surface)" : "transparent",
                    color: data.feedUnit === u ? "var(--slate)" : "var(--muted)",
                    boxShadow: data.feedUnit === u ? "var(--shadow-1)" : "none",
                  }}
                >
                  {u === "bags" ? "Bags (25kg)" : "Kilograms"}
                </button>
              ))}
            </div>
            <BigNumDisplay
              value={data.feedQty || "0"}
              unit={data.feedUnit}
              sub={data.feedQty ? `≈ ${feedKgToday.toLocaleString("en-NG")} kg total today` : "Tap the keypad to enter"}
            />
            <NumPad value={data.feedQty} onChange={(v) => patch({ feedQty: v })} decimal />
            <div className="mt-4 rounded-card bg-teal-haze p-3.5">
              <div className="caption mb-1">Total this cycle so far</div>
              <div className="num text-lg font-medium">
                {(batch.totalFeed + feedKgToday).toLocaleString("en-NG")} kg{" "}
                <span className="text-xs font-normal text-muted">
                  · ≈ {Math.round((batch.totalFeed + feedKgToday) / KG_PER_BAG)} bags
                </span>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <BigNumDisplay
              value={data.deaths}
              unit={deaths === 1 ? "bird" : "birds"}
              sub={deaths === 0 ? "Great. Keep it up." : "Tap a cause below if you can."}
            />
            <NumPad value={data.deaths} onChange={(v) => patch({ deaths: v })} zeroKey />
            {deaths > 0 && (
              <div className="mt-5">
                <div className="label mb-2.5">What happened?</div>
                <div className="flex flex-wrap gap-2">
                  {CAUSES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="av-chip"
                      aria-pressed={data.cause === c}
                      onClick={() => patch({ cause: data.cause === c ? null : c })}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {deaths > batch.alive * 0.1 && (
              <div className="mt-4 flex gap-2 rounded-metric bg-error-soft p-3 text-[13px] text-error">
                <Icon name="alert" size={16} className="shrink-0" />
                <span>
                  That&rsquo;s more than 10% of your flock. We&rsquo;ll suggest emergency steps on the next screen.
                </span>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-2">
            {HEALTH_OPTIONS.map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => patch({ health: o.v })}
                className="flex items-center gap-3 rounded-card border p-3.5 text-left text-[15px]"
                style={{
                  borderColor: data.health === o.v ? "var(--av-teal)" : "var(--border)",
                  background: data.health === o.v ? "var(--av-teal-haze)" : "var(--surface)",
                  borderWidth: data.health === o.v ? 1.5 : 1,
                }}
              >
                <span className="flex-1">{o.label}</span>
                {data.health === o.v && <Icon name="check" size={18} style={{ color: "var(--av-teal)" }} />}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <>
            <BigNumDisplay value={naira(Number(data.expenses) || 0)} unit="" sub="Water, labour, transport, anything else." />
            <NumPad value={data.expenses} onChange={(v) => patch({ expenses: v })} zeroKey />
          </>
        )}
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-border bg-surface p-3 px-4">
        <button
          type="button"
          onClick={() => (step === 0 ? undefined : setStep((s) => s - 1))}
          disabled={step === 0}
          className="av-btn ghost flex-1"
        >
          Back
        </button>
        <button type="button" onClick={() => setStep((s) => s + 1)} className="av-btn primary flex-[2]">
          {step === TOTAL_STEPS - 1 ? "Review" : "Next"} <Icon name="arrow" size={16} />
        </button>
      </div>
    </div>
  );
}

function ReviewRow({
  label, value, sub, bad, onEdit,
}: { label: string; value: string; sub?: string; bad?: boolean; onEdit: () => void }) {
  return (
    <div className="av-card mb-2.5 flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="label mb-1">{label}</div>
        <div className="num text-lg font-medium" style={{ color: bad ? "var(--error)" : "var(--slate)" }}>
          {value}
        </div>
        {sub && <div className="caption mt-0.5 text-xs">{sub}</div>}
      </div>
      <button type="button" onClick={onEdit} className="av-btn ghost sm">
        Edit
      </button>
    </div>
  );
}
