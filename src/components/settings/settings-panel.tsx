"use client";

import { useLanguage, useTheme, type ThemeChoice } from "./preferences";
import type { Language } from "@/lib/strings";

const THEMES: { v: ThemeChoice; label: string; sub: string }[] = [
  { v: "light", label: "Light", sub: "Best in daylight" },
  { v: "dark", label: "Dark", sub: "Easier at night in the pen" },
  { v: "system", label: "Match my phone", sub: "Follows your device setting" },
];

const LANGUAGES: { v: Language; label: string; sub: string }[] = [
  { v: "english", label: "English", sub: "Good morning, Adamu." },
  { v: "local", label: "Nigerian English", sub: "Good morning, Oga." },
];

function OptionRow<T extends string>({
  label, sub, checked, onSelect, first,
}: { label: string; sub: string; checked: boolean; onSelect: () => void; first?: boolean; value?: T }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="flex w-full items-center gap-3 bg-surface p-3.5 text-left"
      style={{ borderTop: first ? "none" : "1px solid var(--border)" }}
    >
      <span
        className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full"
        style={{ border: `2px solid ${checked ? "var(--av-teal)" : "var(--border-strong)"}` }}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-teal" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="caption block text-xs">{sub}</span>
      </span>
    </button>
  );
}

export function SettingsPanel() {
  const [theme, setTheme] = useTheme();
  const [language, setLanguage] = useLanguage();

  return (
    <div className="p-4">
      <span className="label">Appearance</span>
      <div className="mt-2 mb-5 overflow-hidden rounded-card border border-border" role="radiogroup" aria-label="Theme">
        {THEMES.map((t, i) => (
          <OptionRow
            key={t.v}
            label={t.label}
            sub={t.sub}
            checked={theme === t.v}
            onSelect={() => setTheme(t.v)}
            first={i === 0}
          />
        ))}
      </div>

      <span className="label">Language</span>
      <div className="mt-2 overflow-hidden rounded-card border border-border" role="radiogroup" aria-label="Language">
        {LANGUAGES.map((l, i) => (
          <OptionRow
            key={l.v}
            label={l.label}
            sub={l.sub}
            checked={language === l.v}
            onSelect={() => setLanguage(l.v)}
            first={i === 0}
          />
        ))}
      </div>
      <p className="av-help">Affects greetings and a few metric labels.</p>
    </div>
  );
}
