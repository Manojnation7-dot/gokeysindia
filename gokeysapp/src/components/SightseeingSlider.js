"use client";

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SightseeingSlider({ places }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08 },
    }),
  };

  if (!places || places.length === 0) {
    return (
      <div className="py-20 bg-white text-center">
        <p className="text-gray-500">No sightseeing places available.</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-brand-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Explore Popular <span className="text-brand-600">Sightseeing</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Discover iconic landmarks, scenic viewpoints, and must-visit attractions
            curated by local travel experts.
          </p>
        </div>

        {/* Slider */}
        <Slider {...settings}>
          {places.map((place, index) => (
            <motion.div
              key={place.id}
              className="px-3 pb-10"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 280 }}
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

                {/* Image */}
                <div className="relative h-52 group overflow-hidden">
                  <Image
                    src={
                      place.featured_image?.optimized_card ||
                      place.featured_image?.image ||
                      "/images/placeholder.jpg"
                    }
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    <Link
                      href={`/sightseeing/${place.slug}`}
                      className="hover:text-brand-600 transition"
                    >
                      {place.name}
                    </Link>
                  </h3>

                  <p className="text-sm text-gray-500">
                    {place.destination_name || "Destination"}
                  </p>

                  {place.distance_from_center && (
                    <p className="text-sm text-gray-500">
                      {parseFloat(place.distance_from_center)} km from center
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <FaStar className="text-amber-400 text-sm" />
                    <span className="font-semibold text-gray-800">
                      {place.rating || "4.5"}
                    </span>
                    <span className="text-gray-500">
                      ({place.review_count || 128} reviews)
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/sightseeing/${place.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition"
                  >
                    View Details →
                  </Link>
                </div>

              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
