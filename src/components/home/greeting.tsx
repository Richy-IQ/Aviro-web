"use client";

import { useLanguage } from "@/components/settings/preferences";
import { STRINGS } from "@/lib/strings";

/**
 * Greeting depends on both the time of day and the language, so it renders on
 * the client; the rest of the home screen stays server-rendered.
 *
 * The Nigerian English strings already address the reader ("Afternoon, Oga"),
 * so the name is only appended in English — otherwise it reads
 * "Afternoon, Oga, Adamu."
 */
export function Greeting({ name, fallback }: { name: string; fallback: string }) {
  const [language] = useLanguage();
  const hour = new Date().getHours();
  const key = hour < 12 ? "greeting_morning" : hour < 17 ? "greeting_afternoon" : "greeting_evening";

  const text = typeof window === "undefined" ? `${fallback}, ${name}.` : language === "local"
    ? `${STRINGS.local[key]}.`
    : `${STRINGS.english[key]}, ${name}.`;

  return (
    <p className="caption text-[13px]" suppressHydrationWarning>
      {text}
    </p>
  );
}
