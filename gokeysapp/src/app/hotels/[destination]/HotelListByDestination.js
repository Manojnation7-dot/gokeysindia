"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function HotelListByDestination({ destination, destinationData }) {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    starRating: null,
  });

  useEffect(() => {
    async function fetchHotels() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const url = new URL(`${apiUrl}/api/hotels/`);
        url.searchParams.append("destination", destination);
        if (filters.minPrice) url.searchParams.append("tariff_starting_from__gte", filters.minPrice);
        if (filters.maxPrice) url.searchParams.append("tariff_starting_from__lte", filters.maxPrice);
        if (filters.starRating) url.searchParams.append("star_rating", filters.starRating);

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch hotels");
        const data = await res.json();
      setHotels(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (destination) {
      fetchHotels();
    }
  }, [destination, filters]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="text-center p-10 text-gray-600">Loading hotels...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center p-10 text-red-500">Error: {error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
    
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
        {/* Filters */}
        <aside className="bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Filter Hotels</h2>

          {/* Price Range */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Price Range</h4>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })
                }
                placeholder="Min"
                className="w-full p-2 rounded border border-gray-300"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: Number(e.target.value) || 50000 })
                }
                placeholder="Max"
                className="w-full p-2 rounded border border-gray-300"
              />
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Star Rating</h4>
            <select
              value={filters.starRating || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  starRating: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full p-2 rounded border border-gray-300"
            >
              <option value="">All Ratings</option>
              <option value="5">★★★★★ - 5 Star</option>
              <option value="4">★★★★☆ - 4 Star</option>
              <option value="3">★★★☆☆ - 3 Star</option>
              <option value="2">★★☆☆☆ - 2 Star</option>
              <option value="1">★☆☆☆☆ - 1 Star</option>
            </select>
          </div>
        </aside>

        {/* Hotel List */}
        <main className="col-span-1 lg:col-span-3 space-y-6">
          <h1 className="text-3xl font-bold capitalize">
            Hotels in {destinationData?.name || destination}
          </h1>
          {hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  href={`/hotels/${destination}/${hotel.slug}`}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={hotel.front_image_url || "https://via.placeholder.com/300x200"}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Star Rating Badge */}
                    {hotel.star_rating && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-[11px] font-extrabold tracking-widest uppercase backdrop-blur">
                        {hotel.star_rating} ★
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                      {hotel.name}
                    </h3>

                    <p className="text-xs text-gray-400 font-semibold mb-4 flex items-center">
                      📍 {hotel.location}
                    </p>

                    <div className="mt-auto">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        Starting from
                      </span>
                      <span className="text-xl font-extrabold text-emerald-600">
                        ₹{parseFloat(hotel.tariff_starting_from).toLocaleString()}/night
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-6">
              No hotels found for this destination with selected filters.
            </p>
          )}
        </main>
      </section>
      <Footer />
    </>
  );
}
