// Income statement periods.
//
// Calendar windows, not cycles. A lender asks what the farm earned between two
// dates; "last three batches" is not an answer they can compare with anything.
//
// The statement itself is built by the API, so that the figures a farmer hands
// to a bank come from the same records the app runs on and cannot drift from
// them.

export type Period = "this-month" | "last-month" | "this-year" | "12-mo";

export const PERIODS: { v: Period; label: string }[] = [
  { v: "this-month", label: "This month" },
  { v: "last-month", label: "Last month" },
  { v: "this-year", label: "This year" },
  { v: "12-mo", label: "Last 12 months" },
];

export function isPeriod(value: string): value is Period {
  return PERIODS.some((p) => p.v === value);
}
