import SightseeingSlider from "./SightseeingSlider";
import { CACHED } from "@/lib/api";
import { slimPlace } from "@/lib/slim";

export default async function SightseeingSliderWrapper({ limit = 8 }) {
  let places = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/sightseeing/?page_size=${limit}`, CACHED);

    if (!res.ok) throw new Error("Failed to fetch sightseeing places");

    const data = await res.json();
    places = (data.results || data).map(slimPlace);
  } catch (err) {
    console.error("Failed to fetch sightseeing places:", err);
  }

  return <SightseeingSlider places={places} />;
}