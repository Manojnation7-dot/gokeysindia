

import HeroSection from "@/components/HeroSection";
import WhyChooseUs, { TrustStrip } from "@/components/WhyChooseUs";
import KumbhBanner from "@/components/KumbhBanner";
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
import HomeFAQ from "@/components/HomeFAQ";
import {
  buildLocalBusinessSchema,
  buildImageObject,
  buildBreadcrumbList,
  buildWebsiteSchema,
} from "@/lib/seoSchemas";
import HomeReviews from "@/components/HomeReviews";
import GoogleMap from "@/components/MapIframe";
import { CACHED } from "@/lib/api";
import { slimDestination } from "@/lib/slim";

export const revalidate = 300;

export const metadata = {
  alternates: { canonical: "https://gokeys.in/" },
};

async function getFeaturedDestinations() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-destinations/`, CACHED);
    if (!res.ok) return [];
    return (await res.json()).map(slimDestination);
  } catch {
    return [];
  }
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
    <>
      <SmartSEO schema={pageSchemas} />
    <div className="flex flex-col min-h-screen bg-mist">
      <Header />

      <HeroSection />
      <TrustStrip />

      <FeaturedDestinations initialDestinations={destinations} />

      <BestSellingTripsWrapper />
      <KumbhBanner />
      <BestSellingGroupTripsWrapper />

      <SightseeingSliderWrapper limit={8} />

      <CabSlider />

      <HomeReviews />

      <TravelStoriesWrapper limit={8} />

      <MostSearchedPackages />

      <WhyChooseUs />

      <section className="gk-section">
        <div className="gk-wrap">
          <div className="grid lg:grid-cols-[1.4fr_1fr] rounded-2xl overflow-hidden bg-white gk-card">
            <div className="h-72 lg:h-auto lg:min-h-85 p-3 lg:p-4 lg:pr-0">
              <GoogleMap className="h-full w-full rounded-xl overflow-hidden" />
            </div>
            <div className="p-7 md:p-9">
              <p className="gk-eyebrow mb-2">Find us</p>
              <h2 className="gk-h2">Find Us On Map</h2>
              <p className="mt-3 gk-lead text-[15px]">
                Visit our Haridwar office or get directions instantly via Google Maps.
                Our team is always happy to assist you.
              </p>
              <p className="mt-4 text-[15px] text-ink leading-relaxed">
                4th Shop, Zila Panchayat Market, Railway Road,
                Haridwar, Uttarakhand, India
              </p>
              <p className="mt-3 text-[15px] text-ink leading-relaxed">
                📞 +91-9045916770<br />📞 +91-7830718687<br />📞 +91-7830718680
              </p>
              <a
                href="https://www.google.com/maps/place/Gokeys+(Travel+In+Himalayas)+%7C+Travel+Agency+Haridwar/@29.9441709,78.1485517,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="gk-btn gk-btn-ink mt-6"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <HomeFAQ />
      <CTASection />

      <Footer />
    </div>
    </>
  );
}
