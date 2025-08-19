"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { buildItemListSchema, buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";

export default function TourListPage({ tours, tripTypes }) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

   

  const filteredTours = tours.filter((tour) => {
    const matchesDestination =
      !selectedFilter ||
      tour.destinations?.some(
        (dest) => dest.toLowerCase() === selectedFilter.toLowerCase()
      );

    const matchesPrice =
      (!minPrice || parseFloat(tour.base_price) >= parseFloat(minPrice)) &&
      (!maxPrice || parseFloat(tour.base_price) <= parseFloat(maxPrice));

    const matchesDuration =
      !selectedDuration ||
      (selectedDuration === "1-3" && tour.duration_days <= 3) ||
      (selectedDuration === "4-7" &&
        tour.duration_days >= 4 &&
        tour.duration_days <= 7) ||
      (selectedDuration === "8+" && tour.duration_days >= 8);

    const matchesType =
      selectedTypes.length === 0 ||
      (Array.isArray(tour.trip_types) &&
        selectedTypes.every((type) =>
          tour.trip_types.some((t) => t.name === type)
        ));

    return (
      matchesDestination && matchesPrice && matchesDuration && matchesType
    );
  });

const isPriceOnRequest = (price) => {
  if (!price) return true;
  const numeric = parseFloat(price);
  return isNaN(numeric) || numeric === 0;
};

// Update tourListSchema construction
const tourListSchema = buildItemListSchema({
  name: 'All Tour Packages',
  items: filteredTours,
  itemType: 'TouristTrip',
  getItemSchema: (tour, schema) => ({
    ...schema,
    name: tour.name || 'Unnamed Tour', // Ensure name is included
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gokeys.in'}/tours/${tour.slug}`, // Correct /tours/ path
    description: tour.meta_description || tour.content?.replace(/<\/?[^>]+(>|$)/g, '') || 'Explore an unforgettable tour with Gokeys India.', // Ensure meaningful description
    image: tour.featured_image?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    offers: isPriceOnRequest(tour.base_price)
      ? undefined
      : {
          '@type': 'Offer',
          url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gokeys.in'}/tours/${tour.slug}`, // Correct /tours/ path
          priceCurrency: 'INR',
          price: parseFloat(tour.base_price) || 0, // Ensure valid numeric price
        },
  }),
});

  const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Tours", url: "/tours" }
]); 

    return (
    <>
      <Header />
      <SmartSEO schema={[tourListSchema, breadcrumbSchema]} />
      <div className="min-h-screen bg-gray-50">
        <div className="py-6 px-4 sm:px-8 lg:px-16 bg-white shadow">
          <h1 className="text-3xl font-bold text-gray-800">Explore Tours</h1>
          <p className="text-gray-500 mt-1">
            Browse handpicked packages from trusted operators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 sm:p-8">
          {/* Filters */}
          <aside className="bg-white p-4 rounded-xl shadow-md hidden lg:block">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            {/* Destination Filter */}
            <label className="block mb-4">
              <span className="text-gray-700">Destination</span>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">All</option>
                {[
                  { value: "kedarnath", label: "Kedarnath" },
                  { value: "badrinath", label: "Badrinath" },
                  { value: "yamunotri", label: "Yamunotri" },
                  { value: "gangotri", label: "Gangotri" },
                ].map((dest) => (
                  <option key={dest.value} value={dest.value}>
                    {dest.label}
                  </option>
                ))}
              </select>
            </label>
            {/* Price Range Filter */}
            <div className="mb-4">
              <span className="text-gray-700 block mb-1">Price Range (₹)</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border border-gray-300 rounded-md p-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border border-gray-300 rounded-md p-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Duration Filter */}
            <label className="block mb-4">
              <span className="text-gray-700">Duration</span>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1-3">1–3 Days</option>
                <option value="4-7">4–7 Days</option>
                <option value="8+">8+ Days</option>
              </select>
            </label>

            {/* Trip Type Filter */}
            <div className="mb-4">
              <span className="text-gray-700 block mb-1">Tour Type</span>
              <div className="space-y-1">
                {tripTypes.map((type) => (
                  <label key={type.name} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.name)}
                      onChange={() => toggleType(type.name)}
                      className="mr-2"
                    />
                    {type.name}
                  </label>
                ))}
              </div>
            </div>
          </aside>

           {/* Tour Listings */}
          <section className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl p-4 shadow flex flex-col"
              >
                <div className="relative h-48 w-full rounded-xl overflow-hidden">
                  <Image
                    src={tour.featured_image?.image || "https://via.placeholder.com/300x200"}
                    alt={tour.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                <h3 className="mt-4 text-lg font-semibold line-clamp-2">
                  {tour.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {tour.duration_days} Days / {tour.duration_nights} Nights
                </p>
                <p className="mt-2 font-bold text-indigo-600 mb-4">
                  ₹{parseFloat(tour.base_price).toLocaleString()}
                </p>

                {/* Button stays at bottom */}
                <div className="mt-auto">
                  <Link href={`/tours/${tour.slug}`}>
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                      View Tour
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredTours.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No tours match the selected filters.
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}