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
  
function extractParagraphTexts(htmlString) {
  if (!htmlString) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const paragraphs = [...doc.querySelectorAll("p")].map(p => p.textContent.trim());

  // Fallback: if no <p> found, treat entire string as one paragraph
  if (paragraphs.length === 0 && htmlString.trim()) {
    return [htmlString.trim()];
  }

  return paragraphs;
}
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
        {/* Hero Section – Premium Design (No Enquiry Box) */}
        <section className="relative h-screen flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={destination.featured_image?.image || "/placeholder.jpg"}
              alt={destination.name}
              fill
              priority
              className="object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Badge */}
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Featured Destination
              </div> */}

              {/* Heading */}
              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-white">
                Explore <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                  {destination.name}
                </span>
              </h1>

              {/* Travel Tips Glass Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 max-w-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Traveler Insights
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.travel_tips
                    .split(/\r?\n/)
                    .filter(Boolean)
                    .map((tip, idx) => (
                      <div key={idx} className="text-sm text-white/80 flex items-start">
                        <span className="mr-2 text-emerald-400 font-bold">•</span>
                        {tip}
                      </div>
                    ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href="#tours-section"
                className="inline-block mt-4 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-lg"
              >
                Explore Tours
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce">
            <span className="text-xs uppercase font-bold tracking-widest mb-2">
              Scroll to explore
            </span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7m7 7V3" />
            </svg>
          </div>
        </section>
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
                {/* Best Time to Visit */}
              {typeof destination.best_time_to_visit === "string" && destination.best_time_to_visit.trim() && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4">
                      <CalendarIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Best Time to Visit</h2>
                  </div>
                  <ul className="space-y-3 pl-16">
                    {extractParagraphTexts(destination.best_time_to_visit).map((para, index) => (
                      <li key={index} className="text-lg text-gray-700 list-disc list-inside">{para}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popular Activities */}
              {typeof destination.popular_activities === "string" && destination.popular_activities.trim() && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-xl mr-4">
                      <ActivityIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Popular Activities</h2>
                  </div>
                  <ul className="space-y-3 pl-16">
                    {extractParagraphTexts(destination.popular_activities).map((activity, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span className="text-lg text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                    <span
                      className="text-lg text-gray-700"
                      dangerouslySetInnerHTML={{ __html: attraction }}
                    ></span>
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
          <section className="py-16 max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {(destination.faqs || []).map((faq, index) => {
                const isOpen = expandedDay === index + 10;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
                  >
                    {/* Question */}
                    <button
                      onClick={() => toggleDay(index + 10)}
                      className="w-full flex items-center justify-between gap-6 p-6 md:p-8 text-left group"
                    >
                      <span
                        className={`text-lg md:text-xl font-bold transition-colors ${
                          isOpen ? "text-indigo-600" : "text-gray-900 group-hover:text-indigo-600"
                        }`}
                      >
                        {faq.question}
                      </span>

                      {/* Arrow */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                          isOpen
                            ? "bg-indigo-600 text-white rotate-180"
                            : "bg-gray-100 text-gray-500 group-hover:bg-indigo-50"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Answer */}
                    {isOpen && (
                      <div className="px-6 md:px-8 pb-8 pt-0 text-gray-600 text-base leading-relaxed">
                        <div
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>


        {/* Tours Section */}
      <section id="tours-section" className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-800">Available Tour Packages</h2>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={tour.featured_image?.image || "/images/placeholder.jpg"}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Duration badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-900">
                    {tour.duration_days}D / {tour.duration_nights}N
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {tour.name}
                  </h3>

                  <p
                    className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: tour.content }}
                  />

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        Starting from
                      </span>
                      <span className="text-2xl font-extrabold text-indigo-600">
                        ₹{parseFloat(tour.base_price || 0).toLocaleString()}
                      </span>
                    </div>

                    <Link href={`/tours/${tour.slug}`}>
                      <button className="px-6 py-3 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold transition shadow-md">
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
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
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={hotel.front_image_url || "/images/placeholder.jpg"}
                        alt={hotel.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Star Rating Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-[11px] font-extrabold tracking-widest uppercase backdrop-blur">
                        {hotel.star_rating} ★
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        {hotel.name}
                      </h3>

                      <div className="flex items-center text-gray-400 text-xs font-semibold mb-5">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {hotel.location}
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                            Starting from
                          </span>
                          <span className="text-2xl font-extrabold text-emerald-600">
                            ₹{parseFloat(hotel.tariff_starting_from).toLocaleString()}
                          </span>
                        </div>

                        <Link href={`/hotels/${slug}/${hotel.slug}`}>
                          <button className="px-6 py-3 bg-gray-900 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold transition shadow-md">
                            Details
                          </button>
                        </Link>
                      </div>
                    </div>
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
