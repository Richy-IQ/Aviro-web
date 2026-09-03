import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm } from "@/lib/farm-data";

export const metadata = { title: "Profile · Aviro" };

export default function ProfilePage() {
  const { farmer, farm } = makeFarm(CURRENT_DAY);

  const rows: [string, string][] = [
    ["Name", `${farmer.first} ${farmer.last}`],
    ["Phone", farmer.phone],
    ["State", farmer.state],
    ["LGA", farmer.lga],
    ["Farm", farm.name],
    ["Location", farm.location],
  ];

  return (
    <div className="mx-auto w-full max-w-2xl pb-7">
      <TopBar title="Profile & farm" backHref="/more" />
      <div className="p-4">
        <div className="overflow-hidden rounded-card border border-border">
          {rows.map(([k, v], i) => (
            <div
              key={k}
              className="flex items-center justify-between gap-4 bg-surface px-4 py-3.5"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <span className="caption">{k}</span>
              <span className="text-sm font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
