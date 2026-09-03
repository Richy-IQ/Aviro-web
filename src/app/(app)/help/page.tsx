import { HelpSearch } from "@/components/settings/help-search";
import { TopBar } from "@/components/ui/top-bar";

export const metadata = { title: "Help & support · Aviro" };

export default function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Help & support" backHref="/more" />
      <HelpSearch />
    </div>
  );
}
