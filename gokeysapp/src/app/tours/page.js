import TourListPage from "./TourListPage";
import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";

export async function generateMetadata() {
  return buildMetadata({
    title: "Tour Packages",
    description:
      "Check Out the latest Tour Package available at Gokeys with Different Destination, Places and activities, Call for Best Rates for tour package throughout the India.",
    path: "/tours",
    image: "/images/gokeyslogo.png",
  });
}

export default async function Page() {
  const toursData = await fetchData("tours");
  const tripTypesData = await fetchData("trip-types");

  const tours = Array.isArray(toursData) ? toursData : toursData.results || [];
  const tripTypes = Array.isArray(tripTypesData)
    ? tripTypesData
    : tripTypesData.results || [];

  return <TourListPage tours={tours} tripTypes={tripTypes} />;
}
