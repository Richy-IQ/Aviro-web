import { AccountMenu } from "./account-menu";
import { AlertBell } from "./alert-bell";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

/** The pair that sits in the corner of every tab-root screen. */
export async function HeaderActions() {
  const farm = await getCurrentFarm();
  if (!farm) return null;

  const [user, alerts] = await Promise.all([
    api.me(),
    api.alerts(farm.id).catch(() => []),
  ]);

  // Empty when there is no name yet; the avatar falls back to a person icon
  // rather than showing two digits of their phone number.
  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.trim();

  return (
    <div className="flex items-center gap-1">
      <AlertBell count={alerts.length} />
      <AccountMenu
        initials={initials.toUpperCase()}
        name={user.display_name || user.phone}
        farm={`${farm.name}${farm.location ? ` · ${farm.location}` : ""}`}
      />
    </div>
  );
}
