import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

// Constant-time comparison (hashing first gives equal lengths)
const sameSecret = (a, b) =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
import { API_CACHE_TAG } from "@/lib/api";

// Called by the Django admin after something is saved or deleted, so the change shows
// at once instead of after the 5 minute cache. Needs REVALIDATE_SECRET (same value as
// NEXT_REVALIDATE_SECRET in the Django .env) in the Vercel environment variables.
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !sameSecret(request.headers.get("x-revalidate-secret") || "", secret)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(API_CACHE_TAG, { expire: 0 }); // every cached API response
  revalidatePath("/", "layout"); // every page (and the sitemap)
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
