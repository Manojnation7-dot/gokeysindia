import { buildMetadata, seoFromApi } from "@/lib/seoHelpers";
import { slugParams } from "@/lib/staticParams";
import { previewQuery } from "@/lib/preview";
import PreviewBanner from "@/components/PreviewBanner";
import { fetchData, cacheFor, CACHED } from "@/lib/api";
import DestinationDetailPage from "./DestinationDetailPage";
import { notFound } from "next/navigation";

// Constant to avoid repetition and ensure safety
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * GENERATE METADATA
 */
// Cached for 5 minutes and refreshed when the admin saves (see /api/revalidate);
// each URL is built on its first visit
export const revalidate = 86400; // 24 h safety net; admin saves refresh the page at once (api/revalidate)
// Every live page is built at deploy time; new ones are built on their first visit (dynamicParams).
export async function generateStaticParams() {
  return slugParams("destinations");
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    if (!slug) return {};

    const preview = await previewQuery();
    const destination = await fetchData("destinations", `${slug}${preview}`);

    // Fallback if destination doesn't exist
    if (!destination || destination.detail) {
      return { title: "Destination | GoKeys", robots: { index: false, follow: true } };
    }

    const seo = seoFromApi(destination, { preview: Boolean(preview) });
    return buildMetadata({
      title: `${destination?.meta_title || destination?.name || "Destination"}`,
      description:
        destination?.meta_description ||
        `Discover ${destination?.name || "this destination"} with GoKeys.`,
      path: `/destinations/${slug}`,
      image: seo.ogImage || destination?.featured_image?.image || "/images/gokeyslogo.png",
      canonical: seo.canonical,
      noindex: seo.noindex,
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
  const preview = await previewQuery();

  try {
    // 2. Fetch Destination Data with explicit error handling (a draft too, in preview)
    const destUrl = `${API_BASE}/api/destinations/${slug}/${preview}`;
    const destRes = await fetch(destUrl, cacheFor(destUrl));

    if (destRes.status === 404) return notFound();
    if (!destRes.ok) throw new Error(`API returned status ${destRes.status}`);

    const destination = await destRes.json();

    // 3. Validation Logic
    if (!destination || (destination.detail && !destination.name)) {
      return notFound();
    }

    // 4. Fetch Parallel Data (Tours & Hotels)
    // We use a safe wrapper to prevent one failing API from crashing the whole page
    const [toursRes, hotelsRes] = await Promise.all([
      fetch(`${API_BASE}/api/tours/?destination=${encodeURIComponent(slug)}`, CACHED).catch(() => null),
      fetch(`${API_BASE}/api/hotels/?destination=${encodeURIComponent(slug)}`, CACHED).catch(() => null),
    ]);

    // 5. Process Tours Safely
    let safeTours = [];
    if (toursRes?.ok) {
      const toursRaw = await toursRes.json();
      const results = Array.isArray(toursRaw?.results) ? toursRaw.results : [];
      // The list sends a plain-text summary (older API: the whole content, cut here)
      safeTours = results.slice(0, 3).map((tour) => ({
        ...tour,
        content: tour.summary
          || (typeof tour.content === "string" ? tour.content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160) + "..." : "No description available."),
      }));
    }

    // 6. Process Hotels Safely
    let hotels = [];
    if (hotelsRes?.ok) {
      const hotelsRaw = await hotelsRes.json();
      hotels = Array.isArray(hotelsRaw?.results) ? hotelsRaw.results : Array.isArray(hotelsRaw) ? hotelsRaw : [];
    }

    // 7. Render
    return (
      <>
      {preview && <PreviewBanner path={`/destinations/${slug}`} />}
      <DestinationDetailPage
        destination={destination}
        tours={safeTours}
        hotels={hotels}
        slug={slug}
      />
      </>
    );
  } catch (error) {
    // This catch-all prevents the 500 error for Googlebot
    console.error(`Page crash prevented for /destinations/${slug}:`, error.message);
    return notFound(); 
  }
}