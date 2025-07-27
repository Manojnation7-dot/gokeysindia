"use client";

import { useState } from "react";

export default function TourItineraryMain({ tourData }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!tourData || !tourData.itineraries) {
    return <p className="text-gray-500 text-center py-8">Itinerary not available.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tour Itinerary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore your journey day by day
        </p>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute h-full w-0.5 bg-blue-200 dark:bg-blue-900 left-6 top-4"></div>
        
        <div className="space-y-8">
          {tourData.itineraries?.map((item, index) => (
            <div key={index} className="relative pl-16">
              {/* Timeline marker */}
              <div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg -translate-x-1/2 ring-4 ring-white dark:ring-gray-800">
                <span className="font-bold">{index + 1}</span>
              </div>

              {/* Accordion card */}
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200 ${
                openIndex === index ? "ring-2 ring-blue-500" : "hover:shadow-lg"
              }`}>
                {/* Accordion header */}
                <button
                  type="button"
                  className={`w-full flex items-center justify-between p-6 text-left ${
                    openIndex === index ? "bg-blue-50 dark:bg-gray-700" : ""
                  }`}
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`timeline-accordion-body-${index}`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        Day {item.day}
                      </span>
                    </div>
                    {openIndex !== index && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {item.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Accordion content */}
                <div
                  id={`timeline-accordion-body-${index}`}
                  className={`${openIndex === index ? "block" : "hidden"} transition-all duration-200`}
                  aria-labelledby={`timeline-accordion-heading-${index}`}
                >
                  <div className="px-6 pb-6">
                    <div
                      className="prose prose-blue max-w-none dark:prose-invert text-gray-600 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    
                    {item.activities?.length > 0 && (
                      <div className="mt-6 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            ></path>
                          </svg>
                          Today's Activities
                        </h4>
                        <ul className="space-y-2 pl-5">
                          {item.activities.map((act, i) => (
                            <li key={i} className="relative pl-6 text-gray-700 dark:text-gray-300">
                              <span className="absolute left-0 top-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}