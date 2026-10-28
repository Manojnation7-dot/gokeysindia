"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumbs, CtaBand, PLACEHOLDER } from "@/components/ui/kit";


const DEFAULT_FILTERS = { minPrice: 0, maxPrice: 50000, starRating: null };

// initialHotels: the list rendered on the server with the default filters (null if that failed: loaded here instead)
export default function HotelListByDestination({ destination, destinationData, initialHotels = null }) {
  const [hotels, setHotels] = useState(initialHotels ?? []);
  const [isLoading, setIsLoading] = useState(initialHotels == null);
  const serverList = useRef(initialHotels != null); // skip the first fetch: the server already sent this list
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

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
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (serverList.current) {
      serverList.current = false;
      return;
    }
    if (destination) {
      fetchHotels();
    }
  }, [destination, filters]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="text-center p-10 text-slate-ink min-h-[50vh]">Loading hotels...</div>
        <Footer />
      </>
    );
  }

  const placeName = destinationData?.name || destination;

  return (
    <>
      <Header />
      <main className="bg-mist">
        <section className="bg-ink">
          <div className="gk-wrap py-10 md:py-12">
            <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Hotels", href: "/hotels" }, { label: placeName }]} />
            <h1 className="gk-h1 text-white! capitalize">
              Hotels in {placeName}
            </h1>
          </div>
        </section>

      <section className="gk-wrap py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Filters */}
        <aside className="gk-card p-5 space-y-5 lg:sticky lg:top-20">
          <h2 className="gk-h3">Filter Hotels</h2>

          {/* Price Range */}
          <div>
            <h4 className="gk-label">Price Range</h4>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })
                }
                placeholder="Min"
                aria-label="Minimum price"
                className="gk-field"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: Number(e.target.value) || 50000 })
                }
                placeholder="Max"
                aria-label="Maximum price"
                className="gk-field"
              />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <h4 className="gk-label">Star Rating</h4>
            <select
              value={filters.starRating || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  starRating: e.target.value ? Number(e.target.value) : null,
                })
              }
              aria-label="Star rating"
              className="gk-field"
            >
              <option value="">All Ratings</option>
              <option value="5">★★★★★ - 5 Star</option>
              <option value="4">★★★★☆ - 4 Star</option>
              <option value="3">★★★☆☆ - 3 Star</option>
              <option value="2">★★☆☆☆ - 2 Star</option>
              <option value="1">★☆☆☆☆ - 1 Star</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="gk-btn gk-btn-line w-full"
          >
            Clear filters
          </button>
        </aside>

        {/* Hotel List */}
        <div className="space-y-4 min-w-0">
          {/* A failed filter update keeps the list shown so far */}
          {error && <p role="alert" className="rounded-xl bg-sun-soft px-4 py-3 text-sm text-ink">Could not update the list. Please check your connection and try again.</p>}
          <p className="text-xs text-slate-ink">{hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} in {placeName}</p>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/hotels/${destination}/${hotel.slug}`}
                className="gk-card gk-card-hover group grid sm:grid-cols-[220px_1fr_auto]"
              >
                <div className="gk-media h-48 sm:h-full sm:min-h-40">
                  <Image
                    src={hotel.front_image_url || PLACEHOLDER}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 220px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {hotel.star_rating && <span className="gk-chip gk-chip-sun">{hotel.star_rating} star</span>}
                    {hotel.location && <span className="gk-chip">📍 {hotel.location}</span>}
                  </div>
                  <h3 className="gk-h3">{hotel.name}</h3>
                </div>
                <div className="p-5 sm:border-l border-line flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2">
                  <div>
                    <span className="text-xs text-slate-ink block">Starting from</span>
                    <span className="gk-price text-2xl">
                      ₹{parseFloat(hotel.tariff_starting_from).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-ink">/night</span>
                  </div>
                  <span className="gk-btn gk-btn-ink">View hotel</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-slate-ink mt-6">
              No hotels found for this destination with selected filters.
            </p>
          )}
        </div>
      </section>

        <section className="gk-wrap pb-16">
          <CtaBand title="Need a room for Ardh Kumbh Mela 2027?" text="Tell us your dates and group size. We check availability near the ghats and send options.">
            <Link href="/contact" className="gk-btn gk-btn-ink">Ask about hotels</Link>
          </CtaBand>
        </section>
      </main>
      <Footer />
    </>
  );
}
