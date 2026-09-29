import { NextResponse } from "next/server";

// Redirect manager: applies the redirects from the Django admin (Gokeys content > Redirects),
// including the automatic 301s made when a published page's URL (slug) changes.
// The list is cached in memory for a few minutes, so most requests make no API call.
// If the API is slow or down, pages load normally (no redirect) instead of failing.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";
const CACHE_MS = 5 * 60 * 1000;
const RETRY_MS = 60 * 1000;
const TIMEOUT_MS = 1500;

let cache = { map: new Map(), expires: 0, loading: null };

async function loadRedirects() {
  try {
    const res = await fetch(`${API_URL}/api/redirects/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const rows = await res.json();
    cache.map = new Map(rows.map((r) => [normalize(r.from), { to: r.to, code: r.code === 302 ? 302 : 301 }]));
    cache.expires = Date.now() + CACHE_MS;
  } catch (err) {
    console.error("Redirect list unavailable:", err?.message || err);
    cache.expires = Date.now() + RETRY_MS; // keep the old list, try again soon
  } finally {
    cache.loading = null;
  }
}

async function getRedirects() {
  if (Date.now() > cache.expires) {
    cache.loading = cache.loading || loadRedirects();
    await cache.loading;
  }
  return cache.map;
}

function normalize(path) {
  let p = path || "/";
  try {
    p = decodeURIComponent(p);
  } catch {}
  return p.replace(/\/+$/, "") || "/";
}

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const redirects = await getRedirects();
  const match = redirects.get(normalize(pathname));
  if (!match) return NextResponse.next();

  const target = /^https?:\/\//.test(match.to)
    ? new URL(match.to)
    : new URL(match.to + search, request.url); // keep ?utm_... query strings
  return NextResponse.redirect(target, match.code);
}

export const config = {
  // Pages only: skip Next.js internals, API routes and files like /images/x.png or /sitemap.xml
  matcher: ["/((?!_next/|api/|favicon\\.ico|images/|.*\\.[a-zA-Z0-9]{2,5}$).*)"],
};
