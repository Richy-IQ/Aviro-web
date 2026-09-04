import type { BirdGuide } from "@/lib/guide";

const H = 76;
const PAD = 2;

// Phases are tinted along one scale so the eye reads them as a sequence
// rather than as unrelated categories.
const TINTS = [
  "var(--av-teal)",
  "color-mix(in srgb, var(--av-teal) 72%, white)",
  "color-mix(in srgb, var(--av-teal) 48%, white)",
  "color-mix(in srgb, var(--av-teal) 30%, white)",
  "color-mix(in srgb, var(--av-teal) 18%, white)",
];

/**
 * The whole cycle in one band. A first-time farmer can see how long the job
 * is, how the stages divide it, and where today falls — which is the question
 * a list of sections cannot answer at a glance.
 *
 * Inline SVG, so it costs no image request, scales to any width and follows
 * the theme.
 */
export function CycleTimeline({ guide, currentDay }: { guide: BirdGuide; currentDay?: number }) {
  const last = guide.phases[guide.phases.length - 1];
  const total = last.dayTo;
  const W = 320;
  const trackW = W - PAD * 2;
  const x = (day: number) => PAD + (day / total) * trackW;

  const pinDay = currentDay != null && currentDay <= total ? currentDay : null;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${guide.label}: ${guide.phases
          .map((p) => `${p.name}, days ${p.dayFrom} to ${p.dayTo}`)
          .join("; ")}.${pinDay ? ` Currently day ${pinDay}.` : ""}`}
      >
        {guide.phases.map((p, i) => {
          const x0 = x(p.dayFrom - 1);
          const w = x(p.dayTo) - x0;
          return (
            <g key={p.id}>
              <rect
                x={x0}
                y={26}
                width={Math.max(0, w - 1.5)}
                height={20}
                rx={3}
                fill={TINTS[i % TINTS.length]}
              />
              {/* Only label segments with room for text */}
              {w > 42 && (
                <text
                  x={x0 + w / 2}
                  y={58}
                  textAnchor="middle"
                  fontSize="8"
                  fill="var(--muted)"
                  fontFamily="var(--font-sans)"
                >
                  {p.name}
                </text>
              )}
            </g>
          );
        })}

        {pinDay != null && (
          <g>
            <line
              x1={x(pinDay)}
              x2={x(pinDay)}
              y1={18}
              y2={50}
              stroke="var(--av-orange)"
              strokeWidth={2}
            />
            <circle cx={x(pinDay)} cy={18} r={4} fill="var(--av-orange)" />
            <text
              x={Math.min(W - 24, Math.max(18, x(pinDay)))}
              y={11}
              textAnchor="middle"
              fontSize="8"
              fontWeight="500"
              fill="var(--av-orange)"
              fontFamily="var(--font-sans)"
            >
              day {pinDay}
            </text>
          </g>
        )}

        <text x={PAD} y={72} fontSize="8" fill="var(--muted)" fontFamily="var(--font-sans)">
          day 1
        </text>
        <text
          x={W - PAD}
          y={72}
          textAnchor="end"
          fontSize="8"
          fill="var(--muted)"
          fontFamily="var(--font-sans)"
        >
          day {total}
        </text>
      </svg>
      <figcaption className="caption mt-1.5 text-xs">
        {guide.cycleDays} days {guide.cycleGoal}
      </figcaption>
    </figure>
  );
}
