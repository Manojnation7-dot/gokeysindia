import SightseeingSlider from "./SightseeingSlider";

export default async function SightseeingSliderWrapper({ limit = 8 }) {
  let places = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/sightseeing/?limit=${limit}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });

    if (!res.ok) throw new Error("Failed to fetch sightseeing places");

    const data = await res.json();
    places = data.results || data;
  } catch (err) {
    console.error("Failed to fetch sightseeing places:", err);
  }

  return <SightseeingSlider places={places} />;
}