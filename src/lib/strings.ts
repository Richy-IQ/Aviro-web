// Copy that changes with the language preference.
//
// Scope matches the design prototype: only the handful of phrases where
// Nigerian English reads more naturally than textbook English. Everything else
// is the same in both, so there is no full i18n layer to maintain.

export type Language = "english" | "local";

export const STRINGS = {
  english: {
    greeting_morning: "Good morning",
    greeting_afternoon: "Good afternoon",
    greeting_evening: "Good evening",
    log_today: "Log today",
    see_report: "Cycle report",
    cost_per_bird: "Cost per bird",
    fcr: "Feed conversion",
    mortality: "Mortality",
    projected: "Projected profit",
  },
  local: {
    greeting_morning: "Good morning, Oga",
    greeting_afternoon: "Afternoon, Oga",
    greeting_evening: "Evening, Oga",
    log_today: "Log today",
    see_report: "See full report",
    cost_per_bird: "Cost per bird",
    fcr: "Feed efficiency",
    mortality: "Birds lost",
    projected: "Likely profit",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["english"];
