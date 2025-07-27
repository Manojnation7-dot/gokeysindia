"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";   
import Footer from "@/components/Footer";   
import { MapPin } from "lucide-react";
import { buildItemListSchema, buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO"; 


export default function SightseeingListPage({places}) {
 

   if (!places || places.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No sightseeing places found.</p>
      </div>
    );
  }

const sightseeingListSchema = buildItemListSchema({
  name: "All Sightseeing Places",
  items: places, // your `places` array
  itemType: "TouristAttraction",
  getItemSchema: (place, schema) => ({
    ...schema,
    locatedInPlace: {
      "@type": "Place",
      name: place.destination?.name || ""
    }
  })
});

const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Sightseeing", url: "/sightseeing" }
]);

  return (
    <>
    <Header/>
    <SmartSEO schema={[sightseeingListSchema, breadcrumbSchema]} />
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-10 text-center">
          Explore Sightseeing Places
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <motion.div
              key={place.slug}
              className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={place.featured_image?.optimized_card || "/images/placeholder.jpg"}
                  alt={place.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <span className="text-sm text-blue-600 font-medium">
                  {place.category?.name || "General"}
                </span>
                <h2 className="text-lg font-semibold text-gray-800 mt-1">
                  {place.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {place.description}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {Number(place.distance_from_center).toFixed(0)} km from center
                </p>
                <Link
                  href={`/sightseeing/${place.slug}`}
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
}

function stripHtml(html) {
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  return html;
}
