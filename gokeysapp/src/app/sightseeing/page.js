import SightseeingListPage from "./SightseeingListPage";
import { buildMetadata } from "@/lib/seoHelpers";

export async function generateMetadata() {
  return buildMetadata({
    title: "Top Sightseeing, Activity",
    description: "Explore the amazing sightseeing, activities and places...",
    path: "/sightseeing",
    image: "/images/gokeyslogo.png",
  });
}

export default async function page() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sightseeing/`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  // If your API is paginated:
  const sightseeing = (data.results || data).map((place) => ({
    ...place,
    description: stripHtmlServer(place.description || ""),
  }));

  return <SightseeingListPage places={sightseeing} />;
}

function stripHtmlServer(html) {
  return html ? html.replace(/<[^>]+>/g, "") : "";
}