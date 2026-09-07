// Currency and number formatting.
// Spec: naira sign, non-breaking space, then the number — "₦ 1,240" never wraps.

const NBSP = " ";

const NUMBER = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });

export function fmtN(n: number | null | undefined): string {
  return n == null ? "—" : NUMBER.format(Math.round(n));
}

export function naira(n: number | null | undefined): string {
  return n == null ? "—" : `₦${NBSP}${fmtN(n)}`;
}

/** Compact naira for tiles and charts: ₦ 7.38M, ₦ 62k, ₦ 940. */
export function nairaShort(n: number | null | undefined): string {
  if (n == null) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1e6) {
    return `${sign}₦${NBSP}${(abs / 1e6).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (abs >= 1e5) return `${sign}₦${NBSP}${Math.round(abs / 1e3)}k`;
  return `${sign}₦${NBSP}${fmtN(abs)}`;
}

export { NBSP };

/**
 * A date range as a farmer would say it: "1 – 7 Sept", or "28 Aug – 3 Sept"
 * when the two ends fall in different months.
 */
export function dateRange(from: string, to: string): string {
  const a = new Date(`${from}T00:00:00`);
  const b = new Date(`${to}T00:00:00`);
  const day = (d: Date) => d.getDate();
  const month = (d: Date) => d.toLocaleDateString("en-NG", { month: "short" });

  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${day(a)} – ${day(b)} ${month(b)}`;
  }
  return `${day(a)} ${month(a)} – ${day(b)} ${month(b)}`;
}

/** A single date, short: "10 Sept". */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getDate()} ${d.toLocaleDateString("en-NG", { month: "short" })}`;
}
