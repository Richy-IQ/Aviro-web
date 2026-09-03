// Aviro fixture data and derived metrics.
//
// Everything below is a faithful port of the design prototype's data.js. The
// derivations (FCR, mortality, cost per bird, sell window) are business rules
// that belong on the server — when the Django API lands, this module shrinks to
// typed fetches and these functions move to the backend verbatim.

import type {
  Alert,
  Batch,
  BenchmarkRow,
  BirdType,
  CycleReport,
  DayLog,
  FarmSnapshot,
  FeedPrice,
  SellPoint,
  Vaccination,
} from "./types";

// ───── Reference data ─────

export const BREEDS = [
  "Arbor Acres",
  "Cobb 500",
  "Ross 308",
  "ISA Brown",
  "Lohmann Brown",
  "Nera Black",
  "FUNAAB Alpha",
] as const;

export const BIRD_TYPES: { v: BirdType; label: string; sub: string }[] = [
  { v: "broiler", label: "Broilers", sub: "Meat · 6–8 wks" },
  { v: "layer", label: "Layers", sub: "Eggs · 72+ wks" },
  { v: "cockerel", label: "Cockerels", sub: "Local meat" },
  { v: "noiler", label: "Noilers", sub: "Dual purpose" },
  { v: "mixed", label: "Mixed", sub: "Multiple types" },
];

export const STATES = [
  "Oyo", "Lagos", "FCT (Abuja)", "Kano", "Kaduna",
  "Rivers", "Ogun", "Anambra", "Enugu", "Plateau",
] as const;

export const LGAS: Record<string, string[]> = {
  Oyo: ["Ibadan North", "Ibadan South-West", "Egbeda", "Akinyele", "Lagelu"],
  Lagos: ["Ikeja", "Alimosho", "Kosofe", "Eti-Osa", "Surulere"],
  "FCT (Abuja)": ["AMAC", "Bwari", "Gwagwalada", "Kuje", "Abaji"],
};

/** Standard broiler vaccination schedule. */
export const VAX: Vaccination[] = [
  { day: 1, name: "Marek + ND (HB1)", route: "Spray" },
  { day: 7, name: "Newcastle + IB", route: "Eye drop" },
  { day: 10, name: "Gumboro (IBD)", route: "Drinking water" },
  { day: 14, name: "Gumboro booster", route: "Drinking water" },
  { day: 21, name: "Newcastle (LaSota)", route: "Drinking water" },
  { day: 28, name: "Fowl pox", route: "Wing-stab" },
];

export const FEED_PRICES: FeedPrice[] = [
  { market: "Bodija, Ibadan", starter: 780, grower: 750, finisher: 720, trend: 4.2 },
  { market: "Mile 12, Lagos", starter: 790, grower: 745, finisher: 715, trend: 2.1 },
  { market: "Karu, Abuja", starter: 770, grower: 735, finisher: 710, trend: -0.5 },
  { market: "Aleshinloye, Ibadan", starter: 760, grower: 720, finisher: 695, trend: 1.0 },
  { market: "Sabongari, Kano", starter: 750, grower: 705, finisher: 685, trend: -1.8 },
  { market: "Mile 1, Port Harcourt", starter: 800, grower: 760, finisher: 730, trend: 5.4 },
];

const CHICK_COST = 850;
const FEED_COST_PER_KG = 720;
const MARKET_PRICE_PER_KG = 3200;
const VAX_DAYS = new Set([1, 7, 10, 14, 21, 28]);

/** Cobb 500 growth curve — kg at a given day in cycle. */
const weightAt = (d: number) => 0.042 + 0.00012 * d * d + 0.045 * d;

/**
 * Replay a batch day by day up to `day`, accumulating feed, deaths and cost.
 * Deterministic, so the same day always yields the same numbers.
 */
export function makeBatch(day: number): Batch {
  const stocked = 500;
  const days: DayLog[] = [];

  let alive = stocked;
  let totalFeed = 0;
  let totalCost = stocked * CHICK_COST;
  let totalDeaths = 0;

  for (let d = 1; d <= day; d++) {
    // Baseline mortality is highest in the brooding week, then settles.
    const baseMort = d <= 4 ? 0.004 : d <= 7 ? 0.002 : 0.0006;
    // Days 18–19 carry a disease spike the alerts key off.
    const spike = d === 18 ? 0.018 : d === 19 ? 0.012 : 0;
    const died = Math.max(0, Math.round(alive * (baseMort + spike) + (d % 3 === 0 ? 1 : 0)));
    alive -= died;
    totalDeaths += died;

    const gramsPerBird = 18 + (d - 1) * 3.5;
    const feedKg = (alive * gramsPerBird) / 1000;
    totalFeed += feedKg;
    const feedCost = feedKg * FEED_COST_PER_KG;

    const medsCost = VAX_DAYS.has(d) ? 4500 : d % 5 === 0 ? 900 : 0;
    const miscCost = d === 1 ? 6000 : d % 7 === 0 ? 1800 : 400;
    totalCost += feedCost + medsCost + miscCost;

    days.push({
      day: d,
      feedKg: +feedKg.toFixed(1),
      died,
      alive,
      feedCost: Math.round(feedCost),
      medsCost,
      miscCost,
      note:
        d === 18 ? "Sneezing in pen 2. Started Tylosin."
        : d === 19 ? "Mortality still up. Vet booked."
        : d === 14 ? "Gumboro booster in drinking water."
        : "",
    });
  }

  const avgWeight = +weightAt(day).toFixed(2);
  const totalLiveMass = alive * avgWeight;
  const fcr = totalLiveMass ? +(totalFeed / totalLiveMass).toFixed(2) : 0;
  const costPerBird = Math.round(totalCost / alive);
  const mortPct = +((totalDeaths / stocked) * 100).toFixed(1);

  const projRevenue = Math.round(alive * avgWeight * MARKET_PRICE_PER_KG);
  const projProfit = projRevenue - totalCost;

  // Project forward: each extra day adds weight but also feed cost. The peak of
  // that curve is the day worth selling on.
  const sellWindow: SellPoint[] = [];
  for (let d = Math.max(day, 28); d <= 49; d++) {
    const wt = weightAt(d);
    const revenue = alive * wt * MARKET_PRICE_PER_KG;
    const carryCost =
      totalCost +
      Math.max(0, d - day) * ((alive * (18 + (d - 1) * 3.5)) / 1000 * FEED_COST_PER_KG + 600);
    sellWindow.push({ day: d, weight: +wt.toFixed(2), profit: Math.round(revenue - carryCost) });
  }
  const optimalDay = sellWindow.reduce((a, b) => (b.profit > a.profit ? b : a), sellWindow[0]).day;

  return {
    id: "b-current",
    name: "Batch B",
    breed: "Cobb 500",
    type: "broiler",
    pen: "Pen 1 · Ibadan",
    startDate: "2026-04-28",
    stocked,
    alive,
    totalDeaths,
    mortPct,
    day,
    totalFeed: +totalFeed.toFixed(0),
    totalCost,
    avgWeight,
    fcr,
    costPerBird,
    marketPricePerKg: MARKET_PRICE_PER_KG,
    projRevenue,
    projProfit,
    sellWindow,
    optimalDay,
    days,
    streak: Math.min(day, 7),
    status:
      mortPct > 7 ? "needs-attention"
      : fcr > 1.8 ? "behind"
      : fcr < 1.55 ? "ahead"
      : "on-track",
    loggedToday: day >= 1,
  };
}

export function makeFarm(day: number): FarmSnapshot {
  return {
    farmer: {
      first: "Adamu",
      last: "Bello",
      phone: "+234 803 412 9087",
      state: "Oyo",
      lga: "Ibadan North",
    },
    farm: { name: "Adamu's Poultry", location: "Ibadan, Oyo", primaryType: "broiler" },
    batches: [
      makeBatch(day),
      {
        id: "b-young", name: "Batch C", breed: "Ross 308", type: "broiler", day: Math.min(8, day),
        stocked: 1000, alive: 990, costPerBird: 1240, fcr: 1.32, mortPct: 1.0, status: "ahead",
      },
      {
        id: "b-tiny", name: "Batch D", breed: "Arbor Acres", type: "broiler", day: Math.min(2, day),
        stocked: 300, alive: 293, costPerBird: 870, fcr: null, mortPct: 2.3, status: "on-track",
      },
    ],
  };
}

/** Alerts are derived from batch state, not stored — the day drives what shows. */
export function alertsForDay(b: Batch): Alert[] {
  const out: Alert[] = [];
  const d = b.day;

  if (d >= 18 && d <= 22) {
    out.push({
      id: "mort-spike", kind: "error",
      title: "Higher than usual deaths in Batch B",
      body: `${b.days[17]?.died ?? 0} birds died on day 18 and ${b.days[18]?.died ?? 0} on day 19. That's about 7 times normal. Likely Newcastle or coccidiosis — check with a vet today.`,
      cta: "Call a vet", time: "2h ago", batch: "Batch B",
    });
  }
  if (d >= 19 && d <= 24) {
    out.push({
      id: "vax-21", kind: "warn",
      title: "Newcastle (LaSota) vaccine due on day 21",
      body: "Add 20ml LaSota vaccine to 80L of cool drinking water before 8am. Withhold water for 30 minutes before so birds drink the lot in two hours.",
      cta: "Mark scheduled", time: "Today", batch: "Batch B",
    });
  }
  if (d >= 35) {
    out.push({
      id: "sell-window", kind: "success",
      title: "Best time to sell is opening up",
      body: `Sell on day ${b.optimalDay} for an estimated ₦${(b.projProfit / 1000).toFixed(0)}k profit. Each day after that loses about ₦${Math.round((b.projProfit * 0.012) / 1000)}k.`,
      cta: "See sell calculator", time: "Just now", batch: "Batch B",
    });
  }
  if (d >= 7) {
    out.push({
      id: "feed-price", kind: "warn",
      title: "Feed price went up 4.2% in Ibadan",
      body: "Cargill grower mash is now ₦750/kg at Bodija market. Three other mills are still ₦720.",
      cta: "See feed prices", time: "Yesterday", batch: null,
    });
  }
  if (d <= 3) {
    out.push({
      id: "welcome", kind: "info",
      title: "Welcome to your first cycle",
      body: "Log feed and any deaths every evening — even on quiet days. Two minutes is enough to keep your numbers honest.",
      cta: "Got it", time: "Today", batch: "Batch B",
    });
  }
  return out;
}

/** Percentile bands come from aggregated farms; `value` is this farm's number. */
export function benchmark(b: Batch): BenchmarkRow[] {
  return [
    { metric: "Feed conversion (FCR)", value: b.fcr, unit: "", p25: 1.42, p50: 1.55, p75: 1.68, lowerIsBetter: true },
    { metric: "Mortality", value: b.mortPct, unit: "%", p25: 3.2, p50: 4.8, p75: 7.1, lowerIsBetter: true },
    { metric: "Cost per bird", value: b.costPerBird, unit: "₦", p25: 1850, p50: 2100, p75: 2480, lowerIsBetter: true },
    { metric: "Average bird weight", value: b.avgWeight, unit: "kg", p25: 0.95, p50: 1.10, p75: 1.25, lowerIsBetter: false },
  ];
}

const PAST_BREAKDOWN = [
  { k: "Feed", v: 4180000 },
  { k: "Chicks", v: 850000 },
  { k: "Labor", v: 168000 },
  { k: "Transport", v: 75000 },
  { k: "Meds", v: 142000 },
  { k: "Other", v: 25000 },
];

const pastTotalCost = PAST_BREAKDOWN.reduce((a, b) => a + b.v, 0);
const pastRevenue = 7384000;
const pastGrossProfit = pastRevenue - pastTotalCost;

/** The most recently closed cycle, used by the Cycle Report screen. */
export const PAST_CYCLE: CycleReport = {
  id: "ba",
  name: "Batch A",
  breed: "Ross 308",
  stocked: 1000,
  sold: 942,
  days: 41,
  avgWeight: 2.45,
  mortPct: 5.8,
  fcr: 1.71,
  revenue: pastRevenue,
  breakdown: PAST_BREAKDOWN,
  soldPricePerKg: 3200,
  insights: [
    "Your feed cost per bird dropped 8% compared to last cycle.",
    "Mortality stayed flat at 5.8%, just above the median of 4.8%.",
    "You sold 3 days later than the optimal window — that cost about ₦62k.",
  ],
  totalCost: pastTotalCost,
  grossProfit: pastGrossProfit,
  margin: +((pastGrossProfit / pastRevenue) * 100).toFixed(1),
  costPerBird: Math.round(pastTotalCost / 942),
};
