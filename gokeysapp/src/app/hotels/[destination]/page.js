import HotelListByDestination from "./HotelListByDestination";
import { hotelDestinationParams } from "@/lib/staticParams";
import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData, fetchListData } from "@/lib/api";
import { buildBreadcrumbList } from "@/lib/seoSchemas";

export const revalidate = 86400; // 24 h safety net; admin saves refresh the page at once (api/revalidate)
// Every live page is built at deploy time; new ones are built on their first visit (dynamicParams).
export async function generateStaticParams() {
  return hotelDestinationParams();
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const destData = await fetchData("destinations", resolvedParams.destination);
  return buildMetadata({
    title: `Hotels in ${destData?.name || resolvedParams.destination}`,
    description: `Find the best hotels in ${destData?.name || resolvedParams.destination}`,
    path: `/hotels/${resolvedParams.destination}`,
    image: destData?.featured_image?.optimized_banner || destData?.featured_image?.image,
  });
}

// The fields a hotel card shows (the API sends whole hotel records)
const hotelCard = (h) => ({
  id: h.id, slug: h.slug, name: h.name, front_image_url: h.front_image_url || null,
  star_rating: h.star_rating ?? null, location: h.location || "", tariff_starting_from: h.tariff_starting_from,
});

export default async function Page({ params }) {
  const resolvedParams = await params;
  const destinationData = await fetchData("destinations", resolvedParams.destination);

  const destinationSlug = destinationData?.slug
    || destinationData?.name?.trim().toLowerCase().replace(/\s+/g, "-")
    || resolvedParams.destination;

  // The hotels are in the page HTML (for visitors and search engines); the browser only fetches again when a filter
  // changes. Same default filter as the list (up to ₹50,000). null when the API fails: the list then loads in the browser.
  let initialHotels = null;
  try {
    const data = await fetchListData("hotels", { destination: destinationSlug, tariff_starting_from__lte: 50000 });
    initialHotels = (Array.isArray(data) ? data : data?.results || []).map(hotelCard);
  } catch {
    initialHotels = null;
  }

  // Use relative URLs instead of absolute URLs
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Best Hotels in India", url: "/hotels" },
    {
      name: destinationData?.name || resolvedParams.destination,
      url: `/hotels/${destinationSlug}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <HotelListByDestination
        destination={destinationSlug}
        destinationData={destinationData}
        initialHotels={initialHotels}
      />
    </>
  );
}