import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimilarPlaces from "@/components/SimilarPlaces";
import SmartSEO from "@/components/SmartSEO";
import { buildSightseeingPlaceSchema, buildBreadcrumbList, hasValidReviewRating, hasValidSightseeingSlug } from "@/lib/seoSchemas";
import InquiryFormCard from "@/components/SimpleEnquiryForm";
import { Breadcrumbs, PLACEHOLDER } from "@/components/ui/kit";

const TIPS = [
  "Best time to visit: Early morning to avoid crowds",
  "Photography allowed in most areas",
  "Wear comfortable shoes for walking",
];

export default function SightseeingDetailPage({place,similarPlaces }) {

if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>Failed to load place data.</p>
        </div>
      </div>
    );
  }

  const sightseeingSchema = buildSightseeingPlaceSchema({
  slug: place.slug,
  name: place.name,
  description: place.meta_description || place.description?.slice(0, 160) || "",
  imageUrl: place.featured_image?.optimized_banner || place.featured_image?.image || "",
  destinationName: place.destination?.name || ""
});

const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Sightseeing", url: "/sightseeing" },
  ...(hasValidSightseeingSlug(place.slug) ? [{ name: place.name, url: `/sightseeing/${place.slug}` }] : [])
]);

  const areaName = place.destination?.name || place.destination_name || "";
  const facts = [
    areaName && ["Location", areaName],
    place.distance_from_center && ["Distance", `${Math.round(place.distance_from_center)} km from City Center`],
    // The API sends "00:00:00" / "0.00" when a value was never filled in
    place.opening_time && !/^0?0:00(:00)?$/.test(place.opening_time) && ["Opening Hours", `${place.opening_time} - ${place.closing_time}`],
    Number(place.entry_fee) > 0 && ["Entry Fee", `₹${place.entry_fee}`],
    hasValidReviewRating(place.rating, place.review_count) && ["Visitor Rating", `${place.rating} (${place.review_count} reviews)`],
  ].filter(Boolean);
  const whatsappUrl = `https://wa.me/917830718687?text=${encodeURIComponent(`Hello Gokeys India, I want a cab to visit ${place.name}.`)}`;

  return (
    <>
      <Header/>
        <SmartSEO schema={[sightseeingSchema, breadcrumbSchema]} />
      <main className="bg-mist min-h-screen">
        <div className="gk-wrap pt-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sightseeing", href: "/sightseeing" }, { label: place.name }]} />
          <div className="flex flex-wrap gap-1.5 mb-3">
            {place.category?.name && <span className="gk-chip gk-chip-sun">{place.category.name}</span>}
            {areaName && <span className="gk-chip">{areaName}</span>}
          </div>
          <h1 className="gk-h1">{place.name}</h1>

          <div className="gk-media relative h-64 sm:h-80 md:h-105 rounded-2xl mt-6">
            <Image
              src={place.featured_image?.optimized_banner || PLACEHOLDER}
              alt={place.featured_image?.alt_text || place.name}
              fill
              sizes="(max-width: 1216px) 100vw, 1216px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="gk-wrap py-10 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="min-w-0 space-y-10">
            {/* Key Information */}
            {facts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {facts.map(([label, value]) => (
                  <div key={label} className="gk-panel px-4 py-3">
                    <p className="gk-label mb-0.5!">{label}</p>
                    <p className="text-[15px] font-bold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Description Section */}
            <section>
              <h2 className="gk-h2 mb-4">About {place.name}</h2>
              <div
                className="prose max-w-none text-slate-ink"
                dangerouslySetInnerHTML={{ __html: place.description }}
              />
            </section>

            {/* Gallery Section */}
            {place.gallery_images?.length > 0 && (
              <section>
                <h2 className="gk-h2 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {place.gallery_images.map((img, i) => (
                    <div key={i} className="gk-media h-44 rounded-xl">
                      <Image
                        src={img.optimized_card || img.image}
                        alt={img.alt_text || `${place.name} ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Map Section */}
            <section>
              <h2 className="gk-h2 mb-4">Location</h2>
              <div className="w-full h-80 md:h-100 rounded-2xl overflow-hidden bg-chip">
                <iframe
                  title={`Map of ${place.name}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${place.name}, ${areaName}`)}&output=embed&z=15`}
                />
              </div>
              <p className="text-[15px] mt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.destination_name || areaName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal font-semibold hover:underline"
                >
                  Open in Google Maps →
                </a>
              </p>
            </section>
          </div>

          {/* Right Column */}
          <aside className="space-y-5 lg:sticky lg:top-20">
            <div className="gk-card p-5">
              <h3 className="gk-h3">Visit with a cab and driver</h3>
              <p className="text-[15px] text-slate-ink mt-1.5">
                Add {place.name} to a sightseeing day. Pickup from your hotel.
              </p>
              <Link href="/cabs" className="gk-btn gk-btn-sun w-full mt-4">Book a cab</Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="gk-btn gk-btn-wa w-full mt-2.5">
                Chat on WhatsApp
              </a>
            </div>

            <InquiryFormCard placeName={place.name} />

            {/* Travel Tips Card */}
            <div className="gk-card p-5">
              <h3 className="gk-h3 mb-3">Travel Tips</h3>
              <ul className="space-y-2.5">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5 text-sm text-slate-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sun shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Similar Places */}
        <SimilarPlaces places={similarPlaces} />
      </main>
      <Footer/>
    </>
  );
}
