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
    <section className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto mb-5">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
          Explore Amazing Destinations
        </h2>
        <div className="space-y-6 text-gray-700 text-lg mb-5">
          <p className="text-lg text-gray-700">
            Discover breathtaking destinations across India with
            <strong> Gokeys India</strong>. From holy shrines to hidden valleys,
            we bring you detailed travel guides and hassle-free packages — so
            you can explore without worry, backed by
            <strong> authorized travel agents in Haridwar</strong>.
          </p>
        </div>

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
              className="px-2 pb-10 relative z-10"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden min-h-[280px] flex flex-col">
                <div className="relative w-full h-48 group overflow-hidden">
                  <Image
                    src={
                      place.featured_image?.optimized_card ||
                      place.featured_image?.image ||
                      "/images/placeholder.jpg"
                    }
                    alt={place.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {place.name}
                  </h3>
                  <Link
                    href={`/destinations/${place.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    Explore
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
