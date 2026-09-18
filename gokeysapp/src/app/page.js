

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
import HomeFAQ, { faqs } from "@/components/HomeFAQ";
import {
  buildLocalBusinessSchema,
  buildImageObject,
  buildBreadcrumbList,
  buildWebsiteSchema,
} from "@/lib/seoSchemas";
import HomeReviews from "@/components/HomeReviews";
import GoogleMap from "@/components/MapIframe";

export const metadata = {
  alternates: { canonical: "https://gokeys.in/" },
};

async function getFeaturedDestinations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-destinations/`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function HomePage() {
  const destinations = await getFeaturedDestinations();
    
  const pageSchemas = [
      
    buildWebsiteSchema({
        name: "Gokeys India",
        alternateName: "Gokeys Travel In Himalayas",
        description:
          "Gokeys Travel In Himalayas (Gokeys India), a top Travel Agent in Haridwar near Har Ki Pauri. Char Dham Yatra, hill station tours, car rentals – 24×7.",
        searchUrlPattern: "/search?q={search_term_string}", // ← confirm/replace this
      }),
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
       <SmartSEO
        schema={
          pageSchemas
         }
      />

      <Header />

      <HeroSection />

      <WhyChooseUs />

      <FeaturedDestinations initialDestinations={destinations} />

      <BestSellingTripsWrapper />
      <BestSellingGroupTripsWrapper />

      <SightseeingSliderWrapper limit={8} />

      <HomeReviews />

      <CabSlider />

      <TravelStoriesWrapper limit={8} />

      <MostSearchedPackages />

       <section className="py-20 px-6 bg-gradient-to-b from-white via-indigo-50/40 to-white">
          <div className="max-w-7xl mx-auto text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Find Us <span className="text-brand-600">On Map</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Visit our Haridwar office or get directions instantly via Google Maps.
              Our team is always happy to assist you.
            </p>
          </div>

          <GoogleMap />
        </section>
        <HomeFAQ />
      <CTASection />

      <Footer />
    </div>
  );
}
