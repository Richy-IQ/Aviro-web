import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { VAX } from "@/lib/farm-data";

export const metadata = { title: "Vaccinations · Aviro" };

export default function VaccinationsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar title="Vaccinations" backHref="/" subtitle={`Batch B · day ${CURRENT_DAY} of 42`} />
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-card border border-border">
          {VAX.map((v) => {
            const done = v.day < CURRENT_DAY;
            const today = v.day === CURRENT_DAY;
            return (
              <div key={v.day} className="av-row">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
                  style={{
                    background: done ? "var(--soft-mint)" : today ? "var(--warning-soft)" : "var(--bg)",
                    color: done ? "var(--av-teal)" : today ? "var(--warning-ink)" : "var(--muted)",
                  }}
                >
                  <Icon name={done ? "check" : "syringe"} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="caption text-xs">
                    Day {v.day} · {v.route}
                  </div>
                </div>
                {today && <Pill tone="warn">Due today</Pill>}
                {done && <Pill tone="success">Done</Pill>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
