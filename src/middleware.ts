import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE } from "@/lib/api/session";

/**
 * Route gate.
 *
 * Presence of the session cookie is enough to decide where to send someone;
 * whether the token is still valid is the API's business, and the client
 * handles a 401 by refreshing or signing out. Middleware only steers.
 */

// Readable without an account. The guide is deliberately public — it is the
// best reason to install Aviro, and costs nothing to give away. The offline
// page must be reachable with no session because that is precisely when it is
// shown.
const PUBLIC_PATHS = ["/welcome", "/guide", "/offline"];

// Fetched by the browser rather than navigated to by a person. Redirecting
// these breaks installation and offline start-up entirely: a service worker
// served a 307 to /welcome never registers.
const PUBLIC_FILES = ["/sw.js", "/manifest.webmanifest"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = request.cookies.has(ACCESS_COOKIE);
  const isPublic =
    PUBLIC_FILES.includes(pathname) ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!signedIn && !isPublic) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }
  if (signedIn && pathname === "/welcome") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next's own assets and the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
