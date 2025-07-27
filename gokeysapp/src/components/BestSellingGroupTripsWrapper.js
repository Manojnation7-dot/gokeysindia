import BestSellingGroupTrips from "./BestSellingGroupTrips"; // 👈 The Client Component

export default async function BestSellingGroupTripsWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/best-selling-group-trips/`, {
    cache: "no-store", // or "force-dynamic" if you want
  });
  const tours = await res.json();

  return <BestSellingGroupTrips tours={tours} />;
}