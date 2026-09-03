import type { SellPoint } from "@/lib/types";

const W = 320;

/**
 * Profit-by-sell-day curve. Pure SVG with a viewBox — scales to any width with
 * no chart library and no client JS, which keeps the batch screen cheap on a
 * phone. The orange marker is the profit-maximising day.
 */
export function SellChart({
  data, optimalDay, height = 100,
}: { data: SellPoint[]; optimalDay: number; height?: number }) {
  if (!data.length) return null;

  const profits = data.map((d) => d.profit);
  const minY = Math.min(...profits);
  const maxY = Math.max(...profits);
  const span = Math.max(1, maxY - minY);

  const px = (i: number) => 8 + (i / (data.length - 1 || 1)) * (W - 16);
  const py = (v: number) => height - 12 - ((v - minY) / span) * (height - 24);

  const path = data
    .map((d, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(d.profit).toFixed(1)}`)
    .join(" ");
  const optIdx = data.findIndex((d) => d.day === optimalDay);

  // Unique per render so multiple charts on one page don't share a gradient id.
  const gradientId = `sell-gradient-${optimalDay}-${height}`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Projected profit by sell day, peaking on day ${optimalDay}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--av-teal)" stopOpacity=".24" />
          <stop offset="1" stopColor="var(--av-teal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${(W - 8).toFixed(1)} ${height - 12} L8 ${height - 12} Z`} fill={`url(#${gradientId})`} />
      <path d={path} fill="none" stroke="var(--av-teal)" strokeWidth="2" />
      {optIdx >= 0 && (
        <g>
          <line x1={px(optIdx)} x2={px(optIdx)} y1={6} y2={height - 12} stroke="var(--av-orange)" strokeDasharray="2 3" />
          <circle cx={px(optIdx)} cy={py(data[optIdx].profit)} r="5" fill="var(--av-orange)" />
        </g>
      )}
    </svg>
  );
}
