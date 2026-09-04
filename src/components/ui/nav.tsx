"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icon";
import { Logo } from "./logo";

// Tabs name the jobs a farmer comes to do. Account settings sit behind the
// avatar instead of taking a tab, and alerts live in a bell that is visible on
// every screen rather than behind a menu.
const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/batches", label: "Batches", icon: "list" },
  { href: "/money", label: "Money", icon: "naira" },
  { href: "/guide", label: "Guide", icon: "shield" },
];

/**
 * Screens reached from a tab keep that tab lit, even though their URL sits
 * outside it — otherwise the bar goes blank the moment you open Settings.
 */
const OWNED_BY: Record<string, string[]> = {
  "/batches": ["/log", "/sale", "/vaccinations"],
  "/money": ["/reports", "/feed-prices", "/markets", "/benchmark"],
};

function useActive() {
  const pathname = usePathname();
  return (href: string) => {
    if (pathname === href) return true;
    if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
    return (OWNED_BY[href] ?? []).some((p) => pathname === p || pathname.startsWith(`${p}/`));
  };
}

/**
 * Bottom tab bar — the primary navigation on phones, which is how most Aviro
 * farmers use the app. Hidden from lg upward, where the sidebar takes over.
 */
export function TabBar() {
  const isActive = useActive();

  return (
    <nav className="av-tabbar sticky bottom-0 z-20 lg:hidden" aria-label="Main">
      {TABS.map((t) => {
        const active = isActive(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`av-tab${active ? " active" : ""}`}
          >
            <span className="relative">
              <Icon name={t.icon} size={22} />
            </span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Desktop counterpart — the owner console's persistent rail. */
export function Sidebar() {
  const isActive = useActive();

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col gap-1 border-r border-border bg-surface p-4 lg:flex"
      aria-label="Main"
    >
      <div className="mb-4 px-2 pt-1">
        <Logo size={26} />
      </div>
      {TABS.map((t) => {
        const active = isActive(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className="flex items-center gap-3 rounded-card px-3 py-2.5 text-[15px] font-medium transition-colors"
            style={{
              background: active ? "var(--av-teal-tint)" : "transparent",
              color: active ? "var(--av-teal)" : "var(--slate-2)",
            }}
          >
            <Icon name={t.icon} size={20} />
            <span className="flex-1">{t.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
