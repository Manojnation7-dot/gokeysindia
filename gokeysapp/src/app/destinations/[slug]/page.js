import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
import DestinationDetailPage from "./DestinationDetailPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const destination = await fetchData("destinations", slug);

  return buildMetadata({
    title: `${destination?.name || "Destination"}`,
    description:
      destination?.meta_description ||
      `Discover ${destination?.name || "this destination"} with travel tips, tours, and hotels.`,
    path: `/destinations/${slug}`,
    image: destination?.featured_image?.image || "/images/gokeyslogo.png",
  });
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;

  const destRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations/${slug}/`, {
    next: { revalidate: 60 },
  });
  const destination = await destRes.json();

const nearbyAttractionsList = (destination.nearby_attractions || "")
  .match(/<p[^>]*>(.*?)<\/p>/gi)
  ?.map((p) =>
    p.replace(/^<p[^>]*>/i, "").replace(/<\/p>$/i, "").trim()
  )
  .filter(Boolean) || [];

const toursRes = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/tours/?destination=${encodeURIComponent(slug)}`, 
  {
    next: { revalidate: 60 },
  }
);

const toursRaw = await toursRes.json();

const safeTours = Array.isArray(toursRaw.results)
  ? toursRaw.results
      .map(tour => ({
        ...tour,
        content: tour.content
          ? tour.content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160) + "..."
          : "No description available."
      }))
      .slice(0, 3) // ✅ limit to 3 tours
  : [];

  const hotelsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels/?destination=${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
  const hotels = await hotelsRes.json();

  return (
    <DestinationDetailPage
      destination={destination}
      tours={safeTours}
      hotels={hotels}
      nearbyAttractionsList={nearbyAttractionsList}
    />
  );
}