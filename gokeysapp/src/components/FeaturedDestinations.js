"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FeaturedDestinations({ initialDestinations }) {
  const [destinations] = useState(initialDestinations);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-brand-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Discover Iconic <span className="text-brand-600">Destinations</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            From sacred pilgrimages to breathtaking Himalayan landscapes,
            explore India with trusted local expertise.
          </p>
        </div>

        {/* Slider */}
        <Slider
          className="pb-10"
          dots
          infinite
          speed={500}
          slidesToShow={4}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={4000}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
          ]}
        >
          {destinations.map((place) => (
            <motion.div
              key={place.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="px-2 pb-10"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

                {/* Image */}
                <div className="relative w-full h-52 group overflow-hidden">
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
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
                    {place.name}
                  </h3>

                  <Link
                    href={`/destinations/${place.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition"
                  >
                    Explore Destination →
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
