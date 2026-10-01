import TourListPage from "./TourListPage";
import { buildMetadata } from "@/lib/seoHelpers";
import { fetchAllResults } from "@/lib/api";
import { slimTour } from "@/lib/slim";

export const revalidate = 300;

export async function generateMetadata() {
  return buildMetadata({
    title: "Tour Packages",
    description:
      "Tour packages from Haridwar by Gokeys India: Char Dham Yatra, Kedarnath, Badrinath, Auli, Mussoorie and Nainital trips. Call for the best rates.",
    path: "/tours",
    image: "/images/gokeyslogo.png",
  });
}

export default async function Page() {
  // All tours and trip types (the API sends 8 per page by default)
  const [tours, tripTypes] = await Promise.all([
    fetchAllResults("tours"),
    fetchAllResults("trip-types"),
  ]);

  return <TourListPage tours={tours.map(slimTour)} tripTypes={tripTypes} />;
}
