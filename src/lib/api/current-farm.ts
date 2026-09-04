import "server-only";

import { cache } from "react";

import { api } from "./resources";
import { isSignedIn } from "./session";
import type { ApiFarm } from "./types";

/**
 * The farm the app is currently about.
 *
 * Most farmers have exactly one, so the app does not make them pick. Wrapped in
 * React's `cache` so a page that needs the farm in three places fetches it once
 * per request.
 */
export const getCurrentFarm = cache(async (): Promise<ApiFarm | null> => {
  if (!(await isSignedIn())) return null;
  const farms = await api.farms();
  return farms[0] ?? null;
});
