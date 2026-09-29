import { buildMetadata, seoFromApi } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
import { previewQuery } from "@/lib/preview";
import { notFound } from "next/navigation";
import TourDetailClient from "@/components/TourDetailsClient";
import PreviewBanner from "@/components/PreviewBanner";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const preview = await previewQuery();

  const tour = await fetchData(`tours/${slug}${preview}`);

  if (!tour) {
    return buildMetadata({
      title: "Tour Not Found",
      description: "Sorry, the tour you’re looking for does not exist.",
      path: `/tours/${slug}`,
      image: "/images/default-og.jpg",
      noindex: true,
    });
  }

  const seo = seoFromApi(tour, { preview: Boolean(preview) });
  return buildMetadata({
    title: tour.meta_title || "Amazing Tour",
    description:
      tour.meta_description ||
      `Explore ${tour.name} with Gokeys Travel — ${tour.duration_days} days of unforgettable adventure!`,
    path: `/tours/${slug}`,
    image: seo.ogImage || tour.featured_image?.image || "/images/default-og.jpg",
    canonical: seo.canonical,
    noindex: seo.noindex,
  });
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const preview = await previewQuery();

  // ✅ 1. Fetch the main tour
  const tour = await fetchData(`tours/${slug}${preview}`);
  if (!tour) return notFound();

  let similarTours = [];

    // ✅ Try to get similar tours (smart backend version)
    if (tour.id) {
      const resSimilar = await fetch(
        `${apiUrl}/api/similar-smart/${tour.id}/`,
        { cache: "no-store" }
      );

      if (resSimilar.ok) {
        const data = await resSimilar.json();
        similarTours = (data.results || []).slice(0, 3); // 👈 top 3 (hand-picked first, then best match)

      }
    }

    // ✅ Fallback if no smart results
    if (!similarTours.length) {
      const resFallback = await fetch(`${apiUrl}/api/tours/?page_size=4`, {
        cache: "no-store",
      });
      if (resFallback.ok) {
        const data = await resFallback.json();
        similarTours = (data.results || []).filter((t) => t.id !== tour.id).slice(0, 3);

      }
    }

  return (
    <>
      {preview && <PreviewBanner path={`/tours/${slug}`} />}
      <TourDetailClient
        baseUrl={apiUrl}
        tourData={tour}
        similarTours={similarTours}
        tourPath="tours"
      />
    </>
  );
}
