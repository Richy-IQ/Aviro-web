import { redirect } from "next/navigation";

import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

export const metadata = { title: "Profile · Aviro" };

export default async function ProfilePage() {
  const farm = await getCurrentFarm();
  if (!farm) redirect("/setup");

  const user = await api.me();

  const rows: [string, string][] = [
    ["Name", user.display_name || "Not set"],
    ["Phone", user.phone],
    ["State", user.state || farm.state || "Not set"],
    ["LGA", user.lga || farm.lga || "Not set"],
    ["Farm", farm.name],
    ["Location", farm.location || "Not set"],
    ["Your role", farm.role ?? "—"],
  ];

  return (
    <div className="mx-auto w-full max-w-2xl pb-7">
      <TopBar title="Profile" backHref="/" />
      <div className="p-4">
        <div className="overflow-hidden rounded-card border border-border">
          {rows.map(([k, v], i) => (
            <div
              key={k}
              className="flex items-center justify-between gap-4 bg-surface px-4 py-3.5"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <span className="caption">{k}</span>
              <span className="text-sm font-medium capitalize">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
