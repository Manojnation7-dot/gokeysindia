// Home page cab teaser (new UI).
// Server component; keeps the OfferCatalog schema.

import Image from "next/image";
import Link from "next/link";
import { homeCabs, seatLabel } from "@/lib/cabs";

export default function CabSlider() {
  return (
    <section className="gk-section bg-mist">
      <div className="gk-wrap grid md:grid-cols-2 gap-8 md:gap-12 items-center">

        {/* Large Cab Image */}
        <div className="gk-media relative rounded-2xl h-72 md:h-96 overflow-hidden bg-linear-to-b! from-[#cfe6ef] to-[#e8f2f5]">
          <Image
            src="/images/innova-crysta.png"
            alt="Innova Crysta cab from Haridwar"
            fill
            priority
            className="object-contain scale-[1.4]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div>
          <p className="gk-eyebrow mb-2">
            Cabs from Haridwar
          </p>

          <h2 className="gk-h2">
            Book Reliable Cabs with Ease
          </h2>

          <p className="mt-3 gk-lead">
            Comfortable, verified drivers for Char Dham Yatra,
            Kedarnath, sightseeing and outstation travel from Haridwar.
          </p>

          {/* Cab Types */}
          <div className="flex flex-wrap gap-2 mt-5">
            {["Sedan", "SUV", "Tempo Traveller"].map((t) => (
              <span key={t} className="gk-pill">
                {t}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/cabs"
              className="gk-btn gk-btn-ink"
            >
              See cabs and routes
            </Link>

            <a
              href="https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20booking%20a%20cab"
              target="_blank"
              rel="noopener noreferrer"
              className="gk-btn gk-btn-wa"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Cab Services in Haridwar",
            itemListElement: homeCabs.map((cab, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Service",
                name: cab.name,
                description: `${cab.type}${seatLabel(cab.seats) ? ` with ${seatLabel(cab.seats)} seats` : ""}, ${
                  cab.ac ? "AC" : "Non-AC"
                }, available in ${cab.location}`,
                image: "https://gokeys.in" + cab.image,
                offers: {
                  "@type": "Offer",
                  price: cab.pricePerDay,
                  priceCurrency: "INR",
                  availability: "https://schema.org/InStock",
                  priceValidUntil: "2026-12-31",
                },
              },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}