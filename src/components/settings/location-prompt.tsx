"use client";

import { useState, useSyncExternalStore } from "react";
import { FieldLabel, Select } from "@/components/form/fields";
import { Icon } from "@/components/ui/icon";
import { LGAS, STATES } from "@/lib/farm-data";

const KEY = "aviro:location";
const EVENT = "aviro:prefs";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function readLocation(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * Location is asked here rather than at sign-up, because this is the first
 * screen where it changes the answer — prices and benchmarks are local. Asking
 * in context means the farmer can see why it is wanted.
 */
export function LocationPrompt({ purpose }: { purpose: string }) {
  const saved = useSyncExternalStore(subscribe, readLocation, () => "");
  const [state, setState] = useState(STATES[0] as string);
  const [lga, setLga] = useState(LGAS[STATES[0]]?.[0] ?? "");
  const [open, setOpen] = useState(false);

  if (saved) {
    return (
      <div className="mb-3 flex items-center gap-2">
        <Icon name="loc" size={14} style={{ color: "var(--muted)" }} />
        <span className="caption text-xs">{saved}</span>
        <button
          type="button"
          className="av-link text-xs"
          onClick={() => {
            try {
              localStorage.removeItem(KEY);
            } catch {}
            window.dispatchEvent(new Event(EVENT));
            setOpen(true);
          }}
        >
          Change
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="av-card mb-3 flex w-full items-center gap-3 text-left"
        style={{ background: "var(--av-teal-haze)", borderColor: "transparent" }}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-surface text-teal">
          <Icon name="loc" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-teal">Where is your farm?</span>
          <span className="caption block text-xs">{purpose}</span>
        </span>
        <Icon name="chevron" size={16} style={{ color: "var(--muted)" }} />
      </button>
    );
  }

  return (
    <div className="av-card mb-3">
      <FieldLabel htmlFor="loc-state">State</FieldLabel>
      <Select
        id="loc-state"
        value={state}
        options={STATES.map((s) => ({ value: s, label: s }))}
        onChange={(e) => {
          setState(e.target.value);
          setLga(LGAS[e.target.value]?.[0] ?? "");
        }}
      />
      <div className="h-3" />
      <FieldLabel htmlFor="loc-lga">Local government area</FieldLabel>
      <Select
        id="loc-lga"
        value={lga}
        options={(LGAS[state] ?? ["—"]).map((l) => ({ value: l, label: l }))}
        onChange={(e) => setLga(e.target.value)}
      />
      <button
        type="button"
        className="av-btn secondary full mt-4"
        onClick={() => {
          try {
            localStorage.setItem(KEY, `${lga}, ${state}`);
          } catch {}
          window.dispatchEvent(new Event(EVENT));
          setOpen(false);
        }}
      >
        Save
      </button>
    </div>
  );
}
