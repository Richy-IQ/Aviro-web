import Link from "next/link";
import { Icon } from "@/components/ui/icon";

/**
 * Alerts are time-critical — a mortality spike costs money every hour it goes
 * unread — so the count is visible on every screen rather than buried behind a
 * menu.
 */
export function AlertBell({ count }: { count: number }) {
  return (
    <Link
      href="/alerts"
      aria-label={count > 0 ? `${count} alerts need your attention` : "Alerts"}
      className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-2 transition-colors hover:bg-bg"
    >
      <Icon name="bell" size={20} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange px-1 text-[10px] leading-none font-medium text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
