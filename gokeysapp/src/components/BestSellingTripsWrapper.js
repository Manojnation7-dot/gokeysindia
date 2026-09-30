import BestSellingTrips from "./BestSellingTrips";
import { CACHED } from "@/lib/api";
import { slimTour } from "@/lib/slim";

export default async function BestSellingTripsWrapper() {
  let tours = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/best-selling-trips/`,
      CACHED
    );
    if (!res.ok) throw new Error("Failed to fetch");

    tours = (await res.json()).map(slimTour);
  } catch (error) {
    console.error("Error fetching best selling trips:", error);
  }

  return (
    <BestSellingTrips
      tours={tours}
    />
  );
}