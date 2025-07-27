'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import QuoteDialog from './QuoteDialog';
import { useState } from 'react';
import { isPriceOnRequest, formatPrice, getSavings } from '@/lib/pricingUtils';

export default function BestSellingGroupTrips({ tours }) {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const handleQuoteClick = (tour) => {
    const standardPackage =
      tour.pricing?.find((pkg) => pkg.package_type === 'standard') || null;

    setSelectedTour({
      ...tour,
      selectedPackage: standardPackage,
    });

    setShowEnquiry(true);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    }),
  };

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
          Catch a Group Trip Now
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour, index) => {
            const imageUrl =
              tour.featured_image?.optimized_card ||
              tour.featured_image?.image ||
              '/images/placeholder.jpg';
            const standardPackage = tour.pricing?.find((pkg) => pkg.package_type === 'standard');

            return (
              <motion.div
                key={tour.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
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
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 2}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,..."
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">{tour.name}</h3>

                  {tour.duration_days && (
                    <p className="text-sm text-gray-500">🕒 {tour.duration_days} Days</p>
                  )}

                  {isPriceOnRequest(standardPackage) ? (
                    <p className="text-base text-gray-600 font-semibold">Price on Request</p>
                  ) : (
                    <div className="text-base">
                      <span className="text-black-600 font-semibold">
                        {formatPrice(
                          standardPackage?.discount_price || standardPackage?.price
                        )}
                      </span>
                      {standardPackage?.discount_price &&
                        standardPackage?.price &&
                        parseFloat(standardPackage.price) > parseFloat(standardPackage.discount_price) && (
                          <>
                            <span className="line-through text-gray-400 ml-2">
                              {formatPrice(standardPackage.price)}
                            </span>
                            <span className="text-sm text-green-500 ml-2">
                              {getSavings(standardPackage)}
                            </span>
                          </>
                        )}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between gap-2 mt-4">
                    <Link
                      href={`/grouptour/${tour.slug}`}
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
            packagePrice={selectedTour.selectedPackage}
            tourImage={selectedTour.featured_image}
          />
        )}
      </div>
    </section>
  );
}
