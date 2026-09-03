import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";

export function ShortcutCard({
  icon, label, sub, href,
}: { icon: IconName; label: string; sub: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-card border border-border bg-surface p-3.5 text-left text-slate-ink transition-colors hover:bg-bg"
    >
      <div className="mb-2.5 grid h-8 w-8 place-items-center rounded-[10px] bg-teal-tint text-teal">
        <Icon name={icon} size={18} />
      </div>
      <div className="text-sm font-medium">{label}</div>
      <div className="caption mt-0.5 text-xs">{sub}</div>
    </Link>
  );
}
