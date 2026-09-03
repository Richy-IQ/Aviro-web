// The growing guide.
//
// Aviro's promise is that someone with no poultry experience can run a
// profitable batch. That only holds if the app says what to do today, what
// healthy looks like, and which signs mean act now. This module is that
// knowledge, keyed to the day in the cycle.
//
// Content follows standard commercial broiler practice and lines up with the
// vaccination schedule in farm-data.ts. It is general guidance, not veterinary
// advice — anything involving disease routes the farmer to a vet.

import { VAX } from "./farm-data";

export interface Warning {
  sign: string;
  meaning: string;
  action: string;
}

export interface Task {
  title: string;
  detail: string;
}

export interface Phase {
  id: string;
  name: string;
  dayFrom: number;
  dayTo: number;
  headline: string;
  /** Target house temperature at chick level. */
  temperature: string;
  feed: string;
  /** Light hours per day. */
  light: string;
  tasks: Task[];
  normal: string[];
  warnings: Warning[];
}

export const PHASES: Phase[] = [
  {
    id: "brooding",
    name: "Brooding",
    dayFrom: 1,
    dayTo: 7,
    headline: "The week that decides your cycle",
    temperature: "32–34°C at chick level, dropping about 1°C by day 7",
    feed: "Starter crumbs, always available",
    light: "23 hours light, 1 hour dark",
    tasks: [
      {
        title: "Heat the house before the chicks arrive",
        detail:
          "Switch on the brooder 24 hours early so the litter itself is warm, not just the air. Cold litter chills chicks through their feet and is the most common cause of first-week deaths.",
      },
      {
        title: "Give warm water with glucose on arrival",
        detail:
          "Chicks are dehydrated after transport. Warm water with glucose for the first 6 hours helps them find the drinkers and start eating.",
      },
      {
        title: "Check crop fill after 24 hours",
        detail:
          "Pick up 10 chicks at random and feel the crop. At least 9 of 10 should feel full and soft. If not, add more feeder trays and check the light reaches the feed.",
      },
      {
        title: "Read the chicks, not the thermometer",
        detail:
          "Spread evenly across the floor means the temperature is right. Huddled under the heat means too cold. Panting at the walls means too hot. Chicks are a better gauge than any thermometer.",
      },
    ],
    normal: [
      "1–2% of chicks lost across the whole first week",
      "Chicks spread evenly, active and noisy",
      "Litter stays dry and loose",
    ],
    warnings: [
      {
        sign: "Chicks huddling in a tight ball",
        meaning: "Too cold. They stop eating to conserve heat, and growth never fully recovers.",
        action: "Raise the temperature now and check for draughts at floor level.",
      },
      {
        sign: "More than 2% lost in the first three days",
        meaning: "Usually poor chick quality, chilling in transport, or the house was cold on arrival.",
        action: "Log it, call your supplier, and raise the brooder temperature.",
      },
      {
        sign: "Wet or caked litter",
        meaning: "Leaking drinkers or poor ventilation. Wet litter breeds coccidiosis.",
        action: "Fix the drinkers, remove the caked patches, add fresh dry bedding.",
      },
    ],
  },
  {
    id: "growing",
    name: "Growing",
    dayFrom: 8,
    dayTo: 21,
    headline: "Build the frame the meat will hang on",
    temperature: "Down about 3°C a week, reaching roughly 26°C by day 21",
    feed: "Starter to about day 14, then grower",
    light: "Around 18 hours light",
    tasks: [
      {
        title: "Change feed gradually, never overnight",
        detail:
          "Mix the new feed into the old over three days. A sudden switch upsets the gut and shows up as loose droppings and a wasted week of growth.",
      },
      {
        title: "Raise feeders and drinkers as the birds grow",
        detail:
          "Keep the lip level with the birds' backs. Too low and they walk in it and foul it; too high and the smaller birds stop drinking.",
      },
      {
        title: "Give the birds more floor as they grow",
        detail:
          "Aim for no more than 10–12 birds per square metre by the end. Crowding causes pecking, uneven growth and heat build-up.",
      },
      {
        title: "Keep the vaccination days",
        detail:
          "Gumboro and Newcastle fall in this window. A missed dose can cost the whole flock, and vaccine in warm or chlorinated water does nothing.",
      },
    ],
    normal: [
      "Under 0.1% lost per day",
      "Birds active and evenly sized",
      "Feed intake climbing every single day",
    ],
    warnings: [
      {
        sign: "Sneezing, rattling breath, or heads shaking",
        meaning: "Respiratory infection. Newcastle and infectious bronchitis both start this way.",
        action: "Call a vet the same day. Do not wait to see if it passes.",
      },
      {
        sign: "Blood or orange mucus in droppings",
        meaning: "Coccidiosis, usually from damp litter.",
        action: "Speak to a vet about treatment and get the litter dry.",
      },
      {
        sign: "Feed intake flat or falling",
        meaning: "Birds are sick, too hot, or out of water. Healthy growing birds eat more each day.",
        action: "Check water flow first, then temperature, then call a vet.",
      },
    ],
  },
  {
    id: "finishing",
    name: "Finishing",
    dayFrom: 22,
    dayTo: 35,
    headline: "Most of your feed money is spent here",
    temperature: "Around 21–24°C, with ventilation now more important than heat",
    feed: "Finisher from about day 29",
    light: "Around 18 hours light",
    tasks: [
      {
        title: "Ventilate hard, even when it feels cool to you",
        detail:
          "Big birds throw off heat and ammonia. If your eyes sting at bird level, the air is already damaging their lungs.",
      },
      {
        title: "Weigh a sample every week",
        detail:
          "Catch 10 birds from different corners, weigh them, take the average. This is the number that tells you when to sell, so guessing costs real money.",
      },
      {
        title: "Watch your feed conversion",
        detail:
          "This is where a good cycle separates from a poor one. If it is drifting above 1.8, something is wrong with feed, water or health.",
      },
      {
        title: "Start finding your buyer now",
        detail:
          "Do not wait until the birds are ready. Farmers who look for a buyer in the last week accept whatever price they are offered.",
      },
    ],
    normal: [
      "Feed conversion between 1.5 and 1.7",
      "Cumulative losses under 5%",
      "Birds heavy, calm and evenly grown",
    ],
    warnings: [
      {
        sign: "Birds panting with wings held away from the body",
        meaning: "Heat stress. In Nigerian afternoons this kills big birds quickly.",
        action: "Increase airflow, give cool fresh water, avoid handling until evening.",
      },
      {
        sign: "Healthy-looking big birds found dead on their backs",
        meaning: "Sudden death syndrome, linked to very fast growth.",
        action: "Log it. If it is more than a few birds, discuss slowing growth with a vet.",
      },
      {
        sign: "Lame birds sitting rather than walking",
        meaning: "Leg weakness from fast growth or wet litter.",
        action: "Dry the litter and cull birds that cannot reach feed and water.",
      },
    ],
  },
  {
    id: "market",
    name: "Selling",
    dayFrom: 36,
    dayTo: 49,
    headline: "Every extra day now has to pay for itself",
    temperature: "Around 21°C with maximum ventilation",
    feed: "Finisher, observing any withdrawal period",
    light: "Around 18 hours light",
    tasks: [
      {
        title: "Respect the drug withdrawal period",
        detail:
          "If the birds have had medication, do not sell before the withdrawal days on the label have passed. Selling early is unsafe and can lose you a buyer permanently.",
      },
      {
        title: "Weigh before you agree a price",
        detail:
          "Know your average weight and your cost per kilogram before you negotiate. Aviro shows both. Without them you are guessing against someone who is not.",
      },
      {
        title: "Sell on the day the numbers peak",
        detail:
          "Birds keep gaining weight, but they eat more to do it. After a point each extra day costs more in feed than it adds in value. Aviro marks that day for you.",
      },
      {
        title: "Take feed away before catching, not water",
        detail:
          "Empty crops travel better and reduce contamination. Leave the water until the birds are caught.",
      },
    ],
    normal: [
      "Average weight of 1.8–2.5kg depending on breed and market",
      "Total losses across the cycle under 5%",
      "Feed conversion at or under 1.7",
    ],
    warnings: [
      {
        sign: "Holding birds past the peak day hoping for a better price",
        meaning: "Feed cost keeps running while weight gain slows. This quietly erases profit.",
        action: "Compare the feed cost of waiting against the extra weight before you decide.",
      },
      {
        sign: "Only one buyer offering",
        meaning: "No competition means no negotiating power.",
        action: "Approach at least three buyers before you commit.",
      },
    ],
  },
];

export function phaseForDay(day: number): Phase {
  return PHASES.find((p) => day >= p.dayFrom && day <= p.dayTo) ?? PHASES[PHASES.length - 1];
}

export interface Focus {
  title: string;
  detail: string;
  kind: "vaccine" | "task" | "check";
}

/**
 * The two or three things that matter most today. Vaccination days always come
 * first — they are date-critical and cannot be made up later.
 */
export function todaysFocus(day: number): Focus[] {
  const out: Focus[] = [];
  const phase = phaseForDay(day);

  const vaxToday = VAX.find((v) => v.day === day);
  if (vaxToday) {
    out.push({
      kind: "vaccine",
      title: `${vaxToday.name} due today`,
      detail: `Give by ${vaxToday.route.toLowerCase()}. Missing the day costs you the protection.`,
    });
  }

  const vaxSoon = VAX.find((v) => v.day > day && v.day - day <= 3);
  if (vaxSoon && !vaxToday) {
    out.push({
      kind: "vaccine",
      title: `${vaxSoon.name} in ${vaxSoon.day - day} day${vaxSoon.day - day === 1 ? "" : "s"}`,
      detail: `Buy the vaccine now so you are not looking for it on day ${vaxSoon.day}.`,
    });
  }

  // Rotate the phase's tasks so the same advice is not shown every day.
  const task = phase.tasks[day % phase.tasks.length];
  out.push({ kind: "task", title: task.title, detail: task.detail });

  if (out.length < 3) {
    const warning = phase.warnings[day % phase.warnings.length];
    out.push({
      kind: "check",
      title: `Watch for: ${warning.sign.toLowerCase()}`,
      detail: warning.meaning,
    });
  }

  return out.slice(0, 3);
}
