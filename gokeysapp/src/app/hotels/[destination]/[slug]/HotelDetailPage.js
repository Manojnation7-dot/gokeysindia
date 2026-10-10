"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Ruler } from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";
import { buildBreadcrumbList, buildHotelSchema } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import {
  Wifi,
  ParkingCircle,
  Utensils,
  Wind,
  Tv,
  Bath,
  Droplets,
  Power,
  Fan,
  Heater,
  BedDouble,
  Coffee,
  Refrigerator,
  Dumbbell,
  ShieldCheck,
  MapPin,
  Shirt,
  Bus,
  SprayCan,
  WashingMachine,
  Wine,
  Briefcase,
  ConciergeBell,
  Sparkles,
  Users,
  Waves,
  Stethoscope,
  Clock,
  ArrowUpDown,
  Plane,
} from "lucide-react";
import HotelEnquiryModal from "@/components/HotelEnquiryModal";
import ImageGallery from "@/components/ImageGallery";
import { Breadcrumbs, TourCard, Price, PlaceCard, cardImage } from "@/components/ui/kit";

export default function HotelDetailPage({ hotelData, relatedPlaces, relatedTours, similarHotels }) {
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  // Modal navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? hotelData.gallery_images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === hotelData.gallery_images.length - 1 ? 0 : prev + 1
    );
  };

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showHotelEnquiry, setShowHotelEnquiry] = useState(false);

  const handleQuoteClick = (tour) => {
    const standardPackage = tour.pricing?.find(
      (pkg) => pkg.package_type === "standard"
    ) || null;

    setSelectedTour({
      ...tour,
      selectedPackage: standardPackage,
    });

  setShowEnquiry(true);
};
const destinationSlug = hotelData.destination_slug 
  || (hotelData.destination ? hotelData.destination.trim().toLowerCase().replace(/\s+/g, "-") : "unknown");

  const hotelSchema = buildHotelSchema({
    slug: hotelData.slug, destinationSlug: hotelData.destination_slug,
    name: hotelData.name,
    description: hotelData.description,
    imageUrl: [
      hotelData.front_image_url,
      ...(hotelData.gallery_images?.map((img) => img.image) || [])
    ],
    address: {
      streetAddress: hotelData.address,
      city: hotelData.location,
      region: hotelData.region || "",
      postalCode: hotelData.postalCode
    },
    price: hotelData.tariff_starting_from,
    starRating: hotelData.star_rating || "",
    amenities: hotelData.facilities?.map(f => f.name) || []
  });
  


const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Hotels", url: "/hotels" },
  ...(hotelData.destination_slug ? [
    { name: hotelData.destination, url: `/hotels/${hotelData.destination_slug}` },
    { name: hotelData.name, url: `/hotels/${hotelData.destination_slug}/${hotelData.slug}` }
  ] : [])
]);

  if (!hotelData) {
    return (
      <div className="text-center py-20 text-gray-600">
        Hotel not found.
      </div>
    );
  }

const facilityIconMap = {
  // Essentials
  wifi: Wifi,
  parking: ParkingCircle,
  lift: ArrowUpDown,
  elevator: ArrowUpDown,

  // Room & Comfort
  "room service": ConciergeBell,
  "hot and cold water": Droplets,
  toiletries: SprayCan,
  bathroom: Bath,
  bed: BedDouble,
  tv: Tv,
  ac: Wind,
  fan: Fan,
  heater: Heater,

  // Cleaning & Laundry
  laundry: WashingMachine,
  "clothing iron": Shirt,
  iron: Shirt,

  // Food & Beverage
  restaurant: Utensils,
  bar: Wine,
  coffee: Coffee,

  // Wellness & Leisure
  spa: Sparkles,
  "swimming pool": Waves,
  pool: Waves,
  "fitness center": Dumbbell,
  gym: Dumbbell,

  // Business & Work
  "business center": Briefcase,
  "meeting rooms": Users,
  conference: Users,

  // Transport & Travel
  "airport shuttle": Plane,
  shuttle: Bus,
  "travel desk": MapPin,

  // Medical & Safety
  "doctor on call": Stethoscope,
  security: ShieldCheck,

  // Reception & Services
  "24/7 reception": Clock,
  reception: Clock,
};


  // "13:00:00" -> "01:00 PM"; falls back to the times shown before
  const formatTime = (t, fallback) => {
    const m = /^(\d{1,2}):(\d{2})/.exec(t || "");
    if (!m) return fallback;
    const h = Number(m[1]);
    return `${String(h % 12 || 12).padStart(2, "0")}:${m[2]} ${h < 12 ? "AM" : "PM"}`;
  };
  const checkIn = formatTime(hotelData.check_in_time, "01:00 PM");
  const checkOut = formatTime(hotelData.check_out_time, "11:00 AM");

  return (
    <>
      <Header />
      <SmartSEO schema={hotelSchema} />
      <SmartSEO schema={breadcrumbSchema} />  
      <main className="bg-mist">
        <div className="gk-wrap pt-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Hotels", href: "/hotels" },
              ...(hotelData.destination ? [{ label: hotelData.destination, href: `/hotels/${destinationSlug}` }] : []),
              { label: hotelData.name },
            ]}
          />
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <h1 className="gk-h1 text-3xl! md:text-[2.6rem]! uppercase">{hotelData.name}</h1>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hotelData.star_rating ? (
                  <span className="gk-chip gk-chip-sun">{`${"★".repeat(hotelData.star_rating)} Star Hotel`}</span>
                ) : null}
                {hotelData.location && <span className="gk-chip">{hotelData.location}</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-ink">Starting from</p>
              <p className="gk-price text-3xl">₹{Number(hotelData.tariff_starting_from).toLocaleString()}</p>
              <p className="text-xs text-slate-ink">per night</p>
            </div>
          </div>

          {/* Gallery */}
          <ImageGallery
            alt={hotelData.name}
            images={[hotelData.front_image_url, ...(hotelData.gallery_images?.map((img) => img.image) || [])]}
          />
        </div>

        <div className="gk-wrap py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="min-w-0 space-y-10">
            <section>
              <h2 className="gk-h2 mb-3">Overview</h2>
              <p className="text-slate-ink leading-relaxed whitespace-pre-line">
                {hotelData.description || "No description available."}
              </p>
            </section>

            {/* Facilities  */}
            {hotelData.facilities?.length > 0 && (
              <section>
                <h3 className="gk-h2 mb-4">Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotelData.facilities.map((facility, i) => {
                    const key = facility.name?.toLowerCase().trim();
                    const Icon = facilityIconMap[key] || Wifi;

                    return (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-ink">
                        <Icon className="w-4 h-4 text-teal shrink-0" />
                        {facility.name}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <h3 className="gk-h2 mb-3">Location</h3>
              <p className="text-slate-ink flex gap-2">
                <MapPin className="w-4 h-4 mt-1 text-teal shrink-0" />
                {hotelData.address}
              </p>
            </section>

            <section>
              <h3 className="gk-h2 mb-4">Hotel policies</h3>
              <div className="grid sm:grid-cols-[1fr_1fr_2fr] gap-3">
                <div className="gk-panel p-4">
                  <p className="text-xs text-slate-ink">Check-in</p>
                  <p className="font-bold text-ink">{checkIn}</p>
                </div>
                <div className="gk-panel p-4">
                  <p className="text-xs text-slate-ink">Check-out</p>
                  <p className="font-bold text-ink">{checkOut}</p>
                </div>
                <div className="gk-panel p-4">
                  <p className="text-xs text-slate-ink">Cancellation</p>
                  <p className="font-bold text-ink">{hotelData.cancellation_policy_text || "Free cancellation • Instant confirmation"}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Booking card */}
          <aside className="lg:sticky lg:top-20">
            <div className="gk-card p-5">
              <p className="text-xs text-slate-ink">Starting from</p>
              <p className="flex items-baseline gap-1.5">
                <span className="gk-price text-3xl">₹{Number(hotelData.tariff_starting_from).toLocaleString()}</span>
                <span className="text-xs text-slate-ink">per night</span>
              </p>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="gk-panel p-3 text-sm">
                  <p className="text-slate-ink text-xs">Check-in</p>
                  <p className="font-semibold">{checkIn}</p>
                </div>
                <div className="gk-panel p-3 text-sm">
                  <p className="text-slate-ink text-xs">Check-out</p>
                  <p className="font-semibold">{checkOut}</p>
                </div>
              </div>

              <button onClick={() => setShowHotelEnquiry(true)} className="gk-btn gk-btn-sun w-full">
                Check Availability
              </button>
              <a
                href={`https://wa.me/917830718687?text=${encodeURIComponent(`Hello Gokeys India, I want to enquire about ${hotelData.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gk-btn gk-btn-wa w-full mt-2.5"
              >
                Chat on WhatsApp
              </a>

              <p className="text-xs text-center text-slate-ink mt-3">
                {hotelData.cancellation_policy_text || "Free cancellation • Instant confirmation"}
              </p>
            </div>
          </aside>
        </div>

        {/* ✅ SIMILAR HOTELS */}
        {similarHotels?.length > 0 && (
          <section className="bg-white">
            <div className="gk-wrap gk-section">
              <h2 className="gk-h2 mb-6">More Hotels in {hotelData.destination}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {similarHotels.map((hotel) => (
                  <Link
                    key={hotel.id}
                    href={`/hotels/${destinationSlug}/${hotel.slug}`}
                    className="gk-card gk-card-hover group flex flex-col"
                  >
                    <div className="gk-media h-40">
                      <Image
                        src={hotel.front_image_url || "/images/placeholder.jpg"}
                        alt={hotel.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="gk-chip gk-chip-sun self-start mb-2">{hotel.star_rating} ★</span>
                      <h3 className="gk-h3">{hotel.name}</h3>
                      <p className="text-xs text-slate-ink mt-0.5">📍 {hotel.location}</p>
                      {hotel.tariff_starting_from && (
                        <p className="mt-auto pt-3 flex items-baseline gap-1.5">
                          <span className="text-xs text-slate-ink">Starting from</span>
                          <span className="gk-price text-lg">₹{Number(hotel.tariff_starting_from).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ✅ RELATED TOURS */}
        {relatedTours?.length > 0 && (
          <section className="gk-wrap gk-section">
            <h2 className="gk-h2 mb-6">Tour Packages for {hotelData.destination}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  href={`/tours/${tour.slug}`}
                  chips={[tour.duration_days && `${tour.duration_days} Days`]}
                  footer={
                    <>
                      <Link href={`/tours/${tour.slug}`} className="gk-btn gk-btn-ink flex-1">Explore</Link>
                      <button onClick={() => handleQuoteClick(tour)} className="gk-btn gk-btn-line flex-1">
                        Quote
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* ✅ RELATED PLACES */}
        {relatedPlaces?.length > 0 && (
          <section className="gk-wrap pb-16">
            <h2 className="gk-h2 mb-6">Places to Visit Near {hotelData.destination}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  href={`/sightseeing/${place.slug}`}
                  image={cardImage(place.featured_image)}
                  alt={place.name}
                  title={place.name}
                  sub={`${place.destination_name || hotelData.destination}${place.distance_from_center ? ` · ${parseFloat(place.distance_from_center)} km from center` : ""}`}
                  text={place.description?.replace(/<[^>]+>/g, "").slice(0, 100) || "No description available."}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
          {/* ✅ HOTEL WHATSAPP ENQUIRY MODAL */}
         <HotelEnquiryModal 
            isOpen={showHotelEnquiry} 
            onClose={() => setShowHotelEnquiry(false)} 
            hotel={hotelData} 
          />
          {showEnquiry && selectedTour && (
                <QuoteDialog
                  isOpen={showEnquiry}
                  onClose={() => setShowEnquiry(false)}
                  tourName={selectedTour.name}
                  packageType="Standard"
                  packagePrice={{
                    price: selectedTour.selectedPackage?.price,
                    discount_price: selectedTour.selectedPackage?.discount_price,
                  }}
                  tourImage={selectedTour.featured_image}
                />
              )}
    </>
  );
}
