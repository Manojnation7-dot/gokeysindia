import { buildMetadata } from "@/lib/seoHelpers";
import DestinationListPage from "./DestinationListPage";
import { fetchData } from "@/lib/api";

export const dynamic = "force-dynamic"; // or "auto" or "force-static"

export async function generateMetadata() {
  return buildMetadata({
    title: "Explore Best Destinations in India",
    description:
      "Discover amazing destinations across India with Gokeys. Find breathtaking places, hidden gems, and plan your next adventure.",
    path: "/destinations",
    image: "/images/gokeyslogo.png", // Replace with your best OG image
  });
}

export default async function DestinationsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations/`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  // ✅ Extract only the destinations array
  const destinations = data.results;

  return <DestinationListPage destinations={destinations} />;
}