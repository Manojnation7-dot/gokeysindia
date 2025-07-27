"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { MapPin, Ruler } from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";
import { buildBreadcrumbList, buildHotelSchema } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";


export default function HotelDetailPage({ hotelData, relatedPlaces, relatedTours }) {
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
        <div className="flex flex-col lg:flex-row gap-8">
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

          {/* Booking Card */}
          <div className="lg:w-80 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-2">Deluxe Room</h3>
            <p className="text-gray-600 mb-1">Fits 2 Adults</p>
            <p className="text-gray-600 mb-1">• No meals included</p>
            <p className="text-green-600 mb-4">• Free Cancellation till 24 hrs before check-in</p>
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-800">
                ₹{parseFloat(hotelData.tariff_starting_from).toLocaleString() || "N/A"}
              </p>
              <p className="text-sm text-gray-500">Total Price</p>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              BOOK THIS NOW
            </button>
          </div>
        </div>

        {/* Overview */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-3">Hotel Overview</h2>
          <p className="text-gray-700 leading-relaxed">{hotelData.description || "No description available."}</p>
        </section>

        {/* Amenities */}
        {hotelData.facilities?.length > 0 && (
          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {hotelData.facilities.map((facility, i) => (
                <span key={i} className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  ✓ {facility.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Location */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Location</h3>
          <p className="text-gray-700">{hotelData.address || "Address not specified."}</p>
        </section>
      {/* ✅ RELATED TOURS */}
        {relatedTours?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              Tour Packages for {hotelData.destination}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map((tour, index) => {
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
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={imageUrl}
                        alt={tour.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {tour.name}
                      </h3>

                      {tour.duration_days && (
                        <p className="text-sm text-gray-500">
                          🕒 {tour.duration_days} Days
                        </p>
                      )}

                      {discountPrice ? (
                        <div className="text-base">
                          <span className="text-black-600 font-semibold">
                            ₹{Number(discountPrice).toLocaleString()}
                          </span>
                          {price && price > discountPrice && (
                            <>
                              <span className="line-through text-gray-400 ml-2">
                                ₹{Number(price).toLocaleString()}
                              </span>
                              <span className="text-sm text-green-500 ml-2">
                                Save ₹{Number(price - discountPrice).toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      ) : price ? (
                        <p className="text-base text-green-600 font-semibold">
                          From ₹{Number(price).toLocaleString()}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap justify-between gap-2 mt-4">
                        <Link
                          href={`/tours/${tour.slug}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          Explore
                        </Link>
                            <button
                        onClick={() => handleQuoteClick(tour)}
                        className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 text-sm"
                      >
                        Request Quote
                      </button>
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