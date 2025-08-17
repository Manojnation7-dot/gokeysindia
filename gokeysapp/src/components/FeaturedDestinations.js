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
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Explore Amazing Destinations
        </h2>
        <section>
        <p>Explore the Amazing destination with detailed Travel Guide to make your holiday perfect with Authorized Travel Agents in Haridwar. Gokeys India's includes various destination throughout the India, so you can explore without worry.</p>
        </section>
        <Slider
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
            <div key={place.id} className="px-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={
                      place.featured_image?.optimized_card ||
                      place.featured_image?.image ||
                      "/images/placeholder.jpg"
                    }
                    alt={place.name}
                    fill
                    style={{ objectFit: "cover" }}
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
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
