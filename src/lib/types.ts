// Aviro domain types.
// These mirror what the Django API will serialize, so swapping fixtures for
// fetches later is a change of data source, not of shape.

export type BatchStatus = "on-track" | "ahead" | "behind" | "needs-attention";
export type BirdType = "broiler" | "layer" | "cockerel" | "noiler" | "mixed";
export type AlertKind = "error" | "warn" | "success" | "info";

/** One evening's log for a batch. */
export interface DayLog {
  day: number;
  feedKg: number;
  died: number;
  alive: number;
  feedCost: number;
  medsCost: number;
  miscCost: number;
  note: string;
}

/** A point on the sell-timing curve. */
export interface SellPoint {
  day: number;
  weight: number;
  profit: number;
}

export interface Batch {
  id: string;
  name: string;
  breed: string;
  type: BirdType;
  pen: string;
  startDate: string;
  stocked: number;
  alive: number;
  totalDeaths: number;
  mortPct: number;
  day: number;
  totalFeed: number;
  totalCost: number;
  avgWeight: number;
  /** Null until the birds have enough mass for the ratio to mean anything. */
  fcr: number | null;
  costPerBird: number;
  marketPricePerKg: number;
  projRevenue: number;
  projProfit: number;
  sellWindow: SellPoint[];
  optimalDay: number;
  days: DayLog[];
  streak: number;
  status: BatchStatus;
  loggedToday: boolean;
}

/** Summary shape for batches shown in a list but not fully loaded. */
export interface BatchSummary {
  id: string;
  name: string;
  breed: string;
  type: BirdType;
  day: number;
  stocked: number;
  alive: number;
  costPerBird: number;
  fcr: number | null;
  mortPct: number;
  status: BatchStatus;
}

export interface Farmer {
  first: string;
  last: string;
  phone: string;
  state: string;
  lga: string;
}

export interface Farm {
  name: string;
  location: string;
  primaryType: BirdType;
}

export interface FarmSnapshot {
  farmer: Farmer;
  farm: Farm;
  batches: [Batch, ...BatchSummary[]];
}

export interface Alert {
  id: string;
  kind: AlertKind;
  title: string;
  body: string;
  cta: string;
  time: string;
  batch: string | null;
}

export interface Vaccination {
  day: number;
  name: string;
  route: string;
}

export interface FeedPrice {
  market: string;
  starter: number;
  grower: number;
  finisher: number;
  trend: number;
}

export interface BenchmarkRow {
  metric: string;
  value: number;
  unit: string;
  p25: number;
  p50: number;
  p75: number;
  lowerIsBetter: boolean;
}

export interface CostLine {
  k: string;
  v: number;
}

export interface CycleReport {
  id: string;
  name: string;
  breed: string;
  stocked: number;
  sold: number;
  days: number;
  avgWeight: number;
  mortPct: number;
  fcr: number;
  revenue: number;
  breakdown: CostLine[];
  soldPricePerKg: number;
  insights: string[];
  totalCost: number;
  grossProfit: number;
  margin: number;
  costPerBird: number;
}
