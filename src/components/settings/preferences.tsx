"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Language } from "@/lib/strings";

export type ThemeChoice = "light" | "dark" | "system";

export const THEME_KEY = "aviro:theme";
export const LANG_KEY = "aviro:lang";

const CHANGE_EVENT = "aviro:prefs";

/**
 * Theme and language live in localStorage rather than React state: an inline
 * script applies the theme before first paint, so React must read the value
 * that is already on the document rather than own it. useSyncExternalStore is
 * the right primitive for that — it subscribes to the store instead of
 * mirroring it into state.
 */
function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function read(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    // Private mode or blocked storage — the default is fine.
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function systemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(theme: ThemeChoice) {
  const resolved = theme === "system" ? (systemDark() ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = resolved;
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => read(THEME_KEY, "system"),
    () => "system",
  ) as ThemeChoice;

  const setTheme = useCallback((t: ThemeChoice) => {
    write(THEME_KEY, t);
    applyTheme(t);
  }, []);

  return [theme, setTheme] as const;
}

export function useLanguage() {
  const language = useSyncExternalStore(
    subscribe,
    () => read(LANG_KEY, "english"),
    () => "english",
  ) as Language;

  const setLanguage = useCallback((l: Language) => write(LANG_KEY, l), []);

  return [language, setLanguage] as const;
}
