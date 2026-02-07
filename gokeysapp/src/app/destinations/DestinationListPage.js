"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import ArrowButton from "@/components/ArrowButton";
import { buildItemListSchema, buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import Link from "next/link";

const DestinationListPage = ({ destinations }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const destinationsPerPage = 12;

  const filteredDestinations = (destinations || []).filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredDestinations.length / destinationsPerPage
  );

  const indexOfLast = currentPage * destinationsPerPage;
  const indexOfFirst = indexOfLast - destinationsPerPage;

  const visibleDestinations = filteredDestinations.slice(
    indexOfFirst,
    indexOfLast
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  /* ---------------- SEO ---------------- */
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
  ]);

  const destinationListSchema = buildItemListSchema({
    name: "All Destinations",
    items: filteredDestinations,
    itemType: "Place",
    getItemSchema: (destination, schema) => ({
      ...schema,
      name: destination.name,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/destinations/${destination.slug}`,
      description:
        destination.state || "Discover amazing destinations with Gokeys India.",
      image:
        destination.featured_image?.image ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    }),
  });

  const schemas = [breadcrumbSchema, destinationListSchema];

  return (
    <>
      <Header />
      <SmartSEO schema={schemas} />

      <main className="bg-gradient-to-b from-white to-gray-50">

        {/* PREMIUM HERO */}
        <section className="relative h-[420px] flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
            alt="Explore destinations"
            fill
            priority
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

          <div className="relative text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Discover Incredible Destinations
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Explore handpicked places across India with comfort & trust
            </p>
          </div>
        </section>

        {/* PREMIUM SEARCH */}
        <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
          <div className="backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl p-4 border border-white/40">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search destination (Haridwar, Kedarnath, Goa...)"
              className="w-full py-3 px-5 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
            />
          </div>
        </section>

        {/* DESTINATION GRID */}
        {visibleDestinations.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-14">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {visibleDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative h-[260px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">

                  <Image
                    src={
                      destination.featured_image?.image || "/placeholder.jpg"
                    }
                    alt={destination.name}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                  {/* Content */}
                  <div className="absolute bottom-0 p-4 text-white w-full">
                    <h3 className="text-lg font-semibold tracking-wide">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {destination.state}
                    </p>
                  </div>

                  <ArrowButton
                    href={`/destinations/${destination.slug}`}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-indigo-600 hover:text-white transition"
                  />
                </motion.div>
              ))}
            </div>

            {/* PREMIUM PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-5 py-2 rounded-full bg-gray-200 hover:bg-indigo-600 hover:text-white transition"
                  >
                    ← Previous
                  </button>
                )}

                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-5 py-2 rounded-full bg-gray-200 hover:bg-indigo-600 hover:text-white transition"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </section>
        )}
        {/* PREMIUM CTA */}
<section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
  <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2.5rem] shadow-2xl">

    {/* Background Image */}
    <Image
      src="/images/banner-image.png"
      alt="Plan Your Group Trip"
      fill
      priority
      className="object-cover scale-105"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/20" />

    {/* Soft Glow */}
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/20 blur-[120px] rounded-full" />

    {/* Content */}
    <div className="relative z-10 max-w-2xl p-10 md:p-16 text-white">
      
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold leading-tight mb-6"
      >
        Ready to Plan Your <br /> Dream Journey?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-lg text-white/90 mb-10"
      >
        Tell us your destination, dates, and preferences — our travel experts will craft a perfect experience for you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link href="/contact">
          <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition duration-300">
            Plan My Trip
          </button>
        </Link>

        <Link href="/contact">
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-semibold rounded-xl transition duration-300">
            Get Callback
          </button>
        </Link>
      </motion.div>
    </div>
  </div>
</section>

      </main>

      <Footer />
    </>
  );
};

export default DestinationListPage;
