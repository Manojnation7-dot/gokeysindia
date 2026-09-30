import { buildMetadata } from "@/lib/seoHelpers";
import GroupTour from "./GroupTour";
import { fetchAllResults } from "@/lib/api";
import { slimGroupTour } from "@/lib/slim";

export const revalidate = 300;

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
  const tours = await fetchAllResults("group-tours");

  return <GroupTour tours={tours.map(slimGroupTour)} />;
}
