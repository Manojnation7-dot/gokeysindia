import BestSellingGroupTrips from "./BestSellingGroupTrips"; // 👈 The Client Component
import { CACHED } from "@/lib/api";
import { slimGroupTour } from "@/lib/slim";

export default async function BestSellingGroupTripsWrapper() {
  let tours = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/best-selling-group-trips/`, CACHED);
    if (!res.ok) throw new Error(`status ${res.status}`);
    tours = (await res.json()).map(slimGroupTour);
  } catch (error) {
    console.error("Error fetching best selling group trips:", error);
  }

  return <BestSellingGroupTrips tours={tours} />;
}