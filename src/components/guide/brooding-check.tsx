// Deterministic chick positions per panel — no randomness, so the diagram
// renders identically on server and client and never shifts between reloads.
type Pattern = "cold" | "right" | "hot" | "draught";

const R = 44;
const CX = 50;
const CY = 50;

function positions(pattern: Pattern): [number, number][] {
  const pts: [number, number][] = [];
  const rings: Record<Pattern, { r: number; n: number; from?: number }[]> = {
    // Piled under the heat source in the middle.
    cold: [
      { r: 0, n: 1 },
      { r: 7, n: 6 },
      { r: 14, n: 9 },
    ],
    // Spread evenly across the whole floor — what you want to see.
    right: [
      { r: 0, n: 1 },
      { r: 14, n: 6 },
      { r: 28, n: 9 },
    ],
    // Pushed out to the walls, away from the heat.
    hot: [
      { r: 34, n: 16 },
    ],
    // Bunched to one side, away from a cold draught.
    draught: [
      { r: 12, n: 5, from: 0.55 },
      { r: 24, n: 8, from: 0.55 },
    ],
  };

  for (const ring of rings[pattern]) {
    if (ring.r === 0) {
      pts.push([CX, CY]);
      continue;
    }
    for (let i = 0; i < ring.n; i++) {
      const spread = ring.from != null ? Math.PI * 1.1 : Math.PI * 2;
      const base = ring.from != null ? Math.PI * ring.from : 0;
      const a = base + (i / ring.n) * spread;
      pts.push([CX + Math.cos(a) * ring.r, CY + Math.sin(a) * ring.r]);
    }
  }
  return pts;
}

const PANELS: { pattern: Pattern; title: string; meaning: string; good: boolean }[] = [
  { pattern: "cold", title: "Piled in the middle", meaning: "Too cold — raise the heat", good: false },
  { pattern: "right", title: "Spread evenly", meaning: "Temperature is right", good: true },
  { pattern: "hot", title: "Pressed to the walls", meaning: "Too hot — lower the heat", good: false },
  { pattern: "draught", title: "Bunched to one side", meaning: "A draught — find and block it", good: false },
];

/**
 * The classic brooding diagram, and the clearest example of where a picture
 * beats a paragraph: a first-time farmer looks at their own brooder and
 * matches the shape. No reading of temperature figures required.
 */
export function BroodingCheck() {
  return (
    <div className="av-card">
      <div className="label mb-1">Read the chicks, not the thermometer</div>
      <p className="caption mb-3.5 text-xs leading-[1.55]">
        Look down into the brooder. The shape the chicks make tells you the temperature faster than
        any gauge.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PANELS.map((p) => (
          <figure key={p.pattern} className="m-0">
            <svg
              viewBox="0 0 100 100"
              width="100%"
              role="img"
              aria-label={`${p.title}: ${p.meaning}`}
              className="block"
            >
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="var(--bg)"
                stroke={p.good ? "var(--av-teal)" : "var(--border-strong)"}
                strokeWidth={p.good ? 2 : 1.2}
              />
              {/* Heat source */}
              <circle
                cx={CX}
                cy={CY}
                r={9}
                fill="none"
                stroke="var(--av-orange)"
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.7}
              />
              {positions(p.pattern).map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3.4}
                  fill={p.good ? "var(--av-teal)" : "var(--slate-2)"}
                />
              ))}
            </svg>
            <figcaption className="mt-1.5">
              <span className="block text-xs font-medium">{p.title}</span>
              <span
                className="block text-[11px] leading-[1.4]"
                style={{ color: p.good ? "var(--av-teal)" : "var(--muted)" }}
              >
                {p.meaning}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
