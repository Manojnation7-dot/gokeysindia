// HotelsHomePage.jsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";

export default function HotelsHomePage({ hotels }) {

  const groupedHotels = hotels.reduce((acc, hotel) => {
    const destination = hotel.destination.toLowerCase();
    if (!acc[destination]) {
      acc[destination] = {
        destination: hotel.destination,
        front_image_url: hotel.front_image_url || "https://via.placeholder.com/300x200",
        tariff_starting_from: hotel.tariff_starting_from || Infinity,
        count: 1,
      };
    } else {
      acc[destination].count += 1;
      if (hotel.tariff_starting_from && hotel.tariff_starting_from < acc[destination].tariff_starting_from) {
        acc[destination].tariff_starting_from = hotel.tariff_starting_from;
        acc[destination].front_image_url = hotel.front_image_url || acc[destination].front_image_url;
      }
    }
    return acc;
  }, {});
  const destinations = Object.values(groupedHotels);
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Best Hotels in India", url: "/hotels" },
  ]);
  return (
    <>
      <Header />
      <SmartSEO schema={breadcrumbSchema} />
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Hotels by Destination</h1>
        {destinations.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.destination} href={`/hotels/${destination.destination.toLowerCase()}`}>
                <div className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition">
                  <div className="relative h-56">
                    <Image
                      src={destination.front_image_url}
                      alt={destination.destination}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{destination.destination}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {destination.count} {destination.count > 1 ? "hotels" : "hotel"} starting from ₹
                      {destination.tariff_starting_from !== Infinity
                        ? destination.tariff_starting_from
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hotels found.</p>
        )}
      </section>
      <Footer />
    </>
  );
}
