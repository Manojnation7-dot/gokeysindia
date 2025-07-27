"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ArrowButton from "@/components/ArrowButton";
import { buildItemListSchema, buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";


const DestinationListPage = ({destinations}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const destinationsPerPage = 4;


  // Filter destinations by search query
  const filteredDestinations = destinations.filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate destinations for the "Discover More" section
  const indexOfLastDestination = currentPage * destinationsPerPage;
  const indexOfFirstDestination = indexOfLastDestination - destinationsPerPage;

  const currentDiscoverMoreDestinations = filteredDestinations.slice(
    indexOfFirstDestination,
    indexOfLastDestination
  );

  const totalPages = Math.ceil(filteredDestinations.length / destinationsPerPage);

  // Handle search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Define breadcrumb schema
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
  ]);

  // Define destination list schema
  const destinationListSchema = buildItemListSchema({
    name: "All Destinations",
    items: filteredDestinations,
    itemType: "Place",
    getItemSchema: (destination, schema) => ({
      ...schema,
      name: destination.name || "Unnamed Destination",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://gokeys.in"}/destinations/${destination.slug}`,
      description:
        destination.overview?.replace(/<\/?[^>]+(>|$)/g, "") ||
        destination.state ||
        "Discover a stunning destination with Gokeys India.",
      image:
        destination.featured_image?.image ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      address: {
        "@type": "PostalAddress",
        addressRegion: destination.state || "Unknown",
        addressCountry: "IN",
      },
    }),
  });

  // Combine schemas for SmartSEO
  const schemas = [breadcrumbSchema, destinationListSchema];

  return (
    <>
      <Header />
      <SmartSEO schema={schemas} />
      <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[350px] flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop"
            alt="Explore destinations with Gokeys India"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 bg-black opacity-30 z-5" />
          <div className="relative z-10 text-center text-white px-4">
            <motion.h1
              className="text-4xl md:text-5xl font-bold drop-shadow-lg"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Explore Amazing Destinations with Gokeys India
            </motion.h1>
            <motion.p
              className="mt-3 text-lg md:text-xl italic drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              "I'm in love with cities I've never been to and people I've never met."
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 120 }}
            >
              <Link href="#destinations">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                  Discover Now
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
          <div className="flex justify-center items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search destinations..."
              className="py-3 px-5 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md shadow-sm"
            />
          </div>
        </section>

        {/* Top Destinations Section */}
        {filteredDestinations.length > 0 && (
         <section id="destinations" className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
           {/* Left: Large Card */}
           <div className="md:col-span-5">
             <motion.div
               className="relative h-[500px] md:h-full rounded-xl overflow-hidden shadow-lg group"
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
             >
               <Image
                 src={
                   filteredDestinations[0]?.featured_image?.image ||
                   "/placeholder.jpg"
                 }
                 alt={filteredDestinations[0]?.name}
                 layout="fill"
                 objectFit="cover"
                 className="transition-transform duration-300 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
               <div className="absolute group inset-0 bg-black/30 flex flex-col justify-end p-6 z-20">
              <div className="text-white">
                <h3 className="text-2xl font-semibold">
                  {filteredDestinations[0]?.name}
                </h3>
                <p className="text-sm mt-1">{filteredDestinations[0]?.state}</p>
              </div>

              <ArrowButton
                href={`/destinations/${filteredDestinations[0]?.slug}`}/>              
            </div>
             </motion.div>
           </div>
       
           {/* Right: Responsive Cards */}
           <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:grid-rows-2 gap-4">
             {filteredDestinations.slice(1, 4).map((destination, index) => (
               <motion.div
                 key={destination.id}
                 className={`relative rounded-xl overflow-hidden shadow-lg group ${
                   index === 2 ? "sm:col-span-2 md:col-span-2 md:row-span-2 h-[250px] md:h-full" : "h-[250px]"
                 }`}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.2, duration: 0.5 }}
               >
                 <Image
                   src={destination.featured_image?.image || "/placeholder.jpg"}
                   alt={destination.name}
                   layout="fill"
                   objectFit="cover"
                   className="transition-transform duration-300 group-hover:scale-105"
                 />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                 <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4 z-20">
                   <div className="text-white">
                     <h3 className="text-xl font-semibold">
                       {destination.name}
                     </h3>
                     <p className="text-sm mt-1">{destination.state}</p>
                   </div>
                   <ArrowButton
                     href={`/destinations/${destination.slug}`}
                     className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-indigo-600 hover:text-white transition"
                   />
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
       
        
        )}

        {/* Explore More Stunning Destinations Section */}
        {filteredDestinations.length > 4 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Explore More Stunning Destinations
            </h2>
            <p className="text-center text-gray-600 mt-2">
              Discover breathtaking locations around the world and find your next adventure!
            </p>
            <hr className="w-24 mx-auto border-t-2 border-gray-300 my-6" />

            <motion.div
              className="relative h-[500px] rounded-xl overflow-hidden shadow-lg group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={
                  filteredDestinations[4]?.featured_image?.image ||
                  "/placeholder.jpg"
                }
                alt={filteredDestinations[4]?.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105 "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 z-20">
                <div className="text-white">
                  <h3 className="text-2xl font-semibold">
                    {filteredDestinations[4]?.name}
                  </h3>
                  <p className="text-sm mt-1 line-clamp-2">
                    {filteredDestinations[4]?.overview}
                  </p>
                </div>
                <ArrowButton
                  href={`/destinations/${filteredDestinations[4]?.slug}`}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full hover:bg-indigo-600 hover:text-white transition"
                />
              </div>
            </motion.div>
          </section>
        )}

        {/* Discover More Destinations Section */}
        {filteredDestinations.length > 5 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Discover More Destinations
            </h2>
            <p className="text-center text-gray-600 mt-2">
              Uncover unique places waiting to be explored.
            </p>
            <hr className="w-24 mx-auto border-t-2 border-gray-300 my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentDiscoverMoreDestinations.slice(5, 17).map((destination, index) => (
                <motion.div
                  key={destination.id}
                  className="relative h-[250px] rounded-xl overflow-hidden shadow-lg group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Image
                    src={destination.featured_image?.image || "/placeholder.jpg"}
                    alt={destination.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                    <div className="text-white">
                      <h3 className="text-xl font-semibold">
                        {destination.name}
                      </h3>
                    </div>
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-indigo-600 hover:text-white transition"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {filteredDestinations.length > 17 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                {currentPage > 1 && (
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                  >
                    Previous
                  </button>
                )}
                <span className="text-lg font-semibold text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* Quick Links Section */}
        {filteredDestinations.length > 0 && (
         <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-blue-900 mb-12">
                Check Out the Best Destinations
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredDestinations.slice(0, 8).map((destination) => (
                  <li key={destination.id}>
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="block p-4 bg-gradient-to-r from-red-50 to-gray-100 rounded-full shadow hover:from-yellow-100 hover:to-orange-100 transition"
                    >
                      {destination.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DestinationListPage;