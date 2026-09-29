import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE } from "@/lib/preview";

// Opened by the admin "Preview draft ↗" button: /api/preview?token=<signed token>.
// Django checks the token and tells us which page it is for; then draft mode is turned on
// (for this browser only) and the visitor is sent to that page.
export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";

  let path = null;
  try {
    const res = await fetch(`${apiUrl}/api/preview/resolve/?token=${encodeURIComponent(token)}`, { cache: "no-store" });
    if (res.ok) path = (await res.json()).path;
  } catch (err) {
    console.error("Preview resolve failed:", err);
  }

  // Only ever redirect to a path on this site
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return new Response("This preview link is invalid or has expired. Open the draft in the admin and click 'Preview draft' again.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  (await draftMode()).enable();
  (await cookies()).set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  redirect(path);
}
