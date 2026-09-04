"use client";

import { useState } from "react";

import { Icon } from "@/components/ui/icon";

/**
 * The sign-in code, shown on screen.
 *
 * Only appears when the API says it is running in demo mode. Deliberately
 * looks like a warning rather than a feature: anyone reading it should
 * understand that phone verification is switched off, not learn to expect a
 * code on the page.
 */
export function DemoCode({ code, notice }: { code: string; notice?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the digits are on screen to be typed anyway.
    }
  };

  return (
    <div
      className="mt-4 rounded-card p-3.5"
      style={{ background: "var(--warning-soft)", border: "1px solid var(--warning)" }}
    >
      <div className="label mb-2 flex items-center gap-1.5" style={{ color: "var(--warning-ink)" }}>
        <Icon name="alert" size={13} />
        Demo mode — verification is off
      </div>

      <div className="flex items-center gap-3">
        <span
          className="num text-[28px] font-medium tracking-[0.2em]"
          style={{ color: "var(--warning-ink)" }}
        >
          {code}
        </span>
        <button
          type="button"
          onClick={copy}
          className="av-btn ghost sm ml-auto"
          style={{ borderColor: "var(--warning)", color: "var(--warning-ink)" }}
        >
          <Icon name={copied ? "check" : "doc"} size={14} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {notice && (
        <p className="mt-2 text-[11px] leading-[1.5]" style={{ color: "var(--warning-ink)" }}>
          {notice}
        </p>
      )}
    </div>
  );
}
