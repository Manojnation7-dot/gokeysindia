"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TravelStories({ posts = [], error = null }) {
  if (error) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">No travel stories available.</p>
        </div>
      </section>
    );
  }

  const truncateContent = (html, maxLength = 100) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3).trim() + "...";
  };

  const sliderSettings = {
    dots: true,
    infinite: posts.length > 3,
    speed: 500,
    slidesToShow: Math.min(posts.length, 3),
    slidesToScroll: 3,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-blue-900 text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Recent Travel Stories
        </motion.h2>

        <Slider {...sliderSettings}>
          {posts.map((post, idx) => (
            <motion.div
              key={post.id || idx}
              className="px-3 pb-10 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col min-h-[360px]">
                <div className="relative w-full h-48 group overflow-hidden">
                  <Image
                    src={
                      post.cover_image?.[0]?.optimized_card ||
                      post.cover_image?.[0]?.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt={`Cover image for ${post.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx === 0}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {truncateContent(post.content)}
                    </p>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <span className="text-blue-600 hover:underline font-medium">
                      Read More →
                    </span>
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
