import CabsPage from "./CabsPage";
import { buildMetadata } from "@/lib/seoHelpers";

export async function generateMetadata() {
  return buildMetadata({
    title: "Cabs at Gokeys",
    description: "Book a cab in Haridwar from Gokeys India's own fleet: Dzire, Ertiga, Innova Crysta, Tempo Traveller and Urbania for Uttarakhand and all-India trips.",
    path: "/cabs",
    image: "/images/gokeyslogo.png",
  });
}

export default function Page() {
  return <CabsPage />;
}