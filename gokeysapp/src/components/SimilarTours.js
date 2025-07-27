"use client";

import Image from "next/image";
import Link from "next/link";

export default function SimilarTours({ tours}) {
   if (!tours || !tours.length) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Similar Tour Packages</h2>
        <p className="text-gray-500 mb-8 text-center">You might also like these group tours</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4"
            >
              <div className="relative h-48 w-full rounded-xl overflow-hidden">
                <Image
                  src={
                    tour.featured_image?.image || "/images/placeholder.jpg"
                  }
                  alt={tour.name}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">{tour.name}</h3>
              <p className="text-sm text-gray-500">
                {tour.duration_days} Days / {tour.duration_nights} Nights | {tour.starting_location}
              </p>
              <p className="text-md font-bold text-indigo-600 mt-2">
                ₹{parseFloat(tour.base_price).toLocaleString()}
              </p>
              <Link href={`/tours/${tour.slug}`}>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  View Tour
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
