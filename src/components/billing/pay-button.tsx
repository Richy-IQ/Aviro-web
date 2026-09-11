"use client";

import { useState, useTransition } from "react";

import { startCheckout } from "@/app/actions/billing";
import { Icon } from "@/components/ui/icon";

export function PayButton({ batchId, label }: { batchId: string; label: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        className="av-btn primary full"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            // Resolves only on failure; success navigates to the payment page.
            const result = await startCheckout(batchId);
            if (result && !result.ok) setError(result.message ?? "Could not start the payment.");
          })
        }
      >
        <Icon name="naira" size={16} />
        {pending ? "Opening payment…" : label}
      </button>
      {error && <p className="av-err mt-2">{error}</p>}
    </>
  );
}
