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
          className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Handpicked <span className="text-brand-600">Group Adventures</span>
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
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 2}
                  />

                  {tour.duration_days && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-900">
                      {tour.duration_days} Days
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {tour.name}
                  </h3>

                  <div className="mt-auto">
                    {isPriceOnRequest(standardPackage) ? (
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Price on Request
                      </p>
                    ) : (
                      <div className="text-base font-semibold">
                        <span className="text-brand-600">
                          {formatPrice(
                            standardPackage?.discount_price || standardPackage?.price
                          )}
                        </span>

                        {standardPackage?.discount_price &&
                          standardPackage?.price &&
                          parseFloat(standardPackage.price) >
                            parseFloat(standardPackage.discount_price) && (
                            <>
                              <span className="line-through text-gray-400 ml-2 text-sm">
                                {formatPrice(standardPackage.price)}
                              </span>
                              <span className="text-xs text-green-600 ml-2 font-bold">
                                {getSavings(standardPackage)}
                              </span>
                            </>
                          )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/grouptour/${tour.slug}`}
                        className="flex-1 bg-gray-900 hover:bg-brand-600 text-white py-2 rounded-xl text-sm font-bold text-center transition"
                      >
                        Explore
                      </Link>

                      <button
                        onClick={() => handleQuoteClick(tour)}
                        className="flex-1 border border-brand-600 text-brand-600 hover:bg-brand-50 py-2 rounded-xl text-sm font-bold transition"
                      >
                        Quote
                      </button>
                    </div>
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
