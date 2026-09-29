import SightseeingDetailPage from "./SightseeingDetailPage";
import { buildMetadata, seoFromApi } from "@/lib/seoHelpers";
import { previewQuery } from "@/lib/preview";
import PreviewBanner from "@/components/PreviewBanner";
import { notFound } from "next/navigation";
import { asList } from "@/lib/api";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const preview = await previewQuery();
  const res = await fetch(`${apiUrl}/api/sightseeing/${slug}/${preview}`, { cache: "no-store" });
  if (!res.ok) return { title: "Sightseeing Not Found", robots: { index: false, follow: true } };
  const place = await res.json();

  const seo = seoFromApi(place, { preview: Boolean(preview) });
  // meta_title is filled with the name automatically, so only a custom title replaces the default
  const customTitle = place.meta_title && place.meta_title !== place.name ? place.meta_title : null;
  return buildMetadata({
    title: customTitle || `${place.name} - Sightseeing`,
    description: place.meta_description || `Explore ${place.name}.`,
    path: `/sightseeing/${place.slug || slug}`,
    image: seo.ogImage || place.featured_image?.optimized_banner || "/images/gokeyslogo.png",
    canonical: seo.canonical,
    noindex: seo.noindex,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 1️⃣ Fetch the main place (a draft too, when opened from the admin "Preview draft" link)
  const preview = await previewQuery();
  const resPlace = await fetch(`${apiUrl}/api/sightseeing/${slug}/${preview}`, { cache: "no-store" });
  if (resPlace.status === 404) notFound(); // unknown or draft place: real 404, not a crash
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
      similarPlaces = asList(await resSimilar.json()); // the API is paginated ({ results: [...] })
    }
  }


  // 3️⃣ Fallback if missing or empty
  if (
    !place.destination?.id ||
    !place.id ||
    !Array.isArray(similarPlaces) ||
    similarPlaces.length === 0
  ) {
    const resFallback = await fetch(`${apiUrl}/api/sightseeing/?page_size=4`, { cache: "no-store" });
    if (resFallback.ok) {
      similarPlaces = asList(await resFallback.json()).filter((p) => p.id !== place.id).slice(0, 3);
    }
  }

  return (
    <>
      {preview && <PreviewBanner path={`/sightseeing/${slug}`} />}
      <SightseeingDetailPage place={place} similarPlaces={similarPlaces} />
    </>
  );
}
