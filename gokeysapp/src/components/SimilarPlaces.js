import { hasValidReviewRating, hasValidSightseeingSlug } from '@/lib/seoSchemas';
import { PlaceCard, cardImage } from '@/components/ui/kit';

export default function SimilarPlaces({ places }) {
  if (!places || !places.length) return null;

  return (
    <section className="bg-white">
      <div className="gk-wrap gk-section">
        <h2 className="gk-h2 mb-6">Similar Places You Might Like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              href={`/sightseeing/${place.slug}`}
              image={cardImage(place.featured_image)}
              alt={place.name}
              chip={place.category?.name}
              title={place.name}
              sub={[
                place.distance_from_center
                  ? `${parseFloat(place.distance_from_center).toFixed(1)} km from center`
                  : 'Distance not available',
                hasValidReviewRating(place.rating, place.review_count) ? `★ ${place.rating} (${place.review_count} reviews)` : '',
              ].filter(Boolean).join(' · ')}
            />
          ))}
        </div>

        {/* SEO structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Similar Places',
              itemListElement: places.filter((place) => hasValidSightseeingSlug(place?.slug)).map((place, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Place',
                  name: place.name,
                  image: place.featured_image?.optimized_card || place.featured_image?.image,
                  description:
                    place.description || `Explore ${place.name} in ${place.destination_name}`,
                  url: `https://gokeys.in/sightseeing/${place.slug}`,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: place.destination_name,
                  },
                },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      </div>
    </section>
  );
}
