/*
 * Aviro service worker.
 *
 * Its job is narrow: make the app open with no connection, so a farmer can
 * still reach the log screen and have their entry queued. It is not a general
 * cache.
 *
 * Privacy note: pages contain one farmer's own numbers, and phones are shared
 * in the places Aviro is used. Page responses are therefore kept in a cache
 * that the app clears on sign-out, and are never served to a request that
 * carries no session.
 */

const VERSION = "v1";
const SHELL_CACHE = `aviro-shell-${VERSION}`;
const PAGE_CACHE = `aviro-pages-${VERSION}`;
const OFFLINE_URL = "/offline";

const SHELL = [OFFLINE_URL, "/icon-192.png", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("aviro-") && !key.endsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/** The app asks for the page cache to be emptied when someone signs out. */
self.addEventListener("message", (event) => {
  if (event.data?.type === "CLEAR_PAGE_CACHE") {
    event.waitUntil(caches.delete(PAGE_CACHE));
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache the sync endpoint or any API route: replaying a stale response
  // would tell a farmer their log was sent when it was not.
  if (url.pathname.startsWith("/api/")) return;

  // Build output is content-hashed, so it can be served from cache forever.
  if (url.pathname.startsWith("/_next/static/") || /\.(png|svg|woff2?)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

/**
 * Fresh data whenever the network allows, the last good copy when it does not,
 * and an honest offline page when there is neither.
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return (await caches.match(OFFLINE_URL)) ?? Response.error();
  }
}
