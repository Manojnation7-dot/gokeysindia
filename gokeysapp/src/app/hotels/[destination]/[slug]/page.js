import { buildMetadata, seoFromApi } from "@/lib/seoHelpers";
import { previewQuery } from "@/lib/preview";
import PreviewBanner from "@/components/PreviewBanner";
import { fetchData, fetchListData } from "@/lib/api";
import HotelDetailPage from "./HotelDetailPage"; // ✅ The Client Component
import { notFound } from "next/navigation";

// True when the hotel belongs to the destination in the URL. Compares the destination
// slug ("jim-corbett"); the name ("Jim Corbett") never matched for multi-word destinations.
function belongsTo(hotel, destination) {
  const hotelDestination = hotel?.destination_slug
    || (hotel?.destination || "").trim().toLowerCase().replace(/\s+/g, "-");
  return !!hotel && hotelDestination === destination.toLowerCase();
}

export async function generateMetadata({ params }) {
  const { destination, slug } = await params;
  const preview = await previewQuery();

  const hotel = await fetchData("hotels", `${slug}${preview}`);

  // Validate the hotel belongs to the destination
  if (!belongsTo(hotel, destination)) {
    return buildMetadata({
      title: "Hotel Not Found ",
      description: "Sorry, the hotel you’re looking for does not exist.",
      path: `/hotels/${destination}/${slug}`,
      image: "/images/default-og.jpg",
    });
  }

  const seo = seoFromApi(hotel, { preview: Boolean(preview) });
  return buildMetadata({
    title: hotel.meta_title || `${hotel.name} in ${hotel.destination}`,
    description: hotel.meta_description || hotel.description?.substring(0, 150),
    path: `/hotels/${destination}/${slug}`,
    image: seo.ogImage || hotel.front_image_url || "/images/default-og.jpg",
    canonical: seo.canonical,
    noindex: seo.noindex,
  });
}

export default async function Page({ params }) {
  const { destination, slug } = await params;
  const preview = await previewQuery();

  const hotel = await fetchData("hotels", `${slug}${preview}`);

  if (!belongsTo(hotel, destination)) {
    return notFound();
  }

    const similarHotels = (await fetchListData("hotels", { destination }))
  ?.filter(hotelItem => hotelItem.slug !== slug);
   const relatedToursResponse = await fetchListData("tours", { destination });
  const relatedPlacesResponse = await fetchListData("sightseeing", { destination });

  const relatedTours = relatedToursResponse?.results?.slice(0, 4) || [];
  const relatedPlaces = relatedPlacesResponse?.results?.slice(0, 4) || [];

  return (
    <>
    {preview && <PreviewBanner path={`/hotels/${destination}/${slug}`} />}
    <HotelDetailPage hotelData={hotel} 
      relatedPlaces={relatedPlaces}
      relatedTours={relatedTours}
      similarHotels={similarHotels}
    />
    </>
  );
}
