import { InviteButton } from "@/components/settings/invite-sheet";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/ui/top-bar";

export const metadata = { title: "Team · Aviro" };

/**
 * Farm access is per-person and scoped to pens — a manager sees one pen, the
 * owner sees everything. This shape is what the Django permission model will
 * need to express.
 */
const MEMBERS = [
  { name: "Adamu Bello", role: "Owner", scope: "All farms", last: "Now", color: "var(--av-teal)" },
  { name: "Tunde Okafor", role: "Farm manager", scope: "Pen 1", last: "2h ago", color: "var(--av-orange)" },
  { name: "Halima Sani", role: "Pen attendant", scope: "Pens 2, 3", last: "Yesterday", color: "#3B82F6" },
];

const initials = (n: string) => n.split(" ").map((x) => x[0]).join("");

export default function TeamPage() {
  return (
    <div className="mx-auto w-full max-w-4xl pb-7">
      <TopBar
        title="Team"
        subtitle="People who can log on your farm"
        backHref="/"
        right={<InviteButton />}
      />

      <div className="p-4">
        <span className="label">{MEMBERS.length} active members</span>
        <div className="mt-2 overflow-hidden rounded-card border border-border">
          {MEMBERS.map((m, i) => (
            <button
              key={m.name}
              type="button"
              className="av-row w-full border-0 text-left"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-medium text-white"
                style={{ background: m.color }}
              >
                {initials(m.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium">{m.name}</div>
                <div className="caption text-[11px]">{m.role}</div>
              </div>
              <div className="hidden text-xs sm:block">{m.scope}</div>
              <div className="caption num hidden text-[11px] sm:block">last seen {m.last}</div>
              <Icon name="chevron" size={16} style={{ color: "var(--muted)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
