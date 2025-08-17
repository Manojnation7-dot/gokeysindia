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
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  if (!places || places.length === 0) {
    return (
      <div className="py-16 bg-white text-center">
        <p className="text-gray-500">No sightseeing places available.</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
          Popular Sightseeing Places
        </h2>

        <Slider {...settings}>
          {places.map((place, index) => (
            <motion.div
              key={place.id}
              className="px-3 pb-10 relative z-10"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-48 group overflow-hidden">
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
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    <Link
                      href={`/sightseeing/${place.slug}`}
                      className="hover:underline"
                    >
                      {place.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {place.destination_name || "Destination"}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {place.distance_from_center
                      ? `${parseFloat(place.distance_from_center)} km from center`
                      : "Distance unknown"}
                  </p>
                  <div className="flex items-center text-sm">
                    <FaStar className="text-amber-400 mr-1 text-sm" />
                    <span className="font-medium">{place.rating || "4.5"}</span>
                    <span className="text-gray-500 ml-2">
                      ({place.review_count || 128} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
