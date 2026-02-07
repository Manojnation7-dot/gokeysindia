"use client";

import { useState } from "react";

export default function TourItineraryMain({ tourData }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!tourData || !tourData.itineraries?.length) {
    return <p className="text-gray-500 text-center py-10">Itinerary not available.</p>;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Day Wise Tour Itinerary
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore your journey step by step
        </p>
      </div>

      {/* Timeline */}
      <div className="relative space-y-12">
        {/* Main vertical line */}
        <div className="absolute left-4 md:left-10 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

        {tourData.itineraries.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="relative pl-12 md:pl-24">
              {/* Day Bubble */}
              <div
                className={`absolute left-0 md:left-6 top-4 w-9 h-9 rounded-full border-4 border-white dark:border-slate-900 shadow flex items-center justify-center transition-all duration-300 z-10
                ${isOpen ? "bg-indigo-600 scale-110" : "bg-slate-300 dark:bg-slate-600"}`}
              >
                <span className="text-[11px] font-bold text-white">
                  D{item.day || index + 1}
                </span>
              </div>

              {/* Card */}
              <div
                className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300
                ${isOpen ? "shadow-xl ring-2 ring-indigo-500/20" : "shadow hover:shadow-lg"}`}
              >
                {/* Header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                        Day {item.day || index + 1}
                      </span>

                      {item.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    {item.location && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        📍 {item.location}
                      </p>
                    )}
                  </div>

                  {/* Toggle */}
                  <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isOpen 
                        ? "bg-indigo-600 text-white rotate-180" 
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
                    >
                      {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14" />
                        </svg>
                      )}
                    </div>
                </button>

                {/* Body */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden border-t border-slate-100 dark:border-slate-700">
                    <div className="p-6 md:p-8 space-y-8">
                      {/* Description */}
                      <div
                        className="prose max-w-none text-slate-600 dark:text-slate-300"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />

                      {/* Activities */}
                      {item.activities?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Highlights & Activities
                          </h4>

                          <ul className="grid sm:grid-cols-2 gap-3">
                            {item.activities.map((act, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                              >
                                <span className="text-indigo-500 mt-0.5">✔</span>
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Meals */}
                      {item.meals?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Meals Included
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                              <span
                                key={meal}
                                className={`px-3 py-1 rounded-full text-xs border
                                ${
                                  item.meals.includes(meal)
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                    : "bg-slate-50 border-slate-200 text-slate-400"
                                }`}
                              >
                                {meal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
