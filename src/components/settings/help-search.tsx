"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";

const SECTIONS = [
  {
    title: "Getting started",
    items: [
      "How do I create my first batch?",
      "Why does Aviro need my phone number?",
      "Can my farm manager use the app too?",
    ],
  },
  {
    title: "Logging activity",
    items: [
      "What if I forget to log a day?",
      "Bags vs kilograms — which should I use?",
      "How do I edit a past entry?",
    ],
  },
  {
    title: "Understanding your numbers",
    items: [
      "What is feed conversion ratio?",
      "How do you calculate cost per bird?",
      "Why is my mortality flagged?",
    ],
  },
  {
    title: "Account and billing",
    items: ["How do I change my phone number?", "What does Aviro cost?", "How do I delete my account?"],
  },
];

export function HelpSearch() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return SECTIONS;
    const needle = q.toLowerCase();
    return SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter((i) => i.toLowerCase().includes(needle)),
    })).filter((s) => s.items.length);
  }, [q]);

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">
          <Icon name="search" size={18} />
        </span>
        <input
          className="av-input lg pl-11"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the help centre"
          aria-label="Search the help centre"
        />
      </div>

      {filtered.map((s) => (
        <div key={s.title} className="mb-4">
          <span className="label">{s.title}</span>
          <div className="mt-2 overflow-hidden rounded-card border border-border">
            {s.items.map((item, j) => (
              <button
                key={item}
                type="button"
                className="av-row w-full border-0 text-left"
                style={{ borderTop: j ? "1px solid var(--border)" : "none" }}
              >
                <span className="flex-1 text-sm">{item}</span>
                <Icon name="chevron" size={16} style={{ color: "var(--muted)" }} />
              </button>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="caption py-8 text-center">No help articles match “{q}”.</p>
      )}

      <div className="av-card mt-2 bg-teal-haze p-4.5" style={{ borderColor: "transparent" }}>
        <span className="label" style={{ color: "var(--av-teal)" }}>
          Still need help?
        </span>
        <div className="h3 mt-1 text-teal">Talk to us</div>
        <div className="mt-3.5 flex gap-2">
          <button type="button" className="av-btn secondary flex-1">
            <Icon name="phone" size={16} /> WhatsApp
          </button>
          <button type="button" className="av-btn tertiary flex-1">
            Email us
          </button>
        </div>
      </div>
    </div>
  );
}
