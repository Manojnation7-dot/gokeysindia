import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE } from "@/lib/preview";

// "Exit preview" link in the preview banner: back to the normal (published) site.
export async function GET(request) {
  const requested = new URL(request.url).searchParams.get("path") || "/";
  const path = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  (await draftMode()).disable();
  (await cookies()).delete(PREVIEW_COOKIE);
  redirect(path);
}
