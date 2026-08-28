import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in/";

export async function generateMetadata() {
  const title =
    "Travel Agency in Haridwar | Gokeys India – Uttarakhand Tours & Char Dham";

  const description =
    "Looking for a travel agency in Haridwar? Gokeys India offers Char Dham Yatra, Uttarakhand tour packages, taxi services, hotel bookings and customized travel services from Haridwar.";

  const url = `${siteUrl}/services/travel-agency-haridwar/`;

  return {
    title,
    description,

    keywords: [
      "travel agency in Haridwar",
      "travel agents in Haridwar",
      "tour operator in Haridwar",
      "travel company in Haridwar",
      "Haridwar travel agency",
      "Uttarakhand tour operator",
      "Char Dham Yatra operator in Haridwar",
      "Haridwar tour packages",
      "Uttarakhand tour packages",
      "Haridwar taxi service",
      "Haridwar cab service",
      "hotel booking in Uttarakhand",
      "best travel agency in Haridwar",
      "Top Travel Agency in Haridwar",
      "Travel Agency for Char Dham Yatra in Haridwar",
      "Tour Package Agency in Haridwar",
      "Local Travel Agency in Haridwar",
      "Registered Travel Agency in Haridwar",
      
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
          url: `${siteUrl}/images/travel-agency-haridwar.jpeg`,
          width: 1200,
          height: 630,
          alt: "Gokeys India Travel Agency in Haridwar",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/travel-agency-haridwar.jpeg`],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TravelAgencyHaridwarPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Travel Agency in Haridwar",
      url: "/services/travel-agency-haridwar/",
    },
  ]);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/travel-agency-haridwar.jpeg`,
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

  const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Travel Agency Services in Haridwar",
  serviceType: "Tour Operator, Taxi and Travel Agency Services",
  description: "Char Dham Yatra, Uttarakhand tour packages, taxi and cab services, hotel booking and customized travel assistance from Haridwar.",
  provider: { "@type": "TravelAgency", name: "Gokeys India", url: siteUrl },
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
        name: "Which travel services does Gokeys provide in Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Gokeys India provides tour packages, Char Dham Yatra arrangements, Uttarakhand tours, taxi and cab services, hotel bookings and customized travel assistance from Haridwar.",
        },
      },
      {
        "@type": "Question",
        name: "Does Gokeys provide Char Dham Yatra packages from Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India provides Char Dham Yatra travel services from Haridwar, including transportation, accommodation and itinerary assistance depending on the selected package.",
        },
      },
      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar for Uttarakhand travel?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, you can book a taxi from Gokeys Travel Agency Haridwar for your Haridwar Sightseeing or any Uttarakhand Trips like Char Dham Yatra, Winter Vacation to Auli, Chopta and Mussoorie, Harsil Valley Sightseeing and more.",
        },
      },
      {
        "@type": "Question",
        name: "Does Gokeys provide hotel booking in Uttarakhand?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, Gokeys Travel has various affiliated hotels in Uttarakhand with best contracted rates, so you can easily book a hotel with Gokeys for all over Uttarakhand.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact Gokeys India?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can contact Gokeys India by phone or WhatsApp at +91 9045916770. You can also email helpdesk@gokeys.in for travel assistance.",
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
                HARIDWAR TRAVEL & TOUR SERVICES
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Travel Agency in Haridwar for Uttarakhand Tours & Char Dham
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Gokeys India is a travel agency in Haridwar offering
                Char Dham Yatra, Uttarakhand tour packages, taxi and cab
                services, hotel bookings and customized travel assistance.
                Plan your Uttarakhand journey with a local travel team based
                in Haridwar. 
                </p>
                <p className="mt-6 text-lg text-gray-700 leading-8">Gokeys India is Top Travel agents from Haridwar with many years of experience in Travel Field. Contact Now and get the best customized trip to Uttarakhand with us.</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a
                  href="tel:+919045916770"
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  Call Us
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
              Travel Agency in Haridwar
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar is known for starting point of Garhwal Region like Char Dham Yatra Tours, Mussoorie, Chopta, Auli Winter Tours, Various Treks like Valley of flowers, Hemkund Sahib, famous winter treks like Kedarkantha, Deoria Tal, Tungnath and Chadrashila, Various Bugyal trek like Dayara Bugyal, Roopkund Trek and more. It also connect to the Kumaon Regions like Nainital, Corbett, Kausani, Almora and more Places.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              As Haridwar is well connected with roads, railway and by air to different cities of India, so one can easily reach Haridwar and then plan a travel to Uttarakhand various tourist destinations. If you are planning a trip to Uttarakhand and looking for best travel agency in Haridwar then you can opt for Gokeys India as your travel partner.
            </p>

            <p className="text-gray-700 leading-8">
              Whether you are planning a Char Dham Yatra, a Kedarnath trip,
              a family holiday in Uttarakhand or a taxi journey from Haridwar,
              our team can help you organize the major parts of your trip.
            </p>
          </div>
        </section>

                {/* Featured Images */}
                      <div className="my-10">
                                  <Image
                                    src="/images/travel-agency-haridwar.jpeg"
                                    alt="Travel Agency in Haridwar Gokeys India Top Travel Agents"
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
                Our Travel Services in Haridwar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Char Dham Yatra
                  </h3>
                  <p className="text-gray-600 leading-7">
                   Char Dham Yatra is one of the most visited religious trips in Uttarakhand, It is said that once a lifetime every Hindu should visit these sacred temples. So, we at Gokeys Offers various Char Dham Yatra Trip with customized packages. You can choose any package according to your needs to visit Char Dham with us.
                  </p>

                  <a
                    href="/tours/char-dham-yatra-2025-tour-package-from-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    View Char Dham Tours →
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Uttarakhand Tour Packages
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Uttarakhand has many tourist destinations, where you can plan your holidays, we as Haridwar based Travel agency Offers various Uttarakhand tour package like Winter Tours to Mussoorie, Auli and Chopta, Harsil Valley Trips, Char Dham Yatra, Nainital Corbett and Kumaon Trip, Chakrata, Dehradun 3 Days Trip and more alike.
                  </p>

                  <a
                    href="/tours"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Explore Tours →
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Taxi & Cab Services
                  </h3>

                  <p className="text-gray-600 leading-7">
                    We have own fleet of transportations like Swift Dzire, Ertiga Cab, Innova, Innova Crysta, Kia Carens, Tempo Travellers and also various contracted vehicles for your trip. You can easily book a taxi with Gokeys India for your Uttarakhand Trip.
                  </p>

                  <a
                    href="/services/taxi-services-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Taxi Services →
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Hotel Booking
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Hotel booking is included as part of most packages, so travelers don't need to arrange it separately. We as Haridwar based Travel Agency provides various hotel booking in different locations of Uttarakhand like Char Dham Locations Mussoorie, Nainital, Rishikesh, Haridwar etc.
                  </p>

                  <a
                    href="/hotels/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Find Hotels →
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Pilgrimage Tours
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Uttarakhand, as known as Devbhoomi means land of God, so it has various pilgrimage tours like Char Dham Trip to sacred Badrinath, Kedarnath, Gangotri and Yamunotri Temples, Kainchi Dham Nainital, Golu Devta Temple, Shaktipeeth like Dhari Devi Temple, Kunjapuri Temple, Surkanda Mata Temple and more, Panch Prayag five holy confluences and many more temples.
                  </p>

                  <a
                    href="/destinations/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Explore Destinations →
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Customized Tours
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Need a different itinerary? Speak with our team about
                    creating a trip based on your dates, destinations,
                    transportation and accommodation requirements. We are happy to create a customized trip itinerary according to your needs.
                  </p>

                  <a
                    href="tel:+919045916770"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Discuss Your Trip →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY GOKEYS */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Gokeys India for Your Uttarakhand Trip?
            </h2>

            <div className="space-y-5 text-gray-700 leading-8">
              <p>
                As one of the top travel agencies in Uttarakhand, we are serving our customers since many years. So, choosing a local travel agency can make planning a trip to
                Uttarakhand easier, particularly when your itinerary involves
                several mountain destinations and pilgrimage routes.
              </p>

              <p>
                Gokeys India is based in Haridwar and has been involved in
                travel services since 2011 through Travel In Himalayas and
                since 2019 under the Gokeys India brand.
              </p>

              <p>
                Our services cover different parts of the travel journey,
                including transportation, accommodation, tour planning and
                travel assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              <div className="border rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-2">
                  Local Haridwar Base
                </h3>
                <p className="text-gray-600">
                  Our office is located on Railway Road in Haridwar, making it
                  convenient for travelers beginning their Uttarakhand journey.
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-2">
                  Uttarakhand Experience
                </h3>
                <p className="text-gray-600">
                  Our travel services focus strongly on Uttarakhand and
                  Himalayan journeys.
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-2">
                  Complete Travel Assistance
                </h3>
                <p className="text-gray-600">
                  We can assist with tours, hotels, transportation and other
                  travel arrangements.
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="font-semibold text-lg mb-2">
                  Customized Planning
                </h3>
                <p className="text-gray-600">
                  Travelers can opt for their requirements with our team when
                  an existing package does not fit their plans.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR DESTINATIONS */}
        <section className="bg-green-50">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Popular Uttarakhand Destinations
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <a
                  href="/destinations/haridwar/"
                  className="bg-white rounded-lg p-5 font-semibold hover:shadow-md"
                >
                  Haridwar
                </a>

                <a
                  href="/destinations/rishikesh/"
                  className="bg-white rounded-lg p-5 font-semibold hover:shadow-md"
                >
                  Rishikesh
                </a>

                <a
                  href="/destinations/kedarnath/"
                  className="bg-white rounded-lg p-5 font-semibold hover:shadow-md"
                >
                  Kedarnath
                </a>

                <a
                  href="/destinations/badrinath/"
                  className="bg-white rounded-lg p-5 font-semibold hover:shadow-md"
                >
                  Badrinath
                </a>

                <a
                  href="/destinations/gangotri/"
                  className="bg-white rounded-lg p-5 font-semibold hover:shadow-md"
                >
                  Gangotri
                </a>

                <a
                  href="/destinations/yamunotri/"
                  className="bg-white rounded-lg p-5 font-semibold hover:shadow-md"
                >
                  Yamunotri
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CHAR DHAM */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Char Dham Yatra from Haridwar
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar is a popular starting point for travelers planning
              their Char Dham Yatra. The traditional circuit covers the four
              major pilgrimage destinations of Yamunotri, Gangotri, Kedarnath
              and Badrinath.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              A Char Dham journey requires careful planning because travel
              involves mountain roads, changing weather, accommodation
              availability and different distances between destinations.
            </p>

            <p className="text-gray-700 leading-8">
              If you are planning a Char Dham Yatra from Haridwar, our team
              can help with package selection, transportation, accommodation
              and itinerary planning.
            </p>

            <a
              href="/tours/char-dham-yatra-2025-tour-package-from-haridwar/"
              className="inline-block mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              View Char Dham Yatra Packages
            </a>
          </div>
        </section>

           <section className="container mx-auto px-4 py-10">
            <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-5 text-center">
            Uttarakhand Tour Packages & Starting Prices
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
                ["Char Dham Yatra Standard Package", "10 Days", "₹21,000"],
                ["Char Dham Yatra Deluxe Package", "10 Days", "₹28,000"],
                ["Badrinath Kedarnath Tour Package", "6 Days", "₹13,500"],
                ["Gangotri Yamunotri Dham Tour Package", "5 Days", "₹12,000"],
                 ["2 Days Mussoorie Tour Package", "2 Days", "₹5,500"],
                 ["Harsil Valley Tour Package", "3 Days", "₹7,500"],
                 ["Badrinath Dham Tour Package", "3 Days", "₹6,500"],
                 ["Kedarnath Dham Tour Package", "4 Days", "₹7,500"],
                 ["Auli Chopta Tour Package", "5 Days", "₹11,500"],
                 ["Nainital Kainchi Dham Tour Package", "3 Days", "₹7,500"],
                 ["Nainital Corbett Tour Package", "4 Days", "₹10,500"],
                 ["Kedar Kantha Trekking Tour Package", "6 Days", "₹7,500"],
                 ["Haridwar Rishikesh Tour Package", "3 Days", "₹6,500"],
                 ["Tungnath Chandrashila Chopta Tour Package", "3 Days", "₹7,500"],
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

        {/* HOW BOOKING WORKS */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                How to Plan Your Trip With Gokeys
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    01
                  </div>
                  <h3 className="font-semibold mb-2">
                    Tell Us Your Plan
                  </h3>
                  <p className="text-gray-600">
                    Share your travel dates, destinations and requirements.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    02
                  </div>
                  <h3 className="font-semibold mb-2">
                    Choose Your Package
                  </h3>
                  <p className="text-gray-600">
                    Review available tour, transport and accommodation
                    options.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    03
                  </div>
                  <h3 className="font-semibold mb-2">
                    Confirm Arrangements
                  </h3>
                  <p className="text-gray-600">
                    Finalize the itinerary and required travel services.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-3">
                    04
                  </div>
                  <h3 className="font-semibold mb-2">
                    Start Your Journey
                  </h3>
                  <p className="text-gray-600">
                    Begin your Uttarakhand journey from Haridwar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Which travel services does Gokeys provide in Haridwar?
                </h3>
                <p className="text-gray-700 leading-7">
                  Gokeys India provides tour packages, Char Dham Yatra
                  arrangements, Uttarakhand tours, taxi and cab services,
                  hotel bookings and customized travel assistance from
                  Haridwar.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Does Gokeys provide Char Dham Yatra packages from Haridwar?
                </h3>
                <p className="text-gray-700 leading-7">
                  Yes. Gokeys India provides Char Dham Yatra travel services
                  from Haridwar, including transportation, accommodation and
                  itinerary assistance depending on the selected package.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a taxi from Haridwar for Uttarakhand travel?
                </h3>
                <p className="text-gray-700 leading-7">
                 Yes, you can book a taxi from Gokeys Travel Agency Haridwar for your Haridwar Sightseeing or any Uttarakhand Trips like Char Dham Yatra, Winter Vacation to Auli, Chopta and Mussoorie, Harsil Valley Sightseeing and more.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Does Gokeys provide hotel booking in Uttarakhand?
                </h3>
                <p className="text-gray-700 leading-7">
                  Yes, Gokeys Travel has various affiliated hotels in Uttarakhand with best contracted rates, so you can easily book a hotel with Gokeys for all over Uttarakhand.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can I contact Gokeys India?
                </h3>
                <p className="text-gray-700 leading-7">
                  You can contact Gokeys India by phone or WhatsApp at
                  +91 9045916770. You can also email helpdesk@gokeys.in for
                  travel assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="bg-green-700 text-white">
          <div className="container mx-auto px-4 py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planning a Trip From Haridwar?
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Talk to Gokeys India about Char Dham Yatra, Uttarakhand tour
              packages, taxi services, hotel bookings or a customized trip.
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