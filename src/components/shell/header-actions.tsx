import { AccountMenu } from "./account-menu";
import { AlertBell } from "./alert-bell";
import { CURRENT_DAY } from "@/lib/current";
import { alertsForDay, makeFarm } from "@/lib/farm-data";

/** The pair that sits in the corner of every tab-root screen. */
export function HeaderActions() {
  const farm = makeFarm(CURRENT_DAY);
  const [batch] = farm.batches;
  const count = alertsForDay(batch).length;

  return (
    <div className="flex items-center gap-1">
      <AlertBell count={count} />
      <AccountMenu
        initials={`${farm.farmer.first[0]}${farm.farmer.last[0]}`}
        name={`${farm.farmer.first} ${farm.farmer.last}`}
        farm={`${farm.farm.name} · ${farm.farm.location}`}
      />
    </div>
  );
}
