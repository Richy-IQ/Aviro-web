import "server-only";

/**
 * Environment configuration.
 *
 * Read through here rather than touching process.env directly: a missing or
 * malformed value fails at startup with a clear message, instead of surfacing
 * later as a confusing fetch against "undefined/api/batches".
 *
 * Note there is deliberately no NEXT_PUBLIC_ variable here. The browser never
 * calls Django: every request goes through a Server Action or a route handler
 * on this origin, which is what lets the session live in an httpOnly cookie.
 * Keeping the API address server-side means it is not in the client bundle and
 * does not have to be supplied as a build argument.
 */

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

/** Where Django is, as this server reaches it. */
export const API_URL = required("API_URL", process.env.API_URL);

/**
 * An address that never leaves the private network, when the platform offers
 * one. Falls back to the public URL, so a single-host deployment needs no
 * extra configuration.
 */
export const API_INTERNAL_URL = process.env.API_INTERNAL_URL
  ? required("API_INTERNAL_URL", process.env.API_INTERNAL_URL)
  : API_URL;

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
