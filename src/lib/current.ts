/**
 * Which day of the cycle the demo farm is on.
 *
 * The design prototype drove this from a slider; the real app will read it from
 * the batch's start date via the API. Until then it is a single constant so
 * every screen agrees on the same farm state.
 */
export const CURRENT_DAY = 21;

/** Aviro's users are in Nigeria, so greetings follow Lagos time, not the server's. */
export function greetingFor(date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-NG", {
      hour: "numeric",
      hour12: false,
      timeZone: "Africa/Lagos",
    }).format(date),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
