import { NotificationSettings } from "@/components/settings/notification-settings";
import { TopBar } from "@/components/ui/top-bar";

export const metadata = { title: "Notifications · Aviro" };

export default function NotificationsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Notifications" backHref="/more" />
      <NotificationSettings />
    </div>
  );
}
