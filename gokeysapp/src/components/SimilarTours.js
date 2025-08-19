"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SimilarTours({ tours }) {
  if (!tours || !tours.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-4 text-gray-800 text-center"
        >
          Similar Tour Packages
        </motion.h2>
        <p className="text-gray-500 mb-10 text-center">
          You might also like these carefully picked tours
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
           <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col h-[480px]" // fixed height
          >
            {/* Image */}
            <div className="relative h-52 w-full">
              <Image
                src={tour.featured_image?.image || "/images/placeholder.jpg"}
                alt={tour.name}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">
                {tour.duration_days}D / {tour.duration_nights}N
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {tour.name}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Starting from{" "}
                  <span className="font-medium">{tour.starting_location}</span>
                </p>

                <p className="text-lg font-bold text-indigo-600 mt-3">
                  ₹{parseFloat(tour.base_price).toLocaleString()}
                </p>
              </div>

              {/* Button at bottom */}
              <div className="pt-5">
                <Link href={`/tours/${tour.slug}`} className="block">
                  <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                    View Tour
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          ))}
        </div>
      </div>
    </section>
  );
}
