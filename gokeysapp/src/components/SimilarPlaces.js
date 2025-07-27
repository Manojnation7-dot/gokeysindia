'use client';


import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function SimilarPlaces({ places }) {
  if (!places || !places.length) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
  };

  return (
    <motion.section
      className="py-16 px-6 bg-white mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-blue-900 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Similar Places You Might Like
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <motion.div
              key={place.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative h-48">
                <Image
                  src={
                    place.featured_image?.optimized_card ||
                    place.featured_image?.image ||
                    '/images/placeholder.jpg'
                  }
                  alt={place.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 2}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD..."
                />
              </div>
              <div className="p-4">
               <Link
                href={`/sightseeing/${place.slug}`}
                className="font-bold text-lg mb-1 text-blue-800 hover:text-blue-900 hover:underline transition"
                >
                {place.name}
                </Link>
                <p className="text-gray-600 text-sm mb-2">
                  {place.distance_from_center
                    ? `${parseFloat(place.distance_from_center).toFixed(1)} km from center`
                    : 'Distance not available'}
                </p>
                <div className="flex items-center text-sm">
                  <FaStar className="text-amber-400 mr-1" />
                  <span className="font-medium">{place.rating || '4.5'}</span>
                  <span className="text-gray-500 ml-2">
                    ({place.review_count || '128'} reviews)
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SEO structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Similar Places',
              itemListElement: places.map((place, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Place',
                  name: place.name,
                  image: place.featured_image?.optimized_card || place.featured_image?.image,
                  description:
                    place.description || `Explore ${place.name} in ${place.destination_name}`,
                  url: `/destinations/${place.destination?.slug}/${place.slug}`,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: place.destination_name,
                  },
                },
              })),
            }),
          }}
        />
      </div>
    </motion.section>
  );
}
