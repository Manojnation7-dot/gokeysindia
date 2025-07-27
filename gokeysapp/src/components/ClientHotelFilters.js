
"use client";

import { useState, useEffect } from "react";

export default function ClientHotelFilters({ initialHotels, destinationSlug }) {
  const [hotels, setHotels] = useState(initialHotels);
  const [starFilter, setStarFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    async function fetchFilteredHotels() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const params = new URLSearchParams({ destination: destinationSlug });
        if (starFilter) params.append("star_rating", starFilter);
        if (minPrice) params.append("tariff_starting_from__gte", minPrice);
        if (maxPrice) params.append("tariff_starting_from__lte", maxPrice);

        const res = await fetch(`${apiUrl}/api/hotels/?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch hotels");
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error("Filter error:", err);
      }
    }
    fetchFilteredHotels();
  }, [starFilter, minPrice, maxPrice, destinationSlug]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Filter</h2>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Star Rating</label>
        <select
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
          value={starFilter}
          onChange={(e) => setStarFilter(e.target.value)}
        >
          <option value="">All</option>
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star} Star
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Min Price</label>
        <input
          type="number"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Max Price</label>
        <input
          type="number"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
    </div>
  );
}