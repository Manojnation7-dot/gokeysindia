

import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import BestSellingTripsWrapper from "@/components/BestSellingTripsWrapper";
import SightseeingSliderWrapper from "@/components/SightseeingSliderWrapper";
import CabSlider from "@/components/CabSlider";
import TravelStoriesWrapper from "@/components/TravelStoriesWrapper";
import CTASection from "@/components/CTASection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MostSearchedPackages from "@/components/MostSearchedPages";
import BestSellingGroupTripsWrapper from "@/components/BestSellingGroupTripsWrapper";
import SmartSEO from "@/components/SmartSEO";
import {
  buildLocalBusinessSchema,
  buildImageObject,
  buildBreadcrumbList,
} from "@/lib/seoSchemas";

async function getFeaturedDestinations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-destinations/`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function HomePage() {
  const destinations = await getFeaturedDestinations();

  const pageSchemas = [
    // ✅ Local Business schema
    buildLocalBusinessSchema(),

    // ✅ Hero image schema (ImageObject)
    buildImageObject({
      url: "/images/gokeyslogo.png",
      width: 800,
      height: 600,
    }),

    // ✅ BreadcrumbList for Home
    buildBreadcrumbList([
      { name: "Home", url: "/" },
    ]),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SmartSEO schema={pageSchemas} />

      <Header />

      <HeroSection />

      <WhyChooseUs />

      <FeaturedDestinations initialDestinations={destinations} />

      <BestSellingTripsWrapper />
      <BestSellingGroupTripsWrapper />

      <SightseeingSliderWrapper limit={8} />

      <CabSlider />

      <TravelStoriesWrapper limit={8} />

      <MostSearchedPackages />

      <CTASection />

      <Footer />
    </div>
  );
}