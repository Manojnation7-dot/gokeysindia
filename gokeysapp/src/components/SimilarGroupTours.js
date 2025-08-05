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
        const tours = data.results || data;

        const filtered = tours.filter((tour) => {
          if (tour.slug === currentTourSlug) return false;

          const tourDestNames = (tour.destinations || [])
            .map((d) => {
              if (typeof d === "string") return d.toLowerCase();
              if (d && typeof d.name === "string") return d.name.toLowerCase();
              return null;
            })
            .filter(Boolean);

          return currentDestinations.some((cd) =>
            tourDestNames.includes(cd.toLowerCase())
          );
        });

        setSimilarTours(filtered.slice(0, 6)); // Show max 6 similar tours
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
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Similar Tour Packages
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          You might also like these group tours
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <div className="relative h-48 w-full rounded-xl overflow-hidden">
                <Image
                  src={
                    tour.featured_image?.image &&
                    tour.featured_image.image.startsWith("http")
                      ? tour.featured_image.image
                      : "/images/placeholder.jpg"
                  }
                  alt={tour.name}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 mt-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{tour.name}</h3>
                  <p className="text-sm text-gray-600">
                    {tour.duration_days} Days / {tour.duration_nights} Nights |{" "}
                    {tour.starting_from}
                  </p>
                  <p className="mt-2 text-base font-bold text-indigo-600">
                    ₹{parseFloat(tour.base_price).toLocaleString()}
                  </p>
                </div>
                <Link href={`/tours/${tour.slug}`}>
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                    View Tour
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
