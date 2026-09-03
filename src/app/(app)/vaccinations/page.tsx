import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TopBar } from "@/components/ui/top-bar";
import { CURRENT_DAY } from "@/lib/current";
import { makeFarm, VAX } from "@/lib/farm-data";
import { guideFor } from "@/lib/guide";

export const metadata = { title: "Vaccinations · Aviro" };

export default function VaccinationsPage() {
  const [batch] = makeFarm(CURRENT_DAY).batches;
  const isBroiler = guideFor(batch.type).type === "broiler";

  return (
    <div className="mx-auto w-full max-w-3xl pb-7">
      <TopBar
        title="Vaccinations"
        backHref="/"
        subtitle={`${batch.name} · ${batch.breed} · day ${batch.day}`}
      />
      <div className="px-4 pt-4">
        {!isBroiler && (
          <div className="av-card mb-3 bg-warning-soft" style={{ borderColor: "transparent" }}>
            <p className="text-[13px] leading-[1.55]" style={{ color: "var(--warning-ink)" }}>
              This is the standard broiler schedule. Layers and other long-lived birds carry a longer
              programme — confirm yours with your supplier or a vet.
            </p>
          </div>
        )}
        <div className="overflow-hidden rounded-card border border-border">
          {VAX.map((v) => {
            const done = v.day < batch.day;
            const today = v.day === batch.day;
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
