// Environment configuration.
//
// Read through here rather than touching process.env directly: a missing or
// malformed value fails at startup with a clear message, instead of surfacing
// later as a confusing fetch error against "undefined/api/batches".
//
// NEXT_PUBLIC_* is inlined into the client bundle at build time, so it must be
// referenced literally — process.env[name] would not be replaced.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and set it.`,
    );
  }
  try {
    new URL(value);
  } catch {
    throw new Error(`Environment variable ${name} is not a valid URL: "${value}"`);
  }
  return value.replace(/\/$/, "");
}

/** Django API base URL as the browser calls it. Safe to use in client code. */
export const API_URL = required("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);

/**
 * Django API base URL as the server calls it. In production this can be an
 * internal address the public never reaches. Falls back to the public URL so a
 * single-host deployment needs no extra configuration.
 */
export const API_INTERNAL_URL = process.env.API_INTERNAL_URL
  ? required("API_INTERNAL_URL", process.env.API_INTERNAL_URL)
  : API_URL;

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** Server components and route handlers should call the internal address. */
export function apiBase(): string {
  return typeof window === "undefined" ? API_INTERNAL_URL : API_URL;
}
