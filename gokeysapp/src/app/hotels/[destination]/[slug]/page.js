import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData, fetchListData } from "@/lib/api";
import HotelDetailPage from "./HotelDetailPage"; // ✅ The Client Component
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { destination, slug } = await params;

  const hotel = await fetchData("hotels", slug);

  // Validate the hotel belongs to the destination
  if (!hotel || hotel.destination?.toLowerCase() !== destination.toLowerCase()) {
    return buildMetadata({
      title: "Hotel Not Found ",
      description: "Sorry, the hotel you’re looking for does not exist.",
      path: `/hotels/${destination}/${slug}`,
      image: "/images/default-og.jpg",
    });
  }

  return buildMetadata({
    title: `${hotel.name} in ${hotel.destination}`,
    description: hotel.meta_description || hotel.description?.substring(0, 150),
    path: `/hotels/${destination}/${slug}`,
    image: hotel.front_image_url || "/images/default-og.jpg",
  });
}

export default async function Page({ params }) {
  const { destination, slug } = await params;

  const hotel = await fetchData("hotels", slug);

  if (!hotel || hotel.destination?.toLowerCase() !== destination.toLowerCase()) {
    return notFound();
  }

    const relatedPlaces = await fetchListData("sightseeing", { destination });
    const relatedTours = await fetchListData("tours", { destination });

  return (
    <HotelDetailPage hotelData={hotel} 
      relatedPlaces={relatedPlaces}
      relatedTours={relatedTours}
    />
  );
}