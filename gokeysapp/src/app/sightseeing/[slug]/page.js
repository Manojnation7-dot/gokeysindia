import SightseeingDetailPage from "./SightseeingDetailPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/sightseeing/${slug}/`, { cache: "no-store" });
  const place = await res.json();

  return {
    title: `${place.name} - Sightseeing`,
    description: place.meta_description || `Explore ${place.name}.`,
    openGraph: {
      images: place.featured_image?.optimized_banner || "/images/placeholder.jpg",
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 1️⃣ Fetch the main place
  const resPlace = await fetch(`${apiUrl}/api/sightseeing/${slug}/`, { cache: "no-store" });
  if (!resPlace.ok) throw new Error("Failed to load place");
  const place = await resPlace.json();

  let similarPlaces = [];

  // 2️⃣ Try to fetch real similar places
  if (place.destination?.id && place.id) {
    const resSimilar = await fetch(
      `${apiUrl}/api/sightseeing/similar/${place.destination.id}/${place.id}/`,
      { cache: "no-store" }
    );
    if (resSimilar.ok) {
      similarPlaces = await resSimilar.json();
    }
  }


  // 3️⃣ Fallback if missing or empty
  if (
    !place.destination?.id ||
    !place.id ||
    !Array.isArray(similarPlaces) ||
    similarPlaces.length === 0
  ) {
    console.log("⚠️ Running fallback: using general places");
    const resFallback = await fetch(`${apiUrl}/api/sightseeing/?limit=3`, { cache: "no-store" });
    if (resFallback.ok) {
      similarPlaces = await resFallback.json();
    }
  }

  return <SightseeingDetailPage place={place} similarPlaces={similarPlaces} />;
}
