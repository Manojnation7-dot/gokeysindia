import { SectionHead, TourCard } from "@/components/ui/kit";

export default function BestSellingTrips({ tours }) {
  if (!tours || tours.length === 0) return null;

  return (
    <section className="gk-section pt-0!">
      <div className="gk-wrap">
        <SectionHead eyebrow="Best sellers" title="Our Best-Selling Trips" href="/tours" linkLabel="View all tours" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              href={`/tours/${tour.slug}`}
              chips={[tour.trip_types?.[0]?.name, tour.duration_days && `${tour.duration_days} days`]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
