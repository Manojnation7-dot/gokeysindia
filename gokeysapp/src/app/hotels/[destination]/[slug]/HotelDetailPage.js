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
    slug: hotelData.slug, destinationSlug, 
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
      postalCode: hotelData.postalCode || "",
      country: "IN"
    },
    priceRange: `₹${parseFloat(hotelData.tariff_starting_from).toLocaleString()}`,
    telephone: hotelData.telephone || "",
    starRating: hotelData.star_rating || "",
    amenities: hotelData.facilities?.map(f => f.name) || [],
    ratingValue: hotelData.ratingValue || "",
    reviewCount: hotelData.reviewCount || ""
  });
  


const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Hotels", url: "/hotels" },
  { name: hotelData.destination || "Unknown Destination", url: `/hotels/${destinationSlug}` },
  { name: hotelData.name, url: `/hotels/${destinationSlug}/${hotelData.slug}` }
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


  return (
    <>
      <Header />
      <SmartSEO schema={hotelSchema} />
      <SmartSEO schema={breadcrumbSchema} />  
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 uppercase">{hotelData.name}</h1>
        <p className="text-sm text-gray-600 mb-6">
          {hotelData.star_rating ? `${"★".repeat(hotelData.star_rating)} Star Hotel` : ""}
          {hotelData.location && ` | ${hotelData.location}`}
        </p>

        {/* Image Gallery + Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
          {/* Gallery */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Image */}
              <div className="md:col-span-2 relative rounded-lg overflow-hidden shadow">
                <div className="aspect-w-16 aspect-h-9 min-h-[300px] md:min-h-[400px]">
                  <Image
                    src={hotelData.front_image_url || "https://via.placeholder.com/800x500"}
                    alt={hotelData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => setShowGalleryModal(true)}
                  className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-4 py-1 rounded hover:bg-opacity-80"
                >
                  Show All Photos
                </button>
              </div>

              {/* Smaller Images */}
              <div className="md:col-span-1 flex flex-col gap-4">
                {hotelData.gallery_images?.slice(0, 2).map((img, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden shadow">
                    <div className="aspect-w-16 aspect-h-9 min-h-[150px] md:min-h-[190px]">
                      <Image
                        src={img.image || "https://via.placeholder.com/400x300"}
                        alt={`Gallery ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {hotelData.description || "No description available."}
              </p>
            </section>
            {/* Facilities  */}
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-5">
                    Facilities
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {hotelData.facilities.map((facility, i) => {
                      const key = facility.name?.toLowerCase().trim();
                      const Icon = facilityIconMap[key] || Wifi;

                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-gray-50 border rounded-xl p-4"
                        >
                          <Icon className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {facility.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
                      <section>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Location
                          </h3>
                          <p className="text-gray-700 flex gap-2">
                            <MapPin className="w-4 h-4 mt-1 text-blue-600" />
                            {hotelData.address}
                          </p>
                        </section>
                    
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg border p-6">

                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ₹{Number(hotelData.tariff_starting_from).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="border rounded-lg p-3 text-sm">
                        <p className="text-gray-500">Check-in</p>
                        <p className="font-semibold">01:00 PM</p>
                      </div>
                      <div className="border rounded-lg p-3 text-sm">
                        <p className="text-gray-500">Check-out</p>
                        <p className="font-semibold">11:00 AM</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowHotelEnquiry(true)} // Change this
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      Check Availability
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-3">
                      Free cancellation • Instant confirmation
                    </p>

                  </div>

            </div>
     
        </div>

        {/* ✅ SIMILAR HOTELS */}
        {similarHotels?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              More Hotels in {hotelData.destination}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarHotels.map((hotel) => (
                  <Link
                    key={hotel.id}
                    href={`/hotels/${destinationSlug}/${hotel.slug}`}
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={hotel.front_image_url || "/images/placeholder.jpg"}
                        alt={hotel.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Star Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-[11px] font-extrabold tracking-widest uppercase backdrop-blur">
                        {hotel.star_rating} ★
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        {hotel.name}
                      </h3>

                      <p className="text-xs text-gray-400 font-semibold mb-4 flex items-center">
                        📍 {hotel.location}
                      </p>

                      {hotel.tariff_starting_from && (
                        <div className="mt-auto">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                            Starting from
                          </span>
                          <span className="text-xl font-extrabold text-emerald-600">
                            ₹{Number(hotel.tariff_starting_from).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                            </div>
          </section>
        )}

      {/* ✅ RELATED TOURS */}
        {relatedTours?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              Tour Packages for {hotelData.destination}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map((tour) => {
                const imageUrl =
                  tour.featured_image?.optimized_card ||
                  tour.featured_image?.image ||
                  "/images/placeholder.jpg";

                const standardPackage = tour.pricing?.find(
                  (pkg) => pkg.package_type === "standard"
                );

                const price = standardPackage?.price;
                const discountPrice = standardPackage?.discount_price;

                return (
                  <div
                    key={tour.id}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={tour.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {tour.duration_days && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-900">
                          {tour.duration_days} Days
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {tour.name}
                      </h3>

                      <div className="mt-auto">
                        {discountPrice ? (
                          <div className="text-base font-semibold">
                            <span className="text-indigo-600">
                              ₹{Number(discountPrice).toLocaleString()}
                            </span>
                            {price && (
                              <>
                                <span className="line-through text-gray-400 ml-2 text-sm">
                                  ₹{Number(price).toLocaleString()}
                                </span>
                                <span className="text-xs text-green-600 ml-2 font-bold">
                                  Save ₹{Number(price - discountPrice).toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        ) : price ? (
                          <p className="text-lg font-extrabold text-indigo-600">
                            From ₹{Number(price).toLocaleString()}
                          </p>
                        ) : null}

                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/tours/${tour.slug}`}
                            className="flex-1 bg-gray-900 hover:bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold text-center transition"
                          >
                            Explore
                          </Link>

                          <button
                            onClick={() => handleQuoteClick(tour)}
                            className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 rounded-xl text-sm font-bold transition"
                          >
                            Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      {/* ✅ RELATED PLACES */}
          {relatedPlaces?.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">
                Places to Visit Near {hotelData.destination}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPlaces.map((place) => (
                  <Link
                    href={`/sightseeing/${place.slug}`}
                    key={place.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 group"
                  >
                    {/* Image */}
                    <div className="relative h-48">
                      <Image
                        src={
                          place.featured_image?.optimized_card ||
                          place.featured_image?.image ||
                          "/images/placeholder.jpg"
                        }
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-4">
                      {/* Name */}
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:underline">
                        {place.name}
                      </h3>

                      {/* Destination with icon */}
                      <p className="text-sm text-gray-500 flex items-center mb-1">
                        <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                        {place.destination_name || hotelData.destination}
                      </p>

                      {/* Distance with icon */}
                      {place.distance_from_center && (
                        <p className="text-sm text-gray-500 flex items-center mb-2">
                          <Ruler className="w-4 h-4 mr-1 text-emerald-500" />
                          {parseFloat(place.distance_from_center)} km from center
                        </p>
                      )}

                      {/* Safe description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {place.description?.replace(/<[^>]+>/g, "").slice(0, 100) || "No description available."}
                      </p>
                    </div>
                  </Link>
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
          {/* Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-200 z-10"
            >
              Close
            </button>
            {hotelData.gallery_images?.length > 0 ? (
              <>
                <img
                  src={hotelData.gallery_images[currentImageIndex].image || "/placeholder.jpg"}
                  alt={hotelData.gallery_images[currentImageIndex].title || `Gallery ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded">
                  {currentImageIndex + 1} / {hotelData.gallery_images.length}
                </div>
                {hotelData.gallery_images?.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                      onClick={handlePrevImage}
                      className="bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white text-center">No images available.</p>
            )}
          </div>
        </div>
      )}
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