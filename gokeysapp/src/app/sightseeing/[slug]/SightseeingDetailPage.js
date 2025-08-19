"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";   
import Footer from "@/components/Footer";   
import Head from "next/head";
import { FaMapMarkerAlt, FaClock, FaTicketAlt, FaStar, FaQuestionCircle, FaPhone, FaEnvelope } from "react-icons/fa";
import SimilarPlaces from "@/components/SimilarPlaces";
import SmartSEO from "@/components/SmartSEO";
import { buildSightseeingPlaceSchema, buildBreadcrumbList } from "@/lib/seoSchemas";
import InquiryFormCard from "@/components/SimpleEnquiryForm";

export default function SightseeingDetailPage({place,similarPlaces }) {
  
if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>Failed to load place data.</p>
        </div>
      </div>
    );
  }

  const sightseeingSchema = buildSightseeingPlaceSchema({
  slug: place.slug,
  name: place.name,
  description: place.meta_description || place.description?.slice(0, 160) || "",
  imageUrl: place.featured_image?.optimized_banner || place.featured_image?.image || "",
  destinationName: place.destination?.name || ""
});

const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Sightseeing", url: "/sightseeing" },
  { name: place.name, url: `/sightseeing/${place.slug}` }
]);
  return (
    <>
      <Header/>
        <SmartSEO schema={[sightseeingSchema, breadcrumbSchema]} />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section with Parallax Effect */}
        <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={place.featured_image?.optimized_banner || "/images/placeholder.jpg"}
              alt={place.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 flex items-end pb-16 justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center px-4"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4">{place.name}</h1>
                <div className="flex items-center justify-center space-x-4 text-white">
                  {place.category?.name && (
                    <span className="bg-green-600 bg-opacity-80 px-3 py-1 rounded-full text-sm">
                      {place.category.name}
                    </span>
                  )}
                  {place.distance_from_center && (
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" /> {Math.round(place.distance_from_center)} km from City Center
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column (2/3 width) */}
            <div className="lg:w-2/3">
              {/* Key Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {place.entry_fee && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <FaTicketAlt className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Entry Fee</p>
                      <p className="font-semibold">₹{place.entry_fee}</p>
                    </div>
                  </div>
                )}
                
                {place.opening_time && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <FaClock className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Opening Hours</p>
                      <p className="font-semibold">{place.opening_time} - {place.closing_time}</p>
                    </div>
                  </div>
                )}
                
                {/* Rating Card - You can add actual rating if available in your data */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="bg-amber-100 p-3 rounded-lg mr-4">
                    <FaStar className="text-amber-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Visitor Rating</p>
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">4.8</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-amber-400 text-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About {place.name}</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: place.description }}
                />
              </motion.div>

              {/* Gallery Section */}
              {place.gallery_images?.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {place.gallery_images.map((img, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.03 }}
                        className="relative h-48 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={img.optimized_card || img.image}
                          alt={`Gallery ${i}`}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Map Section - You can integrate actual map if coordinates are available */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                    <iframe
                    title={`Map of ${place.name}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    // 🧭 Zoom level 15 gives a city/street-level view, you can adjust this
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${place.name}, ${place.destination.name}`)}&output=embed&z=15`}
                    />
                </div>
                </motion.div>
                    <p className="text-sm mt-2 text-blue-600">
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.destination_name}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Open in Google Maps →
                        </a>
                        </p>
            </div>

            {/* Right Column (1/3 width) */}
            <div className="lg:w-1/3">
              {/* Inquiry Form Card */}
                 <InquiryFormCard placeName={place.name} />
              {/* Travel Tips Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Travel Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Best time to visit: Early morning to avoid crowds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Photography allowed in most areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Wear comfortable shoes for walking</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Similar Places */}
          <SimilarPlaces places={similarPlaces} />
        </div>
      </div>
      <Footer/>
    </>
  );
}