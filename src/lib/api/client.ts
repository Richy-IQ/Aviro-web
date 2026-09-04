import "server-only";

import { API_INTERNAL_URL } from "@/lib/env";

import { ApiError, ApiUnreachable } from "./errors";
import { getAccessToken, getRefreshToken, setSession } from "./session";
import type { ApiErrorBody } from "./types";

/**
 * The single door to the Django API.
 *
 * Server-only: the access token lives in an httpOnly cookie, so nothing in the
 * browser can call this. Client components reach the API through Server Actions
 * or route handlers instead, which keeps the token out of the bundle entirely.
 */

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Seconds to cache. Omit for per-farmer data, which must never be shared. */
  revalidate?: number;
  /** Skip the Authorization header — used by the auth endpoints themselves. */
  anonymous?: boolean;
}

// Long enough for a slow Nigerian mobile connection, short enough that a
// hanging request does not hold a page render open indefinitely.
const TIMEOUT_MS = 15_000;

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);

  // One transparent refresh: an expired access token should not log a farmer
  // out while their refresh token is still good.
  if (response.status === 401 && !options.anonymous) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return unwrap<T>(await send(path, options));
    }
  }

  return unwrap<T>(response);
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  const { method = "GET", body, revalidate, anonymous } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!anonymous) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    return await fetch(`${API_INTERNAL_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // A farmer's own data is never cached across requests; reference data can be.
      cache: revalidate === undefined ? "no-store" : undefined,
      next: revalidate === undefined ? undefined : { revalidate },
    });
  } catch (cause) {
    throw new ApiUnreachable(cause);
  }
}

async function unwrap<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const payload = text ? safeParse(text) : null;

  if (!response.ok) {
    const body = (payload as ApiErrorBody | null)?.error;
    throw new ApiError(
      response.status,
      body ?? { code: "unknown", message: "Something went wrong. Please try again." },
    );
  }
  return payload as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Exchange the refresh token for a new access token. */
async function tryRefresh(): Promise<boolean> {
  const refresh = await getRefreshToken();
  if (!refresh) return false;

  try {
    const response = await fetch(`${API_INTERNAL_URL}/v1/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return false;

    const data = (await response.json()) as { access: string; refresh?: string };
    await setSession(data.access, data.refresh ?? refresh);
    return true;
  } catch {
    return false;
  }
}
