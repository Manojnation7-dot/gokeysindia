import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in";

export async function generateMetadata() {
  const title =
    "Haridwar to Rishikesh Taxi | Cab Service & Booking";

  const description =
    "Book a Haridwar to Rishikesh taxi with Gokeys India. Private cab services for families, couples, groups and travelers visiting Rishikesh from Haridwar.";

  const url = `${siteUrl}/services/haridwar-to-rishikesh-taxi/`;

  return {
    title,
    description,

    keywords: [
      "Haridwar to Rishikesh Taxi",
      "Haridwar to Rishikesh Cab",
      "Haridwar to Rishikesh taxi service",
      "Haridwar to Rishikesh cab service",
      "taxi from Haridwar to Rishikesh",
      "cab from Haridwar to Rishikesh",
      "Haridwar Rishikesh taxi booking",
      "Haridwar Rishikesh cab booking",
      "Haridwar to Rishikesh one way taxi",
      "Haridwar to Rishikesh round trip taxi",
      "Haridwar Railway Station to Rishikesh taxi",
      "Haridwar to Rishikesh private cab",
      "Rishikesh taxi from Haridwar",
      "Haridwar taxi service",
      "Rishikesh cab service",
      "Travel Agents in Haridwar for Rishikesh Trip",
      "Travel Agency in Haridwar for Rishikesh Tour",
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
          url: `${siteUrl}/images/haridwar-to-rishikesh-taxi.jpeg`,
          width: 1200,
          height: 630,
          alt: "Haridwar to Rishikesh Taxi Service - Gokeys India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}/images/haridwar-to-rishikesh-taxi.jpeg`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function HaridwarToRishikeshTaxiPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Haridwar to Rishikesh Taxi",
      url: "/services/haridwar-to-rishikesh-taxi/",
    },
  ]);

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/haridwar-to-rishikesh-taxi.jpeg`,
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
        "@type": "City",
        name: "Rishikesh",
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
    name: "Haridwar to Rishikesh Taxi Service",
    serviceType: "Intercity Taxi and Cab Service",
    description:
      "Private taxi and cab booking with Gokeys India Haridwar for travelers travelling between Haridwar and Rishikesh.",
    provider: {
      "@type": "TravelAgency",
      name: "Gokeys India",
      url: siteUrl,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Haridwar",
      },
      {
        "@type": "City",
        name: "Rishikesh",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar to Rishikesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India provides taxi and cab booking for travelers travelling from Haridwar to Rishikesh, subject to vehicle availability.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar Railway Station to Rishikesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Bookings are available for Sedan, SUV and Travellers cab from Haridwar to Rishikesh, so you don't have to worry about any group size.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a round-trip taxi from Haridwar to Rishikesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Round-Trip Rishikesh and Full Day Rishikesh Sightseeing cabs are available with us. You can visit our office located near railway station haridwar and book directly a cab. ",
        },
      },

      {
        "@type": "Question",
        name: "Is Haridwar to Rishikesh taxi suitable for families?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, we have Ertiga, Kia Carens, Innova, Innova Crysta cabs and for big groups we have Tempo Travellers, so yes you can take any taxi as per the group size, and it will be about 45 min drive to reach Rishikesh, which is more comfortable with cabs, where you can easily put your luggage on Carrier.",
        },
      },

      {
        "@type": "Question",
        name: "Can I continue from Rishikesh to other Uttarakhand destinations?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, Rishikesh is well known for starting point of various places like Char Dham, Dhanaulti Kanatal, Tehri Lake, Whole Garhwal regions and more.",
        },
      },

      {
        "@type": "Question",
        name: "How can I book a Haridwar to Rishikesh taxi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Contact Gokeys India by phone or WhatsApp at +91 9045916770 and share your travel date, pickup location, destination, passenger count and luggage requirements.",
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
                HARIDWAR TO RISHIKESH TAXI SERVICE
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Haridwar to Rishikesh Taxi & Cab Service
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Looking for a taxi from Haridwar to Rishikesh? Gokeys India the top travel agency in Haridwar offer best taxi charges to Rishikesh with Local Drivers and comfortable vehicles.
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

        {/* INTRO */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Taxi from Haridwar to Rishikesh
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar and Rishikesh are two of the most popular destinations
              in Uttarakhand. Where Haridwar is mainly known for religious Purpose but Rishikesh is known for Religious, Yoga and Meditations with various adventure activities. 
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Gokeys India, a Haridwar-based travel agency, provide cabs, car rental, roundtrips, Sightseeing and local tour package to various places like Rishikesh, Mussoorie, Tehri Lake, Char Dham Yatra and more.
            </p>

            <p className="text-gray-700 leading-8">
              If you are coming to Haridwar Railway Station, Bus Stand and want to take a pickup from Haridwar to Rishikesh then you can let us know about your itinerary, we will help you to book a best and comfortable cab.
            </p>

          </div>

        </section>

                {/* Featured Images */}
                      <div className="my-10">
                                  <Image
                                    src="/images/haridwar-to-rishikesh-taxi.jpeg"
                                    alt="Haridwar to Rishikesh taxi services with Gokeys India"
                                    width={1200}
                                    height={675}
                                    className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-sm"
                                    priority
                                  />
                                </div>

        {/* ROUTE INFO */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Haridwar to Rishikesh Taxi Route
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Pickup
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Haridwar Railway Station, hotel or another agreed pickup
                    location in Haridwar.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Destination
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Rishikesh Hotels, Ashrams, Triveni Ghat, Tapovan, Phoolchatti, Byasi, Kodiyala, Ram Jhulla, Laxman Jhulla and more.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Travel Type
                  </h3>

                  <p className="text-gray-600 leading-7">
                    One-way or round-trip taxi arrangements can be booked
                    according to your itinerary.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* WHO IT IS FOR */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Who Can Book a Haridwar to Rishikesh Taxi?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Families
                </h3>

                <p className="text-gray-600 leading-7">
                  Suitable for families carrying luggage and traveling
                  together between Haridwar and Rishikesh.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Couples
                </h3>

                <p className="text-gray-600 leading-7">
                  Private transportation can make it easier to plan your
                  journey around your own schedule.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Groups
                </h3>

                <p className="text-gray-600 leading-7">
                  Discuss vehicle options according to your group size and
                  luggage requirements.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Pilgrims
                </h3>

                <p className="text-gray-600 leading-7">
                  Travelers visiting Haridwar and Rishikesh as part of a
                  pilgrimage itinerary can book according to their transportation requirements.
                </p>

              </div>

            </div>

          </div>

        </section>

               <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Haridwar to Rishikesh Taxi and Car Rental Services
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
                  ["Haridwar to Rishikesh City", "30 km", "₹1,800"],
                  ["Haridwar to Geeta Bhawan", "~40 km", "₹2,200"],
                  ["Haridwar to Yog Nagri Rishikesh Railway Station", "~30 km", "₹1,800"],
                  ["Haridwar to Mohan Chatti, Phool Chatti Resorts Rishikesh", "~60 km", "₹2,800"],
                  ["Haridwar to Byasi Resorts Rishikesh", "~70 km", "₹3,200"],
                  ["Haridwar to Rishikesh Full Day Sightseeing", "~80 km round trip", "₹3,000"],
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

        {/* PICKUP LOCATIONS */}
        <section className="bg-green-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Haridwar Pickup Locations for Rishikesh Taxi
              </h2>

              <p className="text-gray-700 leading-8 mb-6">
                When making a taxi enquiry, share your exact pickup location
                so that the travel arrangement can be planned correctly.
                Common pickup points may include:
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <li className="bg-white rounded-lg p-4">
                  Haridwar Railway Station
                </li>

                <li className="bg-white rounded-lg p-4">
                  Hotels in Haridwar
                </li>

                <li className="bg-white rounded-lg p-4">
                  Haridwar city areas like Bhupatwala, Ranipur More, Sector 4, Roshnabad, BHEL, Jwalapur and more.
                </li>

                <li className="bg-white rounded-lg p-4">
                  Other agreed pickup locations
                </li>

              </ul>

              <a
                href="/services/haridwar-railway-station-taxi/"
                className="inline-block mt-7 text-green-700 font-semibold"
              >
                Haridwar Railway Station Taxi →
              </a>

            </div>

          </div>

        </section>

       {/* ONE WAY / ROUND TRIP */}
          <section className="bg-gray-50">
            <div className="container mx-auto px-4 py-14">

              <div className="max-w-5xl mx-auto">

                {/* Section Heading */}
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    One-Way & Round-Trip Taxi Options
                  </h2>

                  <p className="mt-3 text-gray-600 max-w-2xl mx-auto leading-7">
                    Choose a convenient taxi option for travelling between
                    Haridwar and Rishikesh based on your travel plans.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* ONE WAY */}
                  <div
                    className="bg-white rounded-2xl border border-gray-200
                              p-6 md:p-7 shadow-sm
                              flex flex-col h-full
                              transition-all duration-300
                              hover:-translate-y-1 hover:shadow-md
                              hover:border-green-200"
                  >

                    <div className="flex items-center gap-4 mb-5">

                      <div
                        className="w-12 h-12 rounded-full bg-green-50
                                  flex items-center justify-center
                                  shrink-0"
                      >
                        <span className="text-xl">→</span>
                      </div>

                      <h3 className="text-2xl font-semibold text-green-700">
                        One-Way Taxi
                      </h3>

                    </div>

                    <p className="text-gray-700 leading-7">
                      One-way taxi service to Rishikesh can be booked by contacting
                      us by phone or WhatsApp. You can also visit our office in
                      Haridwar to discuss your travel requirements and book a cab.
                    </p>

                    <div className="mt-auto pt-5">
                      <span className="text-sm font-medium text-gray-500">
                        Haridwar → Rishikesh
                      </span>
                    </div>

                  </div>


                  {/* ROUND TRIP */}
                  <div
                    className="bg-white rounded-2xl border border-gray-200
                              p-6 md:p-7 shadow-sm
                              flex flex-col h-full
                              transition-all duration-300
                              hover:-translate-y-1 hover:shadow-md
                              hover:border-green-200"
                  >

                    <div className="flex items-center gap-4 mb-5">

                      <div
                        className="w-12 h-12 rounded-full bg-green-50
                                  flex items-center justify-center
                                  shrink-0"
                      >
                        <span className="text-xl">↔</span>
                      </div>

                      <h3 className="text-2xl font-semibold text-green-700">
                        Round-Trip Taxi
                      </h3>

                    </div>

                    <p className="text-gray-700 leading-7">
                      If you are planning a round trip or sightseeing tour from
                      Haridwar to Rishikesh, share your travel requirements with us.
                      We can help you choose a suitable cab based on your itinerary.
                    </p>

                    <div className="mt-auto pt-5">
                      <span className="text-sm font-medium text-gray-500">
                        Haridwar → Rishikesh → Haridwar
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </section>

        {/* RISHIKESH TRAVEL */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Continue Your Uttarakhand Journey from Rishikesh
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                Rishikesh can also be part of a wider Uttarakhand itinerary.
                Depending on your travel plans, you may continue towards
                other destinations like Kunjapuri, Char Dham Yatra, Dhanaulti, Mussoorie, Kanatal, Pauri Garhwal, Rudraprayag, Dhari Devi Temple, Devprayag and more locations.
              </p>

              <p className="text-gray-700 leading-8 mb-5">
                If you are planning a larger Uttarakhand trip like Auli Chopta Snow Tour, Trekking Trips to Gurson Bugyal Valley of Flower or any other place, Religious trip to Char Dham yatra, then Gokeys India
                can help you discuss tour, taxi and accommodation requirements
                together.
              </p>

              <a
                href="/services/uttarakhand-tour-operators/"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Explore Uttarakhand Tour Services
              </a>

            </div>

          </div>

        </section>

        {/* CHAR DHAM CONNECTION */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Haridwar, Rishikesh & Char Dham Yatra
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Some travelers combine Haridwar and Rishikesh with a pilgrimage
              journey through Uttarakhand. If your trip includes Kedarnath,
              Badrinath, Gangotri or Yamunotri, it is useful to plan your
              complete transportation itinerary in advance.
            </p>

            <p className="text-gray-700 leading-8 mb-5">
              Gokeys India can help you to book transportation and tour
              requirements for a wider Char Dham journey.
            </p>

            <a
              href="/services/char-dham-yatra-operators-haridwar/"
              className="inline-block text-green-700 font-semibold"
            >
              Char Dham Yatra Services →
            </a>

          </div>

        </section>

        {/* HOW TO BOOK */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                How to Book a Haridwar to Rishikesh Taxi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    01
                  </div>

                  <h3 className="font-semibold mb-2">
                    Choose Your Date
                  </h3>

                  <p className="text-gray-600">
                    Tell us the date you plan to travel.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    02
                  </div>

                  <h3 className="font-semibold mb-2">
                    Share Pickup
                  </h3>

                  <p className="text-gray-600">
                    Provide your hotel, railway station or other pickup point.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    03
                  </div>

                  <h3 className="font-semibold mb-2">
                    Tell Us Your Group Size
                  </h3>

                  <p className="text-gray-600">
                    Share passenger and luggage requirements.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    04
                  </div>

                  <h3 className="font-semibold mb-2">
                    Confirm Arrangement
                  </h3>

                  <p className="text-gray-600">
                    Discuss the available taxi option and confirm your travel.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* WHY GOKEYS */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Why Book Your Haridwar Taxi With Gokeys?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Haridwar-Based Travel Team
                </h3>

                <p className="text-gray-600 leading-7">
                  Gokeys India a top Travel Agency is based in Haridwar and focuses on travel
                  services across Uttarakhand.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Local & Outstation Travel
                </h3>

                <p className="text-gray-600 leading-7">
                  We provide local car rental and outstation like Delhi, Agra, Shimla and more places Cab Services.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Complete Travel Assistance
                </h3>

                <p className="text-gray-600 leading-7">
                  Taxi arrangements can be booked together with hotels,
                  tours and pilgrimage travel.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Direct Enquiry
                </h3>

                <p className="text-gray-600 leading-7">
                  Contact the team directly and share your actual itinerary
                  instead of choosing a generic travel package.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RELATED SERVICES */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Related Travel Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <a
                  href="/services/taxi-services-haridwar/"
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Taxi Services in Haridwar
                  </h3>

                  <p className="text-gray-600">
                    Explore taxi and cab services for local and outstation
                    travel from Haridwar.
                  </p>
                </a>

                <a
                  href="/services/haridwar-railway-station-taxi/"
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Haridwar Railway Station Taxi
                  </h3>

                  <p className="text-gray-600">
                    Arrange transportation from Haridwar Railway Station to
                    Rishikesh and other destinations.
                  </p>
                </a>

                <a
                  href="/services/travel-agency-haridwar/"
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Travel Agency in Haridwar
                  </h3>

                  <p className="text-gray-600">
                    Plan tours, hotels, taxis and pilgrimage journeys with
                    Gokeys India.
                  </p>
                </a>

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

            <div className="space-y-7">

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a taxi from Haridwar to Rishikesh?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Gokeys India provides taxi and cab booking for travelers travelling from Haridwar to Rishikesh, subject to vehicle availability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a taxi from Haridwar Railway Station to
                  Rishikesh?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Bookings are available for Sedan, SUV and Travellers cab from Haridwar to Rishikesh, so you don't have to worry about any group size.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a round-trip taxi from Haridwar to Rishikesh?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Round-Trip Rishikesh and Full Day Rishikesh Sightseeing cabs are available with us. You can visit our office located near railway station haridwar and book directly a cab. 
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Is Haridwar to Rishikesh taxi suitable for families?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, we have Ertiga, Kia Carens, Innova, Innova Crysta cabs and for big groups we have Tempo Travellers, so yes you can take any taxi as per the group size, and it will be about 45 min drive to reach Rishikesh, which is more comfortable with cabs, where you can easily put your luggage on Carrier.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I continue from Rishikesh to other Uttarakhand
                  destinations?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, Rishikesh is well known for starting point of various places like Char Dham, Dhanaulti Kanatal, Tehri Lake, Whole Garhwal regions and more.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can I book a Haridwar to Rishikesh taxi?
                </h3>

                <p className="text-gray-700 leading-7">
                  Contact Gokeys India by phone or WhatsApp at +91 9045916770
                  and share your travel date, pickup location, destination,
                  passenger count and luggage requirements.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="bg-green-700 text-white">

          <div className="container mx-auto px-4 py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Book a Haridwar to Rishikesh Taxi
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Book now a taxi to Rishikesh from Haridwar with Gokeys India. We have own fleet of different transportations like Dzire, Aura, Ertiga, Innova, Kia Carens, Tempo Travellers and more.
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