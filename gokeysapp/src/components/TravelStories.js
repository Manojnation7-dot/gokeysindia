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
      <section className="py-20 px-6 bg-white text-center">
        <p className="text-red-600">Error: {error}</p>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className="py-20 px-6 bg-white text-center">
        <p className="text-gray-500">No travel stories available.</p>
      </section>
    );
  }

  const truncateContent = (html, maxLength = 110) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.length <= maxLength
      ? text
      : text.slice(0, maxLength - 3).trim() + "...";
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
    <section className="py-20 px-6 bg-gradient-to-b from-brand-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Travel <span className="text-brand-600">Stories</span> & Experiences
          </motion.h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Real journeys, spiritual moments, and unforgettable experiences
            shared by travelers exploring India with Gokeys.
          </p>
        </div>

        {/* Slider */}
        <Slider {...sliderSettings}>
          {posts.map((post, idx) => (
            <motion.div
              key={post.id || idx}
              className="px-3 pb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 280 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col min-h-[380px]">

                {/* Image */}
                <div className="relative w-full h-52 group overflow-hidden">
                  <Image
                    src={
                      post.cover_image?.[0]?.optimized_card ||
                      post.cover_image?.[0]?.image ||
                      "/images/placeholder.jpg"
                    }
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx === 0}
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {truncateContent(post.content)}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition"
                  >
                    Read Full Story →
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
