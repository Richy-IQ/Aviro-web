import "server-only";

import { cookies } from "next/headers";

/**
 * Where the session lives.
 *
 * Tokens go in httpOnly cookies rather than localStorage, so a script injected
 * into any page cannot read them. The cost is that pages showing a farmer's own
 * data become dynamic — which they had to be anyway once the data is theirs
 * rather than a fixture.
 */

export const ACCESS_COOKIE = "aviro_access";
export const REFRESH_COOKIE = "aviro_refresh";

// Matched to the API's SIMPLE_JWT lifetimes. A farmer standing in a pen with no
// signal should not be logged out.
const ACCESS_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const REFRESH_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

const BASE_COOKIE = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function getAccessToken(): Promise<string | null> {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}

export async function setSession(access: string, refresh: string): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, access, { ...BASE_COOKIE, maxAge: ACCESS_MAX_AGE });
  jar.set(REFRESH_COOKIE, refresh, { ...BASE_COOKIE, maxAge: REFRESH_MAX_AGE });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function isSignedIn(): Promise<boolean> {
  return (await getAccessToken()) !== null;
}
