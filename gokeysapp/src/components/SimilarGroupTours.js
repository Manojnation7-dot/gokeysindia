import { TourCard } from "@/components/ui/kit";

export default function SimilarTours({ tours }) {
  if (!tours || !tours.length) return null;

  return (
    <section className="bg-white">
      <div className="gk-wrap gk-section">
        <h2 className="gk-h2">Similar Tour Packages</h2>
        <p className="text-slate-ink mt-1 mb-6">You might also like these group tours</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              href={`/grouptour/${tour.slug}`}
              chips={["Group departure", tour.duration && `${tour.duration} Days`]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
