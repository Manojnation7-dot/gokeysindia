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
            <div key={post.id || idx} className="px-3">
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={
                      post.cover_image?.[0]?.optimized_card ||
                      post.cover_image?.[0]?.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt={`Cover image for ${post.title}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx === 0}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAoHBwkHBgoJ..."
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{truncateContent(post.content)}</p>
                  <Link href={`/blog/${post.slug}`}>
                    <span className="text-blue-600 hover:underline font-medium">Read More →</span>
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
