"use client";

import { useEffect } from "react";
import { applyTheme, useTheme } from "./preferences";

/** Keeps the document in step with the OS while the choice is "system". */
export function SystemThemeSync() {
  const [theme] = useTheme();

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return null;
}
