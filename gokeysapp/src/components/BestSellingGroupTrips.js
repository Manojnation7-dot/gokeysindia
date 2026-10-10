import { SectionHead, TourCard } from "@/components/ui/kit";

export default function BestSellingGroupTrips({ tours }) {
  if (!tours || tours.length === 0) return null;

  return (
    <section className="gk-section pt-0!">
      <div className="gk-wrap">
        <SectionHead eyebrow="Group tours" title="Handpicked Group Adventures" href="/grouptour" linkLabel="All group tours" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              href={`/grouptour/${tour.slug}`}
              chips={["Group departure"]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
