import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";
import GoogleMap from "@/components/MapIframe";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in";

export async function generateMetadata() {
  const title =
    "Uttarakhand Tour Operators | Uttarakhand Tour Packages";

  const description =
    "Looking for Uttarakhand tour operators? Gokeys India helps plan Uttarakhand tour packages from Haridwar covering Char Dham, Kedarnath, Badrinath, Rishikesh, Mussoorie, Nainital and other destinations.";

  const url = `${siteUrl}/services/uttarakhand-tour-operators/`;

  return {
    title,
    description,

    keywords: [
      "Uttarakhand tour operators",
      "Uttarakhand tour operator",
      "Uttarakhand tour operators in Haridwar",
      "Uttarakhand travel agency",
      "Uttarakhand tour packages",
      "Uttarakhand holiday packages",
      "Uttarakhand tourism packages",
      "Uttarakhand trip packages",
      "Uttarakhand travel packages",
      "Uttarakhand tour package from Haridwar",
      "Uttarakhand tour agency",
      "Uttarakhand travel company",
      "Char Dham tour package",
      "Kedarnath tour package",
      "Badrinath tour package",
      "Rishikesh tour package",
      "Mussoorie tour package",
      "Nainital tour package",
      "Uttarakhand family tour packages",
      "Uttarakhand honeymoon packages",
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
          url: `${siteUrl}/images/uttarakhand-tour-operators.jpeg`,
          width: 1200,
          height: 630,
          alt: "Uttarakhand Tour Operators - Gokeys India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}/images/uttarakhand-tour-operators.jpeg`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function UttarakhandTourOperatorsPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Uttarakhand Tour Operators",
      url: "/services/uttarakhand-tour-operators/",
    },
  ]);

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/uttarakhand-tour-operators.jpeg`,
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

    sameAs: [
      "https://www.gokeys.in/",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Does Gokeys provide Uttarakhand tour packages?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India provides Uttarakhand tour planning and travel packages covering pilgrimage, family, sightseeing and customized trips, depending on the selected itinerary.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book an Uttarakhand tour from Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, as Gokeys India is Haridwar Based Travel Agency and provides various Uttarakhand Tour Packages, also Haridwar is starting point for various Uttarakhand destinations, so you can easily plan a trip from Haridwar.",
        },
      },

      {
        "@type": "Question",
        name: "Which places can I visit on a Uttarakhand tour?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Popular Uttarakhand destinations include Haridwar, Rishikesh, Mussoorie, Nainital, Auli, Kedarnath, Badrinath, Gangotri, Yamunotri, Valley of Flowers and other Himalayan destinations.",
        },
      },

      {
        "@type": "Question",
        name: "Does Gokeys offer Char Dham Yatra packages?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India provides Char Dham Yatra travel Tour Packages covering Yamunotri, Gangotri, Kedarnath and Badrinath according to the selected itinerary.",
        },
      },

      {
        "@type": "Question",
        name: "Can I customize my Uttarakhand tour?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Customized Uttarakhand travel plans can be discussed based on your travel dates, group size, destinations, accommodation requirements and transportation preferences.",
        },
      },

      {
        "@type": "Question",
        name: "How can I contact Gokeys for an Uttarakhand tour?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can contact Gokeys India by phone or WhatsApp at +91 9045916770 and share your preferred destinations, travel dates and group details.",
        },
      },
    ],
  };

  const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Uttarakhand Tour Operator Services",
  serviceType: "Tour Operator and Travel Planning Services",
  description: "Uttarakhand tour packages covering Char Dham, hill stations, family holidays and customized itineraries from Haridwar.",
  provider: { "@type": "TravelAgency", name: "Gokeys India", url: siteUrl },
  areaServed: [
    { "@type": "State", name: "Uttarakhand" },
    { "@type": "City", name: "Haridwar" },
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
                UTTARAKHAND TOUR OPERATORS
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Uttarakhand Tour Operators for Complete Travel Planning
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Uttarakhand is known for various Tourist Destinations and Religious temples, if you are planning a trip to Uttarakhand and looking for Travel Agency or Tour Operators in Uttarakhand. Then Gokeys India Travel In Himalayas is one of Top travel agencies based in Haridwar for All Uttarakhand Trips and tour Packages.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

                <a
                  href="tel:+919045916770"
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  Plan Your Uttarakhand Tour
                </a>

                <a
                  href="https://wa.me/919045916770"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-green-700 text-green-700 px-7 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
                >
                  WhatsApp Us
                </a>

              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Uttarakhand Tour Operators
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Uttarakhand offers a wide range of travel experiences, from Himalayan mountain journey to Adventure activities in Rishikesh, Religious Journey to Sacred Char Dham Temple and trekking experiences to various places like Kedar Kantha, Tungnath and Chandrashila, Valley of flower and the list goes on.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
             Gokey India, based in Haridwar, which is known for starting point of most tours of Uttarakhand. You can reach by Bus, Cab, Trains and air to Haridwar from different cities of India and explore the Himalayan Destinations like Auli, Chopta and more.
            </p>

            <p className="text-gray-700 leading-8">
              Gokeys India a Haridwar travel agency provides Tour Package to Uttarakhand various destinations, religious packages to Char Dham Temples, Hotel Bookings for all over Uttarakhand, Taxi and Cab Rental for One or Multiple Days itinerary and also customized tour package according to your needs.
            </p>

          </div>
        </section>

                {/* Featured Images */}
                      <div className="my-10">
                                  <Image
                                    src="/images/uttarakhand-tour-operators.jpeg"
                                    alt="Tour operators in Uttarakhand"
                                    width={1200}
                                    height={675}
                                    className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-sm"
                                    priority
                                  />
                                </div>

        {/* TYPES OF TOURS */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Uttarakhand Tour Packages
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Char Dham Yatra
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Plan a pilgrimage journey covering Yamunotri, Gangotri,
                    Kedarnath and Badrinath from Haridwar.
                  </p>

                  <a
                    href="/services/char-dham-yatra-operators-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Char Dham Operators →
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Kedarnath Tours
                  </h3>

                  <p className="text-gray-600 leading-7">
                    One of the 12 Jyotirlingas of Lord Shiva, located in the Garhwal Himalayas with Gokeys India. We have Multiple days trip to Kedarnath with Groups and Private trips.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Badrinath Tours
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Badrinath is knows as Moskha Tirath means place of Salvation, so plan a trip to this scared place with us with 3 Days journey from Haridwar.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Hill Station Tours
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Uttarakhand is approx. 80% on hills, so hill stations are most popular for trips throughout the year. You can plan a trip to Mussoorie, Nainital, Chopta, Auli, Harsil, Kausani, Binsar with us.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Family Holidays
                  </h3>

                  <p className="text-gray-600 leading-7">
                   Looking for a family holidays in Uttarakhand. It is one of the best destination to enjoy your vacations with Nature and mountain ranges.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Customized Tours
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Didn't like any pre planned trip itinerary, don't worry we got you, we have all types of customize package according to your needs for Uttarakhand Travel.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* DESTINATIONS */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Popular Uttarakhand Destinations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <a
                href="/destinations/haridwar/"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  Haridwar
                </h3>

                <p className="text-gray-600 mt-2">
                  Known for places of Lord Shiva and Lord Vishnu, also known as gateway of holy Char Dham Yatra.
                </p>
              </a>

              <a
                href="/destinations/rishikesh/"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  Rishikesh
                </h3>

                <p className="text-gray-600 mt-2">
                  Known for yoga and meditation, spirituality, adventure like white water river rafting and the Holy River Ganga.
                </p>
              </a>

              <a
                href="/destinations/mussoorie/"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  Mussoorie
                </h3>

                <p className="text-gray-600 mt-2">
                 Known as queen of Hills, Mussoorie is located about 35 Kms from Dehradun capital city of Uttarakhand, with amazing weather throughout the year.
                </p>
              </a>

              <a
                href="/destinations/nainital/"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  Nainital
                </h3>

                <p className="text-gray-600 mt-2">
                  The city of lake Nainital await you to visit amazing Naini lake, Mall Road, Bhimtal, Kainchi Dham and more places.
                </p>
              </a>

              <a
                href="/destinations/kedarnath/"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  Kedarnath
                </h3>

                <p className="text-gray-600 mt-2">
                  One of the India's most visited temples and abode of Lord Shiva in Himalayas.
                </p>
              </a>

              <a
                href="/destinations/badrinath/"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-700">
                  Badrinath
                </h3>

                <p className="text-gray-600 mt-2">
                  One of the main Char Dham Temples in India, known for Himalayan journey, salvation and amazing India first Village Mana.
                </p>
              </a>

            </div>

            <div className="text-center mt-8">

              <a
                href="/destinations/"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Explore All Destinations
              </a>

            </div>

          </div>
        </section>

              <section className="container mx-auto px-4 py-10">
            <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-5 text-center">
            Uttarakhand Tour Package Pricing
          </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="px-5 py-3 font-semibold">Package Name</th>
                <th className="px-5 py-3 font-semibold">Durations</th>
                <th className="px-5 py-3 font-semibold">Starting Cost Per Person</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                ["Mussoorie Chakarata Tour Package", "4 Days", "₹8,500"],
                ["Char Dham Yatra Package", "10 Days", "₹21,000"],
                ["Chopta Tungnath Deoria Tal Tour Package", "3 Days", "₹8,500"],
                ["Auli Chopta, Mussoorie Rishikesh Tour Package", "8 Days", "₹16,500"],
                 ["Nainital Kausani Corbett Almora Tour Packages", "7 Days", "₹15,500"],
                 ["Corbett Jungle Safari Tour Package", "3 Days", "₹8,500"],
                 ["Valley of flowers Trekking Packages", "5 Days", "₹11,500"],
                 ["Kedarnath Dham Tour Package", "4 Days", "₹7,500"],
                 ["Rishikesh Adventure Tour Package", "2 Days", "₹4,500"],
                 ["Mussoorie Nainital Tour Packages", "6 Days", "₹14,500"],
                 ["Uttarakhand Complete Tour Package", "22 Days", "₹45,500"],
                 ["Garhwal Tour Package", "15 Days", "₹30,500"],
                 ["Panch Kedar Tour Packages", "12 Days", "₹24,500"],
                 ["Munsiyari Chaukori Mukteshwar Tour Package", "6 Days", "₹14,500"],
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
        </div>
        <p className="text-gray-500 text-sm mt-3">
            * Indicative starting fares with Minimum Persons Requirements. Actual price depends on Total persons, Hotel categories, vehicle type, season and meal plans. Contact us for a confirmed quote.
          </p>
      </section>

        {/* HARIDWAR STARTING POINT */}
        <section className="bg-green-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Uttarakhand Tours Starting From Haridwar
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                Haridwar is well connected by road and rail and is frequently
                used as a starting point for Uttarakhand travel. From here,
                travelers can continue towards the Garhwal region, hill
                stations and major pilgrimage destinations.
              </p>

              <p className="text-gray-700 leading-8 mb-4">
                Depending on your itinerary, a trip can combine several
                destinations instead of visiting only one location. For
                example, a journey may combine Haridwar and Rishikesh with
                hill stations like Mussoorie, Dhanaulti, pilgrimage destinations like Char Dham Temples or Himalayan
                sightseeing.
              </p>

              <p className="text-gray-700 leading-8">
                Gokeys of the Uttarakhand's top travel agencies can help travelers discuss the route, transportation
                and accommodation requirements before finalizing a tour.
              </p>

              <div className="flex flex-wrap gap-4 mt-7">

                <a
                  href="/services/taxi-service-haridwar/"
                  className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  View Taxi Services
                </a>

                <a
                  href="/services/hotel-booking-uttarakhand/"
                  className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold"
                >
                  Hotel Booking
                </a>

              </div>

            </div>
          </div>
        </section>

        {/* TOUR PLANNING */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              How We Help Plan Your Uttarakhand Tour
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  01
                </div>

                <h3 className="font-semibold mb-2">
                  Choose Destinations
                </h3>

                <p className="text-gray-600">
                  Tell us which places you want to visit in Uttarakhand.
                </p>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  02
                </div>

                <h3 className="font-semibold mb-2">
                  Share Travel Details
                </h3>

                <p className="text-gray-600">
                  Share your travel dates, group size and approximate trip
                  duration.
                </p>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  03
                </div>

                <h3 className="font-semibold mb-2">
                  Plan the Itinerary
                </h3>

                <p className="text-gray-600">
                  Discuss transportation, accommodation and the travel route.
                </p>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-green-700 mb-3">
                  04
                </div>

                <h3 className="font-semibold mb-2">
                  Confirm Your Trip
                </h3>

                <p className="text-gray-600">
                  Review the proposed arrangements before confirming your
                  travel plans.
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* TRANSPORT + HOTEL */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Transportation & Accommodation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* TAXI CARD */}
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

                  {/* Top accent */}
                  <div className="h-1.5 bg-green-700"></div>

                  <div className="p-8">

                    <div className="mb-5">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 text-xl">
                        🚕
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Taxi & Transportation
                    </h3>

                    <p className="text-gray-600 leading-7 mb-6">
                      Transportation is an important part of a Uttarakhand trip since Uttarakhand's hill regions are mainly accessible by road,
                      particularly when traveling between multiple destinations.
                      Vehicle arrangements can be planned according to your route,
                      travel dates and group size.
                    </p>

                    <a
                      href="/services/taxi-service-haridwar/"
                      className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition"
                    >
                      Taxi Services in Haridwar
                      <span className="ml-2">→</span>
                    </a>

                  </div>
                </div>


                {/* HOTEL CARD */}
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

                  {/* Top accent */}
                  <div className="h-1.5 bg-green-700"></div>

                  <div className="p-8">

                    <div className="mb-5">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 text-xl">
                        🏨
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Hotel Booking
                    </h3>

                    <p className="text-gray-600 leading-7 mb-6">
                      Gokeys offers a wide range of hotel booking options across
                      Uttarakhand, from budget hotels and comfortable stays to
                      resorts for travelers looking for a more convenient trip.
                    </p>

                    <a
                      href="/services/hotel-booking-uttarakhand/"
                      className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition"
                    >
                      Hotel Booking in Uttarakhand
                      <span className="ml-2">→</span>
                    </a>

                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
        {/* CHAR DHAM */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Char Dham and Pilgrimage Tours in Uttarakhand
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Uttarakhand is home to four important Hindu pilgrimage
              destinations. The Char Dham Yatra covering Yamunotri, Gangotri,
              Kedarnath and Badrinath is one of the state's most significant
              pilgrimage journeys.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Other important pilgrimage destinations include Haridwar,
              Rishikesh, Panch Prayags, Panch Kedar, Panch Badri Temple, Shakti peeth Temples and various temples across the Garhwal and Kumaon
              regions.
            </p>

            <p className="text-gray-700 leading-8">
              If your primary reason for visiting Uttarakhand is pilgrimage,
              Gokeys can help you explore suitable travel arrangements based
              on your dates and itinerary.
            </p>

            <a
              href="/services/char-dham-yatra-operators-haridwar/"
              className="inline-block mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Char Dham Yatra From Haridwar
            </a>

          </div>
        </section>

        {/* 2027 */}
        <section className="bg-green-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Plan Your Uttarakhand Trip for 2027
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                If you are planning a Uttarakhand trip in 2027, preparing
                your route and accommodation requirements in advance can make
                the planning process easier, especially during busy travel
                periods.
              </p>

              <p className="text-gray-700 leading-8 mb-4">
               As <a href="https://gokeys.in/blog/ardh-kumbh-mela-2027-haridwar-snan-details-tour">Ardh Kumbh Mela 2027 Haridwar</a> is going to happen in 2027 from January to April months, you can let us know your plan for visiting this holy ceremony celebrated in every 6 years and 12 years in Haridwar. We can make arrangement of various Tour Package from Delhi, Lucknow, Chandigarh and other parts of India to Ardh Kumbh Mela Haridwar.
              </p>

              <p className="text-gray-700 leading-8">
                Contact Gokeys with your preferred dates and destinations to
                discuss available travel arrangements.
              </p>

            </div>
          </div>
        </section>

        {/* WHY GOKEYS */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Why Choose Gokeys for Uttarakhand Travel?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Based in Haridwar
                </h3>

                <p className="text-gray-600 leading-7">
                  Gokeys India (Travel Agency in Haridwar Uttarakhand) is based in Haridwar with office located near Railway Station and focuses on travel
                  arrangements for Uttarakhand and destinations across India.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Multiple Travel Options
                </h3>

                <p className="text-gray-600 leading-7">
                  Travelers can easily book pilgrimage, sightseeing, family,
                  leisure and customized tour requirements.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Transportation Assistance
                </h3>

                <p className="text-gray-600 leading-7">
                  As we have own fleets of different taxi cabs, you can let us know you requirements and we will serve accordingly.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Accommodation Assistance
                </h3>

                <p className="text-gray-600 leading-7">
                  Hotel accommodation requirements can be booked with Gokeys India for all over Uttarakhand.
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* TRAVEL TIPS */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Things to Consider When Planning a Uttarakhand Tour
              </h2>

              <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-7">

                <li>
                  Decide which destinations you want to cover before booking
                  transportation.
                </li>

                <li>
                  Consider the travel time between mountain destinations when
                  creating your itinerary.
                </li>

                <li>
                  Choose accommodation according to your route and budget.
                </li>

                <li>
                  Keep some flexibility for mountain weather and road
                  conditions.
                </li>

                <li>
                  For pilgrimage journeys, check official registration and
                  travel requirements.
                </li>

                <li>
                  Confirm what is included in your selected tour package.
                </li>

              </ul>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions About Uttarakhand Tours
            </h2>

            <div className="space-y-7">

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Does Gokeys provide Uttarakhand tour packages?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Gokeys India provides Uttarakhand tour planning and
                  travel packages covering pilgrimage, family, sightseeing
                  and customized trips, depending on the selected itinerary.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book an Uttarakhand tour from Haridwar?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, as Gokeys India is Haridwar Based Travel Agency and provides various Uttarakhand Tour Packages, also Haridwar is starting point for various Uttarakhand destinations, so you can easily plan a trip from Haridwar.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Which places can I visit on a Uttarakhand tour?
                </h3>

                <p className="text-gray-700 leading-7">
                  Popular destinations include Haridwar, Rishikesh, Mussoorie,
                  Nainital, Auli, Kedarnath, Badrinath, Gangotri, Yamunotri,
                  Valley of Flowers and other Himalayan destinations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Does Gokeys offer Char Dham Yatra packages?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Gokeys India provides Char Dham Yatra travel
                  Tour Packages covering Yamunotri, Gangotri, Kedarnath and
                  Badrinath according to the selected itinerary.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I customize my Uttarakhand tour?
                </h3>

                <p className="text-gray-700 leading-7">
                  Customized Uttarakhand travel plans can be discussed based
                  on your travel dates, group size, destinations,
                  accommodation requirements and transportation preferences.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can I contact Gokeys for an Uttarakhand tour?
                </h3>

                <p className="text-gray-700 leading-7">
                  You can contact Gokeys India by phone or WhatsApp at
                  +91 9045916770 and share your preferred destinations, travel
                  dates and group details.
                </p>
              </div>

            </div>

          </div>
        </section>

         <GoogleMap />

        {/* FINAL CTA */}
        <section className="bg-green-700 text-white">

          <div className="container mx-auto px-4 py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planning a Trip to Uttarakhand?
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              As one of the top travel agecies in Uttarakhand Tell Gokeys your preferred destinations, travel dates and group
              size. We can help you discuss transportation, accommodation and
              tour arrangements for your Uttarakhand trip.
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