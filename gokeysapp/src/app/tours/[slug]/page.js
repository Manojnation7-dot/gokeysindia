import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
import { notFound } from "next/navigation";
import TourDetailClient from "@/components/TourDetailsClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const tour = await fetchData(`tours/${slug}`);

  if (!tour) {
    return buildMetadata({
      title: "Tour Not Found",
      description: "Sorry, the tour you’re looking for does not exist.",
      path: `/tours/${slug}`,
      image: "/images/default-og.jpg",
    });
  }

  return buildMetadata({
    title: tour.name || "Amazing Tour",
    description:
      tour.meta_description ||
      `Explore ${tour.name} with Gokeys Travel — ${tour.duration_days} days of unforgettable adventure!`,
    path: `/tours/${slug}`,
    image: tour.featured_image?.image || "/images/default-og.jpg",
  });
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // ✅ 1. Fetch the main tour
  const tour = await fetchData(`tours/${slug}`);
  if (!tour) return notFound();

  let similarTours = [];

  // ✅ Try to get similar tours
  if (tour.destinations?.[0]?.id && tour.id) {
    const resSimilar = await fetch(
      `${apiUrl}/api/tours/similar/${tour.destinations[0].id}/${tour.id}/`,
      { cache: "no-store" }
    );
    if (resSimilar.ok) {
      similarTours = await resSimilar.json();
    }
  }

   // ✅ Fallback if needed
  if (!similarTours.length) {
    const resFallback = await fetch(`${apiUrl}/api/tours/?limit=3`, {
      cache: "no-store",
    });
    if (resFallback.ok) {
      similarTours = await resFallback.json();
    }
  }

  return (
    <TourDetailClient
      baseUrl={apiUrl}
      tourData={tour}
      similarTours={similarTours}
      tourPath="tours"
    />
  );
}