// Day-by-day itinerary (new UI). Server-renderable: every day's text is in the HTML.
export default function TourItineraryMain({ tourData }) {
  if (!tourData || !tourData.itineraries?.length) {
    return <p className="text-slate-ink py-6">Itinerary not available.</p>;
  }

  return (
    <section>
      <h2 className="gk-h2">Day Wise Tour Itinerary</h2>
      <p className="mt-1 mb-5 text-[15px] text-slate-ink">Explore your journey step by step</p>

      <div className="space-y-3">
        {tourData.itineraries.map((item, index) => (
          <div key={index} className="gk-panel p-4 md:p-5 flex gap-4">
            <span className="shrink-0 h-10 w-10 rounded-xl bg-ink text-sun gk-display font-bold flex items-center justify-center">
              {item.day || index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-teal">Day {item.day || index + 1}</p>
              <h3 className="gk-h3">{item.title}</h3>
              <div
                className="prose prose-sm max-w-none text-gray-800 mt-1.5"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />

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
                  {item.meals?.length > 0 && <span className="gk-chip">{item.meals.join(", ")}</span>}
                  {item.tags?.map((tag, i) => (
                    <span key={i} className="gk-chip">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
