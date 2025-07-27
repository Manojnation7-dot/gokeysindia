import HotelListByDestination from "./HotelListByDestination";
import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
import { buildBreadcrumbList } from "@/lib/seoSchemas";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const destData = await fetchData("destinations", resolvedParams.destination);
  return buildMetadata({
    title: `Hotels in ${destData?.name || resolvedParams.destination}`,
    description: `Find the best hotels in ${destData?.name || resolvedParams.destination}`,
    path: `/hotels/${resolvedParams.destination}`,
    image: destData?.featured_image?.image || "/default-og.jpg",
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const destinationData = await fetchData("destinations", resolvedParams.destination);

  const destinationSlug = destinationData?.slug
    || destinationData?.name?.trim().toLowerCase().replace(/\s+/g, "-")
    || resolvedParams.destination;

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HotelListByDestination
        destination={destinationSlug}
        destinationData={destinationData}
      />
    </>
  );
}