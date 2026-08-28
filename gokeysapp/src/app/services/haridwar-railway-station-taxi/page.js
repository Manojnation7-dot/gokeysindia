import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in";

export async function generateMetadata() {
  const title =
    "Haridwar Railway Station Taxi | Cab Service & Pickup";

  const description =
    "Book a taxi from Haridwar Railway Station with Gokeys India. Cab services for hotels, Rishikesh, Char Dham Yatra, Kedarnath, Badrinath and Uttarakhand travel.";

  const url = `${siteUrl}/services/haridwar-railway-station-taxi/`;

  return {
    title,
    description,

    keywords: [
      "Haridwar Railway Station Taxi",
      "Haridwar Railway Station Cab",
      "taxi from Haridwar Railway Station",
      "cab from Haridwar Railway Station",
      "Haridwar railway station taxi service",
      "Haridwar railway station cab booking",
      "Haridwar station pickup taxi",
      "Haridwar station to hotel taxi",
      "Haridwar Railway Station to Rishikesh taxi",
      "Haridwar Railway Station to Kedarnath taxi",
      "Haridwar Railway Station to Badrinath taxi",
      "Haridwar Railway Station to Delhi cab",
      "Haridwar taxi booking",
      "Haridwar cab service",
      "Uttarakhand taxi service",
      "Travel Agency in Haridwar",
      "Uttarakhand tour operators",
      "travel agents in Haridwar",
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
          url: `${siteUrl}/images/haridwar-railway-station-taxi.jpeg`,
          width: 1200,
          height: 630,
          alt: "Haridwar Railway Station Taxi Service - Gokeys India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}/images/haridwar-railway-station-taxi.jpeg`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function HaridwarRailwayStationTaxiPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Haridwar Railway Station Taxi",
      url: "/services/haridwar-railway-station-taxi/",
    },
  ]);

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/haridwar-railway-station-taxi.jpeg`,
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
        name: "Haridwar",
      },
      {
        "@type": "State",
        name: "Uttarakhand",
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Haridwar Railway Station Taxi Service",
    serviceType: "Railway Station Taxi and Cab Service",
    description:
      "Taxi and cab booking assistance for travelers arriving at or departing from Haridwar Railway Station.",
    provider: {
      "@type": "TravelAgency",
      name: "Gokeys India",
      url: siteUrl,
    },
    areaServed: {
      "@type": "City",
      name: "Haridwar",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar Railway Station?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India provides taxi and cab booking assistance for travelers arriving at or departing from Haridwar Railway Station, subject to availability.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar Railway Station to my hotel?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Travelers can provide their hotel or accommodation details when making an enquiry so that a suitable taxi arrangement can be discussed.",
        },
      },

      {
        "@type": "Question",
        name: "Can I get a taxi from Haridwar Railway Station to Rishikesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, Taxis are available for Rishikesh from Haridwar with Starting prices at ₹1500/-.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar Railway Station for Char Dham Yatra?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys Haridwar is one of the leading travel agencies for Char Dham Yatra with years of experience. Travelers planning Char Dham Yatra can discuss taxi and wider transportation requirements starting from Haridwar Railway Station.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a round-trip taxi from Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Round-trip taxi arrangements can be discussed based on your itinerary, travel dates, destinations and vehicle requirements.",
        },
      },

      {
        "@type": "Question",
        name: "How can I book a Haridwar Railway Station taxi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Contact Gokeys India by phone or WhatsApp at +91 9045916770 and share your arrival or departure details, destination, travel date and number of passengers.",
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
                HARIDWAR RAILWAY STATION TAXI SERVICE
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Haridwar Railway Station Taxi & Cab Service 
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Need a taxi from Haridwar Railway Station? Gokeys India
                Uttarakhand top travel agency, provides cab booking assistance for travelers arriving in
                Haridwar and continuing to hotels, Rishikesh, Delhi, Char
                Dham destinations and other parts of Uttarakhand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

                <a
                  href="tel:+919045916770"
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  Book Your Taxi
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
                    src="/images/haridwar-railway-station-taxi.jpeg"
                    alt="Haridwar Railway Station Taxi Service"
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
              Taxi from Haridwar Railway Station
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar Railway Station is an important arrival point for
              travelers visiting Haridwar and Uttarakhand. Many passengers
              arriving by train need transportation to their hotel, pilgrimage
              destination, tourist places or the next stop on their itinerary.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Gokeys India provides taxi and cab booking assistance from
              Haridwar Railway Station for individuals, families and groups.
              You can directly contact us with your pickup time, destination, number of
              passengers and luggage requirements. And as well located about 100 Mtrs from Haridwar Railway Station, we can arrange a taxi for you to your hotel, Rishikesh, Delhi or other Uttarakhand destinations.
            </p>

            <p className="text-gray-700 leading-8">
              Whether you are staying in Haridwar for a few days or beginning
              a longer Uttarakhand journey, a pre-arranged taxi can make the
              transfer from the railway station easier to plan.
            </p>

          </div>

        </section>

        {/* SERVICES */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-6xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Haridwar Railway Station Cab Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Railway Station to Hotel
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Arrange transportation from Haridwar Railway Station to
                    your hotel or accommodation in Haridwar. We charge a minimum starting fare of ₹500 for hotel drop.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Station to Rishikesh
                  </h3>

                  <p className="text-gray-600 leading-7">
                    If you are continuing your journey from Haridwar to Rishikesh, a taxi can be arranged for onward travel by Gokeys for best Price.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Char Dham Travel
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Char Dham Yatra is holy pilgrimage journey in Garhwal Uttarakhand. If you are planning Char Dham Yatra, Gokeys India can help discuss taxi and wider transportation requirements starting from Haridwar Railway Station.
                  </p>

                  <a
                    href="/services/char-dham-yatra-operators-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Char Dham Services →
                  </a>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Haridwar to Delhi
                  </h3>

                  <p className="text-gray-600 leading-7">
                   If you are looking for Haridwar to Delhi Taxi like Delhi Airport, Railway Station and more places, you can easily book a cab with us.
                  </p>

                  <a
                    href="/services/delhi-to-haridwar-cab/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Delhi–Haridwar Cab →
                  </a>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Uttarakhand Tours
                  </h3>

                  <p className="text-gray-600 leading-7">
                    We offer various Uttarakhand tour packages like Mussoorie Chopta, Auli, Harsil, Char Dham Yatra, Nainital, Kainchi Dham, Corbett Park and more places trips. You can discuss your complete Uttarakhand travel plan with Gokeys India.
                  </p>

                  <a
                    href="/services/uttarakhand-tour-operators/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Uttarakhand Tours →
                  </a>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Local Haridwar Taxi
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Haridwar has many sightseeing places like Mansa Devi, Chandi Devi, Har Ki Pauri, Kankhal Daksh Temple, Bharat Mata Temple, Shanti Kunj and more places. Book Now one day taxi to Haridwar Sightseeing with us.
                  </p>

                  <a
                    href="/services/taxi-services-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Haridwar Taxi Services →
                  </a>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Haridwar Railway Station Taxi Fare & Distance
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="px-5 py-3 font-semibold">Route</th>
                  <th className="px-5 py-3 font-semibold">Distance</th>
                  <th className="px-5 py-3 font-semibold">Starting Fare</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[
                  ["Station to Haridwar Hotels", "1-8 km", "₹500"],
                  ["Station to Rishikesh", "~30 km", "₹1,500"],
                  ["Station to Dehradun", "~55 km", "₹2,200"],
                  ["Station to Delhi", "~215 km", "₹4,000"],
                  ["Station to Mussoorie", "~90 km", "₹3,500"],
                  ["Station to Sonprayag", "~240 km", "₹5,500"],
                ].map(([route, dist, fare], i) => (
                  <tr key={route} className={i % 2 === 0 ? "bg-white" : "bg-green-50/40"}>
                    <td className="px-5 py-3 border-t border-gray-100 font-medium">{route}</td>
                    <td className="px-5 py-3 border-t border-gray-100">{dist}</td>
                    <td className="px-5 py-3 border-t border-gray-100">{fare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm mt-3">
            * Indicative starting fares. Actual price depends on vehicle type, season and exact drop location. Contact us for a confirmed quote.
          </p>
        </div>
      </section>

        {/* POPULAR ROUTES */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Popular Taxi Routes From Haridwar Railway Station
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Haridwar Railway Station to Haridwar Hotels
                </h3>

                <p className="text-gray-600 leading-7">
                  Convenient transfer arrangements can be discussed for
                  travelers staying at hotels in Haridwar.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Haridwar Railway Station to Rishikesh
                </h3>

                <p className="text-gray-600 leading-7">
                  A useful option for travelers continuing from Haridwar to
                  Rishikesh after arriving by train.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Haridwar Railway Station to Delhi
                </h3>

                <p className="text-gray-600 leading-7">
                  Discuss a private cab for onward travel towards Delhi.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Haridwar Railway Station to Uttarakhand
                </h3>

                <p className="text-gray-600 leading-7">
                  Plan onward transportation towards destinations included in
                  your Uttarakhand itinerary.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* PILGRIMAGE */}
        <section className="bg-green-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Haridwar Railway Station Taxi for Pilgrimage Travel
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                Haridwar is a common starting point for travelers heading
                towards several pilgrimage destinations in Uttarakhand.
                Travelers arriving by train can arrange onward transportation
                according to their planned itinerary.
              </p>

              <p className="text-gray-700 leading-8 mb-5">
                If you are planning Kedarnath, Badrinath or Char Dham Yatra,
                share your complete travel plan with the Gokeys team so that
                transportation requirements can be discussed together.
              </p>

              <a
                href="/services/char-dham-yatra-operators-haridwar/"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Plan Char Dham Travel
              </a>

            </div>

          </div>

        </section>

        {/* HOTEL */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Haridwar Railway Station to Hotel Transfer
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              If you have already booked your hotel in Haridwar, you can
              provide the hotel name and location when making your taxi
              enquiry.
            </p>

            <p className="text-gray-700 leading-8">
              If you still need accommodation, Gokeys India can also help
              discuss hotel booking requirements for your Uttarakhand trip.
            </p>

            <a
              href="/services/hotel-booking-uttarakhand/"
              className="inline-block mt-6 text-green-700 font-semibold"
            >
              Hotel Booking in Uttarakhand →
            </a>

          </div>

        </section>

        {/* HOW TO BOOK */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                How to Book a Haridwar Railway Station Taxi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    01
                  </div>

                  <h3 className="font-semibold mb-2">
                    Share Train Details
                  </h3>

                  <p className="text-gray-600">
                    Provide your arrival or departure date and approximate
                    timing.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    02
                  </div>

                  <h3 className="font-semibold mb-2">
                    Tell Us Your Destination
                  </h3>

                  <p className="text-gray-600">
                    Share your hotel, city or onward travel destination.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    03
                  </div>

                  <h3 className="font-semibold mb-2">
                    Share Passenger Details
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
                    Confirm Your Taxi
                  </h3>

                  <p className="text-gray-600">
                    Review the travel arrangement and confirm your booking.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* TRAVEL TIPS */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tips for Booking a Railway Station Taxi
            </h2>

            <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-7">

              <li>
                Share your train arrival time when making the enquiry.
              </li>

              <li>
                Provide the correct passenger and luggage details.
              </li>

              <li>
                Give the exact hotel or destination address where possible.
              </li>

              <li>
                Allow some flexibility because train schedules can change.
              </li>

              <li>
                If you are continuing towards the mountains, plan enough
                travel time for your onward journey.
              </li>

              <li>
                Confirm what is included in your taxi arrangement before
                finalizing the booking.
              </li>

            </ul>

          </div>

        </section>

        {/* WHY GOKEYS */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Why Choose Gokeys for Haridwar Taxi Booking?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white border rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Local Travel Experience
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Gokeys India is based in Haridwar and serves travelers
                    planning journeys across Uttarakhand.
                  </p>

                </div>

                <div className="bg-white border rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Taxi & Tour Assistance
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Your railway station transfer can be discussed together
                    with hotel, taxi and wider tour requirements.
                  </p>

                </div>

                <div className="bg-white border rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Uttarakhand Focus
                  </h3>

                  <p className="text-gray-600 leading-7">
                    We specialize in travel arrangements for Uttarakhand
                    pilgrimage and leisure journeys.
                  </p>

                </div>

                <div className="bg-white border rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Direct Enquiry
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Contact the team directly with your travel details and
                    discuss the appropriate taxi arrangement.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED SERVICES */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Related Haridwar Travel Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <a
                href="/services/taxi-service-haridwar/"
                className="border rounded-xl p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Taxi Services in Haridwar
                </h3>

                <p className="text-gray-600">
                  Explore local and outstation taxi services from Haridwar.
                </p>
              </a>

              <a
                href="/services/travel-agency-haridwar/"
                className="border rounded-xl p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Travel Agency in Haridwar
                </h3>

                <p className="text-gray-600">
                  Plan tours, pilgrimage journeys and travel services from
                  Haridwar.
                </p>
              </a>

              <a
                href="/services/uttarakhand-tour-operators/"
                className="border rounded-xl p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Uttarakhand Tour Operators
                </h3>

                <p className="text-gray-600">
                  Plan a complete Uttarakhand trip with transportation and
                  accommodation assistance.
                </p>
              </a>

            </div>

          </div>

        </section>

        {/* FAQ */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-7">

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book a taxi from Haridwar Railway Station?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes. Gokeys India provides taxi and cab booking assistance
                    for travelers arriving at or departing from Haridwar
                    Railway Station, subject to availability.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book a taxi from Haridwar Railway Station to my
                    hotel?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes. Share your hotel or accommodation details when
                    making your enquiry so that a suitable taxi arrangement
                    so we can have your taxi ready before your train arrives.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I get a taxi from Haridwar Railway Station to
                    Rishikesh?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes, Taxis are available for Rishikesh from Haridwar with Starting prices at ₹1500/-. 
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book a taxi from Haridwar Railway Station for Char
                    Dham Yatra?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes. Gokeys Haridwar is one of the leading travel agencies for Char Dham Yatra with years of experience. Travelers planning Char Dham Yatra can discuss taxi and wider transportation requirements starting from Haridwar Railway Station.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book a round-trip taxi from Haridwar?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes. Round-trip taxi is available based on your itinerary, travel dates, destinations and vehicle requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How can I book a Haridwar Railway Station taxi?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Contact Gokeys India by phone or WhatsApp at +91 9045916770
                    and share your arrival or departure details, destination,
                    travel date and number of passengers.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* FINAL CTA */}
        <section className="bg-green-700 text-white">

          <div className="container mx-auto px-4 py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Taxi From Haridwar Railway Station?
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Share your train arrival details, destination and passenger
              information with Gokeys India to book your taxi requirement.
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