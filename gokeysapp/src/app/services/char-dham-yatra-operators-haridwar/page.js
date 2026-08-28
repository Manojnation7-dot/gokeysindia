import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Link from "next/link";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

export async function generateMetadata() {
  const title =
    "Char Dham Yatra Tour Operators in Haridwar";

  const description =
    "Looking for Char Dham Yatra Tour operators in Haridwar Uttarakhand? Gokeys India helps plan Char Dham Yatra packages from Haridwar covering Yamunotri, Gangotri, Kedarnath and Badrinath with travel, hotel and itinerary assistance.";

  const url = `${siteUrl}/services/char-dham-yatra-operators-haridwar/`;

  return {
    title,
    description,

    keywords: [
      "Char Dham Yatra operators in Haridwar",
      "Char Dham operator in Haridwar",
      "Char Dham Yatra package from Haridwar",
      "Char Dham Yatra Haridwar",
      "Char Dham tour operator Haridwar",
      "Char Dham booking Haridwar",
      "Char Dham Yatra package",
      "Char Dham tour package",
      "Char Dham travel agency Haridwar",
      "Yamunotri Gangotri Kedarnath Badrinath tour",
      "Kedarnath Badrinath tour from Haridwar",
      "Uttarakhand pilgrimage tour operator",
      "Char Dham Yatra 2027",
      "Char Dham Yatra 2027 package",
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
          url: `${siteUrl}/images/char-dham-yatra-haridwar.png`,
          width: 1200,
          height: 630,
          alt: "Char Dham Yatra Operators in Haridwar - Gokeys India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}/images/char-dham-yatra-haridwar.png`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CharDhamOperatorsHaridwarPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Char Dham Yatra Tour Operators in Haridwar",
      url: "/services/char-dham-yatra-operators-haridwar/",
    },
  ]);

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/char-dham-yatra-haridwar.png`,
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
        name: "Does Gokeys operate Char Dham Yatra from Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Gokeys India provides Char Dham Yatra travel and tour arrangements from Haridwar, including assistance with transportation, accommodation and itinerary planning depending on the selected package.",
        },
      },

      {
        "@type": "Question",
        name: "Which temples are included in Char Dham Yatra?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The Uttarakhand Char Dham Yatra traditionally covers Yamunotri, Gangotri, Kedarnath and Badrinath.",
        },
      },

      {
        "@type": "Question",
        name: "Can I start Char Dham Yatra from Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Haridwar is a common starting point for travelers planning the Uttarakhand Char Dham Yatra, and travel arrangements can be planned from Haridwar according to the selected itinerary.",
        },
      },

      {
        "@type": "Question",
        name: "Does Gokeys provide Char Dham Yatra packages?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Gokeys India offers Char Dham Yatra travel packages and customized travel arrangements. Package inclusions depend on the selected itinerary.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a private Char Dham Yatra?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Private and customized Char Dham travel arrangements can be discussed with Gokeys India depending on group size, travel dates, vehicle availability and itinerary requirements.",
        },
      },

      {
        "@type": "Question",
        name: "How can I enquire about Char Dham Yatra?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can contact Gokeys India by phone or WhatsApp at +91 9045916770 and share your travel dates, group size and preferred itinerary.",
        },
      },
    ],
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      travelAgencySchema,
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
                CHAR DHAM YATRA FROM HARIDWAR
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Char Dham Yatra Tour Operators in Haridwar
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Planning a Char Dham Yatra from Haridwar Uttarakhand? Gokeys India helps
                travelers plan journeys to Yamunotri, Gangotri, Kedarnath and
                Badrinath with transportation, accommodation and itinerary
                assistance. Gokeys Travel In Himalayas is <strong>Top Travel Agents from Haridwar for Char Dham Yatra</strong> with 10+ Years of Experience in Uttarakhand Pilgrimage Tour Packages and Char Dham Yatra Tours and Travel services.
                <br/>You can Check out Reviews and Ratings in Google and Justdial for Gokeys Travel In Himalayas, many guest has shared their experience about Char Dham Yatra Tour Packages from Haridwar with Gokeys India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

                <a
                  href="tel:+919045916770"
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  Call for Char Dham
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

        <div className="my-10">
            <img
              src="/images/char-dham-yatra-haridwar.png"
              alt="Gokeys travel vehicle and pilgrims on the Char Dham Yatra route from Haridwar"
              className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-sm"
              loading="lazy"
            />
          </div>

        {/* INTRODUCTION */}
        <section className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Char Dham Yatra Operators in Haridwar
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              The Uttarakhand Char Dham Yatra is one of the most important
              pilgrimage journeys in the Himalayan region. The traditional
              circuit includes Yamunotri, Gangotri, Kedarnath and Badrinath.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Haridwar is a popular starting point for travelers beginning
              their Char Dham journey, As it known as Har Dwar (The places of Lord Shiva) and Hari Dwar (the place of Lord Vishnu) From here, you can take holy dip into the Ganges and continue towards
              the Garhwal Himalayan regions of Uttarakhand according to their chosen
              itinerary.
            </p>

            <p className="text-gray-700 leading-8">
              Gokeys India is based in Haridwar Travel Agency and provides Char Dham travel
              planning and tour arrangements. There are different types of Char Dham Yatra packages available, like Standard, Deluxe and Premium, just share your group size and travel dates and we will do the rest.</p>

          </div>
        </section>

        {/* FOUR DHAMS */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                The Four Dhams of Uttarakhand (Chota Char Dham Yatra)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/destinations/yamunotri/"
              className="block bg-white rounded-xl p-6 shadow-sm border border-transparent
                        transition-all duration-300
                        hover:-translate-y-1 hover:shadow-lg hover:border-green-200
                        cursor-pointer group"
>
            {/* Small Image */}
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image
                src="/images/yamunotri.jpg"
                alt="Yamunotri Temple Uttarakhand - Char Dham Yatra"
                width={600}
                height={350}
                className="w-full h-40 object-cover
                          transition-transform duration-500
                          group-hover:scale-105"
                        />
                      </div>

            <h3
              className="text-2xl font-semibold text-green-700 mb-3
                        group-hover:text-green-800 transition-colors duration-300"
            >
              Yamunotri
            </h3>

            <p className="text-gray-600 leading-7">
              Yamunotri is the source region associated with the
              Yamuna River and the first major pilgrimage destination
              in the traditional Char Dham route.
            </p>

            <span
              className="inline-block mt-4 text-green-700 font-medium
                        group-hover:translate-x-1 transition-transform duration-300"
            >
              Explore Yamunotri →
            </span>
          </Link>

              <Link
                  href="/destinations/gangotri/"
                  className="block bg-white rounded-xl p-6 shadow-sm border border-transparent
                            transition-all duration-300
                            hover:-translate-y-1 hover:shadow-lg hover:border-green-200
                            cursor-pointer group"
                >
                  {/* Gangotri Image */}
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <Image
                      src="/images/gangotri.jpg"
                      alt="Gangotri Temple known for Origin of Ganga River"
                      width={600}
                      height={350}
                      className="w-full h-40 object-cover
                                transition-transform duration-500
                                group-hover:scale-105"
                    />
                  </div>

                  <h3
                    className="text-2xl font-semibold text-green-700 mb-3
                              group-hover:text-green-800 transition-colors duration-300"
                  >
                    Gangotri
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Gangotri is an important pilgrimage destination associated
                    with the River Ganga and forms part of the Uttarakhand
                    Char Dham circuit.
                  </p>

                  <span
                    className="inline-block mt-4 text-green-700 font-medium
                              group-hover:translate-x-1 transition-transform duration-300"
                  >
                    Explore Gangotri →
                  </span>
                </Link>

             <Link
                  href="/destinations/kedarnath/"
                  className="block bg-white rounded-xl p-6 shadow-sm border border-transparent
                            transition-all duration-300
                            hover:-translate-y-1 hover:shadow-lg hover:border-green-200
                            cursor-pointer group"
                >
                  {/* Kedarnath Image */}
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <Image
                      src="/images/kedarnath.jpeg"
                      alt="Kedarnath Temple in garhwal himalayas - char dham trip"
                      width={600}
                      height={350}
                      className="w-full h-40 object-cover
                                transition-transform duration-500
                                group-hover:scale-105"
                    />
                  </div>

                  <h3
                    className="text-2xl font-semibold text-green-700 mb-3
                              group-hover:text-green-800 transition-colors duration-300"
                  >
                    Kedarnath
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Kedarnath is one of the most important Shiva pilgrimage
                    sites in India and a major destination on the Char Dham
                    Yatra in Uttarakhand.
                  </p>

                  <span
                    className="inline-block mt-4 text-green-700 font-medium
                              group-hover:translate-x-1 transition-transform duration-300"
                  >
                    Explore Kedarnath →
                  </span>
                </Link>

                <Link
                    href="/destinations/badrinath/"
                    className="block bg-white rounded-xl p-6 shadow-sm border border-transparent
                              transition-all duration-300
                              hover:-translate-y-1 hover:shadow-lg hover:border-green-200
                              cursor-pointer group"
                  >
                    {/* Badrinath Image */}
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <Image
                        src="/images/badrinath.jpg"
                        alt="Badrinath Temple Dham in Uttarakhand - Char Dham Yatra"
                        width={600}
                        height={350}
                        className="w-full h-40 object-cover
                                  transition-transform duration-500
                                  group-hover:scale-105"
                      />
                    </div>

                    <h3
                      className="text-2xl font-semibold text-green-700 mb-3
                                group-hover:text-green-800 transition-colors duration-300"
                    >
                      Badrinath
                    </h3>

                    <p className="text-gray-600 leading-7">
                      Badrinath is an important Vishnu pilgrimage site located
                      in the Himalayan region of Uttarakhand and is part of the
                      traditional Char Dham circuit.
                    </p>

                    <span
                      className="inline-block mt-4 text-green-700 font-medium
                                group-hover:translate-x-1 transition-transform duration-300"
                    >
                      Explore Badrinath →
                    </span>
                  </Link>

              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Char Dham Yatra Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Char Dham Tour Packages
                </h3>

                <p className="text-gray-600 leading-7">
                  Choose from available Char Dham tour packages or discuss
                  your preferred itinerary with the Gokeys travel team.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Transportation
                </h3>

                <p className="text-gray-600 leading-7">
                  Transportation arrangements are available with us from Haridwar
                  according to your itinerary, group size and vehicle
                  requirements.
                </p>

                <a
                  href="/services/taxi-service-haridwar/"
                  className="inline-block mt-4 text-green-700 font-semibold"
                >
                  Taxi Services →
                </a>
              </div>

              <div className="border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Hotel Accommodation
                </h3>

                <p className="text-gray-600 leading-7">
                  Accommodation/ Hotel are available in different categories like Budget, Standard, Deluxe and Luxury. You can choose any hotels according to your budget and requirements.
                </p>

                <a
                  href="/services/hotel-booking-uttarakhand/"
                  className="inline-block mt-4 text-green-700 font-semibold"
                >
                  Hotel Booking →
                </a>
              </div>

              <div className="border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Customized Itineraries
                </h3>

                <p className="text-gray-600 leading-7">
                  If you want a customize Char Dham Yatra Itinerary with like Lakhamondal Temple, Budha Kedar Temple, Mussoorie, Harsil Valley, Tungnath Chopta, Panch Badri, Panch Kedar Cuircit then you can let us know your requirements and we will plan your Char Dham Yatra accordingly.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Group Travel
                </h3>

                <p className="text-gray-600 leading-7">
                  Many travelers want to do the Char Dham Yatra as a group, so we can arrange your Char Dham Yatra in Group with other peoples. You can also travel with your family and friends in group. And we also have fix departure dates for Char Dham Yatra in Group. You can check our <a href="/grouptour/char-dham-yatra-group-tour" className="text-green-700 underline">Char Dham Yatra Group Tour Packages</a> for more details.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Travel Assistance
                </h3>

                <p className="text-gray-600 leading-7">
                  We are 24X7 Available to give assistance to Char Dham Yatra travelers. You can contact us anytime for any assistance during your Char Dham Yatra.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* DISTANCE TABLE */}
<section className="container mx-auto px-4 py-14">
  <div className="max-w-4xl mx-auto">

    <h2 className="text-3xl font-bold text-gray-900 mb-5">
      Char Dham Yatra Distance & Duration from Haridwar
    </h2>

    <p className="text-gray-700 leading-8 mb-6">
      Approximate road distances and travel times between key stops on the
      Char Dham route from Haridwar. Actual travel time can vary due to
      weather, road conditions and traffic during peak season.
    </p>

    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
              <tr className="bg-green-700 text-white">
                <th className="px-5 py-3 font-semibold">Route</th>
                <th className="px-5 py-3 font-semibold">Distance</th>
                <th className="px-5 py-3 font-semibold">Approx. Travel Time</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                ["Haridwar → Barkot", "~200 km", "6-7 hrs"],
                ["Barkot → Yamunotri (via Jankichatti)", "~45 km + 5-6 km trek", "2.5 hrs drive + 3-4 hrs trek"],
                ["Barkot → Uttarkashi", "~100 km", "3-4 hrs"],
                ["Uttarkashi → Gangotri", "~100 km", "3-4 hrs"],
                ["Gangotri → Guptkashi", "~230 km", "7-8 hrs"],
                ["Guptkashi → Kedarnath (via Sonprayag/Gaurikund trek)", "~30 km + 20 km trek", "1 hr drive + 7-8 hrs trek"],
                ["Guptkashi → Badrinath", "~200 km", "7-8 hrs"],
                ["Badrinath → Haridwar", "~320 km", "9-10 hrs"],
              ].map(([route, distance, time], i) => (
                <tr
                  key={route}
                  className={i % 2 === 0 ? "bg-white" : "bg-green-50/40"}
                >
                  <td className="px-5 py-3 border-t border-gray-100 text-gray-800 font-medium">
                    {route}
                  </td>
                  <td className="px-5 py-3 border-t border-gray-100 text-gray-600">
                    {distance}
                  </td>
                  <td className="px-5 py-3 border-t border-gray-100 text-gray-600">
                    {time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          * Distances and times are approximate and depend on trek pace, weather
          and road conditions. Confirm the latest route details with our team
          before booking.
        </p>

      </div>
    </section>

        {/* ROUTE */}
        <section className="bg-green-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Char Dham Yatra Route From Haridwar
              </h2>

              <p className="text-gray-700 leading-8 mb-5">
                The exact route and order of the Char Dham Yatra can vary
                depending on the package, road conditions, accommodation and
                travel arrangements.
              </p>

              <p className="text-gray-700 leading-8 mb-5">
                A typical journey from Haridwar travels through different
                parts of the Garhwal Himalayas before reaching the four major
                pilgrimage destinations.
              </p>

              <div className="bg-white rounded-xl p-6 shadow-sm">

                <div className="flex flex-wrap items-center justify-center gap-3 text-center">

                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    Haridwar
                  </span>

                  <span>→</span>

                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    Yamunotri
                  </span>

                  <span>→</span>

                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    Gangotri
                  </span>

                  <span>→</span>

                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    Kedarnath
                  </span>

                  <span>→</span>

                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    Badrinath
                  </span>

                </div>

              </div>

              <p className="text-gray-700 leading-8 mt-5">
                Travelers should confirm the final itinerary before booking,
                as routes and travel conditions can change during the
                pilgrimage season due to heavy traffic and weather.
              </p>

            </div>
          </div>
        </section>

        {/* SAMPLE ITINERARY */}
          <section className="bg-gray-50">
            <div className="container mx-auto px-4 py-14">
              <div className="max-w-4xl mx-auto">

                <h2 className="text-3xl font-bold text-gray-900 mb-5">
                  Char Dham Yatra Itinerary from Haridwar (9N/10D)
                </h2>

                <p className="text-gray-700 leading-8 mb-8">
                  Below is a day-wise itinerary for a complete Char Dham Yatra
                  starting and ending in Haridwar. You can check this out and make you travel plans accordingly. The itinerary can be customized based on your travel dates, group size and preferences.
                </p>

                <div className="space-y-4">
                  {[
                    { day: "Day 1", title: "Haridwar to Barkot", desc: "Depart Haridwar early morning after taking holy dip in the Ganges, drive via Mussoorie or Vikasnagar, depends upon traffic conditions. Overnight stay in Barkot." },
                    { day: "Day 2", title: "Barkot to Yamunotri to Barkot", desc: "Early Morning get your packed breakfast from hotel and then Drive to Jankichatti about 45 Kms, trek to Yamunotri temple for darshan 6-7 Kms, after Darshan and visit, return to Barkot for overnight stay." },
                    { day: "Day 3", title: "Barkot to Uttarkashi", desc: "Today wake up easily in the morning and have delicious breakfast at hotel, after that Drive to Uttarkashi, visit Shiv Gufa (Prakateshwar Mahadev) and Vishwanath Temple. Overnight stay in Uttarkashi." },
                    { day: "Day 4", title: "Uttarkashi to Gangotri to Uttarkashi", desc: "Get you packed breakfast from hotel and then Drive to Gangotri for darshan via Gangnani where you can take holy dip in Tapt Kund. return to Uttarkashi for overnight stay." },
                    { day: "Day 5", title: "Uttarkashi to Guptkashi", desc: "Today it's long drive journey via Lambgaon and Chamiyala Route, so have breakfast at hotel in the morning and then start your journey to Kedarnath Dham. Overnight stay in Guptkashi." },
                    { day: "Day 6", title: "Guptkashi to Kedarnath", desc: "Early Morning drive to Sonprayag/Gaurikund, trek (or helicopter, if opted) to Kedarnath (20 Kms trek route), other options are Pony, Palki, Doli. Evening darshan and overnight stay near the temple." },
                    { day: "Day 7", title: "Kedarnath to Guptkashi", desc: "Early morning darshan at temple and then you can visit Bhim Shila, Shankaracharya Samadhi Sthal, Bhukunda Bhairav Ji Temple, after that return trek to Gaurikund, then take cab to sonprayag and drive to Guptkashi for overnight stay." },
                    { day: "Day 8", title: "Guptkashi to Badrinath", desc: "After morning breakfast start towards Badrinath Dham via Rudraprayag, Joshimath. Overnight stay in Badrinath." },
                    { day: "Day 9", title: "Badrinath Darshan", desc: "Early Morning take holy dip in Tapt Kund and then darshan at Badrinath temple, visit Mana village (first Indian village), Bhim Pul, Vyas Gufa, Saraswati River, Dropadi Temple and more. Late Afternoon return journey to Pipalkoti for overnight stay." },
                    { day: "Day 10", title: "Pipalkoti to Haridwar", desc: "After morning breakfast start your return journey to Haridwar via Rishikesh, visit Nand Prayag, Karanprayag, Rudraprayag, Dhari Devi Temple and Devprayag on the way. Reach Haridwar in the evening and end of Char Dham Yatra." },
                  ].map((item) => (
                    <div
                      key={item.day}
                      className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                      <div className="sm:w-28 shrink-0">
                        <span className="inline-block bg-green-700 text-white text-sm font-semibold px-3 py-1 rounded-full">
                          {item.day}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-6">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-gray-500 text-sm mt-6">
                  * This is a sample itinerary. Actual duration, halts and route order
                  can be customized — contact us to plan according to your dates and
                  group size.
                </p>

                
                <a href="tel:+919045916770"
                  className="inline-block mt-6 bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
                
                  Customize This Itinerary
                </a>

              </div>
            </div>
          </section>

        {/* 2027 */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Char Dham Yatra 2027
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              If you are planning your Char Dham Yatra for 2027, it is useful
              to start preparing your travel arrangements early.Gokeys Offering best Travel Package for Char Dham Yatra 2027 with Standard, Deluxe and Luxury Categories.The
              pilgrimage season has limited operating periods and demand for
              transportation and accommodation can increase during popular
              travel dates.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Travelers planning a 2027 Char Dham Yatra should check the
              officially announced temple opening dates, government travel
              advisories, registration requirements and other rules before
              finalizing their journey.
            </p>

            <p className="text-gray-700 leading-8">
              Gokeys India can assist with planning the travel arrangements
              for your selected dates and group size for Upcoming Char Dham Yatra 2027.
            </p>

            <a
              href="/blog/char-dham-yatra-2027/"
              className="inline-block mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Read Char Dham Yatra 2027 Guide
            </a>

          </div>
        </section>

        {/* WHY GOKEYS */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Why Plan Your Char Dham Yatra With Gokeys?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Based in Haridwar
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Gokeys India is based in Haridwar with many years of experience, a major gateway for
                    travelers beginning their Uttarakhand pilgrimage journey.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Uttarakhand Travel Focus
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Our travel services have a strong focus on Uttarakhand
                    pilgrimage and Himalayan travel. We have own fleet of vehicles and experienced drivers for Char Dham Yatra travel.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Complete Travel Planning
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Transportation, accommodation and itinerary requirements
                    can be discussed together instead of arranging every part
                    separately.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Customized Options
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Travelers can discuss their preferred dates, group size
                    and itinerary requirements with the team.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* BEFORE BOOKING */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Things to Check Before Booking Char Dham Yatra
            </h2>

            <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-7">

              <li>
                Confirm the official opening dates and pilgrimage season.
              </li>

              <li>
                Check whether registration is required for your journey.
              </li>

              <li>
                Understand what is included in your selected package.
              </li>

              <li>
                Confirm transportation and accommodation arrangements.
              </li>

              <li>
                Check the itinerary and number of travel days.
              </li>

              <li>
                Keep flexibility for mountain weather and road conditions.
              </li>

              <li>
                Follow current government and temple administration
                instructions.
              </li>

            </ul>

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
                    Does Gokeys operate Char Dham Yatra from Haridwar?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Gokeys India provides Char Dham Yatra travel and tour
                    arrangements from Haridwar, including assistance with
                    transportation, accommodation and itinerary planning
                    depending on the selected package.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Which temples are included in Char Dham Yatra?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    The Uttarakhand Char Dham Yatra traditionally covers
                    Yamunotri, Gangotri, Kedarnath and Badrinath.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I start Char Dham Yatra from Haridwar?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes. Haridwar is a common starting point for travelers
                    planning the Uttarakhand Char Dham Yatra.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Does Gokeys provide Char Dham Yatra packages?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Yes. Gokeys India offers Char Dham Yatra travel packages
                    and customized travel arrangements. Package inclusions
                    depend on the selected itinerary.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I book a private Char Dham Yatra?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Private and customized Char Dham travel arrangements can
                    be discussed depending on group size, travel dates,
                    vehicle availability and itinerary requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How can I enquire about Char Dham Yatra?
                  </h3>

                  <p className="text-gray-700 leading-7">
                    Contact Gokeys India by phone or WhatsApp at
                    +91 9045916770 and share your travel dates, group size and
                    preferred itinerary.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>

        <section className="bg-white border-t border-gray-100 py-10">
  <div className="container mx-auto px-4">

    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">

        <div className="flex flex-col sm:flex-row gap-5 items-start">

          {/* Author Image */}
          <div className="shrink-0">
            <img
              src="/images/gokeyslogo.png"
              alt="Gokeys India travel expert"
              className="w-20 h-20 rounded-full object-cover border-2 border-green-100"
              loading="lazy"
            />
          </div>

          {/* Author Details */}
          <div className="flex-1">

            <p className="text-sm text-green-700 font-semibold uppercase tracking-wide mb-1">
              Travel Information & Editorial Team
            </p>

            <h2 className="text-2xl font-bold text-gray-900">
              Gokeys India Travel Team
            </h2>

            <p className="text-gray-600 leading-7 mt-3">
              This page has been created by the Gokeys India travel team,
              based in Haridwar, Uttarakhand. Our team provides travel
              planning and assistance for Char Dham Yatra, Kedarnath Yatra,
              Uttarakhand tours, hotels and transportation services.
            </p>

            <p className="text-gray-600 leading-7 mt-3">
              We use our local travel experience and information from
              relevant official sources to prepare practical travel
              information for pilgrims and visitors planning their journey
              through Uttarakhand.
            </p>

            {/* Credentials / Experience */}
            <div className="flex flex-wrap gap-3 mt-5">

              <span className="px-3 py-1.5 bg-white rounded-full
                               text-sm text-gray-700 border border-gray-200">
                Haridwar Based
              </span>

              <span className="px-3 py-1.5 bg-white rounded-full
                               text-sm text-gray-700 border border-gray-200">
                Uttarakhand Travel
              </span>

              <span className="px-3 py-1.5 bg-white rounded-full
                               text-sm text-gray-700 border border-gray-200">
                Char Dham Specialists
              </span>

            </div>

            {/* Author Links */}
            <div className="flex flex-wrap gap-5 mt-5">

              <a
                href="/about/"
                className="text-green-700 font-semibold hover:text-green-800"
              >
                About Gokeys →
              </a>

              <a
                href="/contact/"
                className="text-green-700 font-semibold hover:text-green-800"
              >
                Contact Our Team →
              </a>

            </div>

          </div>
        </div>

        {/* Page information */}
        <div className="mt-6 pt-5 border-t border-gray-200
                        flex flex-col sm:flex-row sm:justify-between
                        gap-2 text-sm text-gray-500">

          <span>
            Created by Gokeys India
          </span>

          <span>
            Last updated: August 2026
          </span>

        </div>

      </div>
    </div>

  </div>
</section>

        {/* FINAL CTA */}
        <section className="bg-green-700 text-white">

          <div className="container mx-auto px-4 py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planning Your Char Dham Yatra?
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Contact Gokeys India to discuss your Char Dham Yatra from
              Haridwar, including transportation, accommodation and tour
              planning.
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