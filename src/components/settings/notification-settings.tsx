"use client";

import { useState, type ReactNode } from "react";
import { Toggle } from "@/components/ui/toggle";

interface Prefs {
  dailyReminder: boolean;
  dailyTime: string;
  vaxReminder: boolean;
  mortalityAlerts: boolean;
  sellWindow: boolean;
  weeklySummary: boolean;
}

function Row({
  label, sub, right, first,
}: { label: string; sub?: string; right: ReactNode; first?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 bg-surface p-3.5"
      style={{ borderTop: first ? "none" : "1px solid var(--border)" }}
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="caption mt-0.5 text-xs">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function NotificationSettings() {
  const [v, setV] = useState<Prefs>({
    dailyReminder: true,
    dailyTime: "18:30",
    vaxReminder: true,
    mortalityAlerts: true,
    sellWindow: true,
    weeklySummary: false,
  });

  const set = <K extends keyof Prefs>(k: K, value: Prefs[K]) => setV((p) => ({ ...p, [k]: value }));

  return (
    <div className="p-4">
      <span className="label">Reminders</span>
      <div className="mt-2 mb-5 overflow-hidden rounded-card border border-border">
        <Row
          first
          label="Daily log reminder"
          sub={`Every day at ${v.dailyTime}`}
          right={
            <Toggle
              label="Daily log reminder"
              on={v.dailyReminder}
              onChange={(n) => set("dailyReminder", n)}
            />
          }
        />
        {v.dailyReminder && (
          <Row
            label="Reminder time"
            right={
              <input
                type="time"
                aria-label="Reminder time"
                value={v.dailyTime}
                onChange={(e) => set("dailyTime", e.target.value)}
                className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-slate-ink"
              />
            }
          />
        )}
        <Row
          label="Vaccination reminders"
          sub="3 days before each dose"
          right={
            <Toggle label="Vaccination reminders" on={v.vaxReminder} onChange={(n) => set("vaxReminder", n)} />
          }
        />
      </div>

      <span className="label">Insights and alerts</span>
      <div className="mt-2 overflow-hidden rounded-card border border-border">
        <Row
          first
          label="Abnormal mortality alerts"
          sub="When deaths spike above normal"
          right={
            <Toggle
              label="Abnormal mortality alerts"
              on={v.mortalityAlerts}
              onChange={(n) => set("mortalityAlerts", n)}
            />
          }
        />
        <Row
          label="Optimal sell window"
          sub="When timing matters most"
          right={<Toggle label="Optimal sell window" on={v.sellWindow} onChange={(n) => set("sellWindow", n)} />}
        />
        <Row
          label="Weekly summary"
          sub="Sunday morning recap"
          right={
            <Toggle label="Weekly summary" on={v.weeklySummary} onChange={(n) => set("weeklySummary", n)} />
          }
        />
      </div>
    </div>
  );
}
