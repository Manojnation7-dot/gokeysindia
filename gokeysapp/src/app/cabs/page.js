import CabsPage from "./CabsPage";
import { buildMetadata } from "@/lib/seoHelpers";

export async function generateMetadata() {
  return buildMetadata({
    title: "Cabs at Gokeys",
    description: "Book now ranges of cab services from our own fleet with Gokeys Haridwar. We have best cabs and transportation services for All Over India. Call or WhatsApp us for Cab Booking.",
    path: "/cabs",
    image: "/images/gokeyslogo.png",
  });
}

export default function Page() {
  return <CabsPage />;
}