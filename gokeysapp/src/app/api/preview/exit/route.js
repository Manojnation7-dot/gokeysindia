import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE } from "@/lib/preview";

// "Exit preview" link in the preview banner: back to the normal (published) site.
export async function GET(request) {
  const requested = new URL(request.url).searchParams.get("path") || "/";
  // Only a path on this site: "/\evil.com" counts as "//evil.com" in browsers, so refuse it too
  const path = /^\/(?![\/\\])/.test(requested) ? requested : "/";

  (await draftMode()).disable();
  (await cookies()).delete(PREVIEW_COOKIE);
  redirect(path);
}
