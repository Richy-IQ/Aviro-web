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
