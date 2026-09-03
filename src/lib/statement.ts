// Income statement model.
//
// Farmers need this for two audiences that judge them on paper: cooperatives
// and lenders. So it follows ordinary income-statement structure — revenue,
// cost of production, gross profit, margin — rather than the app's own
// dashboard vocabulary, and states unit economics per bird and per kg.

import { PAST_CYCLE } from "./farm-data";
import type { Batch } from "./types";

export type Period = "6-mo" | "12-mo" | "all";

export const PERIODS: { v: Period; label: string }[] = [
  { v: "6-mo", label: "Last 6 months" },
  { v: "12-mo", label: "Last 12 months" },
  { v: "all", label: "All time" },
];

export interface StatementLine {
  label: string;
  amount: number;
  /** Share of revenue, as a percentage. */
  pctOfRevenue: number;
}

export interface CycleStatement {
  name: string;
  breed: string;
  closed: boolean;
  birdsSold: number;
  avgWeight: number;
  revenue: number;
  costs: StatementLine[];
  totalCost: number;
  grossProfit: number;
  margin: number;
  costPerBird: number;
  revenuePerBird: number;
  profitPerBird: number;
  costPerKg: number;
}

export interface Statement {
  period: Period;
  periodLabel: string;
  generatedAt: string;
  farmName: string;
  farmerName: string;
  location: string;
  cycles: CycleStatement[];
  totals: {
    revenue: number;
    totalCost: number;
    grossProfit: number;
    margin: number;
    birdsSold: number;
  };
}

function line(label: string, amount: number, revenue: number): StatementLine {
  return {
    label,
    amount,
    pctOfRevenue: revenue ? +((amount / revenue) * 100).toFixed(1) : 0,
  };
}

/** A closed cycle, stated from its recorded sale. */
function fromClosedCycle(): CycleStatement {
  const c = PAST_CYCLE;
  const costs = c.breakdown.map((b) => line(b.k, b.v, c.revenue));
  const kg = c.sold * c.avgWeight;

  return {
    name: c.name,
    breed: c.breed,
    closed: true,
    birdsSold: c.sold,
    avgWeight: c.avgWeight,
    revenue: c.revenue,
    costs,
    totalCost: c.totalCost,
    grossProfit: c.grossProfit,
    margin: c.margin,
    costPerBird: c.costPerBird,
    revenuePerBird: Math.round(c.revenue / c.sold),
    profitPerBird: Math.round(c.grossProfit / c.sold),
    costPerKg: Math.round(c.totalCost / kg),
  };
}

/**
 * An open cycle is stated at projection, not at fact — costs are real to date,
 * revenue is what the birds would fetch today. Marked `closed: false` so the
 * report can label it as an estimate rather than let a lender read it as
 * booked income.
 */
function fromOpenBatch(batch: Batch): CycleStatement {
  const feed = batch.days.reduce((a, d) => a + d.feedCost, 0);
  const meds = batch.days.reduce((a, d) => a + d.medsCost, 0);
  const misc = batch.days.reduce((a, d) => a + d.miscCost, 0);
  const chicks = batch.stocked * 850;
  const revenue = batch.projRevenue;

  const costs = [
    line("Feed", feed, revenue),
    line("Chicks", chicks, revenue),
    line("Meds and vaccines", meds, revenue),
    line("Other", misc, revenue),
  ];

  const totalCost = feed + chicks + meds + misc;
  const grossProfit = revenue - totalCost;
  const kg = batch.alive * batch.avgWeight;

  return {
    name: batch.name,
    breed: batch.breed,
    closed: false,
    birdsSold: batch.alive,
    avgWeight: batch.avgWeight,
    revenue,
    costs,
    totalCost,
    grossProfit,
    margin: revenue ? +((grossProfit / revenue) * 100).toFixed(1) : 0,
    costPerBird: Math.round(totalCost / batch.alive),
    revenuePerBird: Math.round(revenue / batch.alive),
    profitPerBird: Math.round(grossProfit / batch.alive),
    costPerKg: Math.round(totalCost / kg),
  };
}

export function buildStatement(batch: Batch, period: Period, farm: {
  farmName: string;
  farmerName: string;
  location: string;
}): Statement {
  const cycles = [fromClosedCycle(), fromOpenBatch(batch)];

  const revenue = cycles.reduce((a, c) => a + c.revenue, 0);
  const totalCost = cycles.reduce((a, c) => a + c.totalCost, 0);
  const grossProfit = revenue - totalCost;

  return {
    period,
    periodLabel: PERIODS.find((p) => p.v === period)?.label ?? "",
    generatedAt: new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Lagos",
    }).format(new Date()),
    ...farm,
    cycles,
    totals: {
      revenue,
      totalCost,
      grossProfit,
      margin: revenue ? +((grossProfit / revenue) * 100).toFixed(1) : 0,
      birdsSold: cycles.reduce((a, c) => a + c.birdsSold, 0),
    },
  };
}
