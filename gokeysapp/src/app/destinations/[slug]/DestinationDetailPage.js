import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InquiryFormCard from "@/components/SimpleEnquiryForm";
import RelatedContent from "@/components/RelatedContent";
import { buildBreadcrumbList, buildFAQSchema } from "@/lib/seoSchemas";
import { readMinutes } from "@/lib/slim";
import SmartSEO from "@/components/SmartSEO";
import { Breadcrumbs, CtaBand, FaqList, TourCard, PLACEHOLDER } from "@/components/ui/kit";

// Common HTML entities left after stripping tags (output is rendered as text, not HTML)
const decode = (t) =>
  t.replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, "&");

const plain = (html) => decode(String(html || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// Older separate admin sections, shown after the description with the same headings as before.
// New destinations write these as Heading 2 sections inside the description instead.
const SECTIONS = [
  ["best_time_to_visit", "Best Time to Visit"],
  ["popular_activities", "Popular Activities"],
  ["nearby_attractions", "Nearby Attractions"],
  ["how_to_reach", "How to Reach"],
];

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";

/**
 * The article as one HTML string with an id on every <h2> (for the "On this page" links).
 * Headings that already have an id keep it.
 */
function buildArticle(destination) {
  const parts = [destination.description || "<p>No description available.</p>"];
  for (const [field, label] of SECTIONS) {
    const html = destination[field];
    if (typeof html === "string" && plain(html)) parts.push(`<h2>${label}</h2>${html}`);
  }

  const toc = [];
  const used = new Set(["about", "tours-section", "hotels-section", "faq"]);
  const html = parts.join("\n").replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
    const label = plain(inner);
    if (!label) return match;
    const existing = attrs.match(/\sid=["']([^"']+)["']/i);
    let id = existing ? existing[1] : slugify(label);
    if (!existing) {
      let n = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
    }
    used.add(id);
    toc.push({ id, label });
    return existing ? match : `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html, toc };
}

export default function DestinationDetailPage({ destination, tours, hotels, slug }) {
  if (!destination) {
    return <div className="text-center py-16">Destination not found</div>;
  }

  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
    { name: destination.name, url: `/destinations/${destination.slug}` }
  ]);

  const faqs = destination.faqs || [];
  const faqSchema = faqs.length > 0 ? buildFAQSchema(faqs, `/destinations/${destination.slug}`) : null;
  const tips = decode(destination.travel_tips || "").split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
  const { html, toc } = buildArticle(destination);
  const updated = destination.updated_at
    ? new Date(destination.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })
    : null;

  const contents = [
    { id: "about", label: `About ${destination.name}` },
    ...toc,
    ...(faqs.length > 0 ? [{ id: "faq", label: "Frequently Asked Questions" }] : []),
  ];

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
        {/* Hero */}
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

          <div className="relative gk-wrap pt-24 pb-10 md:pt-36 md:pb-12">
            <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations" }, { label: destination.name }]} />
            <h1 className="gk-h1 text-white!">
              Explore <span className="text-sun">{destination.name}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85 mt-4">
              {destination.state && <span>{destination.state}</span>}
              <span>{readMinutes(html)} min read</span>
              {updated && <span>Updated {updated}</span>}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="#tours-section" className="gk-btn gk-btn-sun">Explore Tours</a>
              <Link href="/grouptour" className="gk-btn gk-btn-white">Join a group trip</Link>
            </div>
          </div>
        </section>

        {/* Guide + side column */}
        <section className="gk-wrap py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="min-w-0">
            {contents.length > 2 && (
              <nav aria-label="On this page" className="gk-panel p-5 mb-8">
                <p className="gk-label mb-3!">On this page</p>
                <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[15px]">
                  {contents.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-teal font-semibold hover:underline">{item.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <h2 id="about" className="gk-h2 mb-4 scroll-mt-20">About {destination.name}</h2>
            <article
              className="prose prose-lg max-w-none text-gray-800 overflow-x-auto [&_h2]:scroll-mt-20"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {faqs.length > 0 && (
              <section id="faq" className="mt-12 scroll-mt-20">
                <p className="gk-eyebrow mb-2">FAQ</p>
                <h2 className="gk-h2 mb-5">Frequently Asked Questions</h2>
                <FaqList items={faqs.map((faq) => ({ question: faq.question, html: faq.answer }))} />
              </section>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-20">
            {tips.length > 0 && (
              <div className="gk-panel p-5">
                <h3 className="gk-label mb-3!">Traveler Insights</h3>
                <ul className="space-y-2">
                  {tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-gray-800 flex items-start">
                      <span className="mr-2 text-sun font-bold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <InquiryFormCard placeName={destination.name} />
          </aside>
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
