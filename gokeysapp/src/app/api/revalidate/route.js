import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { API_CACHE_TAG } from "@/lib/api";

// Constant-time comparison (hashing first gives equal lengths)
const sameSecret = (a, b) =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

const MAX_PATHS = 50;
// A site path: starts with "/", no "..", no query or fragment, nothing but URL path characters.
const validPath = (p) => typeof p === "string" && p.length <= 300 && p.startsWith("/") && !p.includes("..") && /^\/[A-Za-z0-9\-._~/%]*$/.test(p);

// Called by the Django admin after something is saved or deleted (gokeyscontent/revalidate.py). Needs
// REVALIDATE_SECRET (same value as NEXT_REVALIDATE_SECRET in the Django .env) in the Vercel environment variables.
//
// Body {"paths": ["/tours/x", "/tours", "/"]}: only those pages are refreshed (Django then opens each one, so the next
// visitor gets a cached page). Body {"all": true} (or no body): content that is not a single page changed (settings,
// banners, reviews, online booking switched on or off...): the cached API data expires at once and every page is
// re-rendered on its next visit. ("max" here used to mean stale-while-revalidate: visitors kept getting the old data,
// e.g. book_online false, until each page was saved again. Django's manage.py refresh_website also sends every page
// by name.)
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !sameSecret(request.headers.get("x-revalidate-secret") || "", secret)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }
  let body = {};
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json({ revalidated: false, error: "Body must be JSON" }, { status: 400 });
  }
  const paths = body.paths ?? [];
  if (!Array.isArray(paths) || paths.length > MAX_PATHS || !paths.every(validPath)) {
    return NextResponse.json({ revalidated: false, error: `paths: up to ${MAX_PATHS} site paths starting with "/"` }, { status: 400 });
  }
  const all = body.all === true || (!paths.length && body.paths === undefined);
  if (all) {
    revalidateTag(API_CACHE_TAG, { expire: 0 }); // every cached API response expires now
    revalidatePath("/", "layout"); // and every page under the root layout
  }
  for (const path of new Set(paths)) revalidatePath(path);
  return NextResponse.json({ revalidated: true, all, paths: [...new Set(paths)], at: new Date().toISOString() });
}
