'use client';

import { useRef, useState } from 'react';

// Day-by-day itinerary of a group tour as an accordion: native <details>/<summary>, so every day's text is in the
// server-rendered HTML and opens without JavaScript. Day 1 starts open. "Expand all / Collapse all" needs JavaScript
// (it only opens or closes the same <details>). The package tour pages keep TourItineraryMain unchanged.
export default function GroupItineraryAccordion({ days }) {
  const listRef = useRef(null);
  const [openCount, setOpenCount] = useState(days?.length ? 1 : 0);

  if (!days?.length) {
    return <p className="text-slate-ink py-6">Itinerary not available.</p>;
  }

  const allOpen = openCount === days.length;
  const rows = () => Array.from(listRef.current?.querySelectorAll(':scope > details') || []);
  const recount = () => setOpenCount(rows().filter((d) => d.open).length);
  const toggleAll = () => rows().forEach((d) => { d.open = !allOpen; });

  return (
    <section>
      <h2 className="gk-h2">Day Wise Tour Itinerary</h2>
      <div className="mt-1 mb-5 flex flex-wrap items-center justify-between gap-x-4">
        <p className="text-[15px] text-slate-ink">Explore your journey step by step</p>
        {days.length > 1 && (
          <button type="button" onClick={toggleAll} aria-expanded={allOpen}
            className="min-h-[44px] text-sm font-semibold text-teal underline underline-offset-2">
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        )}
      </div>

      <div ref={listRef} className="space-y-3">
        {days.map((item, index) => {
          const day = item.day || index + 1;
          return (
            <details key={index} open={index === 0} onToggle={recount} className="gk-panel gk-faq">
              <summary className="flex items-center gap-4 p-4 md:p-5 min-h-[44px]">
                <span className="shrink-0 h-10 w-10 rounded-xl bg-ink text-sun gk-display font-bold flex items-center justify-center">
                  {day}
                </span>
                <h3 className="gk-h3 min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-widest text-teal font-sans">Day {day}</span>
                  {item.title}
                </h3>
                <span className="gk-faq-chevron gk-faq-icon shrink-0 transition-transform text-ink" aria-hidden="true" />
              </summary>

              <div className="px-4 pb-4 md:px-5 md:pb-5 md:pl-[4.75rem]">
                <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: item.description }} />

                {item.activities?.length > 0 && (
                  <ul className="grid sm:grid-cols-2 gap-2 mt-3">
                    {item.activities.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-ink">
                        <span className="text-teal mt-0.5">✔</span>
                        {act}
                      </li>
                    ))}
                  </ul>
                )}

                {(item.location || item.meals?.length > 0 || item.tags?.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.location && <span className="gk-chip">📍 {item.location}</span>}
                    {item.meals?.length > 0 && <span className="gk-chip">{item.meals.join(', ')}</span>}
                    {item.tags?.map((tag, i) => (
                      <span key={i} className="gk-chip">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
