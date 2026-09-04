import "server-only";

/**
 * Environment configuration.
 *
 * Read lazily, on first use, rather than when the module loads. A build should
 * not need runtime configuration: the same artifact is meant to be built once
 * and run in several environments, and validating at import time made
 * `next build` fail on any platform where the variable is only set for the
 * running service. It is still validated — just at the moment it is needed,
 * where the error names the missing variable and the app has not silently
 * fetched from "undefined/api/batches".
 *
 * There is deliberately no NEXT_PUBLIC_ variable. The browser never calls
 * Django: every request goes through a Server Action or route handler on this
 * origin, which is what lets the session live in an httpOnly cookie. Keeping
 * the address server-side also means it is not baked into the client bundle.
 */

function validated(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. ` +
        `Set it on the service, or copy .env.example to .env.local for local work.`,
    );
  }
  try {
    new URL(value);
  } catch {
    throw new Error(`Environment variable ${name} is not a valid URL: "${value}"`);
  }
  return value.replace(/\/$/, "");
}

let resolved: string | undefined;

/**
 * Where Django is, as this server reaches it.
 *
 * Prefers a private address when the platform provides one — faster, and it
 * keeps API traffic off the public network — and falls back to the public URL
 * so a single-host deployment needs no extra configuration.
 */
export function apiUrl(): string {
  if (resolved === undefined) {
    resolved = process.env.API_INTERNAL_URL
      ? validated("API_INTERNAL_URL", process.env.API_INTERNAL_URL)
      : validated("API_URL", process.env.API_URL);
  }
  return resolved;
}

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
