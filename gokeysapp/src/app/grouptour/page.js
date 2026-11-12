import { buildMetadata } from "@/lib/seoHelpers";
import GroupTour from "./GroupTour";
import { fetchAllResults } from "@/lib/api";
import { slimGroupTour } from "@/lib/slim";
import { CACHED } from "@/lib/api";

// The hub's own content from the admin (Group Tours > Group tours page); empty sections are hidden
async function getHub() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in"}/api/group-tour-hub/`, CACHED);
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
}

export const revalidate = 86400; // 24 h safety net; admin saves refresh the page at once (api/revalidate)

// Title and description from the admin (Group Tours > Group tours page); these are the fallbacks and the old values.
// The layout adds " | Gokeys India" once (pageTitle skips it when the title already names Gokeys).
const DEFAULT_TITLE = "Group Tours in India";
const DEFAULT_DESCRIPTION = "Explore affordable group tour packages with Gokeys India. Find the best group trips for adventure, trekking, cultural tours, and more.";

export async function generateMetadata() {
  const hub = await getHub();
  return buildMetadata({
    title: hub.meta_title?.trim() || DEFAULT_TITLE,
    description: hub.meta_description?.trim() || DEFAULT_DESCRIPTION,
    path: "/grouptour",
    image: "/images/gokeyslogo.png",
  });
}

export default async function Page() {
  // All group tours (the API sends 8 per page by default)
  const [tours, hub] = await Promise.all([fetchAllResults("group-tours"), getHub()]);

  return <GroupTour tours={tours.map(slimGroupTour)} hub={hub} renderedAt={Date.now()} />;
}
