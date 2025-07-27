import { buildMetadata } from "@/lib/seoHelpers";
import GroupTour from "./GroupTour";
import { fetchData } from "@/lib/api";

export const dynamic = "force-dynamic"; // Optional if you always want fresh data

export async function generateMetadata() {
  return buildMetadata({
    title: "Group Tours in India",
    description: "Explore affordable group tour packages with Gokeys India. Find the best group trips for adventure, trekking, cultural tours, and more.",
    path: "/group-tour",
    image: "/images/gokeyslogo.png",
  });
}

export default async function Page() {
  const response = await fetchData("group-tours/?is_active=true");
  const tours = Array.isArray(response) ? response : response?.results || [];

  return <GroupTour tours={tours} />;
}
