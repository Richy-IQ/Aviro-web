// Aviro mark: stylized hen silhouette with an orange beak and a dot that reads
// as both the eye and a data point.

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  /** Use on teal/dark grounds, where the mark and word both go white. */
  reverse?: boolean;
}

export function Logo({ size = 24, withWordmark = true, reverse = false }: LogoProps) {
  const teal = reverse ? "#fff" : "var(--av-teal)";
  const orange = "var(--av-orange)";

  const mark = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5 22c0-5 4-9 9-9h2c4 0 6 2 7 5l3-1 1 3-3 1c-.3 3-2 5-5 6H10c-3 0-5-2-5-5z" fill={teal} />
      <path d="M24 17l3-1 1 3-3 1z" fill={orange} />
      <circle cx="22" cy="18.5" r="1.6" fill={orange} />
      <path d="M12 25v3M16 25v3" stroke={teal} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  if (!withWordmark) return mark;

  return (
    <span className="inline-flex items-center gap-2">
      {mark}
      <span
        className="font-medium tracking-[-0.02em]"
        style={{
          fontSize: Math.round(size * 0.85),
          color: reverse ? "#fff" : "var(--slate)",
        }}
      >
        aviro
      </span>
    </span>
  );
}
