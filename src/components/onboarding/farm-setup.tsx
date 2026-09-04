"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createFarm } from "@/app/actions/farm";
import { FieldLabel, Select } from "@/components/form/fields";
import { Logo } from "@/components/ui/logo";
import { LGAS, STATES } from "@/lib/farm-data";

/**
 * The one thing a new farmer must give us before the app can hold anything: a
 * farm for their batches to belong to. Name is pre-filled and the location is
 * optional, so this is one tap for anyone in a hurry.
 */
export function FarmSetup({ suggestedName }: { suggestedName: string }) {
  const router = useRouter();
  const [name, setName] = useState(suggestedName);
  const [state, setState] = useState<string>(STATES[0]);
  const [lga, setLga] = useState<string>(LGAS[STATES[0]]?.[0] ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createFarm({ name: name.trim() || suggestedName, state, lga });
      if (!result.ok) {
        setError(result.message ?? "Could not create your farm.");
        return;
      }
      router.push("/batches/new");
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-4 pb-7">
        <Logo size={26} />

        <div className="flex-1">
          <h1 className="display mt-7 mb-2 text-[28px] text-slate-ink">
            What should we call your farm?
          </h1>
          <p className="caption mb-6 text-sm">You can change any of this later.</p>

          <FieldLabel htmlFor="farm-name">Farm name</FieldLabel>
          <input
            id="farm-name"
            className="av-input lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={suggestedName}
          />

          <div className="h-4.5" />
          <FieldLabel htmlFor="farm-state">State</FieldLabel>
          <Select
            id="farm-state"
            value={state}
            options={STATES.map((s) => ({ value: s, label: s }))}
            onChange={(e) => {
              setState(e.target.value);
              setLga(LGAS[e.target.value]?.[0] ?? "");
            }}
          />

          <div className="h-3.5" />
          <FieldLabel htmlFor="farm-lga">Local government area</FieldLabel>
          <Select
            id="farm-lga"
            value={lga}
            options={(LGAS[state] ?? ["—"]).map((l) => ({ value: l, label: l }))}
            onChange={(e) => setLga(e.target.value)}
          />
          <p className="av-help">Used to show feed prices and buyers near you.</p>
        </div>

        {error && <p className="av-err mb-2">{error}</p>}
        <button type="button" className="av-btn primary full" onClick={submit} disabled={pending}>
          {pending ? "Creating…" : "Create farm"}
        </button>
      </div>
    </div>
  );
}
