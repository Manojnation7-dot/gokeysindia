import { fetchData, fetchAllResults } from "@/lib/api";
import GroupTourDetails from "./GroupTourDetails";
import { notFound } from "next/navigation";
import { buildMetadata, seoFromApi } from "@/lib/seoHelpers";
import { previewQuery } from "@/lib/preview";
import PreviewBanner from "@/components/PreviewBanner";

// Cached for 5 minutes and refreshed when the admin saves (see /api/revalidate);
// each URL is built on its first visit
export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const preview = await previewQuery();
  const data = await fetchData("group-tours", `${slug}${preview}`);
  const tour = data?.slug ? data : data?.data || null;
  if (!tour) return { title: "Group Tour Not Found", robots: { index: false, follow: true } };

  const seo = seoFromApi(tour, { preview: Boolean(preview) });
  return buildMetadata({
    title: tour.meta_title || tour.name,
    description: tour.meta_description || `Explore ${tour.name} with Gokeys India.`,
    path: `/grouptour/${tour.slug}`,
    image: seo.ogImage || tour.featured_image?.optimized_banner || tour.featured_image?.image,
    imageAlt: tour.featured_image?.alt_text,
    canonical: seo.canonical,
    noindex: seo.noindex,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";

  // ✅ Fetch current tour (a draft too, when opened from the admin "Preview draft" link)
  const preview = await previewQuery();
  const data = await fetchData("group-tours", `${slug}${preview}`);
  const tourData = data?.slug ? data : data?.data || null;
  if (!tourData) return notFound();

  // ✅ Fetch all tours (for similarity)
  let similarTours = [];
  const allTours = await fetchAllResults("group-tours");

  if (allTours.length) {

    // Filter similar by destination
    const currentDestinations = (tourData.destinations || [])
      .map((d) => (typeof d === "string" ? d.toLowerCase() : d?.name?.toLowerCase()))
      .filter(Boolean);

    similarTours = allTours
      .filter((tour) => {
        if (tour.slug === tourData.slug) return false;

        const tourDest = (tour.destinations || [])
          .map((d) =>
            typeof d === "string"
              ? d.toLowerCase()
              : d?.name?.toLowerCase()
          )
          .filter(Boolean);

        return currentDestinations.some((cd) => tourDest.includes(cd));
      })
      .slice(0, 6);

    // Fallback if none found
    if (!similarTours.length) {
      similarTours = allTours
        .filter((t) => t.slug !== tourData.slug)
        .slice(0, 6);
    }
  }

  return (
    <>
    {preview && <PreviewBanner path={`/grouptour/${slug}`} />}
    <GroupTourDetails
      tourData={tourData}
      similarTours={similarTours}   // 👈 PASS HERE
      baseUrl={apiUrl}
      documentNumber={`GK-${Date.now().toString().slice(-4)}`}
      currentDate={new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
      tourPath="grouptour"
    />
    </>
  );
}
