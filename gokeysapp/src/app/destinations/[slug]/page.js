import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
import DestinationDetailPage from "./DestinationDetailPage";
import { notFound } from "next/navigation";

// Constant to avoid repetition and ensure safety
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * GENERATE METADATA
 */
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    if (!slug) return {};

    const destination = await fetchData("destinations", slug);

    // Fallback if destination doesn't exist
    if (!destination || destination.detail) {
      return { title: "Destination | GoKeys" };
    }

    return buildMetadata({
      title: `${destination?.meta_title || destination?.name || "Destination"}`,
      description:
        destination?.meta_description ||
        `Discover ${destination?.name || "this destination"} with GoKeys.`,
      path: `/destinations/${slug}`,
      image: destination?.featured_image?.image || "/images/gokeyslogo.png",
    });
  } catch (e) {
    console.error("Metadata Error:", e.message);
    return { title: "Explore Destinations | GoKeys" };
  }
}

/**
 * MAIN PAGE COMPONENT
 */
export default async function DestinationPage({ params }) {
  // 1. Safety Check for Environment Variable
  if (!API_BASE) {
    return notFound();
  }

  const { slug } = await params;

  try {
    // 2. Fetch Destination Data with explicit error handling
    const destRes = await fetch(`${API_BASE}/api/destinations/${slug}/`, {
      next: { revalidate: 60 },
    });

    if (destRes.status === 404) return notFound();
    if (!destRes.ok) throw new Error(`API returned status ${destRes.status}`);

    const destination = await destRes.json();

    // 3. Validation Logic
    if (!destination || (destination.detail && !destination.name)) {
      return notFound();
    }

    // 4. Process Nearby Attractions (Safe Regex)
    let nearbyAttractionsList = [];
    const rawAttractions = destination.nearby_attractions;
    if (typeof rawAttractions === "string" && rawAttractions.trim() !== "") {
      nearbyAttractionsList = rawAttractions
        .match(/<p[^>]*>(.*?)<\/p>/gi)
        ?.map((p) => p.replace(/<[^>]*>/g, "").trim())
        .filter(Boolean) || [];
    }

    // 5. Fetch Parallel Data (Tours & Hotels)
    // We use a safe wrapper to prevent one failing API from crashing the whole page
    const [toursRes, hotelsRes] = await Promise.all([
      fetch(`${API_BASE}/api/tours/?destination=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } }).catch(() => null),
      fetch(`${API_BASE}/api/hotels/?destination=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } }).catch(() => null),
    ]);

    // 6. Process Tours Safely
    let safeTours = [];
    if (toursRes?.ok) {
      const toursRaw = await toursRes.json();
      const results = Array.isArray(toursRaw?.results) ? toursRaw.results : [];
      safeTours = results.slice(0, 3).map((tour) => ({
        ...tour,
        content: typeof tour.content === "string" 
          ? tour.content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160) + "..."
          : "No description available.",
      }));
    }

    // 7. Process Hotels Safely
    let hotels = [];
    if (hotelsRes?.ok) {
      const hotelsRaw = await hotelsRes.json();
      hotels = Array.isArray(hotelsRaw?.results) ? hotelsRaw.results : Array.isArray(hotelsRaw) ? hotelsRaw : [];
    }

    // 8. Render
    return (
      <DestinationDetailPage
        destination={destination}
        tours={safeTours}
        hotels={hotels}
        slug={slug}
        nearbyAttractionsList={nearbyAttractionsList}
      />
    );
  } catch (error) {
    // This catch-all prevents the 500 error for Googlebot
    console.error(`Page crash prevented for /destinations/${slug}:`, error.message);
    return notFound(); 
  }
}