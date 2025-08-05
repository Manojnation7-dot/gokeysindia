"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SimilarTours({ currentTourSlug, currentDestinations }) {
  const [similarTours, setSimilarTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group-tours/`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch tours");

        const data = await res.json();
        const tours = data.results || [];

        // Filter similar tours by matching destination
        const filtered = tours.filter((tour) => {
          if (tour.slug === currentTourSlug) return false;

          const tourDestNames = (tour.destinations || [])
            .map((d) =>
              typeof d === "string"
                ? d.toLowerCase()
                : d && d.name
                ? d.name.toLowerCase()
                : null
            )
            .filter(Boolean);

          return (currentDestinations || [])
            .filter((cd) => typeof cd === "string")
            .some((cd) => tourDestNames.includes(cd.toLowerCase()));
        });

        // If we got enough similar ones, use them; else fallback
        if (filtered.length > 0) {
          setSimilarTours(filtered.slice(0, 6));
        } else {
          // Fallback: get latest 6 tours excluding the current one
          const fallback = tours.filter((t) => t.slug !== currentTourSlug).slice(0, 6);
          setSimilarTours(fallback);
        }
      } catch (err) {
        console.error("Error loading similar tours:", err.message);
      }
    };

    if (currentDestinations?.length) fetchTours();
  }, [currentTourSlug, currentDestinations]);

  if (!similarTours.length) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Similar Tour Packages</h2>
        <p className="text-gray-500 mb-8 text-center">You might also like these group tours</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {similarTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={tour.featured_image?.image || "/images/placeholder.jpg"}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-lg font-semibold text-gray-800">{tour.name}</h3>
                <p className="text-sm text-gray-600">
                  {tour.duration_days} Days / {tour.duration_nights} Nights | {tour.starting_from}
                </p>
                <p className="mt-2 text-base font-bold text-indigo-600">
                  ₹{parseFloat(tour.base_price).toLocaleString()}
                </p>

                <div className="mt-auto">
                  <Link href={`/tours/${tour.slug}`}>
                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                      View Tour
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
