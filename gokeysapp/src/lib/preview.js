// Draft preview (server components only). The admin "Preview draft" button opens
// /api/preview?token=..., which turns on Next.js draft mode and stores the token in a cookie.
// Detail pages then pass ?preview=<token> to the API so that one draft is returned.
import { cookies, draftMode } from "next/headers";

export const PREVIEW_COOKIE = "gk_preview";

export async function getPreviewToken() {
  // draftMode() keeps normal pages static; cookies() is only read in draft mode
  // (no try/catch: Next.js needs to see dynamic-rendering signals)
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (await cookies()).get(PREVIEW_COOKIE)?.value || null;
}

// "?preview=<token>" to append to a detail API URL, or "" for normal visitors
export async function previewQuery() {
  const token = await getPreviewToken();
  return token ? `?preview=${encodeURIComponent(token)}` : "";
}
