"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";
import { TourCard, Price, CtaBand, Breadcrumbs } from "@/components/ui/kit";
import Link from "next/link";
import { buildItemListSchema, buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";

const PAGE_SIZE = 9;
const pretty = (slug) => (slug || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const priceOf = (t) => {
  const pkg = t.pricing?.find((p) => p.package_type === "standard");
  return Number(pkg?.discount_price || pkg?.price || t.base_price) || 0;
};

export default function TourListPage({ tours, tripTypes }) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

  const filteredTours = tours
    .filter((tour) => {
      const matchesDuration =
        !selectedDuration ||
        (selectedDuration === "1-3" && tour.duration_days <= 3) ||
        (selectedDuration === "4-7" && tour.duration_days >= 4 && tour.duration_days <= 7) ||
        (selectedDuration === "8+" && tour.duration_days >= 8);
      const matchesType = !selectedType || tour.trip_types?.some((t) => t.name === selectedType);
      return matchesDuration && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return priceOf(a) - priceOf(b);
      if (sortBy === "price-desc") return priceOf(b) - priceOf(a);
      if (sortBy === "duration") return a.duration_days - b.duration_days;
      return 0;
    });

  const pages = Math.max(1, Math.ceil(filteredTours.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shownFrom = (current - 1) * PAGE_SIZE;
  const shownCount = Math.max(0, Math.min(PAGE_SIZE, filteredTours.length - shownFrom));
  const choose = (setter) => (value) => {
    setter(value);
    setPage(1);
  };
  const goTo = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

const isPriceOnRequest = (price) => {
  if (!price) return true;
  const numeric = parseFloat(price);
  return isNaN(numeric) || numeric === 0;
};

// Update tourListSchema construction
const tourListSchema = buildItemListSchema({
  name: 'All Tour Packages',
  items: filteredTours,
  itemType: 'TouristTrip',
  getItemSchema: (tour, schema) => ({
    ...schema,
    name: tour.name || 'Unnamed Tour', // Ensure name is included
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gokeys.in'}/tours/${tour.slug}`, // Correct /tours/ path
    description: tour.meta_description || tour.content?.replace(/<\/?[^>]+(>|$)/g, '') || 'Explore an unforgettable tour with Gokeys India.', // Ensure meaningful description
    image: tour.featured_image?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    offers: isPriceOnRequest(tour.base_price)
      ? undefined
      : {
          '@type': 'Offer',
          url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gokeys.in'}/tours/${tour.slug}`, // Correct /tours/ path
          priceCurrency: 'INR',
          price: parseFloat(tour.base_price) || 0, // Ensure valid numeric price
        },
  }),
});

  const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Tours", url: "/tours" }
]); 

    return (
    <>
      <Header />
      <SmartSEO schema={[tourListSchema, breadcrumbSchema]} />
      <main className="min-h-screen bg-mist">
        <section className="bg-ink">
          <div className="gk-wrap py-12 md:py-14">
            <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Tours" }]} />
            <h1 className="gk-h1 text-white!">Explore Tours</h1>
            <p className="mt-3 text-slate-300 max-w-xl">
              Browse handpicked packages from trusted operators
            </p>
          </div>
        </section>

        <div className="gk-wrap py-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => choose(setSelectedType)("")} className={`gk-pill ${!selectedType ? "gk-pill-on" : ""}`}>
                All tours
              </button>
              {tripTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => choose(setSelectedType)(type.name)}
                  className={`gk-pill ${selectedType === type.name ? "gk-pill-on" : ""}`}
                >
                  {type.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-ink">
              <label className="flex items-center gap-2">
                Duration
                <select className="gk-field w-auto! py-2!" value={selectedDuration} onChange={(e) => choose(setSelectedDuration)(e.target.value)}>
                  <option value="">Any</option>
                  <option value="1-3">1–3 Days</option>
                  <option value="4-7">4–7 Days</option>
                  <option value="8+">8+ Days</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                Sort by
                <select className="gk-field w-auto! py-2!" value={sortBy} onChange={(e) => choose(setSortBy)(e.target.value)}>
                  <option value="popular">Most popular</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="duration">Duration</option>
                </select>
              </label>
            </div>
          </div>

          <p className="text-xs text-slate-ink mt-5 mb-4">
            Showing {shownCount} of {filteredTours.length} tours
          </p>

          {/* Tour Listings: every tour stays in the HTML; other pages are only hidden */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTours.map((tour, i) => (
              <div key={tour.id} className={i < shownFrom || i >= shownFrom + PAGE_SIZE ? "hidden" : ""}>
                <TourCard
                  tour={tour}
                  href={`/tours/${tour.slug}`}
                  imgHeight="h-48"
                  badge={tour.trip_types?.[0]?.name}
                  chips={[
                    `${tour.duration_days} Days / ${tour.duration_nights} Nights`,
                    pretty(tour.destinations?.[0]),
                  ]}
                  footer={
                    <>
                      <a href={`/tours/${tour.slug}`} className="gk-btn gk-btn-ink flex-1">View Tour</a>
                      <a
                        href={`https://wa.me/917830718687?text=${encodeURIComponent(`Hello Gokeys India, I want to enquire about ${tour.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp about ${tour.name}`}
                        className="gk-btn gk-btn-wa px-3.5!"
                      >
                        <MessageCircle size={18} />
                        <span className="sm:hidden lg:inline">WhatsApp</span>
                      </a>
                    </>
                  }
                >
                  {tour.meta_description && (
                    <p className="text-[15px] text-slate-ink line-clamp-2 -mt-1 mb-3">{tour.meta_description}</p>
                  )}
                  <Price tour={tour} />
                </TourCard>
              </div>
            ))}

            {filteredTours.length === 0 && (
              <div className="col-span-full text-center text-slate-ink py-10">
                No tours match the selected filters.
              </div>
            )}
          </section>

          {pages > 1 && (
            <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goTo(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={`h-9 min-w-9 px-3 rounded-full text-sm font-bold ${n === current ? "bg-ink text-white" : "bg-white border border-line text-ink"}`}
                >
                  {n}
                </button>
              ))}
              {current < pages && (
                <button onClick={() => goTo(current + 1)} className="gk-pill">Next</button>
              )}
            </nav>
          )}

          <div className="mt-12">
            <CtaBand tone="ink" title="Cannot see the trip you want?" text="We build custom itineraries for families, groups and solo travellers. Share your dates and a planner replies with a plan.">
              <a href="/contact" className="gk-btn gk-btn-sun">Request a custom plan</a>
              <a href="https://wa.me/917830718687" target="_blank" rel="noopener noreferrer" className="gk-btn gk-btn-wa">WhatsApp us</a>
            </CtaBand>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
