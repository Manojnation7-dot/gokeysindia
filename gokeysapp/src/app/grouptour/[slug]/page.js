import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
import GroupTourDetails from "./GroupTourDetails";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tourData = await fetchData("group-tours", slug);

  return buildMetadata({
    title: `${tourData?.name || "Group Tour"}`,
    description:
      tourData?.meta_description ||
      `Explore ${tourData?.name || "our group tour"} with best itineraries and prices.`,
    path: `/group-tours/${slug}`,
    image: tourData?.featured_image?.image || "/images/gokeyslogo.png",
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await fetchData("group-tours", slug);
  const tourData = data?.slug ? data : data?.data || null; 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const documentNumber = `GK-${Date.now().toString().slice(-4)}`;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <GroupTourDetails
      tourData={tourData}
      baseUrl={baseUrl}
      documentNumber={documentNumber}
      currentDate={currentDate}
      tourPath="grouptour"
    />
  );
}