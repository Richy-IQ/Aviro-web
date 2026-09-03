import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm } from "@/lib/farm-data";

export const metadata = { title: "My farms · Aviro" };

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1">
      <div className="caption mb-0.5 text-[10px] tracking-[.08em] uppercase">{label}</div>
      <div className="num text-sm font-medium">{value}</div>
    </div>
  );
}

export default function FarmsPage() {
  const farm = makeFarm(CURRENT_DAY);
  const totalBirds = farm.batches.reduce((a, b) => a + b.alive, 0);

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="My farms" backHref="/more" />
      <div className="p-4">
        <div className="av-card mb-2.5">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-teal text-white">
              <Icon name="farm" size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-medium">{farm.farm.name}</div>
              <div className="caption truncate text-xs">{farm.farm.location}</div>
            </div>
            <Pill tone="success">Primary</Pill>
          </div>
          <div className="flex gap-4 border-t border-border pt-2.5">
            <Mini label="Active batches" value={String(farm.batches.length)} />
            <Mini label="Total birds" value={totalBirds.toLocaleString("en-NG")} />
            <Mini label="Started" value="Apr 2026" />
          </div>
        </div>

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
