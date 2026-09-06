"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createBatch } from "@/app/actions/farm";
import { previewPlan } from "@/app/actions/plan";
import { CyclePlan } from "@/components/plan/cycle-plan";
import type { ApiCyclePlan } from "@/lib/api/types";
import { ChoiceCard, FieldLabel, NairaInput, RadioRow, Select } from "@/components/form/fields";
import { StepShell } from "@/components/form/step-shell";
import { Icon } from "@/components/ui/icon";
import { BIRD_TYPES, BREEDS } from "@/lib/farm-data";
import { naira } from "@/lib/format";
import type { BirdType } from "@/lib/types";

const PENS = ["Pen 1", "Pen 2", "Pen 3"];
// A fifth step: the plan. It comes before "create" because seeing that 500
// broilers need 81 bags is exactly the kind of thing that changes the decision.
const TOTAL = 5;
const TITLES = [
  "What are you raising?",
  "How many birds did you stock?",
  "What did you pay per bird?",
  "Which pen?",
  "Here is your plan",
];

interface NewBatch {
  name: string;
  type: BirdType;
  breed: string;
  stocked: number;
  dateStocked: string;
  supplier: string;
  costPerBird: number;
  transportCost: number;
  pen: string;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function NewBatchFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<ApiCyclePlan | null>(null);
  const [planning, setPlanning] = useState(false);
  const [pending, startTransition] = useTransition();
  const [data, setData] = useState<NewBatch>({
    name: "Batch C",
    type: "broiler",
    breed: "Cobb 500",
    stocked: 500,
    dateStocked: today(),
    supplier: "",
    costPerBird: 850,
    transportCost: 0,
    pen: "skip",
  });

  const patch = (p: Partial<NewBatch>) => setData((d) => ({ ...d, ...p }));
  const capital = data.stocked * data.costPerBird + data.transportCost;

  /** Work out the plan when the farmer reaches the review step. */
  function loadPlan() {
    setError(null);
    setPlanning(true);
    startTransition(async () => {
      const result = await previewPlan({
        birdType: data.type,
        stocked: data.stocked,
        start: data.dateStocked,
        costPerBird: String(data.costPerBird),
      });
      setPlanning(false);
      if (!result.ok) {
        setError(result.message ?? "Could not work out the plan.");
        return;
      }
      setPlan(result.data ?? null);
    });
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createBatch({
        name: data.name.trim() || "Batch A",
        bird_type: data.type,
        started_on: data.dateStocked,
        stocked: data.stocked,
        cost_per_bird: String(data.costPerBird),
        transport_cost: String(data.transportCost),
        supplier: data.supplier,
      });
      if (!result.ok) {
        setError(result.message ?? "Could not create the batch.");
        return;
      }
      setCreated(true);
      router.refresh();
    });
  }

  if (created) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-12 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[26px] bg-soft-mint text-teal">
          <Icon name="check" size={40} stroke={2.4} />
        </div>
        <div className="display text-[30px] text-teal">Batch created</div>

        <div className="av-card mx-auto mt-7 w-full max-w-[320px] text-left">
          <div className="mb-2 flex justify-between gap-3">
            <span className="caption">Batch</span>
            <span className="font-medium">
              {data.name} · {data.breed}
            </span>
          </div>
          <div className="mb-2 flex justify-between gap-3">
            <span className="caption">Birds</span>
            <span className="num font-medium">{data.stocked.toLocaleString("en-NG")}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="caption">Capital</span>
            <span className="num font-medium">{naira(capital)}</span>
          </div>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-[320px] flex-col gap-2">
          <Link href="/log" className="av-btn primary full">
            Start logging
          </Link>
          <Link href="/batches" className="av-btn ghost full">
            I&rsquo;ll log later
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StepShell
      step={step}
      total={TOTAL}
      title={TITLES[step]}
      subtitle={step === 3 ? "Optional. Helpful if you have multiple pens." : undefined}
      onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
      nextLabel={
        step === TOTAL - 1
          ? pending
            ? "Creating…"
            : "Create batch"
          : step === 3
            ? "See the plan"
            : "Next"
      }
      nextDisabled={pending || (step === TOTAL - 1 && !plan)}
      onNext={() => {
        if (step === TOTAL - 1) {
          submit();
          return;
        }
        if (step === 3) loadPlan();
        setStep((s) => s + 1);
      }}
    >
      {error && <p className="av-err mb-3">{error}</p>}
      {step === 0 && (
        <>
          <FieldLabel htmlFor="batch-name">Batch name</FieldLabel>
          <input
            id="batch-name"
            className="av-input lg"
            value={data.name}
            onChange={(e) => patch({ name: e.target.value })}
          />

          <div className="h-4.5" />
          <FieldLabel>Bird type</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {BIRD_TYPES.slice(0, 4).map((t) => (
              <ChoiceCard
                key={t.v}
                label={t.label}
                sub={t.sub}
                selected={data.type === t.v}
                onSelect={() => patch({ type: t.v })}
              />
            ))}
          </div>

          <div className="h-4.5" />
          <FieldLabel htmlFor="breed">Breed</FieldLabel>
          <Select
            id="breed"
            value={data.breed}
            onChange={(e) => patch({ breed: e.target.value })}
            options={[...BREEDS, "Other"].map((b) => ({ value: b, label: b }))}
          />
        </>
      )}

      {step === 1 && (
        <>
          <FieldLabel htmlFor="stocked">Number of birds</FieldLabel>
          <input
            id="stocked"
            className="av-input xl"
            inputMode="numeric"
            value={data.stocked || ""}
            onChange={(e) => patch({ stocked: Number(e.target.value.replace(/\D/g, "")) || 0 })}
          />

          <div className="h-4.5" />
          <FieldLabel htmlFor="stocked-date">Date stocked</FieldLabel>
          <input
            id="stocked-date"
            className="av-input lg"
            type="date"
            value={data.dateStocked}
            onChange={(e) => patch({ dateStocked: e.target.value })}
          />

          <div className="h-4.5" />
          <FieldLabel htmlFor="supplier" optional>
            Supplier
          </FieldLabel>
          <input
            id="supplier"
            className="av-input lg"
            value={data.supplier}
            onChange={(e) => patch({ supplier: e.target.value })}
            placeholder="e.g. Zartech, Amo Byng"
          />
        </>
      )}

      {step === 2 && (
        <>
          <FieldLabel htmlFor="cost-per-bird">Cost per bird</FieldLabel>
          <NairaInput id="cost-per-bird" value={data.costPerBird} onChange={(n) => patch({ costPerBird: n })} />

          <div className="h-4.5" />
          <FieldLabel htmlFor="transport" optional>
            Transport cost (separate)
          </FieldLabel>
          <NairaInput
            id="transport"
            size="lg"
            value={data.transportCost}
            onChange={(n) => patch({ transportCost: n })}
          />

          <div className="mt-5 rounded-card bg-teal-haze p-4">
            <div className="caption mb-1.5">Starting capital needed</div>
            <div className="display num text-[26px] text-teal">{naira(capital)}</div>
            <div className="caption num mt-1.5 text-xs">
              {data.stocked.toLocaleString("en-NG")} × ₦{data.costPerBird.toLocaleString("en-NG")}
              {data.transportCost
                ? ` + ₦${data.transportCost.toLocaleString("en-NG")} transport`
                : ""}
            </div>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          {planning && (
            <div className="av-card">
              <div className="av-skeleton h-6 w-2/3" />
              <div className="av-skeleton mt-3 h-4 w-1/2" />
              <p className="caption mt-4">Working out how much feed you will need…</p>
            </div>
          )}
          {plan && <CyclePlan plan={plan} />}
          {!planning && !plan && !error && (
            <p className="caption">Could not work out the plan. You can still create the batch.</p>
          )}
        </>
      )}

      {step === 3 && (
        <div className="av-card p-0" role="radiogroup" aria-label="Pen">
          {PENS.map((p, i) => (
            <RadioRow
              key={p}
              label={p}
              hint="0 batches"
              checked={data.pen === p}
              onSelect={() => patch({ pen: p })}
              first={i === 0}
            />
          ))}
          <button
            type="button"
            onClick={() => patch({ pen: "new" })}
            className="flex w-full items-center gap-2 border-0 bg-transparent p-3.5 text-sm font-medium text-teal"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <Icon name="plus" size={16} /> Add a new pen
          </button>
        </div>
      )}
    </StepShell>
  );
}
