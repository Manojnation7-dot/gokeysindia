import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import Image from "next/image";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gokeys.in/";

export async function generateMetadata() {
  const title =
    "Hotel Booking in Uttarakhand | Hotels & Accommodation";

  const description =
    "Book hotels in Uttarakhand with Gokeys India. Find accommodation in Haridwar, Rishikesh, Kedarnath, Badrinath, Mussoorie and other Uttarakhand destinations.";

  const url = `${siteUrl}/services/hotel-booking-uttarakhand/`;

  return {
    title,
    description,

    keywords: [
      "hotel booking Uttarakhand",
      "hotels in Uttarakhand",
      "Uttarakhand hotel booking",
      "hotel booking in Haridwar",
      "hotels in Haridwar",
      "hotel booking Haridwar",
      "hotels in Rishikesh",
      "hotel booking Rishikesh",
      "hotels near Kedarnath",
      "Kedarnath hotel booking",
      "hotels in Badrinath",
      "Badrinath hotel booking",
      "Char Dham hotel booking",
      "Uttarakhand pilgrimage hotel booking",
      "Uttarakhand tour hotel booking",
      "hotel booking for Char Dham Yatra",
      "hotel booking for Kedarnath Yatra",
      "budget hotels Uttarakhand",
      "family hotels Uttarakhand",
      "Uttarakhand accommodation",
      "Travel Agents in Haridwar",
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
          url: `${siteUrl}/images/hotel-booking-uttarakhand.jpeg`,
          width: 1200,
          height: 630,
          alt: "Hotel Booking in Uttarakhand - Gokeys India",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}/images/hotel-booking-uttarakhand.jpeg`,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function HotelBookingUttarakhandPage() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services/" },
    {
      name: "Hotel Booking Uttarakhand",
      url: "/services/hotel-booking-uttarakhand/",
    },
  ]);

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#travel-agency`,
    name: "Gokeys India",
    url: siteUrl,
    logo: `${siteUrl}/images/gokeyslogo-1.png`,
    image: `${siteUrl}/images/hotel-booking-uttarakhand.jpeg`,
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

    areaServed: {
      "@type": "State",
      name: "Uttarakhand",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hotel Booking in Uttarakhand",
    serviceType: "Hotel Booking and Accommodation Services",
    description:
      "Book hotels with Gokeys India if you are looking for hotels in Haridwar, Rishikesh, Kedarnath, Badrinath, Mussoorie and other destinations in Uttarakhand.",
    provider: {
      "@type": "TravelAgency",
      name: "Gokeys India",
      url: siteUrl,
    },
    areaServed: {
      "@type": "State",
      name: "Uttarakhand",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Can I book hotels in Uttarakhand through Gokeys?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, We have affiliations in various hotels in uttarakhand, so you can easily book a hotels with us, we have best price guranteed.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book a hotel in Haridwar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, we have hotels like Hotel Shiwalik Grand, Hotel Shooling Suites, Hotel Ganga Amantran, Hotel Renest, Hotel Purple Dots and more hotels best contracted rates, so you can just tell us your budget and locations requirement, we will book for you.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book hotels for Char Dham Yatra?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, we have contracted rates from hotels all over the Char Dham Locations like Barkot, Uttarkashi, Harsil, Guptkashi, Phata, Kedarnath, Badrinath, Pipalkoti and Rudraprayag.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book budget hotels in Uttarakhand?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, we have budget accommodations available with us in Uttarakhand like Guest House, Home Stays, Lodge and 2 Star Category Hotels, you can check and book with us.",
        },
      },

      {
        "@type": "Question",
        name: "Can I book hotels for a family trip to Uttarakhand?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, You can tell us about your Plans for Uttarakhand Trip and we will book your hotels accordingly, from Nainital, Mussoorie, Char Dham Locations and many more places.",
        },
      },

      {
        "@type": "Question",
        name: "How can I enquire about hotel booking?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Contact Gokeys India by phone or WhatsApp at +91 9045916770 and share your destination, travel dates, number of guests and preferred room requirements.",
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
                UTTARAKHAND HOTEL BOOKING
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Hotel Booking in Uttarakhand
              </h1>

              <p className="mt-6 text-lg text-gray-700 leading-8">
                Looking for hotels in Uttarakhand? Gokeys India provides
                hotel booking assistance for travelers visiting Haridwar,
                Rishikesh, Kedarnath, Badrinath, Mussoorie, Char Dham Locations and other
                destinations across Uttarakhand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

                <a
                  href="tel:+919045916770"
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  Enquire for Hotels
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
              Uttarakhand Hotel Booking Services
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Finding suitable accommodation is an important part of
              planning a trip to Uttarakhand. Whether you are visiting
              Haridwar for pilgrimage, Rishikesh for a spiritual or
              adventure trip, or traveling towards the Himalayan
              destinations like Mussoorie, Auli, Chopta, Munsiyari, Kausani, choosing accommodation according to your
              itinerary can make your journey more comfortable.
            </p>

            <p className="text-gray-700 leading-8 mb-4">
              Gokeys India Based in Haridwar Travel Agency has contracted rates from Hotels with Meal Plans, So you can tell us about your requirements and then we will book hotels accordingly.
            </p>

            <p className="text-gray-700 leading-8">
              Share your destination, travel dates, number of guests and
              accommodation requirements with our team. Available options
              can then be booked according to your travel plan.
            </p>

          </div>

        </section>

                {/* Featured Images */}
                      <div className="my-10">
                                  <Image
                                    src="/images/hotel-booking-uttarakhand.jpeg"
                                    alt="Hotel Bookings in Uttarakhand destination with Gokeys India"
                                    width={1200}
                                    height={675}
                                    className="w-full max-w-5xl mx-auto h-auto rounded-xl shadow-sm"
                                    priority
                                  />
                                </div>

        {/* DESTINATIONS */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-6xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Hotel Booking in Popular Uttarakhand Destinations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* HARIDWAR */}
                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Hotels in Haridwar
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Find accommodation options in Haridwar for pilgrimage
                    trips, family holidays, Ganga Aarti visits and travelers
                    beginning their Uttarakhand journey. Hotel Shiwalik Grand, Hotel Shoolin Suites, Hotel Renest, Hotel Purple Dots are some of the our contracted Hotels.
                  </p>

                  <a
                    href="/services/travel-agency-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Haridwar Travel Services →
                  </a>

                </div>

                {/* RISHIKESH */}
                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Hotels in Rishikesh
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Hotel and accommodation assistance for travelers visiting
                    Rishikesh for yoga, spirituality, adventure activities
                    and leisure travel. Either long for one night or long weeks, you can choose from different categories of hotels from us. We work with Hotel Ganga Retreat, Hotel Ganga Inn, Neeraj Ganga Heritage Hotel in Rishikesh, you can choose from.
                  </p>

                </div>

                {/* KEDARNATH */}
                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Kedarnath Accommodation
                  </h3>

                  <p className="text-gray-600 leading-7">
                    We have contracted rates with various accommodations in Kedarnath Like Gayatri Bhawan, Newly Built Hotels which name like ME1, ME2 and more, with various Sharing Camps stay. Due to limited space near the Kedarnath temple, accommodation is mostly a mix of guesthouses and shared camp-style stays — we can advise on the best option based on your budget and mobility.
                  </p>

                  <a
                    href="/services/char-dham-yatra-operators-haridwar/"
                    className="inline-block mt-4 text-green-700 font-semibold"
                  >
                    Char Dham Services →
                  </a>

                </div>

                {/* BADRINATH */}
                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Badrinath Accommodation
                  </h3>

                  <p className="text-gray-600 leading-7">
                    We work with Hotel Himgiri, Hotel Dikesh Inn, Hotel Bamini Inn, Hotel Suryodaya The Vaikunth, Hotel Amritara Awadh in Badrinath, So you can easily book according to your budget.
                  </p>

                </div>

                {/* MUSSOORIE */}
                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Hotels in Mussoorie
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Hotels in Mussoorie for any leisure trip you can contact us, we have good deals in various hotels like Hotel Luxury Inn, Hotel Kenilworth, Hotel The Oak Leaf Libraby Chowk and many more.
                  </p>

                </div>

                {/* OTHER */}
                <div className="bg-white rounded-xl p-6 shadow-sm">

                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Other Uttarakhand Destinations
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Hotel requirements can also be discussed for other
                    destinations like Nainital, Corbett, Kausani, Chopta, Auli and more places included in your Uttarakhand itinerary.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* HOTEL TYPES */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Accommodation Options in Uttarakhand
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Budget Accommodation
                </h3>

                <p className="text-gray-600 leading-7">
                  Suitable for travelers looking for practical
                  accommodation while keeping their overall trip budget
                  under control.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Family Hotels
                </h3>

                <p className="text-gray-600 leading-7">
                  Accommodation requirements for families like Four Sharing Rooms, Big Six person sharing rooms, Family Suites Rooms can be booked
                  with us, according to budget.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Pilgrimage Accommodation
                </h3>

                <p className="text-gray-600 leading-7">
                  Hotel requirements can be booked around Char Dham,
                  Kedarnath, Badrinath and other pilgrimage itineraries.
                </p>

              </div>

              <div className="border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Tour Accommodation
                </h3>

                <p className="text-gray-600 leading-7">
                  Travelers taking multi-destination Uttarakhand tours can
                  book accommodation requirements for different stops
                  along their itinerary.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* CHAR DHAM */}
        <section className="bg-green-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-4xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Hotel Booking for Char Dham Yatra
              </h2>

              <p className="text-gray-700 leading-8 mb-4">
                Char Dham Yatra involves travel through multiple destinations
                and mountain routes like Barkot, Uttarkashi, Guptkashi, Kedarnath, Badrinath, Pipalkoti. Accommodation planning is therefore an
                important part of preparing for the journey.
              </p>

              <p className="text-gray-700 leading-8 mb-5">
                Depending on your route and travel dates, you can check with us for hotels and also compare price with others, then you can book hotels with us.
              </p>

              <a
                href="/services/char-dham-yatra-operators-haridwar/"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Explore Char Dham Travel Services
              </a>

            </div>

          </div>

        </section>

        {/* KEDARNATH */}
        <section className="container mx-auto px-4 py-14">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Hotel Booking for Kedarnath Yatra
            </h2>

            <p className="text-gray-700 leading-8 mb-4">
              Kedarnath is one of the most visited pilgrimage destinations in
              Uttarakhand. Travelers often need accommodation before and
              after the trek or during different stages of their journey.
            </p>

            <p className="text-gray-700 leading-8">
              If you are planning Kedarnath along with other Uttarakhand
              destinations, hotel requirements can be considered as part of
              your overall itinerary.
            </p>

          </div>

        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gray-50">

          <div className="container mx-auto px-4 py-14">

            <div className="max-w-5xl mx-auto">

              <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                How to Enquire About Hotel Booking
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    01
                  </div>

                  <h3 className="font-semibold mb-2">
                    Choose Destination
                  </h3>

                  <p className="text-gray-600">
                    Tell us where you need accommodation.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    02
                  </div>

                  <h3 className="font-semibold mb-2">
                    Share Dates
                  </h3>

                  <p className="text-gray-600">
                    Provide your check-in and check-out dates.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    03
                  </div>

                  <h3 className="font-semibold mb-2">
                    Tell Us Your Needs
                  </h3>

                  <p className="text-gray-600">
                    Share guests, rooms and preferred accommodation type.
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-3xl font-bold text-green-700 mb-3">
                    04
                  </div>

                  <h3 className="font-semibold mb-2">
                    Confirm
                  </h3>

                  <p className="text-gray-600">
                    Review the available arrangement and confirm your stay.
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
              Why Book Your Uttarakhand Stay Through Gokeys?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Local Travel Experience
                </h3>

                <p className="text-gray-600 leading-7">
                  Gokeys India is Haridwar Based Travel Agency work with travelers
                  planning trips across Uttarakhand.
                </p>

              </div>

              <div className="bg-white border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  One Travel Contact
                </h3>

                <p className="text-gray-600 leading-7">
                  We have lists of contracted and affiliated hotels, Home stays, Resorts with us.
                </p>

              </div>

              <div className="bg-white border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Flexible Travel Planning
                </h3>

                <p className="text-gray-600 leading-7">
                  Share your itinerary and accommodation requirements instead
                  of trying to organize every part of your trip separately.
                </p>

              </div>

              <div className="bg-white border rounded-xl p-6">

                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Uttarakhand Focus
                </h3>

                <p className="text-gray-600 leading-7">
                  Our services are particularly focused on Uttarakhand
                  pilgrimage, leisure and tour travel.
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
                Related Uttarakhand Travel Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <a
                  href="/services/travel-agency-haridwar/"
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Travel Agency in Haridwar
                  </h3>

                  <p className="text-gray-600">
                    Explore travel planning and tour services from Haridwar.
                  </p>
                </a>

                <a
                  href="/services/uttarakhand-tour-operators/"
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Uttarakhand Tour Operators
                  </h3>

                  <p className="text-gray-600">
                    Plan a complete Uttarakhand tour with transportation,
                    accommodation and itinerary assistance.
                  </p>
                </a>

                <a
                  href="/services/taxi-services-haridwar/"
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Taxi Services in Haridwar
                  </h3>

                  <p className="text-gray-600">
                    Discuss taxi and transportation requirements for your
                    Uttarakhand trip.
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
                  Can I book hotels in Uttarakhand through Gokeys?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, We have affiliations in various hotels in uttarakhand, so you can easily book a hotels with us, we have best price guaranteed.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book a hotel in Haridwar?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, we have hotels like Hotel Shiwalik Grand, Hotel Shoolin Suites, Hotel Ganga Amantran, Hotel Renest, Hotel Purple Dots and more hotels best contracted rates, so you can just tell us your budget and locations requirement, we will book for you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book hotels for Char Dham Yatra?
                </h3>

                <p className="text-gray-700 leading-7">
                 Yes, we have contracted rates from hotels all over the Char Dham Locations like Barkot, Uttarkashi, Harsil, Guptkashi, Phata, Kedarnath, Badrinath, Pipalkoti and Rudraprayag.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book budget hotels in Uttarakhand?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, we have budget accommodations available with us in Uttarakhand like Guest House, Home Stays, Lodge and 2 Star Category Hotels, you can check and book with us.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I book hotels for a family trip to Uttarakhand?
                </h3>

                <p className="text-gray-700 leading-7">
                  Yes, You can tell us about your Plans for Uttarakhand Trip and we will book your hotels accordingly, from Nainital, Mussoorie, Char Dham Locations and many more places.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can I enquire about hotel booking?
                </h3>

                <p className="text-gray-700 leading-7">
                  Contact Gokeys India by phone or WhatsApp at +91 9045916770
                  and share your destination, travel dates, number of guests
                  and preferred room requirements.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* FINAL CTA */}
        <section className="bg-green-700 text-white">

          <div className="container mx-auto px-4 py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Hotel Booking in Uttarakhand?
            </h2>

            <p className="max-w-2xl mx-auto text-green-50 leading-7">
              Tell us your destination, travel dates and accommodation
              requirements and discuss available hotel options with Gokeys
              India.
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