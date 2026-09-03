import { Sidebar, TabBar } from "@/components/ui/nav";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { alertsForDay, makeBatch } from "@/lib/farm-data";
import { CURRENT_DAY } from "@/lib/current";

/**
 * App shell. Mobile gets a bottom tab bar (how most farmers use Aviro);
 * lg and up swaps it for a persistent sidebar — one app, two densities of
 * navigation, no separate desktop build.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  const alertCount = alertsForDay(makeBatch(CURRENT_DAY)).length;

  return (
    <div className="flex min-h-dvh">
      <Sidebar alertCount={alertCount} />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <OfflineBanner />
        <main className="av-scroll flex-1">{children}</main>
        <TabBar alertCount={alertCount} />
      </div>
    </div>
  );
}
