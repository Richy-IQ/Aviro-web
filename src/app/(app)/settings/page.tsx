import { SettingsPanel } from "@/components/settings/settings-panel";
import { TopBar } from "@/components/ui/top-bar";

export const metadata = { title: "Settings · Aviro" };

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Settings" backHref="/" />
      <SettingsPanel />
    </div>
  );
}
