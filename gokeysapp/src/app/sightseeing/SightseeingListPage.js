"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildItemListSchema, buildBreadcrumbList, hasValidSightseeingSlug } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import { Breadcrumbs, CtaBand, PlaceCard, cardImage } from "@/components/ui/kit";

const placeArea = (place) => place.destination?.name || place.destination_name || "";

export default function SightseeingListPage({places}) {
  const [area, setArea] = useState("");

   if (!places || places.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-ink">No sightseeing places found.</p>
      </div>
    );
  }

const sightseeingListSchema = buildItemListSchema({
  name: "All Sightseeing Places",
  items: places.filter((place) => hasValidSightseeingSlug(place?.slug)),
  itemType: "TouristAttraction",
  getItemSchema: (place, schema) => ({
    ...schema,
    url: `https://gokeys.in/sightseeing/${place.slug}`,
    locatedInPlace: {
      "@type": "Place",
      name: place.destination?.name || ""
    }
  })
});

const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Sightseeing", url: "/sightseeing" }
]);

  // Filter pills: destinations that have places, most places first
  const counts = places.reduce((acc, p) => {
    const a = placeArea(p);
    if (a) acc[a] = (acc[a] || 0) + 1;
    return acc;
  }, {});
  const areas = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

  return (
    <>
    <Header/>
    <SmartSEO schema={[sightseeingListSchema, breadcrumbSchema]} />
    <main className="bg-mist">
      <section className="bg-ink">
        <div className="gk-wrap py-12 md:py-14">
          <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Sightseeing" }]} />
          <h1 className="gk-h1 text-white!">Explore Sightseeing Places</h1>
          <p className="mt-3 text-slate-300 max-w-xl">
            Temples, ghats, waterfalls and viewpoints. Visit a single place or book a full-day circuit with a cab and driver.
          </p>
          {areas.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={() => setArea("")} className={`gk-pill ${!area ? "bg-sun! border-sun! text-ink!" : ""}`}>All</button>
              {areas.map((a) => (
                <button key={a} onClick={() => setArea(a)} className={`gk-pill ${area === a ? "bg-sun! border-sun! text-ink!" : ""}`}>
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="gk-wrap py-12">
        <h2 className="gk-h2 mb-6">Popular places</h2>
        {/* Every place stays in the HTML; the filter only hides cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map((place) => (
            <div key={place.slug} className={area && placeArea(place) !== area ? "hidden" : ""}>
              <PlaceCard
                href={`/sightseeing/${place.slug}`}
                image={cardImage(place.featured_image)}
                alt={place.featured_image?.alt_text || place.name}
                chip={place.category?.name || "General"}
                title={place.name}
                sub={[
                  placeArea(place),
                  place.distance_from_center ? `${Number(place.distance_from_center).toFixed(0)} km from center` : "",
                ].filter(Boolean).join(" · ")}
                text={place.description}
                imgHeight="h-44"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="gk-wrap pb-16">
        <CtaBand title="Add a cab and driver to any sightseeing day" text="Sedan, SUV or Tempo Traveller, with pickup from your hotel.">
          <Link href="/cabs" className="gk-btn gk-btn-ink">See cab rates</Link>
        </CtaBand>
      </section>
    </main>
    <Footer/>
    </>
  );
}
