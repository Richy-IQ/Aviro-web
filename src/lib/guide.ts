// The growing guide.
//
// Aviro's promise is that someone with no poultry experience can run a
// profitable flock. That only holds if the app says what to do today, what
// healthy looks like, and which signs mean act now.
//
// Guidance is keyed to bird type, because the birds are not the same job.
// A broiler is finished in six weeks; a layer is five months of rearing
// before it earns anything, then more than a year of production. Advice that
// treats them alike would be wrong for both.
//
// Content follows standard commercial practice for Nigerian conditions. It is
// general guidance, not veterinary advice — anything pointing to disease
// routes the farmer to a vet.

import type { BirdType } from "./types";

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
  temperature: string;
  feed: string;
  light: string;
  tasks: Task[];
  normal: string[];
  warnings: Warning[];
}

export interface BirdGuide {
  type: BirdType;
  label: string;
  /** Days to the milestone the farmer is working towards. */
  cycleDays: number;
  /** What that milestone is, in the farmer's words. */
  cycleGoal: string;
  summary: string;
  /** The one number that decides whether this bird makes money. */
  keyMetric: string;
  phases: Phase[];
}

// ─────────────────────────── Broilers ───────────────────────────

const BROILER_PHASES: Phase[] = [
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
          "Spread evenly across the floor means the temperature is right. Huddled under the heat means too cold. Panting at the walls means too hot.",
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
        meaning: "Usually poor chick quality, chilling in transport, or a cold house on arrival.",
        action: "Log it, call your supplier, and raise the brooder temperature.",
      },
      {
        sign: "Wet or caked litter",
        meaning: "Leaking drinkers or poor ventilation. Wet litter breeds coccidiosis.",
        action: "Fix the drinkers, remove caked patches, add fresh dry bedding.",
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
          "This is where a good cycle separates from a poor one. If it drifts above 1.8, check feed, water and health.",
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
          "Know your average weight and your cost per kilogram before you negotiate. Aviro shows both.",
      },
      {
        title: "Sell on the day the numbers peak",
        detail:
          "Birds keep gaining weight, but they eat more to do it. After a point each extra day costs more in feed than it adds in value.",
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

// ─────────────────────────── Layers ───────────────────────────

const LAYER_PHASES: Phase[] = [
  {
    id: "brooding",
    name: "Brooding",
    dayFrom: 1,
    dayTo: 28,
    headline: "Four weeks of warmth, not one",
    temperature: "33–35°C on day one, down about 3°C a week to roughly 24°C",
    feed: "Chick mash, always available",
    light: "22–23 hours in week one, easing to about 16",
    tasks: [
      {
        title: "Brood layers longer than broilers",
        detail:
          "Layer chicks are smaller and feather more slowly, so they need heat for about four weeks rather than two. Pulling the heat early stunts them permanently.",
      },
      {
        title: "Check crop fill after 24 hours",
        detail:
          "Pick up 10 chicks at random and feel the crop. At least 9 of 10 should feel full and soft.",
      },
      {
        title: "Keep the vaccination programme exactly",
        detail:
          "Layers live more than a year, so they carry a longer vaccination list than broilers. A gap now shows up as disease months later.",
      },
      {
        title: "Start weighing weekly from week two",
        detail:
          "Body weight at this age predicts how well she will lay. Weigh the same 20 birds each week and track the average.",
      },
    ],
    normal: [
      "Under 2% lost across the four weeks",
      "Chicks evenly spread and active",
      "Body weight tracking the breed's chart",
    ],
    warnings: [
      {
        sign: "Chicks huddling in a tight ball",
        meaning: "Too cold. Layer chicks chill faster than broilers.",
        action: "Raise the temperature and check for draughts at floor level.",
      },
      {
        sign: "Body weight already behind the breed chart",
        meaning: "Underweight pullets never catch up, and they lay late and lay small.",
        action: "Check feeder space and feed quality now, while it can still be corrected.",
      },
    ],
  },
  {
    id: "rearing",
    name: "Rearing",
    dayFrom: 29,
    dayTo: 112,
    headline: "You are building a bird, not selling one",
    temperature: "Ambient, with good ventilation and no draughts",
    feed: "Grower to about week 8, then developer",
    light: "Around 12 hours — do not increase it yet",
    tasks: [
      {
        title: "Chase uniformity, not just average weight",
        detail:
          "Weigh 20 birds weekly. If more than about a fifth sit outside 10% of the average, the flock will come into lay raggedly and peak lower.",
      },
      {
        title: "Keep light hours constant or falling",
        detail:
          "Increasing light during rearing brings pullets into lay too early, before their frame is ready. Small eggs and prolapse follow.",
      },
      {
        title: "Give every bird feeder space",
        detail:
          "Uneven flocks are almost always a feeder-space problem. Shy birds simply never reach the trough.",
      },
      {
        title: "Deworm and watch for external parasites",
        detail:
          "Worms and mites quietly hold back growth in this stretch and are cheap to prevent.",
      },
    ],
    normal: [
      "Under 3% lost across the whole rearing period",
      "At least 80% of birds within 10% of the average weight",
      "Birds alert, well feathered and on the breed's weight curve",
    ],
    warnings: [
      {
        sign: "A wide spread between the biggest and smallest birds",
        meaning: "Uneven flocks peak lower and hold peak for less time.",
        action: "Add feeder space, and consider grading the small birds into their own pen.",
      },
      {
        sign: "Pale combs and dull feathers",
        meaning: "Often worms, mites or a feed shortfall.",
        action: "Deworm, check for mites at night, and review feed quality.",
      },
    ],
  },
  {
    id: "prelay",
    name: "Point of lay",
    dayFrom: 113,
    dayTo: 140,
    headline: "Get the calcium and the light right",
    temperature: "Ambient, kept as steady as you can",
    feed: "Switch to layer feed at about week 17, or when the first eggs appear",
    light: "Increase gradually to about 16 hours",
    tasks: [
      {
        title: "Move to layer feed before she lays, not after",
        detail:
          "Layer feed carries the calcium she needs for shells. On grower feed she pulls calcium from her own bones instead.",
      },
      {
        title: "Increase light gradually",
        detail:
          "Add about half an hour a week to reach roughly 16 hours. A sudden jump shocks the flock.",
      },
      {
        title: "Have the nest boxes in before the first egg",
        detail:
          "One box for every four or five hens, dark and quiet. Hens that learn to lay on the floor keep doing it, and floor eggs get dirty and broken.",
      },
      {
        title: "Offer grit or oyster shell separately",
        detail: "It lets each hen take the extra calcium she needs for strong shells.",
      },
    ],
    normal: [
      "First eggs at about 18–20 weeks",
      "Early eggs small — this is normal and passes",
      "Production climbing quickly once it starts",
    ],
    warnings: [
      {
        sign: "Eggs on the floor rather than in the boxes",
        meaning: "Nest boxes went in too late, or they are too bright or too few.",
        action: "Add boxes, darken them, and collect floor eggs often until the habit breaks.",
      },
      {
        sign: "Soft or thin shells",
        meaning: "Not enough calcium, or she is still on grower feed.",
        action: "Move to layer feed and offer oyster shell free choice.",
      },
      {
        sign: "Prolapse in young hens",
        meaning: "Usually lay started too early for the bird's frame, often from too much light.",
        action: "Separate affected birds and review your lighting programme with a vet.",
      },
    ],
  },
  {
    id: "laying",
    name: "In lay",
    dayFrom: 141,
    dayTo: 560,
    headline: "Hold the peak as long as you can",
    temperature: "Ambient, with strong ventilation — heat cuts production fast",
    feed: "Layer feed, roughly 110–125g per hen per day",
    light: "A steady 16 hours; never reduce it",
    tasks: [
      {
        title: "Record eggs every single day",
        detail:
          "Hen-day production is the number that decides whether this flock pays. A quiet slide of a few percent is invisible without the daily count.",
      },
      {
        title: "Collect eggs at least twice a day",
        detail:
          "Eggs left in the nest get dirty, cracked or eaten, and hens that learn to eat eggs are hard to stop.",
      },
      {
        title: "Never cut the light hours",
        detail:
          "Shortening day length tells a hen the season is ending and she will stop laying. Keep it steady, including during power cuts.",
      },
      {
        title: "Keep water cool and always flowing",
        detail:
          "A hen drinks about twice what she eats. An afternoon without water costs you eggs for days afterwards.",
      },
    ],
    normal: [
      "Peak of 90–95% hen-day production at about 26–32 weeks",
      "A slow decline of roughly half a percent a week after peak",
      "Under 1% of the flock lost per month",
    ],
    warnings: [
      {
        sign: "Production falling more than about 2% in a week",
        meaning: "Disease, heat, a feed change, or a water problem. Healthy flocks decline slowly.",
        action: "Check water and feed first, then call a vet.",
      },
      {
        sign: "Pale yolks or thin shells appearing",
        meaning: "Feed quality has slipped, or calcium is short.",
        action: "Review your feed source and offer oyster shell free choice.",
      },
      {
        sign: "Hens panting in the afternoon",
        meaning: "Heat stress. Production and shell quality both drop within days.",
        action: "Increase airflow, give cool water, and feed in the cooler hours.",
      },
    ],
  },
  {
    id: "spent",
    name: "End of lay",
    dayFrom: 561,
    dayTo: 700,
    headline: "Know when she costs more than she earns",
    temperature: "Ambient",
    feed: "Layer feed until the day they go",
    light: "16 hours to the end",
    tasks: [
      {
        title: "Compare feed cost against egg income monthly",
        detail:
          "Once a hen's feed costs more than the eggs she lays, every extra week is a loss. Aviro shows you the crossing point.",
      },
      {
        title: "Plan the replacement flock early",
        detail:
          "Point-of-lay pullets take five months to raise. Start the next batch well before this one is spent or you will have months with no income.",
      },
      {
        title: "Sell spent hens as a batch",
        detail:
          "There is a real market for old layers. Selling them together usually beats selling them a few at a time.",
      },
    ],
    normal: [
      "Production down to around 60–65% by 72 weeks",
      "Most flocks sold between 72 and 80 weeks",
    ],
    warnings: [
      {
        sign: "Keeping hens because they still lay a little",
        meaning: "A hen at 50% production usually eats more than her eggs are worth.",
        action: "Check the numbers rather than the feeling, and sell when they cross.",
      },
    ],
  },
];

// ─────────────────────────── Cockerels ───────────────────────────

const COCKEREL_PHASES: Phase[] = [
  {
    id: "brooding",
    name: "Brooding",
    dayFrom: 1,
    dayTo: 21,
    headline: "Slower birds, longer brooding",
    temperature: "33–34°C on day one, down about 3°C a week",
    feed: "Chick mash",
    light: "About 18 hours",
    tasks: [
      {
        title: "Expect a longer brooding period than broilers",
        detail:
          "Cockerels feather and grow more slowly, so they need heat for around three weeks.",
      },
      {
        title: "Vaccinate as you would any chick",
        detail:
          "Hardiness is not immunity. Newcastle in particular will still take a cockerel flock.",
      },
      {
        title: "Do not overfeed expensive feed early",
        detail:
          "Cockerels convert feed less efficiently than broilers. Their profit comes from cheap gain over a long run, not fast gain.",
      },
    ],
    normal: ["Under 3% lost in the first three weeks", "Birds active and alert"],
    warnings: [
      {
        sign: "Chicks huddling",
        meaning: "Too cold.",
        action: "Raise the temperature and check for draughts.",
      },
    ],
  },
  {
    id: "growing",
    name: "Growing",
    dayFrom: 22,
    dayTo: 84,
    headline: "Cheap gain over a long run",
    temperature: "Ambient",
    feed: "Grower feed, and forage if you have the space",
    light: "Natural daylight is enough",
    tasks: [
      {
        title: "Use cheaper feed and let them forage",
        detail:
          "Cockerels tolerate lower-energy feed than broilers. Cutting feed cost matters more here than pushing growth.",
      },
      {
        title: "Give them room and watch for fighting",
        detail:
          "All-male flocks fight when crowded. Space and enough feeder length keep it down.",
      },
      {
        title: "Time them for the festive market",
        detail:
          "Cockerel prices rise sharply around Christmas, Easter and Sallah. Count backwards from the date and stock accordingly.",
      },
    ],
    normal: [
      "Steady but slow weight gain",
      "Feed conversion around 2.5–3.5, well above a broiler's",
      "Total losses under 8%",
    ],
    warnings: [
      {
        sign: "Torn combs and bleeding backs",
        meaning: "Fighting from crowding or too little feeder space.",
        action: "Reduce density, add feeders, and separate persistent aggressors.",
      },
    ],
  },
  {
    id: "market",
    name: "Selling",
    dayFrom: 85,
    dayTo: 140,
    headline: "Sell into the season, not into a hurry",
    temperature: "Ambient",
    feed: "Grower or finisher, observing any withdrawal period",
    light: "Natural daylight",
    tasks: [
      {
        title: "Hold for the festive premium when it is close",
        detail:
          "Unlike broilers, cockerels gain slowly and cost little to hold. Waiting two weeks for a festive price often pays.",
      },
      {
        title: "Weigh before you price",
        detail: "Know your cost per bird and your average weight before you negotiate.",
      },
    ],
    normal: ["1.5–2.5kg live weight at 12–20 weeks", "Strong demand around festive periods"],
    warnings: [
      {
        sign: "Feeding heavily with no seasonal price in sight",
        meaning: "Slow-growing birds on expensive feed lose money quietly.",
        action: "Compare feed cost to weight gain monthly and sell when they cross.",
      },
    ],
  },
];

// ─────────────────────────── Noilers ───────────────────────────

const NOILER_PHASES: Phase[] = [
  {
    id: "brooding",
    name: "Brooding",
    dayFrom: 1,
    dayTo: 21,
    headline: "Hardy, but still needs a warm start",
    temperature: "33–34°C on day one, down about 3°C a week",
    feed: "Chick mash",
    light: "About 18 hours",
    tasks: [
      {
        title: "Brood for about three weeks",
        detail: "Noilers feather faster than layers but slower than broilers.",
      },
      {
        title: "Decide early: meat or eggs",
        detail:
          "Noilers do both, but the feeding differs. Choosing at the start avoids paying for the wrong feed for months.",
      },
      { title: "Vaccinate fully", detail: "Hardiness reduces losses; it does not replace vaccines." },
    ],
    normal: ["Under 3% lost in the first three weeks", "Fast, even feathering"],
    warnings: [
      {
        sign: "Chicks huddling",
        meaning: "Too cold.",
        action: "Raise the temperature and check for draughts.",
      },
    ],
  },
  {
    id: "growing",
    name: "Growing",
    dayFrom: 22,
    dayTo: 84,
    headline: "The bird that forages for part of its own feed",
    temperature: "Ambient",
    feed: "Grower feed, supplemented by forage where possible",
    light: "Natural daylight",
    tasks: [
      {
        title: "Let them range if you safely can",
        detail:
          "Noilers forage well, and that directly cuts your biggest cost. Secure the range against predators and thieves first.",
      },
      {
        title: "Keep feeding them even when they range",
        detail:
          "Forage supplements feed, it does not replace it. Birds left to scavenge alone grow slowly and lay poorly.",
      },
      {
        title: "Watch the weight if you are selling for meat",
        detail: "Most noilers reach a saleable 1.5–2kg somewhere between 12 and 14 weeks.",
      },
    ],
    normal: [
      "1.5–2kg by 12–14 weeks on good feeding",
      "Lower feed cost per bird than a broiler",
      "Total losses under 6%",
    ],
    warnings: [
      {
        sign: "Birds thin despite plenty of range",
        meaning: "Forage alone is not enough, or worms are taking the benefit.",
        action: "Increase supplementary feed and deworm.",
      },
      {
        sign: "Birds disappearing rather than dying",
        meaning: "Predators or theft from the range.",
        action: "Secure the perimeter and house them at night.",
      },
    ],
  },
  {
    id: "dual",
    name: "Meat or eggs",
    dayFrom: 85,
    dayTo: 220,
    headline: "Sell the cockerels, keep the hens laying",
    temperature: "Ambient",
    feed: "Finisher for meat birds; layer feed for hens you keep",
    light: "16 hours for hens you are keeping for eggs",
    tasks: [
      {
        title: "Sell the males, keep the females",
        detail:
          "The usual pattern: males go for meat from about 14 weeks, females stay and start laying at around 24 weeks.",
      },
      {
        title: "Move retained hens onto layer feed",
        detail: "They need the calcium before the first egg, exactly as a commercial layer does.",
      },
      {
        title: "Expect fewer eggs than a commercial layer",
        detail:
          "Around 150–180 eggs a year against 300 from an ISA Brown — but on cheaper feed and with a hardier bird.",
      },
    ],
    normal: [
      "Males sold at 1.8–2.5kg from about 14 weeks",
      "Hens starting to lay at around 24 weeks",
      "150–180 eggs per hen per year",
    ],
    warnings: [
      {
        sign: "Keeping every bird because they are dual purpose",
        meaning: "Males eat layer feed and never lay. They are pure cost after 14 weeks.",
        action: "Sell the males on time and keep only the hens.",
      },
    ],
  },
];

// ─────────────────────────── Registry ───────────────────────────

export const GUIDES: Record<Exclude<BirdType, "mixed">, BirdGuide> = {
  broiler: {
    type: "broiler",
    label: "Broilers",
    cycleDays: 42,
    cycleGoal: "to market",
    summary:
      "Six weeks from chick to sale. Fast, feed-hungry and unforgiving — most of the money is decided in the first week and the last.",
    keyMetric: "Feed conversion. Feed is about two thirds of what the cycle costs you.",
    phases: BROILER_PHASES,
  },
  layer: {
    type: "layer",
    label: "Layers",
    cycleDays: 140,
    cycleGoal: "to first egg",
    summary:
      "Five months of rearing before a single egg, then more than a year of production. The money is made by holding peak lay, and lost by rearing uneven pullets.",
    keyMetric: "Hen-day production. The share of your hens laying on any given day.",
    phases: LAYER_PHASES,
  },
  cockerel: {
    type: "cockerel",
    label: "Cockerels",
    cycleDays: 112,
    cycleGoal: "to market",
    summary:
      "Slow-growing and hardy, raised for the local market. Profit comes from cheap feed over a long run and from selling into festive demand.",
    keyMetric: "Cost per bird. Growth is slow, so feed cost is what you control.",
    phases: COCKEREL_PHASES,
  },
  noiler: {
    type: "noiler",
    label: "Noilers",
    cycleDays: 98,
    cycleGoal: "to market weight",
    summary:
      "Dual purpose and hardy. Males sell for meat from about 14 weeks; females lay 150–180 eggs a year on cheaper feed than a commercial layer.",
    keyMetric: "Cost per bird, and eggs per hen if you keep the females.",
    phases: NOILER_PHASES,
  },
};

export const GUIDE_TYPES = Object.keys(GUIDES) as Exclude<BirdType, "mixed">[];

/** Mixed flocks follow the guide for whichever birds a batch actually holds. */
export function guideFor(type: BirdType): BirdGuide {
  return type === "mixed" ? GUIDES.broiler : GUIDES[type];
}

export function cycleDaysFor(type: BirdType): number {
  return guideFor(type).cycleDays;
}

export function phaseForDay(day: number, type: BirdType = "broiler"): Phase {
  const { phases } = guideFor(type);
  return phases.find((p) => day >= p.dayFrom && day <= p.dayTo) ?? phases[phases.length - 1];
}

export interface Focus {
  title: string;
  detail: string;
  kind: "vaccine" | "task" | "check";
  href?: string;
}

/** The actionable opening line — the card shows this, the guide shows the rest. */
function firstSentence(text: string): string {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

/**
 * The two or three things that matter today. Vaccination days come first when
 * the bird type has a schedule — they are date-critical and cannot be made up.
 */
export function todaysFocus(day: number, type: BirdType = "broiler", vax: { day: number; name: string; route: string }[] = []): Focus[] {
  const out: Focus[] = [];
  const phase = phaseForDay(day, type);

  const vaxToday = vax.find((v) => v.day === day);
  if (vaxToday) {
    out.push({
      kind: "vaccine",
      title: `${vaxToday.name} due today`,
      detail: `Give by ${vaxToday.route.toLowerCase()}.`,
      href: "/vaccinations",
    });
  }

  const vaxSoon = vax.find((v) => v.day > day && v.day - day <= 3);
  if (vaxSoon && !vaxToday) {
    const days = vaxSoon.day - day;
    out.push({
      kind: "vaccine",
      title: `${vaxSoon.name} in ${days} day${days === 1 ? "" : "s"}`,
      detail: "Buy the vaccine now.",
      href: "/vaccinations",
    });
  }

  // Rotate the phase's tasks so the same advice is not shown every day.
  const task = phase.tasks[day % phase.tasks.length];
  out.push({ kind: "task", title: task.title, detail: firstSentence(task.detail), href: "/guide" });

  if (out.length < 3 && phase.warnings.length) {
    const warning = phase.warnings[day % phase.warnings.length];
    out.push({
      kind: "check",
      title: `Watch for: ${warning.sign.toLowerCase()}`,
      detail: firstSentence(warning.meaning),
      href: "/guide",
    });
  }

  return out.slice(0, 3);
}
