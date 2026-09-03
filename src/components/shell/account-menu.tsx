"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet } from "@/components/overlay/sheet";
import { Icon, type IconName } from "@/components/ui/icon";

const LINKS: { href: string; label: string; icon: IconName; sub: string }[] = [
  { href: "/profile", label: "Profile", icon: "user", sub: "Your name and number" },
  { href: "/farms", label: "My farms", icon: "farm", sub: "Farms you manage" },
  { href: "/team", label: "Team", icon: "user", sub: "Who can log on your farm" },
  { href: "/notifications", label: "Notifications", icon: "bell", sub: "Reminders and alerts" },
  { href: "/settings", label: "Settings", icon: "settings", sub: "Appearance and language" },
  { href: "/help", label: "Help & support", icon: "help", sub: "Guides and contact" },
];

/**
 * Account settings live behind the avatar, where people look for them, rather
 * than occupying a navigation tab. That frees the fourth tab for something a
 * farmer opens weekly instead of twice a year.
 */
export function AccountMenu({ initials, name, farm }: { initials: string; name: string; farm: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Your account"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-[13px] font-medium text-white"
      >
        {initials}
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={name} subtitle={farm}>
        <div className="overflow-hidden rounded-card border border-border">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="av-row"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
                <Icon name={l.icon} size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{l.label}</div>
                <div className="caption text-xs">{l.sub}</div>
              </div>
              <Icon name="chevron" size={16} style={{ color: "var(--muted)" }} />
            </Link>
          ))}
        </div>
      </Sheet>
    </>
  );
}
