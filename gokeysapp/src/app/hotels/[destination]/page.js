import HotelListByDestination from "./HotelListByDestination";
import { hotelDestinationParams } from "@/lib/staticParams";
import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <HotelListByDestination
        destination={destinationSlug}
        destinationData={destinationData}
      />
    </>
  );
}