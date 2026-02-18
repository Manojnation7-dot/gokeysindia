import { fetchData } from "@/lib/api";
import GroupTourDetails from "./GroupTourDetails";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";

  // ✅ Fetch current tour
  const data = await fetchData("group-tours", slug);
  const tourData = data?.slug ? data : data?.data || null;
  if (!tourData) return notFound();

  // ✅ Fetch all tours (for similarity)
  let similarTours = [];
  const resAll = await fetch(`${apiUrl}/api/group-tours/`, {
    cache: "no-store",
  });

  if (resAll.ok) {
    const allTours = (await resAll.json()).results || [];

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
  );
}
