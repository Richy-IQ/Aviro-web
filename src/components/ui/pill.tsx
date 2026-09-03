import type { ReactNode } from "react";
import type { BatchStatus } from "@/lib/types";

export type PillTone = "default" | "success" | "warn" | "error" | "teal" | "orange";

export function Pill({ tone = "default", children }: { tone?: PillTone; children: ReactNode }) {
  return <span className={`av-pill${tone === "default" ? "" : ` ${tone}`}`}>{children}</span>;
}

const STATUS: Record<BatchStatus, { tone: PillTone; label: string }> = {
  "on-track": { tone: "success", label: "On track" },
  ahead: { tone: "teal", label: "Ahead" },
  behind: { tone: "warn", label: "Behind" },
  "needs-attention": { tone: "error", label: "Needs attention" },
};

export function StatusPill({ status }: { status: BatchStatus }) {
  const { tone, label } = STATUS[status] ?? STATUS["on-track"];
  return <Pill tone={tone}>{label}</Pill>;
}
