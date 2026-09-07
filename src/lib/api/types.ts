// Shapes the Django API returns. Kept separate from the UI's domain types so a
// change in the wire format is a change in one file.

export interface ApiUser {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  state: string;
  lga: string;
  display_name: string;
}

export interface ApiFarm {
  id: string;
  name: string;
  state: string;
  lga: string;
  location: string;
  pens: { id: string; name: string }[];
  role: "owner" | "manager" | "attendant" | "viewer" | null;
  created_at: string;
}

export interface ApiBirdType {
  id: string;
  code: "broiler" | "layer" | "cockerel" | "noiler" | "mixed";
  label: string;
  description: string;
  cycle_days: number;
  cycle_goal: string;
}

export interface ApiBatch {
  id: string;
  name: string;
  farm: string;
  pen: string | null;
  pen_name: string | null;
  bird_type: ApiBirdType["code"];
  breed: string | null;
  breed_name: string | null;
  started_on: string;
  stocked: number;
  cost_per_bird: string;
  transport_cost: string;
  supplier: string;
  status: "active" | "closed";
  closed_on: string | null;
  created_at: string;
}

/** Every figure here is derived server-side from the daily logs. */
export interface ApiMetrics {
  day_in_cycle: number;
  cycle_days: number;
  alive: number;
  deaths: number;
  mortality_pct: string;
  total_feed_kg: string;
  total_cost: string;
  cost_per_bird: string;
  average_weight_kg: string | null;
  feed_conversion: string | null;
  projected_revenue: string | null;
  projected_profit: string | null;
  optimal_sell_day: number | null;
  /** False means profit was still rising at the horizon — see the API README. */
  sell_window_peaks: boolean;
  logged_today: boolean;
  streak_days: number;
  sell_window: { day: number; weight_kg: string; projected_profit: string }[];
}

export interface ApiDailyLog {
  id: string;
  batch: string;
  logged_on: string;
  day_in_cycle: number;
  feed_kg: string;
  deaths: number;
  death_cause: string;
  health_activity: string;
  feed_cost: string;
  meds_cost: string;
  other_cost: string;
  total_cost: string;
  note: string;
  created_at: string;
}

export interface ApiAlert {
  id: string;
  kind: "error" | "warn" | "success" | "info";
  title: string;
  body: string;
  action: string;
  batch_id: string | null;
  batch_name: string | null;
}

export interface ApiVaccination {
  id: string;
  day: number;
  name: string;
  route: string;
  notes: string;
}

/** The one error envelope the API uses for everything. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export interface ApiBenchmark {
  /** "peers" once enough farms have closed a cycle, "industry" until then. */
  source: "peers" | "industry";
  peer_count: number;
  note: string;
  rows: {
    metric: string;
    value: string;
    p25: number;
    p50: number;
    p75: number;
    lower_is_better: boolean;
    beats_median: boolean;
  }[];
}

export interface ApiCostLine {
  category: string;
  amount: string;
  pct_of_revenue: string;
}

export interface ApiCycleReport {
  batch_id: string;
  name: string;
  breed: string;
  bird_type: string;
  started_on: string;
  closed_on: string | null;
  days: number;
  /** False means these figures are a projection, not money received. */
  is_closed: boolean;
  stocked: number;
  sold: number;
  mortality_pct: string;
  average_weight_kg: string | null;
  feed_conversion: string | null;
  revenue: string;
  costs: ApiCostLine[];
  total_cost: string;
  gross_profit: string;
  margin: string;
  cost_per_bird: string;
  revenue_per_bird: string;
  profit_per_bird: string;
  cost_per_kg: string | null;
  price_per_kg: string | null;
  insights: string[];
}

export interface ApiReports {
  period: string;
  cycles: ApiCycleReport[];
  totals: {
    revenue: string;
    total_cost: string;
    gross_profit: string;
    margin: string;
    birds_sold: number;
    closed_cycles: number;
  };
}

export interface ApiPhasePlan {
  name: string;
  day_from: number;
  day_to: number;
  starts_on: string;
  ends_on: string;
  days: number;
  grams_per_bird_start: number;
  grams_per_bird_end: number;
  total_kg: string;
  bags: string;
  estimated_cost: string;
  notes: string;
}

export interface ApiWeekPlan {
  week: number;
  day_from: number;
  day_to: number;
  starts_on: string;
  feed_name: string;
  total_kg: string;
  bags: string;
}

export interface ApiPlannedVaccination {
  day: number;
  due_on: string;
  name: string;
  route: string;
  notes: string;
}

export interface ApiCyclePlan {
  bird_type: string;
  bird_type_label: string;
  stocked: number;
  started_on: string;
  ends_on: string;
  cycle_days: number;
  cycle_goal: string;
  phases: ApiPhasePlan[];
  weeks: ApiWeekPlan[];
  vaccinations: ApiPlannedVaccination[];
  total_feed_kg: string;
  total_bags: string;
  feed_per_bird_kg: string;
  estimated_feed_cost: string;
  estimated_chick_cost: string;
  estimated_total_cost: string;
  estimated_cost_per_bird: string;
  feed_price_per_kg: string;
  /** These are projections. The UI must not present them as certainties. */
  caveat: string;
}

export interface ApiDueDose {
  day: number;
  due_on: string;
  name: string;
  route: string;
  notes: string;
}

/**
 * The cycle plan narrowed to one day, for the log screen.
 *
 * The feed fields are nullable: birds past the end of the feeding programme
 * still get a log screen, just without a target to compare against.
 */
export interface ApiDayGuidance {
  on: string;
  day: number;
  birds_alive: number;

  phase_name: string | null;
  grams_per_bird: number | null;
  expected_kg: string | null;
  expected_bags: string | null;
  low_kg: string | null;
  high_kg: string | null;

  next_phase_name: string | null;
  next_phase_starts_on: string | null;
  days_until_change: number | null;

  due_today: ApiDueDose[];
  due_soon: ApiDueDose[];

  /** A day's deaths at or above this is worth asking about. */
  deaths_watch_from: number;
  caveat: string;
}

export interface ApiPeriodBatchLine {
  id: string;
  name: string;
  bird_type: string;
  day: number;
  birds_alive: number;
  deaths: number;
  feed_kg: string;
  days_logged: number;
}

export interface ApiUpcoming {
  batch_name: string;
  day: number;
  due_on: string;
  what: string;
}

/** The farm over the last week or month, set against the window before it. */
export interface ApiPeriodReport {
  period: "week" | "month";
  label: string;
  starts_on: string;
  ends_on: string;
  days: number;

  days_logged: number;
  days_possible: number;
  active_batches: number;
  birds_alive: number;

  deaths: number;
  deaths_before: number;

  feed_kg: string;
  feed_bags: string;
  feed_before_kg: string;

  recorded_spend: string;
  revenue: string;
  /** False when no feed cost was recorded — the report says so rather than showing zero. */
  feed_cost_recorded: boolean;

  batches: ApiPeriodBatchLine[];
  upcoming: ApiUpcoming[];
  headline: string;
  notes: string[];
}

export interface ApiStatementLine {
  label: string;
  amount: string;
  pct_of_revenue: string;
}

export interface ApiBatchInPeriod {
  name: string;
  bird_type: string;
  started_on: string;
  stocked: number;
  sold: number;
  status: string;
}

/** A cash-basis income statement for a calendar period. */
export interface ApiIncomeStatement {
  farm_name: string;
  farm_location: string;
  prepared_on: string;
  starts_on: string;
  ends_on: string;

  revenue: string;
  revenue_lines: ApiStatementLine[];

  cost_lines: ApiStatementLine[];
  total_cost: string;

  gross_profit: string;
  margin: string;

  birds_sold: number;
  kg_sold: string;
  revenue_per_bird: string;
  cost_per_bird: string;
  profit_per_bird: string;
  price_per_kg: string | null;

  days_in_period: number;
  days_logged: number;
  feed_cost_recorded: boolean;

  batches: ApiBatchInPeriod[];
  /** How the statement was prepared, printed on its face. */
  basis: string[];
  /** What it does not show. Written for the lender, not the farmer. */
  limitations: string[];
}
