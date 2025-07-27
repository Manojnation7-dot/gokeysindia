'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  PlusIcon,
  MinusIcon,
} from "@/components/Icons";
import InquiryFormCard from "@/components/SimpleEnquiryForm";
import { buildBreadcrumbList, buildFAQSchema } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";


// SVG Icons for info cards
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TransportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

export default function DestinationDetailPage({ destination, tours, hotels, slug, nearbyAttractionsList }) {
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleDay = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };
  
  const extractParagraphTexts = (htmlString) => {
    if (typeof window === 'undefined' || !htmlString) return [];
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlString;
    return Array.from(wrapper.querySelectorAll('p'))
      .map(p => p.textContent.trim())
      .filter(Boolean);
  };
  // Helper function to parse HTML strings
  const parseHTML = (htmlString) => {
    return { __html: htmlString };
  };

   const breadcrumbSchema = buildBreadcrumbList([
      { name: "Home", url: "/" },
      { name: "Destinations", url: "/destinations" },
      { name: destination.name, url: `/destinations/${destination.slug}` }
    ]);

    const faqSchema = destination.faqs?.length > 0 ? buildFAQSchema(destination.faqs) : null;

if (!destination) {
  return <div className="text-center py-16">Destination not found</div>;
}

  return (
    <>
      <Header />
      <SmartSEO
       schema={[
              breadcrumbSchema,
              ...(faqSchema ? [faqSchema] : [])
            ]}
      />
      <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full">
          <Image
            src={destination.featured_image?.image || "/placeholder.jpg"}
            alt={destination.name}
            layout="fill"
            objectFit="cover"
            className="object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white space-y-4 px-6">
              <h1 className="text-4xl md:text-5xl font-extrabold">{destination.name}</h1>
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 mt-4 max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold text-white mb-4">Travel Tips</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {destination.travel_tips
                    .split(/\r?\n/)
                    .filter(Boolean)
                    .map((tip, index) => (
                      <div key={index} className="flex items-start text-white text-sm md:text-base">
                        <svg
                          className="w-5 h-5 text-green-400 mt-1 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{tip.trim()}</span>
                      </div>
                    ))}
                </div>
              </div>

              <a
                href="#tours-section"
                className="inline-block mt-6 px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700 transition"
              >
                Explore Tours
              </a>
            </div>
          </div>
        </section>

        {/* Destination Info */}
        {/* Destination Info */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">About {destination.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Side: Description */}
            <div className="md:col-span-2">
              <div
                className="prose prose-lg prose-indigo text-gray-700 max-w-full overflow-x-auto mb-8"
                dangerouslySetInnerHTML={{ __html: destination.description || "No description available." }}
              />
            </div>

            {/* Right Side: Enquiry Form */}
            <div className="md:col-span-1">
                <InquiryFormCard placeName={destination.name} className="w-full max-w-full" />
              </div>
          </div>
        </section>
        {/* Destination Information Cards */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Best Time to Visit */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-xl mr-4">
                  <CalendarIcon />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Best Time to Visit</h2>
              </div>
              <p className="text-lg text-gray-700 pl-16">{destination.best_time_to_visit || "Year-round"}</p>
            </div>

            {/* Popular Activities */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-3 rounded-xl mr-4">
                  <ActivityIcon />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Popular Activities</h2>
              </div>
              <ul className="space-y-3 pl-16">
                {destination.popular_activities && destination.popular_activities.split('\r\n').map((activity, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-lg text-gray-700">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nearby Attractions */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-100 p-3 rounded-xl mr-4">
                    <LocationIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Nearby Attractions</h2>
                </div>

                <ul className="space-y-3 pl-16">
                  {nearbyAttractionsList.map((attraction, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      <span className="text-lg text-gray-700">{attraction}</span>
                    </li>
                  ))}
                </ul>
              </div>

            {/* How to Reach */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-xl mr-4">
                  <TransportIcon />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">How to Reach</h2>
              </div>
              <div 
                className="text-lg text-gray-700 pl-16 space-y-2"
                dangerouslySetInnerHTML={parseHTML(destination.how_to_reach || "<p>No transport information</p>")} 
              />
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {(destination.faqs || []).map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50 transition-all"
                  onClick={() => toggleDay(index + 10)}
                >
                  <span>{faq.question}</span>
                  {expandedDay === index + 10 ? <MinusIcon /> : <PlusIcon />}
                </button>
                {expandedDay === index + 10 && (
                  <div
                    className="p-4 pt-2 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tours Section */}
        <section id="tours-section" className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-gray-800">Available Tour Packages</h2>
            {tours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {tours.map(tour => (
                  <div
                    key={tour.id}
                    className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4"
                  >
                    <div>
                      <div className="relative h-48 w-full rounded-xl overflow-hidden">
                        <Image
                          src={tour.featured_image?.image || "/images/placeholder.jpg"}
                          alt={tour.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mt-4">{tour.name}</h3>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: tour.content }} />
                      <p className="mt-3 text-sm text-gray-500">
                        Duration: {tour.duration_days} days / {tour.duration_nights} nights
                      </p>
                      <p className="mt-1 text-lg text-indigo-600 font-semibold">
                        From ₹{(parseFloat(tour.base_price) || 20000).toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/tours/${tour.slug}`} className="mt-4 block">
                      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                        View Details
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-gray-600">No tours available for this destination.</p>
            )}
          </div>
        </section>
                {/* Hotels Section */}
           <section id="hotels-section" className="bg-white py-12 border-t border-gray-200">
              <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-semibold text-gray-800">Available Hotels</h2>

                {hotels.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4"
                      >
                        <div>
                          <div className="relative h-48 w-full rounded-xl overflow-hidden">
                            <Image
                              src={hotel.front_image_url || "/images/placeholder.jpg"}
                              alt={hotel.name}
                              fill
                              className="object-cover rounded-xl"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mt-4">{hotel.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{hotel.location}</p>
                          <p className="text-sm text-gray-500 mt-1">Starting at ₹{parseFloat(hotel.tariff_starting_from).toLocaleString()}</p>
                          <p className="mt-1 text-sm text-gray-500">Star Rating: {hotel.star_rating} ⭐</p>
                        </div>
                        <Link href={`/hotels/${slug}/${hotel.slug}`} className="mt-4 block">
                          <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition">
                            View Details
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-gray-600">No hotels available for this destination.</p>
                )}
              </div>
            </section>


        {/* CTA Section */}
        <section className="py-12 bg-indigo-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Have Questions?</h2>
            <p className="mt-2 text-gray-600">
              Need help choosing a tour or want to customize your travel experience? Reach out to us anytime.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
