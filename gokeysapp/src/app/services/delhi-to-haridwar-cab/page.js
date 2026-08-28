import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in";

export async function generateMetadata() {
  const title =
    "Delhi to Haridwar Cab | Delhi to Haridwar Taxi Booking";

  const description =
    "Book a Delhi to Haridwar cab or taxi with Gokeys India. Plan one-way or round-trip travel from Delhi to Haridwar with private cab options and travel assistance.";

  const url = `${siteUrl}/services/delhi-to-haridwar-cab/`;

  return {
    title,
    description,

    keywords: [
      "Delhi to Haridwar cab",
      "Delhi to Haridwar taxi",
      "Delhi to Haridwar cab booking",
      "Delhi to Haridwar taxi booking",
      "Delhi Haridwar cab service",
      "Delhi Haridwar taxi service",
      "cab from Delhi to Haridwar",
      "taxi from Delhi to Haridwar",
      "Delhi to Haridwar one way cab",
      "Delhi to Haridwar round trip cab",
      "Delhi airport to Haridwar cab",
      "Delhi to Haridwar private cab",
      "Delhi to Haridwar car rental",
      "Haridwar cab booking",
      "Haridwar taxi service",
      "Delhi to Rishikesh cab",
      "Delhi to Uttarakhand taxi",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Gokeys India",
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/delhi-to-haridwar-cab.jpeg`,
          width: 1200,
          height: 630,
          alt: "Delhi to Haridwar Cab Service - Gokeys India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}/images/delhi-to-haridwar-cab.jpeg`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function DelhiToHaridwarCabPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Delhi to Haridwar Cab",
      url: "/services/delhi-to-haridwar-cab/",
    },
  ]);

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/delhi-to-haridwar-cab.jpeg`,
    telephone: "+91 9045916770",
    email: "helpdesk@gokeys.in",

    address: {
      "@type": "PostalAddress",
      streetAddress:
        "4th Shop, Zila Panchayat Market, Railway Road",
      addressLocality: "Haridwar",
      addressRegion: "Uttarakhand",
      postalCode: "249401",
      addressCountry: "IN",
    },

    areaServed: [
      {
        "@type": "City",
        name: "Delhi",
      },
      {
        "@type": "City",
        name: "Haridwar",
      },
      {
        "@type": "State",
        name: "Uttarakhand",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],

    sameAs: [
      "https://www.gokeys.in/",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Delhi to Haridwar Cab Service",
    serviceType: "Delhi to Haridwar Taxi and Cab Service",
    description:
      "Cab and taxi booking assistance for travel between Delhi and Haridwar.",
    provider: {
      "@type": "TravelAgency",
      name: "Gokeys India",
      url: siteUrl,
    },

    areaServed: [
      {
        "@type": "City",
        name: "Delhi",
      },
      {
        "@type": "City",
        name: "Haridwar",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Can I book a cab from Delhi to Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India provides cab and taxi booking assistance for travel from Delhi to Haridwar, subject to vehicle availability and the requested travel date.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a one-way Delhi to Haridwar taxi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "One-way Delhi to Haridwar taxi arrangements can be booked with Gokeys India based on the travel date, pickup location and vehicle availability.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a round-trip cab from Delhi to Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Round-trip cab arrangements between Delhi and Haridwar can be booked with Gokeys India based on your travel dates, itinerary and vehicle requirements.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a Delhi Airport to Haridwar cab?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cab arrangements from Delhi Airport to Haridwar can be discussed with Gokeys India depending on the pickup time, travel date and vehicle availability.",
        },
      },

      {
        "@type": "Question",
        name: "Can I continue from Haridwar to other Uttarakhand destinations?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Travelers can call or whatsapp us for onward taxi or tour arrangements from Haridwar to destinations across Uttarakhand, depending on their itinerary.",
        },
      },

      {
        "@type": "Question",
        name: "How can I book a Delhi to Haridwar cab?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Contact Gokeys India by phone or WhatsApp at +91 9045916770, 7830718687, 7830718680 and provide your pickup location, destination, travel date, number of passengers and luggage requirements.",
        },
      },
    ],
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      travelAgencySchema,
      serviceSchema,
      faqSchema,
    ],
  };

  return (
    <>
      <Header />

      <SmartSEO schema={combinedSchema} />

      <main>
        {/* HERO */}
        <section className="bg-green-50">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">

              <p className="text-green-700 font-semibold mb-3">
                DELHI TO HARIDWAR CAB SERVICE
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Delhi to Haridwar Cab & Taxi Service
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Looking for a Delhi to Haridwar cab? Gokeys India is top travel agency in Haridwar and provides
                taxi and cab booking assistance for travelers going from
                Delhi to Haridwar or round-trip arrangements for pilgrimage, leisure, business and
                onward Uttarakhand travel. 
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

                <a
                  href="tel:+919045916770"
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  Book Your Cab
                </a>

                <a
                  href="https://wa.me/919045916770"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-green-700 text-green-700 px-7 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
                >
                  WhatsApp for Booking
                </a>

              </div>
            </div>
          </div>
        </section>

        <div className="my-10">
          <Image
            src="/images/delhi-to-haridwar-cab.jpeg"
            alt="Delhi to Haridwar Taxi and Cab Service with round trip and one way options"
            width={1200}
            height={675}
            className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-sm"
            priority
          />
        </div>

        {/* INTRODUCTION */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Delhi to Haridwar Cab Booking
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar is one of the most popular pilgrimage and travel
              destinations in Uttarakhand. Travelers arriving from Delhi
              often choose a private cab for a direct and convenient journey
              to Haridwar. It is also known for starting point of Holy <a href="/blog/char-dham-yatra-2027">Char Dham Yatra</a> and other Uttarakhand travel.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Gokeys India provides various cab and taxi options like one-way, round-trip, Delhi Airport to Haridwar and onward travel from Haridwar to other Uttarakhand destinations. Travelers can also discuss hotel booking requirements in Haridwar and across Uttarakhand.
            </p>

            <p className="text-gray-700 leading-8">
              You can share your pickup location, travel date, number of
              passengers and luggage requirements with our team so that the
              appropriate travel arrangement can be discussed.
            </p>

          </div>
        </section>

        {/* SERVICE OPTIONS */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Delhi to Haridwar Taxi Options
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    One-Way Cab
                  </h3>

                  <p className="text-gray-600 leading-7">
                    We provide one way cab arrangements from Delhi to Haridwar based on your travel date, pickup location and vehicle requirements.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Round-Trip Taxi
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Discuss a return cab arrangement if you are traveling from
                    Delhi to Haridwar and returning to Delhi. We also have local Haridwar cabs, so if you are travelling for pilgrimage or leisure, you can discuss onward travel from Haridwar to other Uttarakhand destinations.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Delhi Airport to Haridwar
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Travelers arriving at Delhi Airport can discuss cab
                    arrangements for onward travel to Haridwar.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Family Travel
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Private cab arrangements can be discussed for families
                    traveling from Delhi to Haridwar.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Pilgrimage Travel
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Start your Haridwar pilgrimage journey from Delhi and
                    continue onward towards other Uttarakhand destinations.
                  </p>

                  <a
                    href="/services/char-dham-yatra-operators-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Char Dham Travel →
                  </a>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Uttarakhand Travel
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Continue your journey from Haridwar towards destinations
                    across Uttarakhand.
                  </p>

                  <a
                    href="/services/uttarakhand-tour-operators/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Uttarakhand Tours →
                  </a>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* DISTANCE & FARE */}
        <section className="bg-white">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Delhi to Haridwar Distance, Duration & Fare
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-500 mb-1">DISTANCE</div>
                  <div className="text-2xl font-bold text-green-700">215-220 km</div>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-500 mb-1">TRAVEL TIME</div>
                  <div className="text-2xl font-bold text-green-700">4.5 - 5.5 hrs</div>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-500 mb-1">STARTING FARE</div>
                  <div className="text-2xl font-bold text-green-700">₹3500/-*</div>
                </div>
              </div>

              <p className="text-gray-700 leading-8">
                Travel time depends on your Delhi pickup point, traffic and the
                route taken (via NH334 through Meerut-Muzaffarnagar-Roorkee is the
                most common, also there is new Dehradun Express Way is available about 4 Hours it takes to reach Haridwar). Fares vary by vehicle type, one-way vs round-trip,
                and toll charges — contact us for an exact quote.
              </p>
            </div>
          </div>
        </section>

     <section className="container mx-auto px-4 py-10">
          <div className="max-w-5xl mx-auto">

            {/* Section Heading */}
            <div className="text-center mb-7">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Delhi to Haridwar Cab Fare
              </h2>

              <p className="mt-3 text-gray-600 max-w-2xl mx-auto leading-7">
                Choose from comfortable sedan, SUV and Tempo Traveller options for
                one-way and round-trip travel between Delhi and Haridwar.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md bg-white">
              <table className="w-full min-w-175 text-left border-collapse">

                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-6 py-4 font-semibold text-sm md:text-base">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 font-semibold text-sm md:text-base text-center">
                      Seating
                    </th>

                    <th className="px-6 py-4 font-semibold text-sm md:text-base">
                      One-Way Fare
                    </th>

                    <th className="px-6 py-4 font-semibold text-sm md:text-base">
                      Round-Trip Fare
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["Sedan", "Dzire / Aura", "4", "₹4,000", "₹6,500"],
                    ["SUV", "Ertiga / Innova / Kia Carens", "6–7", "₹5,000", "₹8,500"],
                    ["Tempo Traveller", "12–17 Seater", "12–17", "₹13,500", "₹22,000"],
                  ].map(([vehicle, models, seating, oneWay, roundTrip], i) => (
                    <tr
                      key={vehicle}
                      className={`
                        transition-colors duration-200
                        hover:bg-green-50
                        ${i !== 2 ? "border-b border-gray-100" : ""}
                      `}
                    >
                      {/* Vehicle */}
                      <td className="px-6 py-5">
                        <div className="font-semibold text-gray-900">
                          {vehicle}
                        </div>

                        <div className="text-sm text-gray-500 mt-1">
                          {models}
                        </div>
                      </td>

                      {/* Seating */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center justify-center
                                        min-w-13.75 px-3 py-1.5 rounded-full
                                        bg-green-50 text-green-700
                                        font-medium text-sm">
                          {seating}
                        </span>
                      </td>

                      {/* One Way */}
                      <td className="px-6 py-5">
                        <span className="font-semibold text-gray-900">
                          {oneWay}
                        </span>
                      </td>

                      {/* Round Trip */}
                      <td className="px-6 py-5">
                        <span className="font-bold text-green-700 text-lg">
                          {roundTrip}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Note */}
            <div className="mt-4 px-1">
              <p className="text-sm text-gray-500 leading-6">
                <span className="font-medium text-gray-600">
                  * Indicative starting fares.
                </span>{" "}
                Actual prices may vary depending on travel dates, season, toll
                charges, parking and exact pickup or drop location. Contact us
                for a confirmed quote.
              </p>
            </div>

          </div>
        </section>

        {/* ROUTE */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Delhi to Haridwar Travel Route
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Delhi and Haridwar are connected by road, making a private cab
              a convenient option for travelers who prefer direct
              transportation. The total distance is about 210-220 Kms and the drive takes about 4.5 to 5.5 hours depending on traffic, weather and road conditions. The most common route is via NH334 through Meerut, Muzaffarnagar and Roorkee, but there are other routes available as well.
            </p>

            <p className="text-gray-700 leading-8 mb-6">
              The exact travel time can vary depending on your pickup
              location, traffic, weather, road conditions and the route used
              on the day of travel. Travelers should therefore avoid relying
              on a fixed journey time when planning connecting transportation.
            </p>

            <div className="bg-green-50 rounded-xl p-7">

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">

                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    PICKUP
                  </div>

                  <div className="text-xl font-bold text-green-700">
                    Delhi
                  </div>
                </div>

                <div className="text-2xl text-gray-500">
                  →
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    DESTINATION
                  </div>

                  <div className="text-xl font-bold text-green-700">
                    Haridwar
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* PICKUP LOCATIONS */}
        <section className="bg-green-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Delhi Pickup Locations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Delhi Airport
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Travelers arriving in Delhi can discuss an onward cab to
                    Haridwar based on their arrival and pickup requirements.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    New Delhi Railway Area
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Pickup available from New Delhi Railway Station, Old Delhi Railway Station and Nizamuddin Railway Station.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Other Delhi Locations
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Share your exact pickup location with us and we will check upon the current cab located there, so we can easily arrange any cab for you.
                  </p>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* HARIDWAR ONWARD */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Continue From Haridwar to Uttarakhand
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar can be the beginning of a longer Uttarakhand journey.
              From Haridwar, travelers can continue towards Rishikesh,
              Mussoorie, Kedarnath, Badrinath and other destinations depending
              on their itinerary.
            </p>

            <p className="text-gray-700 leading-8 mb-6">
              If you are planning more than just a Delhi to Haridwar transfer,
              you can discuss an extended Uttarakhand tour with Gokeys India. We offer various Uttarakhand Tour Packages like Mussoorie Chopta, Auli, Harsil, Char Dham Yatra, Nainital, Kainchi Dham, Corbett Park and more places trips.
            </p>

            <div className="flex flex-wrap gap-4">

              <a
                href="/services/taxi-service-haridwar/"
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Haridwar Taxi Services
              </a>

              <a
                href="/services/uttarakhand-tour-operators/"
                className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold"
              >
                Uttarakhand Tour Packages
              </a>

            </div>

          </div>
        </section>

        {/* HOTEL */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Hotel Booking in Haridwar & Uttarakhand
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                If Haridwar is your overnight stop before continuing into
                Uttarakhand, you can book hotels with us, we have large number of Hotel affiliates in Haridwar and across Uttarakhand. We can assist you with hotel booking in Haridwar, Rishikesh, Mussoorie, Dehradun, Nainital, Almora, Kedarnath, Badrinath and other destinations.
              </p>

              <p className="text-gray-700 leading-8">
                Travelers can also discuss hotel requirements for other
                destinations included in their Uttarakhand itinerary.
              </p>

              <a
                href="/services/hotel-booking-uttarakhand/"
                className="inline-block mt-6 text-green-700 font-semibold"
              >
                Hotel Booking in Uttarakhand →
              </a>

            </div>
          </div>
        </section>

        {/* HOW TO BOOK */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              How to Book a Delhi to Haridwar Cab
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  01
                </div>

                <h3 className="font-semibold mb-2">
                  Share Pickup
                </h3>

                <p className="text-gray-600">
                  Tell us your Delhi pickup location.
                </p>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  02
                </div>

                <h3 className="font-semibold mb-2">
                  Select Date
                </h3>

                <p className="text-gray-600">
                  Share your travel date and preferred pickup time.
                </p>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  03
                </div>

                <h3 className="font-semibold mb-2">
                  Share Group Size
                </h3>

                <p className="text-gray-600">
                  Tell us the number of passengers and luggage requirements.
                </p>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  04
                </div>

                <h3 className="font-semibold mb-2">
                  Confirm Travel
                </h3>

                <p className="text-gray-600">
                  Review the travel arrangement and confirm your booking.
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* IMPORTANT INFORMATION */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Before Booking Your Delhi to Haridwar Taxi
              </h2>

              <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-7">

                <li>
                  Confirm the exact Delhi pickup location.
                </li>

                <li>
                  Share your travel date and preferred pickup time.
                </li>

                <li>
                  Tell the operator the number of passengers and luggage.
                </li>

                <li>
                  Confirm whether your journey is one-way or round-trip.
                </li>

                <li>
                  Ask what is included in the quoted travel arrangement.
                </li>

                <li>
                  Allow additional time for Delhi traffic and road conditions.
                </li>

                <li>
                  If continuing into Uttarakhand, plan the complete itinerary
                  before finalizing transportation.
                </li>

              </ul>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-7">

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a cab from Delhi to Haridwar?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Gokeys India provides cab and taxi booking assistance
                  for travel from Delhi to Haridwar, subject to vehicle
                  availability and the requested travel date.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a one-way Delhi to Haridwar taxi?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, Delhi to Haridwar one way taxi available with Gokeys India from Old Delhi Railway Station, Nizamuddin Railway Station, Delhi Airport, New Delhi Railway Station, ISBT Bus Stand Kashmiri Gate and more places.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a round-trip cab from Delhi to Haridwar?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. We have own fleet of Sedan, SUV and Tempo Travellers from Delhi to Haridwar and Back. So we can easily book a round trip cab for you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a Delhi Airport to Haridwar cab?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, you can easily book a Cab according to your flight schedule. We will be at IGI Airport Terminal 2,3 for Domestic and Terminal 1 for International to Pickup you up from there to Haridwar.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I continue from Haridwar to other Uttarakhand
                  destinations?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Travelers can discuss onward taxi or tour arrangements
                  from Haridwar to destinations across Uttarakhand depending
                  on their itinerary.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can I book a Delhi to Haridwar cab?
                </h3>

                <p className="text-gray-700 leading-7">
                  Contact Gokeys India by phone or WhatsApp at +91 9045916770, 7830718687, 7830718680
                  and provide your pickup location, destination, travel date,
                  number of passengers and luggage requirements.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-green-700 text-white">

          <div className="container mx-auto px-4 py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Cab From Delhi to Haridwar?
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Share your pickup location, travel date and group details with
              Gokeys India to book your Delhi to Haridwar cab arrangement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-7">

              <a
                href="tel:+919045916770"
                className="bg-white text-green-700 px-7 py-3 rounded-lg font-semibold"
              >
                Call +91 9045916770
              </a>

              <a
                href="https://wa.me/919045916770"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white px-7 py-3 rounded-lg font-semibold"
              >
                WhatsApp
              </a>

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}