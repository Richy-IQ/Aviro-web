/**
 * The plan, on the log screen.
 *
 * A first-time farmer standing at the feed store has no idea whether two bags
 * is right for day twelve. Aviro does — it worked the whole cycle out before
 * the chicks arrived. These pieces put that number where the decision is made.
 *
 * Nothing here blocks. Birds eat less in the heat and more when they are
 * growing well, and a farmer who knows their flock is more often right than a
 * table. The app asks the question and lets them answer it.
 */

import { Icon } from "@/components/ui/icon";
import type { ApiDayGuidance, ApiDueDose } from "@/lib/api/types";
import type { Warning } from "@/lib/guide";

const KG_PER_BAG = 25;

/** Bags below one are meaningless to read. Under a bag, talk in kilograms. */
export function feedAmount(kg: number): string {
  const bags = kg / KG_PER_BAG;
  const kgText = `${kg.toLocaleString("en-NG", { maximumFractionDigits: 1 })} kg`;
  if (bags < 1) return kgText;
  return `${kgText} · about ${bags.toLocaleString("en-NG", { maximumFractionDigits: 1 })} bags`;
}

export interface Verdict {
  tone: "low" | "high";
  title: string;
  body: string;
}

/**
 * Compare what was entered against the day's target.
 *
 * Returns nothing for an ordinary day — an app that comments on every entry
 * teaches farmers to dismiss it without reading.
 */
export function feedVerdict(kg: number, guidance: ApiDayGuidance | null): Verdict | null {
  if (!guidance?.expected_kg || !guidance.low_kg || !guidance.high_kg) return null;
  if (kg <= 0) return null;

  const expected = Number(guidance.expected_kg);
  const low = Number(guidance.low_kg);
  const high = Number(guidance.high_kg);
  if (!expected) return null;

  const share = Math.round((kg / expected) * 100);

  if (kg < low) {
    return {
      tone: "low",
      title: `That is about ${share}% of what these birds should be eating today.`,
      body:
        "If that is really all they ate, check the drinkers first — birds stop eating when they cannot drink — then the temperature. If you meant a different number, go back and change it.",
    };
  }
  if (kg > high) {
    return {
      tone: "high",
      title: `That is about ${share}% of today's feed in one day.`,
      body:
        "If you filled the troughs for more than one day, log only what they actually ate — otherwise the feed conversion for this batch will read worse than the birds deserve.",
    };
  }
  return null;
}

/**
 * The day's context, in one line.
 *
 * Deliberately not a card with the number in it: the answer chip below already
 * says "8.7 kg — as planned", and repeating it pushed the only thing a farmer
 * came to tap below the fold.
 */
export function FeedTarget({ guidance }: { guidance: ApiDayGuidance | null }) {
  if (!guidance) return null;

  const changing =
    guidance.days_until_change !== null && guidance.days_until_change <= 3
      ? guidance.days_until_change
      : null;

  return (
    <div className="pt-1 pb-3">
      <p className="caption text-xs leading-[1.5]">
        Day {guidance.day}
        {guidance.phase_name ? ` · ${guidance.phase_name}` : ""}
        {guidance.grams_per_bird
          ? ` · about ${guidance.grams_per_bird}g each for ${guidance.birds_alive.toLocaleString("en-NG")} birds`
          : ""}
      </p>
      {changing !== null && (
        <p className="caption mt-1.5 text-xs leading-[1.5] text-warning-ink">
          Change to {guidance.next_phase_name} in {changing} {changing === 1 ? "day" : "days"} — mix
          it into the old feed over three days rather than switching at once.
        </p>
      )}
    </div>
  );
}

export function FeedNote({ verdict }: { verdict: Verdict }) {
  return (
    <div className="mt-4 rounded-metric bg-warning-soft p-3 text-[13px] text-warning-ink">
      <div className="mb-1 flex items-center gap-2 font-medium">
        <Icon name="alert" size={15} className="shrink-0" />
        {verdict.title}
      </div>
      <p className="leading-[1.5]">{verdict.body}</p>
    </div>
  );
}

export function DoseDue({ doses, soon }: { doses: ApiDueDose[]; soon: ApiDueDose[] }) {
  if (doses.length === 0 && soon.length === 0) return null;

  return (
    <div className="mb-4 rounded-card bg-orange-soft/40 p-3.5">
      {doses.length > 0 ? (
        <>
          <div className="label mb-1.5">Due today</div>
          {doses.map((d) => (
            <div key={d.name} className="mb-1 text-[15px] font-medium">
              {d.name} <span className="caption text-xs font-normal">· {d.route}</span>
            </div>
          ))}
          <div className="caption text-xs leading-[1.5]">
            Give it today and choose &ldquo;Gave a vaccine&rdquo; below so the record matches.
          </div>
        </>
      ) : (
        <>
          <div className="label mb-1.5">Coming up</div>
          {soon.map((d) => (
            <div key={d.name} className="text-[14px]">
              {d.name} on day {d.day}
              {d.route ? ` · ${d.route}` : ""}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/**
 * The signs worth checking when a farmer says the birds look sick.
 *
 * Shown at the moment they pick "disease symptoms" — the point where someone
 * with no experience knows something is wrong but not what to look at. Every
 * one of these ends with an action, and anything pointing at disease sends
 * them to a vet rather than to a remedy.
 */
export function SignsToCheck({ signs }: { signs: Warning[] }) {
  if (signs.length === 0) return null;

  return (
    <div className="mt-4 rounded-card border border-border bg-surface p-3.5">
      <div className="label mb-2">Check these before you leave the pen</div>
      <ul className="flex flex-col gap-3">
        {signs.map((w) => (
          <li key={w.sign}>
            <div className="text-[14px] font-medium">{w.sign}</div>
            <div className="caption mt-0.5 text-xs leading-[1.5]">{w.meaning}</div>
            <div className="mt-1 flex gap-1.5 text-xs leading-[1.5] text-teal">
              <Icon name="arrow" size={13} className="mt-0.5 shrink-0" />
              <span>{w.action}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="caption mt-3 border-t border-border pt-2.5 text-xs leading-[1.5]">
        Aviro cannot diagnose birds. If several are affected, call a vet the same day.
      </p>
    </div>
  );
}
