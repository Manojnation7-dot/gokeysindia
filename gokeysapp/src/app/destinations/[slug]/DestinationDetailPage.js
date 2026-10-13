import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InquiryFormCard from "@/components/SimpleEnquiryForm";
import RelatedContent from "@/components/RelatedContent";
import { buildBreadcrumbList, buildFAQSchema } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import { Breadcrumbs, CtaBand, FaqList, TourCard, PLACEHOLDER } from "@/components/ui/kit";
import { CalendarDays, Zap, MapPin, Bus } from "lucide-react";

// Common HTML entities left after stripping tags (output is rendered as text, not HTML)
const decode = (t) =>
  t.replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, "&");

/**
 * REPLACEMENT FOR DOMParser (Server-Safe)
 */
function extractParagraphTexts(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return [];

  // Match everything inside <p>...</p> tags
  const pRegex = /<p[^>]*>(.*?)<\/p>/gi;
  const matches = htmlString.match(pRegex);

  if (!matches) {
    // If no <p> tags, remove all other tags and return as one item
    const cleanText = htmlString.replace(/<\/?[^>]+(>|$)/g, "").trim();
    return cleanText ? [decode(cleanText)] : [];
  }

  return matches.map(m =>
    decode(m.replace(/<\/?[^>]+(>|$)/g, "").trim()) // Strip tags from match
  ).filter(Boolean);
}

function InfoCard({ icon: Icon, title, tone, children }) {
  return (
    <div className={`rounded-2xl p-6 ${tone}`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon size={22} className="text-teal" />
        <h2 className="gk-h3">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function DestinationDetailPage({ destination, tours, hotels, slug, nearbyAttractionsList }) {
  if (!destination) {
    return <div className="text-center py-16">Destination not found</div>;
  }

  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
    { name: destination.name, url: `/destinations/${destination.slug}` }
  ]);

  const faqSchema = destination.faqs?.length > 0 ? buildFAQSchema(destination.faqs, `/destinations/${destination.slug}`) : null;
  const tips = decode(destination.travel_tips || "").split(/\r?\n/).filter(Boolean);

  return (
    <>
      <Header />
      <SmartSEO
       schema={[
              breadcrumbSchema,
              ...(faqSchema ? [faqSchema] : [])
            ]}
      />
      <main className="bg-mist">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-ink">
          <Image
            src={destination.banner_image?.optimized_banner || destination.featured_image?.image || PLACEHOLDER}
            alt={destination.featured_image?.alt_text || destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/10" />

          <div className="relative gk-wrap pt-24 pb-12 md:pt-36 md:pb-14">
            <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations" }, { label: destination.name }]} />
            <h1 className="gk-h1 text-white!">
              Explore <span className="text-sun">{destination.name}</span>
            </h1>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="#tours-section" className="gk-btn gk-btn-sun">Explore Tours</a>
              <Link href="/grouptour" className="gk-btn gk-btn-white">Join a group trip</Link>
            </div>

            {tips.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl p-5 max-w-3xl shadow-xl">
                <h3 className="gk-label mb-3!">Traveler Insights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {tips.map((tip, idx) => (
                    <div key={idx} className="text-sm text-ink flex items-start">
                      <span className="mr-2 text-sun font-bold">•</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Destination Info */}
        <section className="gk-wrap gk-section grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
          <div className="min-w-0">
            <h2 className="gk-h2 mb-4">About {destination.name}</h2>
            <div
              className="prose prose-lg text-gray-800 max-w-full overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: destination.description || "No description available." }}
            />
          </div>
          <div className="lg:sticky lg:top-20">
            <InquiryFormCard placeName={destination.name} />
          </div>
        </section>

        {/* Info Cards */}
        <section className="gk-wrap pb-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Best Time to Visit */}
          {typeof destination.best_time_to_visit === "string" && destination.best_time_to_visit.trim() && (
            <InfoCard icon={CalendarDays} title="Best Time to Visit" tone="bg-[#fdebd0]">
              <ul className="space-y-2 list-disc pl-5 text-gray-800">
                {extractParagraphTexts(destination.best_time_to_visit).map((para, index) => (
                  <li key={index}>{para}</li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* Popular Activities */}
          {typeof destination.popular_activities === "string" && destination.popular_activities.trim() && (
            <InfoCard icon={Zap} title="Popular Activities" tone="bg-[#e3eef0]">
              <ul className="space-y-2 list-disc pl-5 text-gray-800">
                {extractParagraphTexts(destination.popular_activities).map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* Nearby Attractions */}
          <InfoCard icon={MapPin} title="Nearby Attractions" tone="bg-[#e6f0dc]">
            <ul className="space-y-2 list-disc pl-5 text-gray-800">
              {(nearbyAttractionsList || []).map((attraction, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: attraction }} />
              ))}
            </ul>
          </InfoCard>

          {/* How to Reach */}
          <InfoCard icon={Bus} title="How to Reach" tone="bg-[#e3e4f2]">
            <div
              className="text-gray-800 space-y-2 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: destination.how_to_reach || "<p>No transport information</p>" }}
            />
          </InfoCard>
        </section>

        {/* Tours Section */}
        <section id="tours-section" className="bg-white scroll-mt-16">
          <div className="gk-wrap gk-section">
            <p className="gk-eyebrow mb-2">Tours to {destination.name}</p>
            <h2 className="gk-h2">Available Tour Packages</h2>
            {tours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {tours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    href={`/tours/${tour.slug}`}
                    imgHeight="h-48"
                    chips={[`${tour.duration_days}D / ${tour.duration_nights}N`]}
                  >
                    <p className="text-[15px] text-slate-ink mb-3 line-clamp-2 -mt-1">{tour.content}</p>
                    <p className="text-xs text-slate-ink">Starting from</p>
                    <p className="gk-price text-xl">₹{parseFloat(tour.base_price || 0).toLocaleString()}</p>
                  </TourCard>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-slate-ink">No tours available for this destination.</p>
            )}
          </div>
        </section>

        {/* Hotels Section */}
        <section id="hotels-section" className="gk-wrap gk-section">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="gk-eyebrow mb-2">Where to stay</p>
              <h2 className="gk-h2">Available Hotels</h2>
            </div>
            <Link href="/hotels" className="gk-btn gk-btn-line">All hotels</Link>
          </div>
          {hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotels.map((hotel) => (
                <Link key={hotel.id} href={`/hotels/${slug}/${hotel.slug}`} className="gk-card gk-card-hover group flex flex-col">
                  <div className="gk-media h-44">
                    <Image
                      src={hotel.front_image_url || PLACEHOLDER}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="gk-chip gk-chip-sun self-start mb-2">{hotel.star_rating} ★</span>
                    <h3 className="gk-h3">{hotel.name}</h3>
                    <p className="text-xs text-slate-ink mt-0.5">{hotel.location}</p>
                    <p className="mt-auto pt-3 flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-ink">Starting from</span>
                      <span className="gk-price text-lg">₹{parseFloat(hotel.tariff_starting_from).toLocaleString()}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-ink">No hotels available for this destination.</p>
          )}
        </section>

        {/* FAQ Section */}
        {(destination.faqs || []).length > 0 && (
          <section className="gk-wrap pb-14 grid lg:grid-cols-[1fr_1.5fr] gap-8">
            <div>
              <p className="gk-eyebrow mb-2">FAQ</p>
              <h2 className="gk-h2">Frequently Asked Questions</h2>
            </div>
            <FaqList items={destination.faqs.map((faq) => ({ question: faq.question, html: faq.answer }))} />
          </section>
        )}

        {/* Blog posts that picked this destination in the admin */}
        <RelatedContent title={`${destination.name} travel guides`} items={destination.related_posts} />

        {/* CTA Section */}
        <section className="gk-wrap pb-16">
          <CtaBand title="Have Questions?" text="Need help choosing a tour or want to customize your travel experience?">
            <a href="/contact" className="gk-btn gk-btn-ink">Contact Us</a>
          </CtaBand>
        </section>
      </main>
      <Footer />
    </>
  );
}
