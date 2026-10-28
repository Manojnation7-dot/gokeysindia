import { buildMetadata, seoFromApi } from "@/lib/seoHelpers";
import { cardHotel, cardTour, slimPlace } from "@/lib/slim";
import { hotelParams } from "@/lib/staticParams";
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

// Cached for 5 minutes and refreshed when the admin saves (see /api/revalidate);
// each URL is built on its first visit
export const revalidate = 86400; // 24 h safety net; admin saves refresh the page at once (api/revalidate)
// Every live page is built at deploy time; new ones are built on their first visit (dynamicParams).
export async function generateStaticParams() {
  return hotelParams();
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
      noindex: true,
    });
  }

  const seo = seoFromApi(hotel, { preview: Boolean(preview) });
  return buildMetadata({
    title: hotel.meta_title || `${hotel.name} in ${hotel.destination}`,
    description: hotel.meta_description || hotel.description?.substring(0, 150),
    path: `/hotels/${destination}/${slug}`,
    image: seo.ogImage || hotel.front_image_url,
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

  // Card fields only: the list endpoints send whole records (a sightseeing place carries its destination's full
  // article), and everything passed to the client component is copied into the page HTML.
  const similarHotels = ((await fetchListData("hotels", { destination })) || [])
    .filter((hotelItem) => hotelItem.slug !== slug).map(cardHotel);
  const relatedToursResponse = await fetchListData("tours", { destination });
  const relatedPlacesResponse = await fetchListData("sightseeing", { destination });

  const relatedTours = (relatedToursResponse?.results || []).slice(0, 4).map(cardTour);
  const relatedPlaces = (relatedPlacesResponse?.results || []).slice(0, 4).map(slimPlace);

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
