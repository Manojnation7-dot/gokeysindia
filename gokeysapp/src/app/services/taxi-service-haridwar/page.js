import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";
import GoogleMap from "@/components/MapIframe";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in/";

export async function generateMetadata() {
  const title =
    "Taxi Services in Haridwar | Haridwar Cab & Taxi Booking";

  const description =
    "Book taxi services in Haridwar for local sightseeing, railway station and airport transfers, Uttarakhand tours, Char Dham Yatra and outstation trips. Contact Gokeys India for taxi and cab services.";

  const url = `${siteUrl}/services/taxi-services-haridwar/`;

  return {
    title,
    description,

    keywords: [
      "taxi services in Haridwar",
      "taxi service in Haridwar",
      "Haridwar taxi service",
      "Haridwar cab service",
      "cab service in Haridwar",
      "taxi booking in Haridwar",
      "Haridwar taxi booking",
      "outstation taxi from Haridwar",
      "Uttarakhand taxi service",
      "Haridwar to Rishikesh taxi",
      "Haridwar to Kedarnath taxi",
      "Haridwar to Badrinath taxi",
      "Haridwar railway station taxi",
      "Haridwar airport taxi",
      "Char Dham taxi service",
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
          url: `${siteUrl}/images/taxi-service-haridwar.jpeg`,
          width: 1200,
          height: 630,
          alt: "Taxi Services in Haridwar by Gokeys India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/taxi-service-haridwar.jpeg`],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TaxiServicesHaridwarPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Taxi Services in Haridwar",
      url: "/services/taxi-services-haridwar/",
    },
  ]);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/taxi-service-haridwar.jpeg`,
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
      {
        "@type": "Country",
        name: "India",
      },
    ],
    sameAs: ["https://www.gokeys.in/"],
  };

  const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Taxi Services in Haridwar",
  serviceType: "Local, Outstation and Pilgrimage Taxi Service",
  description: "Taxi and cab booking assistance from Haridwar for local travel, railway station transfers, outstation journeys and Uttarakhand pilgrimage routes.",
  provider: {
    "@type": "TravelAgency",
    name: "Gokeys India",
    url: siteUrl,
  },
  areaServed: [
    { "@type": "City", name: "Haridwar" },
    { "@type": "State", name: "Uttarakhand" },
  ],
};

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Gokeys provide taxi services in Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, Gokeys India is well known travel agency and taxi service provider in Haridwar since 2019 with a team having 10+ Years of Experience, so you can easily book a cab.",
        },
      },
      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar to Kedarnath?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, we have two types of trip for Kedarnath, one is dropping or one way taxi service and another is 4 Days trip of Kedarnath, it will be round trip with complete Kedarnath, Dhari Devi Temple, Devprayag and Guptkashi Kashi Vishwanath Temple darshan.",
        },
      },
      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar to Rishikesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, you can book a taxi from Haridwar to Rishikesh with us as per your requirement like One Way drop off cab or Full Day Sightseeing Cab.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a taxi from Haridwar Railway Station?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, as we located near Railway Station Haridwar, you can contact or meet us at our office. We will provide you cab for any Uttarakhand Destinations and also for multiple days trips.",
        },
      },
      {
        "@type": "Question",
        name: "Can I book an outstation taxi from Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, outstation cabs are available with Gokeys for various cities like Dehradun, Delhi, Chandigarh, Agra, Lucknow, Varanasi, Ayodhya, Nainital and more.",
        },
      },
      {
        "@type": "Question",
        name: "How can I book a taxi with Gokeys?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can contact Gokeys India by phone or WhatsApp at +91 9045916770 and share your pickup location, destination, travel date, number of passengers and vehicle requirements.",
        },
      },
    ],
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      localBusinessSchema,
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
                HARIDWAR TAXI & CAB SERVICES
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Taxi Services in Haridwar for Local & Uttarakhand Travel
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Looking for taxi services in Haridwar? Gokeys India provides
                taxi and cab booking assistance for local travel, sightseeing,
                railway station transfers, outstation journeys and trips to
                popular destinations across Uttarakhand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a
                  href="tel:+919045916770"
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  Call for Taxi Booking
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

        {/* INTRODUCTION */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Taxi Service in Haridwar
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar is an important place with religious significance, it also known for gateway to Holy Char Dham Temples in Uttarakhand. Haridwar is also known for Road, Railway and Air transportation, so while you planning a trip to Uttarakhand, it can be your starting point and dropping point.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Gokeys India is Haridwar Based Travel and Taxi Service Agency from 2019 providing services travel services like Cab Booking, Car Rental, Hotel Booking, Tour Package Booking to tourists. Gokeys has local office in Haridwar, and the team has served travelers across Uttarakhand's tourist destinations.
            </p>

            <p className="text-gray-700 leading-8">
              If you are looking for a Taxi cab from Haridwar to any destinations of Uttarakhand, then you can contact Gokeys Team and explore the various cab options according to your need.
            </p>
          </div>
        </section>

                {/* Featured Images */}
                      <div className="my-10">
                                  <Image
                                    src="/images/taxi-service-haridwar.jpeg"
                                    alt="book now taxi service from Haridwar"
                                    width={1200}
                                    height={675}
                                    className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-sm"
                                    priority
                                  />
                                </div>

        {/* SERVICES */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Our Taxi & Cab Services in Haridwar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Local Taxi Service
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Book a taxi for local travel around Haridwar, including
                    transfers between important locations and other travel
                    requirements.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Haridwar Railway Station Taxi
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Arrange pickup or drop-off services for travelers arriving
                    at or departing from Haridwar Railway Station, subject to
                    availability.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Outstation Taxi
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Plan an outstation journey from Haridwar to destinations
                    across Uttarakhand and other locations according to your
                    travel requirements.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Uttarakhand Taxi Service
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Travel from Haridwar to popular destinations and
                    pilgrimage locations across Uttarakhand with planned
                    transportation arrangements.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Pilgrimage Taxi
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Taxi arrangements can be booked for journeys towards
                    Kedarnath, Badrinath, Gangotri, Yamunotri and other
                    pilgrimage destinations.
                  </p>

                  <a
                    href="/blog/char-dham-yatra-2027/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    View Char Dham Tours →
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Sightseeing Taxi
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Book a taxi for sightseeing trips around Haridwar and
                    nearby Uttarakhand destinations based on your itinerary.
                  </p>

                  <a
                    href="/destinations/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Explore Destinations →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-10">
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
                ["Haridwar to Rishikesh", "~30 km", "₹1,800"],
                ["Haridwar to Dehradun", "~55 km", "₹2,200"],
                ["Haridwar to Delhi", "~215 km", "₹4,000"],
                ["Haridwar Railway Station to Hotel", "1-8 km", "₹500"],
                 ["Haridwar to Mussoorie", "90 km", "₹3,500"],
                 ["Haridwar to Sonprayag", "240 km", "₹6,500"],
                 ["Haridwar to Badrinath", "320 Km", "₹9,500"],
                 ["Haridwar to Chopta", "230 km", "₹6,500"],
                 ["Haridwar to Ransi Village", "235 km", "₹6,500"],
                 ["Haridwar to Joshimath", "280 km", "₹7,500"],
                 ["Haridwar to Nainital", "280 km", "₹9,500"],
                 ["Haridwar to Shimla", "320 km", "₹11,500"],
                 ["Haridwar to Chandigarh", "220 km", "₹5,500"],
                 ["Haridwar to Chamoli", "230 km", "₹6,500"],
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
      </section>
        {/* POPULAR ROUTES */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Popular Taxi Routes From Haridwar
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <a
                href="/services/delhi-to-haridwar-cab/"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  Delhi to Haridwar Cab
                </h3>
                <p className="text-gray-600 mt-2">
                  Book a cab from Delhi to Haridwar with us.
                </p>
              </a>

              <div className="border rounded-xl p-5">
                <h3 className="text-lg font-semibold text-green-700">
                  Haridwar to Rishikesh Taxi
                </h3>
                <p className="text-gray-600 mt-2">
                  We can book a cab for Haridwar to Rishikesh for Dropping Off or full Day Sightseeing.
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="text-lg font-semibold text-green-700">
                  Haridwar to Kedarnath
                </h3>
                <p className="text-gray-600 mt-2">
                  Cab to Haridwar from Sonprayag is available with us at competitive prices.
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="text-lg font-semibold text-green-700">
                  Haridwar to Badrinath
                </h3>
                <p className="text-gray-600 mt-2">
                  Looking for Haridwar to Badrinath Cab, check with us and get the best prices.
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="text-lg font-semibold text-green-700">
                  Haridwar to Dehradun
                </h3>
                <p className="text-gray-600 mt-2">
                  We can arrange a cab to Dehradun City, Dehradun Jolly Grant Airport and for any location in Dehradun.
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="text-lg font-semibold text-green-700">
                  Haridwar to Mussoorie
                </h3>
                <p className="text-gray-600 mt-2">
                  Looking for Haridwar to Mussoorie Dropping Cabs, we have one way cab with lowest fare.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UTTARAKHAND TAXI */}
        <section className="bg-green-50">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Taxi Service for Uttarakhand Travel
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                Uttarakhand travel often involves long mountain routes,
                changing weather conditions and different road conditions.
                Planning transportation in advance can make a multi-day
                itinerary easier to manage.
              </p>

              <p className="text-gray-700 leading-8 mb-4">
                From Haridwar, travelers commonly continue towards Rishikesh,
                Devprayag, Srinagar, Rudraprayag, Guptkashi, Joshimath,
                Badrinath and other destinations depending on their route.
              </p>

              <p className="text-gray-700 leading-8">
                For pilgrimage journeys, you should always plan about vehicle and seating capacity because hills route and long Journeys like Char Dham Yatra can be hectic if not chosen wisely.
              </p>

              <a
                href="/destinations/"
                className="inline-block mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Explore Uttarakhand Destinations
              </a>
            </div>
          </div>
        </section>

        {/* CHAR DHAM TAXI */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Taxi for Char Dham Yatra From Haridwar
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar is starting point of Char Dham Yatra, it is also known as gateway of God, so after taking holy dip
              in the Ganges River you can start your trip to Char Dham temples. The Yatra takes 9 Nights and 10 Days from Haridwar to Haridwar.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              A Char Dham trip is different from a normal city taxi journey.
              It involves 10 Days of Journey, mountain roads and
              changing weather conditions. Your vehicle and itinerary should
              therefore be selected according to the route and group size.
            </p>

            <p className="text-gray-700 leading-8">
              If you are planning Char Dham travel from Haridwar, Gokeys can
              also book a best tour packages that combine transportation,
              accommodation and itinerary planning.
            </p>

            <a
              href="/blog/char-dham-yatra-2027/"
              className="inline-block mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Explore Char Dham Yatra
            </a>
          </div>
        </section>

        {/* HOW TO BOOK */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                How to Book a Taxi in Haridwar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    01
                  </div>

                  <h3 className="font-semibold mb-2">
                    Share Your Route
                  </h3>

                  <p className="text-gray-600">
                    Tell us your pickup location, destination and travel date.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    02
                  </div>

                  <h3 className="font-semibold mb-2">
                    Share Group Details
                  </h3>

                  <p className="text-gray-600">
                    Let us know the number of passengers and approximate
                    luggage requirements.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    03
                  </div>

                  <h3 className="font-semibold mb-2">
                    Discuss Vehicle
                  </h3>

                  <p className="text-gray-600">
                    Discuss the available vehicle and travel arrangements for
                    your route.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    04
                  </div>

                  <h3 className="font-semibold mb-2">
                    Confirm Booking
                  </h3>

                  <p className="text-gray-600">
                    Confirm the agreed travel arrangements before your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* WHY GOKEYS */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Why Choose Gokeys for Taxi Booking in Haridwar?
            </h2>

            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 leading-7">
              Gokeys India Since 2019 helping travelers arrange taxis, local transfers and
              Uttarakhand trips from Haridwar with flexible travel options and
              local destination knowledge.
            </p>

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">

              <table className="w-full text-left border-collapse">

                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-5 py-4 font-semibold">
                      Why Choose Gokeys?
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      What It Means for You
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">

                  <tr className="bg-white">
                    <td className="px-5 py-4 border-t border-gray-100 font-semibold text-green-700">
                      Local Haridwar Travel Experience
                    </td>

                    <td className="px-5 py-4 border-t border-gray-100 text-gray-600 leading-7">
                      Gokeys India is a Haridwar-based travel agency located near Railway Station Haridwar, helping
                      travelers plan taxi journeys and trips across Uttarakhand.
                    </td>
                  </tr>

                  <tr className="bg-green-50/40">
                    <td className="px-5 py-4 border-t border-gray-100 font-semibold text-green-700">
                      One Travel Contact
                    </td>

                    <td className="px-5 py-4 border-t border-gray-100 text-gray-600 leading-7">
                      Along with taxi services, we can help with accommodation
                      arrangements through our network of hotels, homestays and
                      resorts.
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="px-5 py-4 border-t border-gray-100 font-semibold text-green-700">
                      Flexible Travel Planning
                    </td>

                    <td className="px-5 py-4 border-t border-gray-100 text-gray-600 leading-7">
                      Share your route, travel dates, group size and itinerary
                      requirements so your transportation can be planned according
                      to your trip.
                    </td>
                  </tr>

                  <tr className="bg-green-50/40">
                    <td className="px-5 py-4 border-t border-gray-100 font-semibold text-green-700">
                      Uttarakhand Travel Focus
                    </td>

                    <td className="px-5 py-4 border-t border-gray-100 text-gray-600 leading-7">
                      Our services focus on Uttarakhand travel, including
                      pilgrimage journeys, sightseeing trips, hill destinations
                      and multi-day tours.
                    </td>
                  </tr>

                  <tr className="bg-white">
                    <td className="px-5 py-4 border-t border-gray-100 font-semibold text-green-700">
                      One-Way & Round-Trip Options
                    </td>

                    <td className="px-5 py-4 border-t border-gray-100 text-gray-600 leading-7">
                      Depending on your travel requirement, you can ask for a
                      one-way drop, return taxi, sightseeing trip or multi-day
                      vehicle arrangement.
                    </td>
                  </tr>

                  <tr className="bg-green-50/40">
                    <td className="px-5 py-4 border-t border-gray-100 font-semibold text-green-700">
                      Taxi for Pilgrimage Routes
                    </td>

                    <td className="px-5 py-4 border-t border-gray-100 text-gray-600 leading-7">
                      Taxi arrangements are available for popular Uttarakhand
                      pilgrimage destinations such as Kedarnath, Badrinath,
                      Gangotri and Yamunotri, subject to route and vehicle
                      availability.
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </section>

        {/* TRAVEL TIPS */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Things to Check Before Booking a Taxi in Haridwar
            </h2>

            <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-7">
              <li>
                Confirm the pickup location and destination clearly.
              </li>

              <li>
                Ask which vehicle is being provided for your group size.
              </li>

              <li>
                Confirm whether the quoted amount includes the services you
                require.
              </li>

              <li>
                For multi-day Uttarakhand trips, clarify the itinerary and
                vehicle arrangements before booking.
              </li>

              <li>
                Ask about additional charges, parking, tolls or other route
                expenses when applicable.
              </li>

              <li>
                For mountain journeys, check the current road and weather
                conditions before departure.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions About Haridwar Taxi Services
              </h2>

              <div className="space-y-7">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Does Gokeys provide taxi services in Haridwar?
                  </h3>

                  <p className="text-gray-700 leading-7">
                   Yes, Gokeys India is well known travel agency and taxi service provider in Haridwar since 2019 with a team having 10+ Years of Experience, so you can easily book a cab.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book a taxi from Haridwar to Kedarnath?
                  </h3>

                  <p className="text-gray-700 leading-7">
                   Yes, we have two types of trip for Kedarnath, one is dropping or one way taxi service and another is 4 Days trip of Kedarnath, it will be round trip with complete Kedarnath, Dhari Devi Temple, Devprayag and Guptkashi Kashi Viswanath temple Darshan.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book a taxi from Haridwar to Rishikesh?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes, you can book a taxi from Haridwar to Rishikesh with us as per your requirement like One Way drop off cab or Full Day Sightseeing Cab.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I get a taxi from Haridwar Railway Station?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes, as we located near Railway Station Haridwar, you can contact or meet us at our office. We will provide you cab for any Uttarakhand Destinations and also for multiple days trips.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book an outstation taxi from Haridwar?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes, outstation cabs are available with Gokeys for various cities like Dehradun, Delhi, Chandigarh, Agra, Lucknow, Varanasi, Ayodhya, Nainital and more.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How can I book a taxi with Gokeys?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    You can contact Gokeys India by phone or WhatsApp at
                    +91 9045916770 and share your pickup location, destination,
                    travel date, number of passengers and vehicle requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

         <GoogleMap />

        {/* FINAL CTA */}
        <section className="bg-green-700 text-white">
          <div className="container mx-auto px-4 py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Taxi in Haridwar?
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Contact Gokeys India for taxi and cab booking assistance from
              Haridwar for local travel, Uttarakhand tours, pilgrimage
              journeys and outstation trips.
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

