"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import { Breadcrumbs, CtaBand, PLACEHOLDER } from "@/components/ui/kit";

const toSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

export default function HotelsHomePage({ hotels }) {
  const router = useRouter();

  const groupedHotels = hotels.reduce((acc, hotel) => {
  const destinationKey = hotel.destination.toLowerCase().trim();

  if (!acc[destinationKey]) {
    acc[destinationKey] = {
      destination: hotel.destination.trim(),
      slug: hotel.destination_slug || toSlug(hotel.destination),
      front_image_url: hotel.front_image_url || PLACEHOLDER,
      tariff_starting_from: Number(hotel.tariff_starting_from) || Infinity,
      count: 1,
    };
  } else {
    acc[destinationKey].count += 1;

    const price = Number(hotel.tariff_starting_from);
    if (!isNaN(price) && price < acc[destinationKey].tariff_starting_from) {
      acc[destinationKey].tariff_starting_from = price;
      acc[destinationKey].front_image_url =
        hotel.front_image_url || acc[destinationKey].front_image_url;
    }
  }

  return acc;
}, {});


  const destinations = Object.values(groupedHotels);
  const [selected, setSelected] = useState(destinations[0]?.slug || "");
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Best Hotels in India", url: "/hotels" },
  ]);

  return (
    <>
      <Header />
      <SmartSEO schema={breadcrumbSchema} />
      <main className="bg-mist">
        <section className="bg-ink">
          <div className="gk-wrap py-12 md:py-14">
            <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Hotels" }]} />
            <h1 className="gk-h1 text-white!">Hotels by Destination</h1>
            <p className="mt-3 text-slate-300 max-w-xl">
              From Haridwar ghat stays to Auli snow lodges. Pick a destination and we confirm availability.
            </p>
            {destinations.length > 0 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (selected) router.push(`/hotels/${selected}`);
                }}
                className="mt-7 max-w-xl bg-white rounded-2xl p-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
              >
                <label className="block">
                  <span className="gk-label">Destination</span>
                  <select value={selected} onChange={(e) => setSelected(e.target.value)} className="gk-field">
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>{d.destination}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="gk-btn gk-btn-sun h-10.5">Search</button>
              </form>
            )}
          </div>
        </section>

        <section className="gk-wrap py-12">
          {destinations.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinations.map((destination) => (
                <Link key={destination.destination} href={`/hotels/${destination.slug}`} className="gk-card gk-card-hover group flex flex-col">
                  <div className="gk-media h-48">
                    <Image
                      src={destination.front_image_url}
                      alt={destination.destination}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="gk-chip mb-2">
                      {destination.count} {destination.count > 1 ? "hotels" : "hotel"}
                    </span>
                    <h2 className="gk-h3">{destination.destination}</h2>
                    <p className="text-[15px] text-slate-ink mt-1">
                      {destination.count} {destination.count > 1 ? "hotels" : "hotel"} starting from{" "}
                      <span className="gk-price text-base">
                        ₹{destination.tariff_starting_from !== Infinity
                          ? destination.tariff_starting_from.toLocaleString("en-IN")
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-ink">No hotels found.</p>
          )}
        </section>

        <section className="gk-wrap pb-16">
          <CtaBand title="Need a room for Ardh Kumbh Mela 2027?" text="Tell us your dates and group size. We check availability near the ghats and send options.">
            <Link href="/contact" className="gk-btn gk-btn-ink">Ask about hotels</Link>
          </CtaBand>
        </section>
      </main>
      <Footer />
    </>
  );
}
