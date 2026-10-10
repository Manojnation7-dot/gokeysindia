import { SectionHead, PlaceCard, cardImage, MoreLinks } from "@/components/ui/kit";

// Home page sightseeing grid (new UI)
export default function SightseeingSlider({ places }) {
  if (!places || places.length === 0) return null;

  return (
    <section className="gk-section bg-white">
      <div className="gk-wrap">
        <SectionHead
          eyebrow="Sightseeing"
          title="Explore Popular Sightseeing"
          text="Discover iconic landmarks, scenic viewpoints, and must-visit attractions curated by local travel experts."
          href="/sightseeing"
          linkLabel="All sightseeing"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {places.slice(0, 4).map((place) => (
            <PlaceCard
              key={place.id}
              href={`/sightseeing/${place.slug}`}
              image={cardImage(place.featured_image)}
              alt={place.featured_image?.alt_text || place.name}
              title={place.name}
              sub={place.destination_name}
              text={place.description}
              imgHeight="h-36"
            />
          ))}
        </div>
        <MoreLinks
          label="More places:"
          items={places.slice(4).map((p) => ({ href: `/sightseeing/${p.slug}`, label: p.name }))}
        />
      </div>
    </section>
  );
}
