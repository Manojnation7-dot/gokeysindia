import { buildMetadata } from "@/lib/seoHelpers";
import HotelsHomePage from "./HotelsHomePage";
import { fetchData } from "@/lib/api";

export async function generateMetadata() {
  return buildMetadata({
    title: "Find Hotels in India",
    description: "Find the Best Hotels in India with Gokeys India and explore the amazing Hotels, Homestays, Resorts, Lodges and more in India.",
    path: "/hotels",
    image: "/images/gokeyslogo.png",
  });
}

export default async function Page() {
  const response = await fetchData("hotels/?is_active=true");
  const hotels = Array.isArray(response) ? response : response?.results || [];

  return <HotelsHomePage hotels={hotels} />;
}