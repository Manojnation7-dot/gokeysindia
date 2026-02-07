import { buildMetadata } from "@/lib/seoHelpers";
import HotelsHomePage from "./HotelsHomePage";
import { fetchData } from "@/lib/api";

export async function generateMetadata() {
  return buildMetadata({
    title: "Find Hotels in India",
    description:
      "Find the Best Hotels in India with Gokeys India and explore Hotels, Homestays, Resorts, Lodges and more.",
    path: "/hotels",
    image: "/images/gokeyslogo.png",
  });
}

export default async function Page() {
  const hotels = await fetchData("hotels/?is_active=true");

  return <HotelsHomePage hotels={hotels || []} />;
}
