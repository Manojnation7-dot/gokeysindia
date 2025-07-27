import BestSellingTrips from "./BestSellingTrips";

export default async function BestSellingTripsWrapper() {
  let tours = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/best-selling-trips/`,
      { next: { revalidate: 60 } } // Optional ISR revalidation
    );
    if (!res.ok) throw new Error("Failed to fetch");

    tours = await res.json();
  } catch (error) {
    console.error("Error fetching best selling trips:", error);
  }

  return (
    <BestSellingTrips
      tours={tours}
    />
  );
}