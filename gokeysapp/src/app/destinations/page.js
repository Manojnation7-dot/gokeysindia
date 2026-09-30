import { buildMetadata } from "@/lib/seoHelpers";
import DestinationListPage from "./DestinationListPage";
import { CACHED } from "@/lib/api";
import { slimDestination } from "@/lib/slim";

export const revalidate = 300;

export async function generateMetadata() {
  return buildMetadata({
    title: "Explore Best Destinations in India",
    description:
      "Discover amazing destinations across India with Gokeys. Find breathtaking places, hidden gems, and plan your next adventure.",
    path: "/destinations",
    image: "/images/gokeyslogo.png",
  });
}

export default async function DestinationsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/destinations/`,
    CACHED
  );

  const data = await res.json();

  // 🔥 Works for BOTH paginated & non-paginated API
  const destinations = (data.results || data || []).map(slimDestination);

  return <DestinationListPage destinations={destinations} />;
}
