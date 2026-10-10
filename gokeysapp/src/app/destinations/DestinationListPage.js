"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildItemListSchema, buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import Link from "next/link";
import { Breadcrumbs, CtaBand, PlaceCard, cardImage } from "@/components/ui/kit";

const CHAR_DHAM = ["yamunotri", "gangotri", "kedarnath", "badrinath"];
const PER_PAGE = 12;

const DestinationListPage = ({ destinations }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDestinations = (destinations || []).filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredDestinations.length / PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const first = (page - 1) * PER_PAGE;

  const dhams = CHAR_DHAM.map((slug) => (destinations || []).find((d) => d.slug === slug)).filter(Boolean);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const goTo = (n) => {
    setCurrentPage(n);
    document.getElementById("all-destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- SEO ---------------- */
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
  ]);

  const destinationListSchema = buildItemListSchema({
    name: "All Destinations",
    items: filteredDestinations,
    itemType: "Place",
    getItemSchema: (destination, schema) => ({
      ...schema,
      name: destination.name,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/destinations/${destination.slug}`,
      description:
        destination.state || "Discover amazing destinations with Gokeys India.",
      image:
        destination.featured_image?.image ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    }),
  });

  const schemas = [breadcrumbSchema, destinationListSchema];

  return (
    <>
      <Header />
      <SmartSEO schema={schemas} />

      <main className="bg-mist">
        {/* Hero */}
        <section className="bg-ink">
          <div className="gk-wrap py-12 md:py-14">
            <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Destinations" }]} />
            <h1 className="gk-h1 text-white!">Discover Incredible Destinations</h1>
            <p className="mt-3 text-slate-300 max-w-xl">
              Explore handpicked places across India with comfort & trust
            </p>
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search destination"
              placeholder="Search destination (Haridwar, Kedarnath, Goa...)"
              className="gk-field mt-6 max-w-md py-3!"
            />
          </div>
        </section>

        {/* Char Dham */}
        {!searchQuery && dhams.length > 0 && (
          <section className="gk-wrap pt-12">
            <p className="gk-eyebrow mb-2">Char Dham circuit</p>
            <h2 className="gk-h2 mb-6">The four Dhams</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {dhams.map((d) => (
                <PlaceCard
                  key={d.id}
                  href={`/destinations/${d.slug}`}
                  image={cardImage(d.featured_image)}
                  alt={d.featured_image?.alt_text || d.name}
                  title={d.name}
                  text={d.summary}
                  imgHeight="h-36 md:h-44"
                />
              ))}
            </div>
          </section>
        )}

        {/* All destinations: every card stays in the HTML; other pages are only hidden */}
        <section id="all-destinations" className="gk-wrap py-12 scroll-mt-20">
          <p className="gk-eyebrow mb-2">More places</p>
          <h2 className="gk-h2 mb-6">All destinations</h2>
          {filteredDestinations.length === 0 ? (
            <p className="text-slate-ink py-6">No destinations match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDestinations.map((destination, i) => (
                <div key={destination.id} className={i < first || i >= first + PER_PAGE ? "hidden" : ""}>
                  <PlaceCard
                    href={`/destinations/${destination.slug}`}
                    image={cardImage(destination.featured_image)}
                    alt={destination.featured_image?.alt_text || destination.name}
                    title={destination.name}
                    chip={destination.state}
                    text={destination.summary}
                    imgHeight="h-44"
                  />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-3 mt-10" aria-label="Pagination">
              {page > 1 && (
                <button onClick={() => goTo(page - 1)} className="gk-pill">← Previous</button>
              )}
              <span className="text-sm font-semibold text-ink">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <button onClick={() => goTo(page + 1)} className="gk-pill">Next →</button>
              )}
            </nav>
          )}
        </section>

        {/* CTA */}
        <section className="gk-wrap pb-16">
          <CtaBand
            tone="ink"
            title="Ready to Plan Your Dream Journey?"
            text="Tell us your destination, dates, and preferences — our travel experts will craft a perfect experience for you."
          >
            <Link href="/contact" className="gk-btn gk-btn-sun">Plan My Trip</Link>
            <Link href="/contact" className="gk-btn gk-btn-white">Get Callback</Link>
          </CtaBand>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default DestinationListPage;
