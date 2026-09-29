import SightseeingListPage from "./SightseeingListPage";
import { buildMetadata } from "@/lib/seoHelpers";
import { fetchAllResults } from "@/lib/api";

export async function generateMetadata() {
  return buildMetadata({
    title: "Top Sightseeing, Activity",
    description: "Explore the amazing sightseeing, activities and places...",
    path: "/sightseeing",
    image: "/images/gokeyslogo.png",
  });
}

export default async function page() {

  // All places (the API sends 8 per page by default)
  const places = await fetchAllResults("sightseeing");
  const sightseeing = places.map((place) => ({
    ...place,
    description: stripHtmlServer(place.description || ""),
  }));

  return <SightseeingListPage places={sightseeing} />;
}

function stripHtmlServer(html) {
  return html ? html.replace(/<[^>]+>/g, "") : "";
}