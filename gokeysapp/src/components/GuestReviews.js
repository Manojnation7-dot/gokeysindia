// Guest reviews typed in by staff in the admin (a group tour's, or the /grouptour page's). Text only: no stars and no
// review markup for search engines. Renders nothing while there are none.
export default function GuestReviews({ reviews, title = "What our guests say", className = "" }) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  return (
    <section className={className} aria-labelledby="guest-reviews-heading">
      <h2 id="guest-reviews-heading" className="gk-h2 mb-5">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <figure key={`${r.name}-${i}`} className="bg-mist rounded-2xl p-6 flex flex-col">
            <blockquote className="text-[15px] text-slate-ink leading-relaxed mb-4">“{r.text}”</blockquote>
            <figcaption className="mt-auto text-sm">
              <span className="font-bold text-ink">{r.name}</span>
              {(r.city || r.travel_month) && (
                <span className="block text-xs text-slate-ink">{[r.city, r.travel_month].filter(Boolean).join(" · ")}</span>
              )}
              {r.source_link && (
                <a href={r.source_link} target="_blank" rel="noopener noreferrer nofollow" className="text-xs underline text-teal">Original review</a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
