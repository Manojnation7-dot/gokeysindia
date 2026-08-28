import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in";

export async function generateMetadata() {
  const title =
    "Haridwar to Dehradun Taxi | Dehradun Airport Cab";

  const description =
    "Book a Haridwar to Dehradun taxi or Dehradun Airport cab with Gokeys India. Private taxi services from Haridwar Railway Station, hotels and other locations.";

  const url = `${siteUrl}/services/haridwar-to-dehradun-taxi/`;

  return {
    title,
    description,

    keywords: [
      "Haridwar to Dehradun Taxi",
      "Haridwar to Dehradun Cab",
      "Haridwar to Dehradun Taxi Service",
      "Haridwar to Dehradun Cab Service",
      "Haridwar to Dehradun Airport Taxi",
      "Haridwar to Dehradun Airport Cab",
      "Haridwar to Jolly Grant Airport Taxi",
      "Haridwar to Dehradun Airport Taxi Service",
      "Haridwar Railway Station to Dehradun Taxi",
      "Haridwar Railway Station to Dehradun Airport Taxi",
      "Dehradun Airport to Haridwar Taxi",
      "Jolly Grant Airport to Haridwar Taxi",
      "Haridwar to Dehradun One Way Taxi",
      "Haridwar to Dehradun Round Trip Taxi",
      "Haridwar Private Cab Service",
      "Haridwar Taxi Service",
      "Dehradun Taxi Service",
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
          url: `${siteUrl}/images/haridwar-to-dehradun-taxi.jpeg`,
          width: 1200,
          height: 630,
          alt: "Haridwar to Dehradun Taxi and Airport Cab Service",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}/images/haridwar-to-dehradun-taxi.jpeg`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function HaridwarToDehradunTaxiPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Haridwar to Dehradun Taxi",
      url: "/services/haridwar-to-dehradun-taxi/",
    },
  ]);

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/haridwar-to-dehradun-taxi.jpeg`,
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
        name: "Dehradun",
      },
      {
        "@type": "Airport",
        name: "Jolly Grant Airport",
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
    name: "Haridwar to Dehradun Taxi and Airport Cab Service",
    serviceType: "Taxi and Cab Service",
    description:
      "Private taxi and cab booking assistance between Haridwar, Dehradun and Dehradun Airport.",
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
        name: "Dehradun",
      },
      {
        "@type": "Airport",
        name: "Jolly Grant Airport",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar to Dehradun?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India provides taxi and cab booking for travelers travelling from Haridwar to Dehradun, Dehradun Airport Jolly Grant, City and Mussoorie as well. subject to vehicle availability.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar to Dehradun Airport?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Cabs for Dehradun Airport available from Haridwar with Minimum Charges like ₹1,800/-, you can share your travel date, pickup location and flight details and we can book accordingly.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a taxi from Haridwar Railway Station to Dehradun Airport?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Our office is located near Haridwar Railway Station, so cabs are available at any time to Dehradun Airport, you can book with us.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a Dehradun Airport to Haridwar taxi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Just share your flight arrival details and preferred destination in Haridwar, and we can arrange a taxi accordingly.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a one-way taxi from Haridwar to Dehradun?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. One-way taxi are available from Haridwar to Dehradun, Dehradun Airport and other destinations. Share your travel date, pickup location and destination to book your cabs.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a round-trip taxi from Haridwar to Dehradun?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Round-trip Taxis from Haridwar to Dehradun are available with us (Gokeys India) and you can book via Contacting us at 9045916770 or Just simply WhatsApp us you requirements, we will book and send you details.",
        },
      },

      {
        "@type": "Question",
        name: "How can I book a Haridwar to Dehradun taxi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "For booking a cab with us you can just call or WhatsApp us at +919045916770 and you will get details of your taxi booking, we will send you the cab details and driver contact number for your travel.",
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
                HARIDWAR TO DEHRADUN TAXI SERVICE
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Haridwar to Dehradun Taxi & Dehradun Airport Cab Service
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Looking for a taxi from Haridwar to Dehradun or Dehradun
                Airport? Gokeys India is leading travel agency in Haridwar for various cab bookings, car rental process to Dehradun City, Dehradun Airport and Dehradun Railway Station with Round-Trip As well.
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
              {/* Featured Images */}
              <div className="my-10">
                          <Image
                            src="/images/haridwar-to-dehradun-taxi.jpeg"
                            alt="Haridwar to Dehradun Taxi Services"
                            width={1200}
                            height={675}
                            className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-sm"
                            priority
                          />
                        </div>

        {/* INTRO */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Haridwar to Dehradun Taxi Service
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar and Dehradun are important travel destinations in
              Uttarakhand and are frequently connected as part of a wider
              Uttarakhand journey. A private taxi can be a convenient option
              for travelers who want direct transportation between the two
              cities.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Dehradun is Capital City of Uttarakhand, and also known for its proximity to Mussoorie, Rishikesh and other Uttarakhand destinations. Travelers can also use Dehradun Airport (Jolly Grant Airport) for onward flights. So Gokeys India provides cab services to various places in Dehradun and nearby.
            </p>

            <p className="text-gray-700 leading-8">
              You can also enquire about transportation to or from Dehradun
              Airport, commonly known as Jolly Grant Airport, when planning
              your flight journey.
            </p>

          </div>

        </section>

         <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Haridwar to Dehradun taxi and Car rental Services
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
                  ["Haridwar to Dehradun City", "60 km", "₹2,200"],
                  ["Haridwar to Dehradun Airport", "~40 km", "₹1,800"],
                  ["Haridwar to Dehradun Railway Station", "~60 km", "₹2,200"],
                  ["Haridwar to Clock Tower Dehradun", "~60 km", "₹2,400"],
                  ["Haridwar to Mussoorie", "~90 km", "₹3,500"],
                  ["Full-Day Dehradun Sightseeing Tour (from Haridwar)", "~150 km round trip", "₹3,000"],
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

        {/* AIRPORT */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Haridwar to Dehradun Airport Taxi
              </h2>

              <p className="text-gray-700 leading-8 mb-5">
                If you have a flight from Dehradun Airport, and you want to book cab from Haridwar then you can simply let us know you travel plans and we will arrange a taxi for you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Hotel Pickup
                  </h3>

                  <p className="text-gray-600 leading-7">
                    We can directly pick you up from your hotel in Haridwar and drop you at Dehradun Airport.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Railway Station Pickup
                  </h3>

                  <p className="text-gray-600 leading-7">
                   We are located near the railway station Haridwar, so we can pick you up from Haridwar Railway Station and drop you at Dehradun Airport and Dehradun City.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Flight Transfers
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Share your flight schedule when making an airport taxi
                    enquiry and booking.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* AIRPORT RETURN */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Dehradun Airport to Haridwar Taxi
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Arriving at Dehradun Airport and travelling to Haridwar? You
              can also Book you taxi or cab with Gokeys India at best prices. 
            </p>

            <p className="text-gray-700 leading-8">
              We just need your flight arrival details and your preferred destination in Haridwar, and we can arrange a taxi accordingly.
            </p>

          </div>

        </section>

        {/* ROUTE OPTIONS */}
        <section className="bg-green-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Haridwar to Dehradun Taxi Booking Options
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Haridwar to Dehradun
                  </h3>

                  <p className="text-gray-600 leading-7">
                    All Types of Vehicles are available for Haridwar to Dehradun City, Mussoorie and other nearby destinations. You can share your travel date, pickup location and destination to book your cabs.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Haridwar to Airport
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Book a taxi from Haridwar to Dehradun Airport (Jolly Grant Airport) for your flight journey. Share your travel date, pickup location and flight details to book your cabs.
                  </p>

                </div>

                <div className="bg-white rounded-xl p-6">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Airport to Haridwar
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Book a taxi from Dehradun Airport to hotels or other
                    destinations in Haridwar. Share your travel date, pickup location and destination to book your cabs.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* PICKUP */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Haridwar Pickup Locations
            </h2>

            <p className="text-gray-700 leading-8 mb-6">
              Tell us your exact pickup location when making a taxi enquiry.
              Common pickup points may include:
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <li className="border rounded-lg p-4">
                Haridwar Railway Station
              </li>

              <li className="border rounded-lg p-4">
                Hotels in Haridwar
              </li>

              <li className="border rounded-lg p-4">
                Haridwar city areas
              </li>

              <li className="border rounded-lg p-4">
                Other agreed pickup locations
              </li>

            </ul>

          </div>

        </section>

     {/* ONE WAY / ROUND TRIP */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                One-Way & Round-Trip Taxi Services
              </h2>

              <p className="mt-3 text-gray-600 max-w-2xl mx-auto leading-7">
                Choose a taxi option that fits your travel plans between
                Haridwar, Dehradun and Dehradun Airport.
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
            If you only need transportation from Haridwar to Dehradun,
            or from Haridwar to Dehradun Airport, you can enquire about
            a one-way taxi booking based on your travel requirements.
          </p>

          <div className="mt-auto pt-5">
            <span className="text-sm font-medium text-gray-500">
              Haridwar → Dehradun
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
                  If your itinerary requires returning to Haridwar after
                  visiting Dehradun, you can discuss a round-trip taxi
                  booking based on your travel schedule and requirements.
                </p>

                <div className="mt-auto pt-5">
                  <span className="text-sm font-medium text-gray-500">
                    Haridwar → Dehradun → Haridwar
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

        {/* WHO CAN BOOK */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Who Can Book This Taxi Service?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Families
                </h3>

                <p className="text-gray-600 leading-7">
                  Convenient private transportation for families travelling
                  with luggage carrier.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Airport Travelers
                </h3>

                <p className="text-gray-600 leading-7">
                  Travelers who need transportation between Haridwar and
                  Dehradun Airport.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Couples
                </h3>

                <p className="text-gray-600 leading-7">
                  Private cab travel for couples visiting Dehradun and
                  surrounding destinations.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Groups
                </h3>

                <p className="text-gray-600 leading-7">
                  Discuss suitable transportation based on group size and
                  luggage requirements.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* UTTARAKHAND CONNECTION */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Continue Your Uttarakhand Journey
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                Haridwar and Dehradun can both be used as starting points for
                wider Uttarakhand journeys. Depending on your itinerary, you
                may continue towards Rishikesh, Mussoorie, Nainital, Char Dham
                destinations and other parts of Uttarakhand.
              </p>

              <p className="text-gray-700 leading-8 mb-6">
                Gokeys India can help you discuss taxi, hotel and tour
                requirements for a larger Uttarakhand itinerary.
              </p>

              <a
                href="/services/uttarakhand-tour-operators/"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Uttarakhand Tour Services
              </a>

            </div>

          </div>

        </section>

        {/* CHAR DHAM */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Taxi Services for Char Dham Travelers
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Char Dham Yatra is one of the most popular pilgrimage journeys in Uttarakhand. If your travel plans include visiting Kedarnath, Badrinath, Gangotri or Yamunotri, you can discuss your complete itinerary with the Gokeys India team.
            </p>

            <p className="text-gray-700 leading-8 mb-5">
              If you want to visit Do Dham like Kedarnath and Badrinath or Gangotri and Yamunotri Dham which takes about 5-6 Days to complete, you can discuss your travel plans with the Gokeys India team.
            </p>

            <a
              href="/services/char-dham-yatra-operators-haridwar/"
              className="text-green-700 font-semibold"
            >
              Char Dham Yatra Services →
            </a>

          </div>

        </section>

        {/* HOW TO BOOK */}
        <section className="bg-green-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                How to Book a Haridwar to Dehradun Taxi
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
                    Tell us when you plan to travel.
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
                    Provide your Haridwar pickup location.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    03
                  </div>

                  <h3 className="font-semibold mb-2">
                    Share Destination
                  </h3>

                  <p className="text-gray-600">
                    Tell us whether you need Dehradun city or the airport.
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
                    Discuss the available vehicle and travel arrangement.
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
              Why Choose Gokeys India?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Haridwar-Based Travel Team
                </h3>

                <p className="text-gray-600 leading-7">
                  Gokeys India is based in Haridwar and working since 10+ years in Travel Industry, so we can provide local travel assistance for your taxi and cab requirements.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  City & Airport Transfers
                </h3>

                <p className="text-gray-600 leading-7">
                  Available for both city and airport transfers, including Dehradun Airport (Jolly Grant Airport) and other locations in Dehradun.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Travel Planning
                </h3>

                <p className="text-gray-600 leading-7">
                  We also offer various tour packages across the Uttarakhand region, including Char Dham Yatra, Do Dham Yatra, and other pilgrimage and sightseeing tours.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Direct Enquiry
                </h3>

                <p className="text-gray-600 leading-7">
                  Share your actual travel requirements directly with the
                  Gokeys India team.
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
                Related Taxi & Travel Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <a
                  href="/services/taxi-service-haridwar/"
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Taxi Services in Haridwar
                  </h3>

                  <p className="text-gray-600">
                    Explore local and outstation taxi services from Haridwar.
                  </p>
                </a>

                <a
                  href="/services/haridwar-to-rishikesh-taxi/"
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Haridwar to Rishikesh Taxi
                  </h3>

                  <p className="text-gray-600">
                    Taxi and cab services between Haridwar and Rishikesh.
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
                    Plan taxis, tours, hotels and pilgrimage journeys.
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
                  Can I book a taxi from Haridwar to Dehradun?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Gokeys India provides taxi and cab booking for travelers travelling from Haridwar to Dehradun, Dehradun Airport Jolly Grant, City and Mussoorie as well. subject to vehicle availability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a taxi from Haridwar to Dehradun Airport?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Cabs for Dehradun Airport available from Haridwar with Minimum Charges like ₹1,800/-, you can share your travel date, pickup location and flight details and we can book accordingly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a taxi from Haridwar Railway Station to Dehradun
                  Airport?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Our office is located near Haridwar Railway Station, so cabs are available at any time to Dehradun Airport, you can book with us.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a Dehradun Airport to Haridwar taxi?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Just share your flight arrival details and preferred destination in Haridwar, and we can arrange a taxi accordingly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a one-way taxi from Haridwar to Dehradun?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. One-way taxi are available from Haridwar to Dehradun, Dehradun Airport and other destinations. Share your travel date, pickup location and destination to book your cabs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a round-trip taxi from Haridwar to Dehradun?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes. Round-trip Taxis from Haridwar to Dehradun are available with us (Gokeys India) and you can book via Contacting us at 9045916770 or Just simply WhatsApp us your requirements, we will book and send you details.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can I book a Haridwar to Dehradun taxi?
                </h3>

                <p className="text-gray-700 leading-7">
                  For booking a cab with us you can just call or WhatsApp us at +919045916770 and you will get details of your taxi booking, we will send you the cab details and driver contact number for your travel.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* FINAL CTA */}
        <section className="bg-green-700 text-white">

          <div className="container mx-auto px-4 py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Book Your Haridwar to Dehradun Taxi
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Need a taxi to Dehradun or Dehradun Airport? Share your travel
              date, pickup location, destination and passenger details with
              Gokeys India.
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