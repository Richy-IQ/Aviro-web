"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { saveDailyLog } from "@/app/actions/farm";
import { enqueue } from "@/lib/offline/queue";
import { phaseForDay } from "@/lib/guide";
import type { ApiDayGuidance } from "@/lib/api/types";
import { Icon } from "@/components/ui/icon";
import { naira } from "@/lib/format";
import type { Batch } from "@/lib/types";
import { BigNumDisplay, NumPad } from "./numpad";
import { DoseDue, FeedNote, FeedTarget, SignsToCheck, feedAmount, feedVerdict } from "./day-guidance";

const KG_PER_BAG = 25;
const CAUSES = ["Sudden death", "Disease symptoms", "Predator", "Other"];

/** The API stores a code; the farmer picks a phrase. */
const CAUSE_CODES: Record<string, string> = {
  "Sudden death": "sudden",
  "Disease symptoms": "disease",
  Predator: "predator",
  Other: "other",
};

const HEALTH_OPTIONS = [
  { v: "none", label: "Nothing today" },
  { v: "vaccine", label: "Gave a vaccine" },
  { v: "medicine", label: "Gave medicine" },
  { v: "vet", label: "Vet visited" },
];

/** Most days are none, one or two. Anything past that is worth typing. */
const QUICK_DEATHS = [0, 1, 2, 3];

interface LogData {
  /** null until the farmer has actually answered. Never pre-filled. */
  feedKg: number | null;
  deaths: number;
  cause: string | null;
  health: string;
  expenses: string;
}

export function DailyLogFlow({
  batch,
  guidance,
}: {
  batch: Batch;
  /** Null when the plan could not be reached. The log still works without it. */
  guidance: ApiDayGuidance | null;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [data, setData] = useState<LogData>({
    feedKg: null,
    deaths: 0,
    cause: null,
    health: "none",
    expenses: "0",
  });

  // Which entry pad is open, if any. Only one at a time: this is a phone.
  const [entry, setEntry] = useState<null | "feed" | "deaths" | "expenses">(null);
  const [buffer, setBuffer] = useState("");
  const [unit, setUnit] = useState<"bags" | "kg">("bags");
  const [more, setMore] = useState(false);

  const patch = (p: Partial<LogData>) => setData((d) => ({ ...d, ...p }));

  const planned = guidance?.expected_kg ? Number(guidance.expected_kg) : null;
  const feedKg = data.feedKg;
  const verdict = feedKg === null ? null : feedVerdict(feedKg, guidance);
  // The husbandry phase, which is not the feed phase: brooding and heat stress
  // do not line up with starter and finisher.
  const signs = phaseForDay(batch.day, batch.type).warnings;
  const bufferKg = unit === "bags" ? (Number(buffer) || 0) * KG_PER_BAG : Number(buffer) || 0;

  function openEntry(which: "feed" | "deaths" | "expenses") {
    setEntry(which);
    setBuffer(which === "expenses" ? (data.expenses === "0" ? "" : data.expenses) : "");
  }

  function commitEntry() {
    if (entry === "feed") patch({ feedKg: bufferKg });
    if (entry === "deaths") patch({ deaths: Number(buffer) || 0 });
    if (entry === "expenses") patch({ expenses: buffer || "0" });
    setEntry(null);
    setBuffer("");
  }

  function save() {
    setError(null);
    if (feedKg === null) {
      setError("Tell us how much feed they got today.");
      return;
    }

    const loggedOn = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(
      new Date(),
    );
    const payload = {
      logged_on: loggedOn,
      feed_kg: String(feedKg),
      deaths: data.deaths,
      death_cause: data.cause ? (CAUSE_CODES[data.cause] ?? "other") : "",
      health_activity: data.health,
      other_cost: String(Number(data.expenses) || 0),
    };

    startTransition(async () => {
      // A farmer in a pen with no bars must not lose the entry they just made,
      // so an unreachable server means "keep it here", not "start again".
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        await queueIt(payload, loggedOn);
        return;
      }

      const result = await saveDailyLog(batch.id, payload);
      if (result.ok) {
        setSaved(true);
        router.refresh();
        return;
      }

      // Reaching the server and being told no is different from not reaching
      // it at all. Only the second is worth queueing.
      if (result.message?.includes("Could not reach")) {
        await queueIt(payload, loggedOn);
        return;
      }
      setError(result.message ?? "Could not save your log.");
    });
  }

  async function queueIt(payload: Record<string, unknown>, loggedOn: string) {
    try {
      await enqueue({ batchId: batch.id, batchName: batch.name, loggedOn, payload });
      setQueued(true);
      setSaved(true);
    } catch {
      setError("Could not save your log on this phone. Write the numbers down and try again.");
    }
  }

  if (saved) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-soft-mint text-teal">
          <Icon name="check" size={30} />
        </div>
        <h1 className="h2">{queued ? "Saved on this phone" : `Logged for day ${batch.day}`}</h1>
        <p className="caption mx-auto mt-2 max-w-[300px] leading-[1.55]">
          {(feedKg ?? 0).toLocaleString("en-NG")} kg of feed
          {data.deaths > 0
            ? ` and ${data.deaths} ${data.deaths === 1 ? "death" : "deaths"}`
            : ", no deaths"}{" "}
          {queued
            ? "kept here. It will send on its own when you have signal again."
            : `recorded. That's a ${batch.streak + 1} day streak.`}
        </p>
        <Link href={`/batches/${batch.id}`} className="av-btn primary mt-6">
          Back to {batch.name}
        </Link>
      </div>
    );
  }

  // ── The entry pad. Takes over the screen only while a number is being typed.
  if (entry) {
    const isFeed = entry === "feed";
    const isExpenses = entry === "expenses";
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col">
        <div className="px-4 pt-4">
          <h1 className="h1 mb-4 text-2xl">
            {isFeed ? "How much feed?" : isExpenses ? "How much did you spend?" : "How many died?"}
          </h1>
          {isFeed && (
            <div className="mb-4 flex rounded-[10px] bg-bg p-[3px]">
              {(["bags", "kg"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className="flex-1 rounded-lg px-2 py-2.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: unit === u ? "var(--surface)" : "transparent",
                    color: unit === u ? "var(--slate)" : "var(--muted)",
                    boxShadow: unit === u ? "var(--shadow-1)" : "none",
                  }}
                >
                  {u === "bags" ? "Bags (25kg)" : "Kilograms"}
                </button>
              ))}
            </div>
          )}
          <BigNumDisplay
            value={isExpenses ? naira(Number(buffer) || 0) : buffer || "0"}
            unit={isExpenses ? "" : isFeed ? unit : "birds"}
            sub={
              isFeed && buffer
                ? `≈ ${bufferKg.toLocaleString("en-NG")} kg today`
                : "Tap the keypad to enter"
            }
          />
          <NumPad value={buffer} onChange={setBuffer} decimal={isFeed} zeroKey={!isFeed} />
        </div>
        <div className="sticky bottom-0 mt-4 flex gap-2 border-t border-border bg-surface p-3 px-4">
          <button
            type="button"
            onClick={() => {
              setEntry(null);
              setBuffer("");
            }}
            className="av-btn ghost flex-1"
          >
            Cancel
          </button>
          <button type="button" onClick={commitEntry} className="av-btn primary flex-[2]">
            <Icon name="check" size={16} stroke={2} /> Use this
          </button>
        </div>
      </div>
    );
  }

  // ── The whole day, on one screen.
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pb-4">
      <div className="px-4 pt-4">
        <FeedTarget guidance={guidance} />
        {guidance && <DoseDue doses={guidance.due_today} soon={guidance.due_soon} />}

        <Section title="Feed today">
          {feedKg === null ? (
            <div className="flex flex-wrap gap-2">
              {planned !== null && (
                <button type="button" className="av-btn tertiary" onClick={() => patch({ feedKg: planned })}>
                  {feedAmount(planned)} — as planned
                </button>
              )}
              <button type="button" className="av-btn ghost" onClick={() => openEntry("feed")}>
                {planned !== null ? "A different amount" : "Enter the amount"}
              </button>
            </div>
          ) : (
            <Answer value={feedAmount(feedKg)} onChange={() => openEntry("feed")}>
              {`Cycle total ${(batch.totalFeed + feedKg).toLocaleString("en-NG")} kg`}
            </Answer>
          )}
          {verdict && <FeedNote verdict={verdict} />}
        </Section>

        <Section title="Birds lost today">
          <div className="flex flex-wrap gap-2">
            {QUICK_DEATHS.map((n) => (
              <button
                key={n}
                type="button"
                className="av-chip"
                aria-pressed={data.deaths === n}
                onClick={() => patch({ deaths: n, cause: n === 0 ? null : data.cause })}
              >
                {n === 0 ? "None" : n}
              </button>
            ))}
            <button
              type="button"
              className="av-chip"
              aria-pressed={data.deaths > 3}
              onClick={() => openEntry("deaths")}
            >
              {data.deaths > 3 ? `${data.deaths} birds` : "More"}
            </button>
          </div>

          {data.deaths > 0 && (
            <>
              <div className="label mt-4 mb-2">What happened?</div>
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
            </>
          )}

          {data.cause === "Disease symptoms" && <SignsToCheck signs={signs} />}
          {guidance &&
            data.deaths >= guidance.deaths_watch_from &&
            data.deaths <= batch.alive * 0.1 &&
            data.cause !== "Disease symptoms" && (
              <div className="mt-4 rounded-metric bg-warning-soft p-3 text-[13px] text-warning-ink">
                <div className="mb-1 flex items-center gap-2 font-medium">
                  <Icon name="alert" size={15} className="shrink-0" />
                  {data.deaths} in one day is more than a normal day for this flock.
                </div>
                <p className="leading-[1.5]">
                  One or two a day is ordinary. Several at once usually means heat, water, or
                  something starting. Walk the pen before you leave it.
                </p>
              </div>
            )}
          {data.deaths > batch.alive * 0.1 && (
            <div className="mt-4 flex gap-2 rounded-metric bg-error-soft p-3 text-[13px] text-error">
              <Icon name="alert" size={16} className="shrink-0" />
              <span>That&rsquo;s more than 10% of your flock. Call a vet today.</span>
            </div>
          )}
        </Section>

        {/* Folded away because most days have neither. Open it and it stays open. */}
        <button
          type="button"
          onClick={() => setMore((m) => !m)}
          className="mt-1 flex w-full items-center justify-between py-3 text-left"
        >
          <span className="label">Vaccine, medicine or other spending</span>
          <span className="flex items-center gap-1.5 text-[13px] text-teal">
            {more ? "Hide" : summarise(data)}
            <Icon
              name="chev-down"
              size={15}
              style={{ transform: more ? "rotate(180deg)" : undefined }}
            />
          </span>
        </button>

        {more && (
          <div className="pb-2">
            <div className="flex flex-col gap-2">
              {HEALTH_OPTIONS.map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => patch({ health: o.v })}
                  className="flex items-center gap-3 rounded-card border p-3 text-left text-[15px]"
                  style={{
                    borderColor: data.health === o.v ? "var(--av-teal)" : "var(--border)",
                    background: data.health === o.v ? "var(--av-teal-haze)" : "var(--surface)",
                    borderWidth: data.health === o.v ? 1.5 : 1,
                  }}
                >
                  <span className="flex-1">{o.label}</span>
                  {data.health === o.v && (
                    <Icon name="check" size={18} style={{ color: "var(--av-teal)" }} />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <Answer value={naira(Number(data.expenses) || 0)} onChange={() => openEntry("expenses")}>
                Water, labour, transport, anything else
              </Answer>
            </div>
          </div>
        )}

        {error && <p className="av-err">{error}</p>}
      </div>

      <div className="sticky bottom-0 mt-3 border-t border-border bg-surface p-3 px-4">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="av-btn primary full"
        >
          <Icon name="check" size={16} stroke={2} />
          {pending ? "Saving…" : `Save day ${batch.day}`}
        </button>
      </div>
    </div>
  );
}

/** What the folded section holds, so nobody has to open it to find out. */
function summarise(data: LogData): string {
  const bits: string[] = [];
  if (data.health !== "none") bits.push(HEALTH_OPTIONS.find((h) => h.v === data.health)!.label);
  if (Number(data.expenses) > 0) bits.push(naira(Number(data.expenses)));
  return bits.length ? bits.join(" · ") : "None";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-4 first:border-t-0">
      <div className="label mb-2.5">{title}</div>
      {children}
    </div>
  );
}

function Answer({
  value,
  children,
  onChange,
}: {
  value: string;
  children?: React.ReactNode;
  onChange: () => void;
}) {
  return (
    <div className="av-card flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="num text-lg font-medium">{value}</div>
        {children && <div className="caption mt-0.5 text-xs">{children}</div>}
      </div>
      <button type="button" onClick={onChange} className="av-btn ghost sm">
        Change
      </button>
    </div>
  );
}
