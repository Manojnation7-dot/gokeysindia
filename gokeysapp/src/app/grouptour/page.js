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

export async function generateMetadata() {
  return buildMetadata({
    title: "Group Tours in India",
    description: "Explore affordable group tour packages with Gokeys India. Find the best group trips for adventure, trekking, cultural tours, and more.",
    path: "/grouptour",
    image: "/images/gokeyslogo.png",
  });
}

export default async function Page() {
  // All group tours (the API sends 8 per page by default)
  const [tours, hub] = await Promise.all([fetchAllResults("group-tours"), getHub()]);

  return <GroupTour tours={tours.map(slimGroupTour)} hub={hub} renderedAt={Date.now()} />;
}
