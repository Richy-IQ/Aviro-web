import type { SVGProps } from "react";

// Icon set ported from the design prototype. Stored as path data rather than
// per-icon components so the whole set costs one small module, and the
// component stays server-renderable — no client bundle hit for static screens.

const PATHS = {
  home: <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />,
  list: <path d="M3 6h18M3 12h18M3 18h12" />,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13h7M10 17h5" /></>,
  more: <><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></>,
  bell: <><path d="M6 15V11a6 6 0 1 1 12 0v4l1.5 2.5h-15z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  "chev-down": <path d="M6 9l6 6 6-6" />,
  close: <path d="M5 5l14 14M19 5L5 19" />,
  check: <path d="M5 12l4 4 10-10" />,
  edit: <path d="M14 4l6 6L8 22H2v-6z" />,
  share: <><path d="M12 16V3M8 7l4-4 4 4" /><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /></>,
  download: <><path d="M12 4v12M7 11l5 5 5-5" /><path d="M4 20h16" /></>,
  feed: <><path d="M4 13c2-3 4-4 8-4s6 1 8 4M4 13v5h16v-5" /><path d="M9 18v-2M15 18v-2" /></>,
  skull: <><path d="M5 11a7 7 0 0 1 14 0v4a3 3 0 0 1-3 3h-2v2h-4v-2H8a3 3 0 0 1-3-3z" /><circle cx="9" cy="13" r="1.2" /><circle cx="15" cy="13" r="1.2" /></>,
  pill: <><rect x="3" y="10" width="18" height="4" rx="2" transform="rotate(-45 12 12)" /><path d="M8.5 8.5l7 7" /></>,
  syringe: <path d="M16 3l5 5M18 5l-9 9-3 6 6-3 9-9zM6 14l4 4" />,
  naira: <path d="M6 4v16M18 4v16M6 4l12 16M4 10h16M4 14h16" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  alert: <><path d="M12 4l10 17H2z" /><path d="M12 10v5M12 18v.5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" /></>,
  trend: <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
  "trend-down": <path d="M3 7l6 6 4-4 8 8M14 17h7v-7" />,
  trophy: <><path d="M8 4h8v6a4 4 0 0 1-8 0z" /><path d="M5 5H3v3a3 3 0 0 0 3 3M19 5h2v3a3 3 0 0 1-3 3M9 16h6l-1 4h-4z" /></>,
  egg: <path d="M12 3c-4 0-7 5-7 11a7 7 0 0 0 14 0c0-6-3-11-7-11z" />,
  drop: <path d="M12 3s-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13z" />,
  phone: <path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  loc: <><path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  farm: <><path d="M3 21V11l9-6 9 6v10H3z" /><path d="M3 21h18M9 21v-6h6v6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-5-5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2.1-1.6-2-3.5-2.5 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.5-1-2 3.5L5.1 10.8A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2.1 1.6 2 3.5 2.5-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.5 1 2-3.5-2.1-1.6c.1-.4.1-.8.1-1.2z" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17v.5" /></>,
  logout: <><path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" /><path d="M10 12h10M15 7l5 5-5 5" /></>,
  "wifi-off": <><path d="M3 8a16 16 0 0 1 5-3M16 5a16 16 0 0 1 5 3M6 12a10 10 0 0 1 3-2M15 10a10 10 0 0 1 3 2M9 16a4 4 0 0 1 6 0" /><circle cx="12" cy="20" r=".5" /><path d="M3 3l18 18" /></>,
  stop: <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>,
  vet: <><path d="M12 7v10M7 12h10" /><circle cx="12" cy="12" r="9" /></>,
  shield: <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />,
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "stroke"> {
  name: IconName;
  size?: number;
  /** Stroke width in user units; the design default is 1.7. */
  stroke?: number;
}

export function Icon({ name, size = 22, stroke = 1.7, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
