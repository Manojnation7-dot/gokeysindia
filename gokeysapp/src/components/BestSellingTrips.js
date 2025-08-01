"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import QuoteDialog from "./QuoteDialog";

export default function BestSellingTrips({ tours }) {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const handleQuoteClick = (tour) => {
    const standardPackage = tour.pricing?.find((pkg) => pkg.package_type === "standard") || null;

    setSelectedTour({
      ...tour,
      selectedPackage: standardPackage,
    });

    setShowEnquiry(true);
  };

  const formatPrice = (price) => `₹${Number(price).toLocaleString()}`;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  if (!tours || tours.length === 0) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">No trips available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-blue-900 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Our Best Selling Trips
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour, index) => {
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
              <motion.div
                key={tour.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition flex flex-col"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={imageUrl}
                    alt={tour.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 2}
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">{tour.name}</h3>

                  {tour.duration_days && (
                    <p className="text-sm text-gray-500">🕒 {tour.duration_days} Days</p>
                  )}

                  {discountPrice ? (
                    <div className="text-base">
                      <span className="text-black-600 font-semibold">
                        {formatPrice(discountPrice)}
                      </span>
                      {price && price > discountPrice && (
                        <>
                          <span className="line-through text-gray-400 ml-2">
                            {formatPrice(price)}
                          </span>
                          <span className="text-sm text-green-500 ml-2">
                            Save {formatPrice(price - discountPrice)}
                          </span>
                        </>
                      )}
                    </div>
                  ) : price ? (
                    <p className="text-base text-green-600 font-semibold">
                      From {formatPrice(price)}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap justify-between gap-2 mt-auto pt-4 border-t">
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
              </motion.div>
            );
          })}
        </div>

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
      </div>
    </section>
  );
}
