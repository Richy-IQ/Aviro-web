import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "./icon";

interface TopBarProps {
  title: string;
  subtitle?: string;
  /** Renders a back chevron linking here. */
  backHref?: string;
  right?: ReactNode;
  big?: boolean;
}

export function TopBar({ title, subtitle, backHref, right, big }: TopBarProps) {
  return (
    <header className="av-topbar" style={{ minHeight: big ? 64 : 56 }}>
      {backHref && (
        <Link
          href={backHref}
          aria-label="Go back"
          className="av-btn ghost h-10 w-10 shrink-0 border-transparent p-0 text-slate-ink"
        >
          <Icon name="back" size={20} />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className={`${big ? "h1" : "h2"} truncate`}>{title}</h1>
        {subtitle && <p className="caption mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
