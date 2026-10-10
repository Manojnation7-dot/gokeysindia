import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CabList from "@/components/CabList";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import { Breadcrumbs, CtaBand } from "@/components/ui/kit";

const STEPS = [
  [
    "Tell us your route",
    "Pickup, drop, dates and number of travellers.",
  ],
  [
    "Get a clear quote",
    "One price with tolls and driver charges listed.",
  ],
  [
    "Confirm and travel",
    "Driver details are shared before pickup.",
  ],
];

export default function CabsPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Book Cab with Us", url: "/cabs" },
  ]);

  return (
    <>
      <Header />

      <SmartSEO schema={breadcrumbSchema} />

      <main className="bg-mist">

        {/* Hero Section */}
        <section className="gk-wrap pt-10 pb-10 grid lg:grid-cols-2 gap-10 items-center">

          {/* Hero Content */}
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Cabs" },
              ]}
            />

            <h1 className="gk-h1">
              All Cabs in Uttarakhand
            </h1>

            <p className="mt-4 gk-lead max-w-lg">
              Sedans, SUVs and Tempo Travellers with drivers
              who know the mountain roads. Pick a vehicle,
              tell us your route, get a quote.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="tel:+919045916770"
                className="gk-btn gk-btn-sun"
              >
                Get a cab quote
              </a>

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

          {/* Large Tempo Traveller Image */}
          <div className="relative h-72 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden bg-linear-to-b from-[#f6d79a] to-[#f0b26b]">

            <Image
              src="/images/tempo-14-seater.png"
              alt="Tempo Traveller cab booking from Haridwar"
              fill
              priority
              className="object-contain scale-[1.35] lg:scale-[1.45]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

          </div>
        </section>

        {/* Cab Listing Section */}
        <section className="gk-wrap pb-14">
          <p className="gk-eyebrow mb-2">
            Our vehicles
          </p>

          <h2 className="gk-h2 mb-6">
            Choose the right size
          </h2>

          <CabList />
        </section>

        {/* How Booking Works */}
        <section className="bg-white">
          <div className="gk-wrap gk-section">

            <h2 className="gk-h2 mb-6">
              How booking works
            </h2>

            <div className="grid md:grid-cols-3 gap-5">
              {STEPS.map(([title, text], i) => (
                <div
                  key={title}
                  className="bg-mist rounded-2xl p-5"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sun text-xs font-bold text-ink">
                    {i + 1}
                  </span>

                  <h3 className="gk-h3 mt-3">
                    {title}
                  </h3>

                  <p className="text-[15px] text-slate-ink mt-1">
                    {text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Final CTA Section */}
        <section className="gk-wrap gk-section">
          <CtaBand
            title="Add a cab and driver to any sightseeing day"
            text="Sedan, SUV or Tempo Traveller, with pickup from your hotel."
          >
            <a
              href="tel:+919045916770"
              className="gk-btn gk-btn-ink"
            >
              Call to book
            </a>
          </CtaBand>
        </section>

      </main>

      <Footer />
    </>
  );
}