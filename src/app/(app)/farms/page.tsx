import { redirect } from "next/navigation";

import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TopBar } from "@/components/ui/top-bar";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

export const metadata = { title: "My farms · Aviro" };

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1">
      <div className="caption mb-0.5 text-[10px] tracking-[.08em] uppercase">{label}</div>
      <div className="num text-sm font-medium">{value}</div>
    </div>
  );
}

export default async function FarmsPage() {
  const current = await getCurrentFarm();
  if (!current) redirect("/setup");

  const [farms, rows] = await Promise.all([api.farms(), api.batches(current.id)]);
  const totalBirds = rows.reduce((sum, r) => sum + r.metrics.alive, 0);

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="My farms" backHref="/" />
      <div className="p-4">
        {farms.map((farm) => (
          <div key={farm.id} className="av-card mb-2.5">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-teal text-white">
                <Icon name="farm" size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{farm.name}</div>
                <div className="caption truncate text-xs">{farm.location || "No location set"}</div>
              </div>
              {farm.role && <Pill tone="success">{farm.role}</Pill>}
            </div>
            {farm.id === current.id && (
              <div className="flex gap-4 border-t border-border pt-2.5">
                <Mini label="Batches" value={String(rows.length)} />
                <Mini label="Total birds" value={totalBirds.toLocaleString("en-NG")} />
                <Mini label="Pens" value={String(farm.pens.length)} />
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-card bg-transparent p-4.5 font-medium text-teal"
          style={{ border: "1.5px dashed var(--border-strong)" }}
        >
          <Icon name="plus" size={16} /> Add another farm
        </button>
      </div>
    </div>
  );
}
