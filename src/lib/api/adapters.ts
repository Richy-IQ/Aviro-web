import type { Batch, BatchStatus, BirdType } from "@/lib/types";

import type { ApiBatch, ApiMetrics } from "./types";

/**
 * Translate the API's shapes into the ones the screens already speak.
 *
 * The UI was built against a fixture model before the API existed. Adapting
 * here, rather than rewriting every component, keeps the wire format and the
 * view model free to move independently — and money arrives from Django as a
 * decimal string, which must not become a float on the way in.
 */

const num = (value: string | null): number | null => (value === null ? null : Number(value));

/**
 * Status is derived from the numbers rather than stored, so it can never
 * disagree with them.
 */
function statusFor(metrics: ApiMetrics): BatchStatus {
  const mortality = Number(metrics.mortality_pct);
  const fcr = num(metrics.feed_conversion);

  if (mortality > 7) return "needs-attention";
  if (fcr === null) return "on-track";
  if (fcr > 1.8) return "behind";
  if (fcr < 1.55) return "ahead";
  return "on-track";
}

export function toBatch(api: ApiBatch, metrics: ApiMetrics): Batch {
  return {
    id: api.id,
    name: api.name,
    breed: api.breed_name ?? "—",
    type: api.bird_type as BirdType,
    pen: api.pen_name ?? "",
    startDate: api.started_on,

    stocked: api.stocked,
    alive: metrics.alive,
    totalDeaths: metrics.deaths,
    mortPct: Number(metrics.mortality_pct),

    day: metrics.day_in_cycle,
    totalFeed: Number(metrics.total_feed_kg),
    totalCost: Number(metrics.total_cost),
    avgWeight: num(metrics.average_weight_kg) ?? 0,
    fcr: num(metrics.feed_conversion),
    costPerBird: Number(metrics.cost_per_bird),

    marketPricePerKg: 3200,
    projRevenue: num(metrics.projected_revenue) ?? 0,
    projProfit: num(metrics.projected_profit) ?? 0,
    optimalDay: metrics.optimal_sell_day ?? metrics.cycle_days,
    sellWindow: metrics.sell_window.map((p) => ({
      day: p.day,
      weight: Number(p.weight_kg),
      profit: Number(p.projected_profit),
    })),

    // The list endpoint does not carry day-by-day history; the batch screen
    // fetches it separately when it needs it.
    days: [],
    streak: metrics.streak_days,
    status: statusFor(metrics),
    loggedToday: metrics.logged_today,
  };
}
