import { SectionHead, PlaceCard, cardImage, MoreLinks } from "@/components/ui/kit";

export default function FeaturedDestinations({ initialDestinations = [] }) {
  if (!initialDestinations.length) return null;

  return (
    <section className="gk-section">
      <div className="gk-wrap">
        <SectionHead eyebrow="Destinations" title="Discover Iconic Destinations"
          text="From sacred pilgrimages to breathtaking Himalayan landscapes, explore India with trusted local expertise." href="/destinations" linkLabel="All destinations" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialDestinations.slice(0, 6).map((place) => (
            <PlaceCard
              key={place.id}
              href={`/destinations/${place.slug}`}
              image={cardImage(place.featured_image)}
              alt={place.featured_image?.alt_text || place.name}
              title={place.name}
              text={place.summary}
              imgHeight="h-44"
            />
          ))}
        </div>
        <MoreLinks
          label="More destinations:"
          items={initialDestinations.slice(6).map((p) => ({ href: `/destinations/${p.slug}`, label: p.name }))}
        />
      </div>
    </section>
  );
}
