import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';
import Link from 'next/link';
import SmartSEO from '@/components/SmartSEO';
import { buildBreadcrumbList, buildItemListSchema, buildFAQSchema } from '@/lib/seoSchemas';
import { Breadcrumbs, CtaBand, FaqList, TourCard, Price, Mountains } from '@/components/ui/kit';
import { getDepartures, formatDepartureDate } from '@/lib/departures';

const faqs = [
  {
    question: "What is the group size limit for tours?",
    answer: "Our group tours typically accommodate 10–30 people, but this varies by package. Contact us for specifics!",
  },
  {
    question: "Can we customize our group tour?",
    answer: "Yes, we offer customizable itineraries to suit your group’s preferences. Reach out to discuss options.",
  },
  {
    question: "What payment options are available?",
    answer: "We accept credit/debit cards, UPI, and bank transfers. Flexible EMI options are also available.",
  },
  {
    question: "What’s included in the tour packages?",
    answer: "Packages typically include accommodation, transport, guided tours, and some meals. Check package details for specifics.",
  },
];

const FEATURES = [
  { title: "Budget Friendly", desc: "Save more with group discounts and shared travel costs.", icon: "💰" },
  { title: "Local Experts", desc: "Explore destinations with knowledgeable local guides.", icon: "🧑‍🏫" },
  { title: "Hassle-Free", desc: "We manage planning, bookings, and logistics end-to-end.", icon: "📋" },
  { title: "Customizable", desc: "Trips tailored to your group’s interests and pace.", icon: "⚙️" },
  { title: "24×7 Support", desc: "On-trip assistance and support whenever you need it.", icon: "🛡️" },
];

const GROUPS = [
  { name: "Friends", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205" },
  { name: "Corporate Teams", image: "https://images.unsplash.com/photo-1630487656049-6db93a53a7e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Students", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" },
  { name: "Families", image: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08" },
  { name: "Senior Citizens", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Delhi",
    quote: "Our Manali group trip was incredibly well planned. The coordination, hotels, and guides were all perfect.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    name: "Rahul Patel",
    location: "Mumbai",
    quote: "The Varanasi tour was a deeply spiritual experience. Everything was smooth and hassle-free.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    name: "Anita Rao",
    location: "Bangalore",
    quote: "Perfect family group tour to Goa. Safe, fun, and very affordable. Highly recommended!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
  },
];

const STEPS = [
  { step: "Choose Your Trip", desc: "Browse and select the group tour that fits your travel style.", icon: "🔍" },
  { step: "Customize Details", desc: "Personalize dates, hotels, or activities if needed.", icon: "⚙️" },
  { step: "Confirm & Pay", desc: "Lock your spot with secure and flexible payment options.", icon: "💳" },
  { step: "Travel & Enjoy", desc: "Relax, explore, and make memories with your group.", icon: "🎉" },
];

const formatDate = formatDepartureDate;

export default function GroupTour({ tours = [] }) {
  const isPriceOnRequest = (pricing) => {
    if (!pricing) return true;
    if (pricing.price_on_request) return true;
    const numeric = parseFloat(pricing.discount_price || pricing.price);
    return isNaN(numeric) || numeric === 0;
  };

  const processedTours = tours.map(tour => {
    const standardPackage = tour.pricing?.find(p => p.package_type === 'standard')
      || tour.pricing?.[0]
      || null;

    return {
      id: tour.id,
      title: tour.name,
      slug: tour.slug,
      type: tour.trip_types?.length > 0 ? tour.trip_types[0].name : 'Group Tour',
      price: standardPackage,
      image: tour.featured_image?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      description: tour.meta_description || 'Explore this amazing group tour!',
    };
  });

  // Every future departure of every tour, soonest first
  const departuresOf = Object.fromEntries(tours.map((t) => [t.id, getDepartures(t)]));
  const upcoming = tours
    .flatMap((t) => departuresOf[t.id].list.map((dep) => ({ date: dep.date, dep, tour: t })))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const schemas = [];

// BreadcrumbList Schema
schemas.push(
  buildBreadcrumbList([
    { name: 'Home', url: '/' },
    { name: 'Group Tours', url: '/grouptour' },
  ])
);

// ItemList Schema for tours
schemas.push(
  buildItemListSchema({
    name: 'Group Tours',
    items: processedTours,
    itemType: 'TouristTrip',
    getItemSchema: (tour, schema) => ({
      ...schema,
      name: tour.title, // Ensure name is included
      url: `https://gokeys.in/grouptour/${tour.slug}`, // Use correct path
      description: tour.meta_description || tour.description || 'Explore this amazing group tour with Gokeys India.', // Non-empty description
      image: tour.image,
      offers: isPriceOnRequest(tour.price)
        ? undefined
        : {
            '@type': 'Offer',
            url: `https://gokeys.in/grouptour/${tour.slug}`, // Use correct path
            priceCurrency: 'INR',
            price: parseFloat(tour.price.discount_price || tour.price.price) || 0,
          },
    }),
  })
);

// FAQPage Schema
schemas.push(
  buildFAQSchema(
    faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    "/grouptour"
  )
);

  return (
    <>
      <Header />
      <SmartSEO schema={schemas} />
      <main className="bg-mist">
        {/* 1. Hero */}
        <section className="relative overflow-hidden bg-ink">
          <Mountains scene="dusk" className="absolute inset-0 w-full h-full opacity-70" />
          <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/70 to-transparent" />
          <div className="relative gk-wrap py-16 md:py-24">
            <Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Group tours" }]} />
            <h1 className="gk-h1 text-white! max-w-xl">
              Explore Group Tours <span className="text-sun">Together.</span>
            </h1>
            <p className="mt-4 text-slate-200 max-w-lg">
              Affordable adventures, curated itineraries, and unforgettable group travel experiences.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#tours" className="gk-btn gk-btn-sun">Explore Packages</a>
              <Link href="/contact" className="gk-btn gk-btn-white">Get Callback</Link>
            </div>
          </div>
        </section>

        {/* 2. Popular Group Tour Packages */}
        <section className="gk-wrap gk-section scroll-mt-16" id="tours">
          <p className="gk-eyebrow mb-2">Fixed departures</p>
          <h2 className="gk-h2 mb-6">Popular Group Tour Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tours.map((tour) => (
              <div key={tour.id}>
                <TourCard
                  tour={tour}
                  href={`/grouptour/${tour.slug}`}
                  imgHeight="h-44"
                  badge={tour.trip_types?.[0]?.name || "Group Tour"}
                  chips={[
                    tour.duration && `${tour.duration} days`,
                    departuresOf[tour.id].next
                      ? (departuresOf[tour.id].next.bookable && departuresOf[tour.id].next.seatsLeft != null
                          ? `${departuresOf[tour.id].next.seatsLeft} seats left`
                          : departuresOf[tour.id].next.label)
                      : "Dates coming soon",
                  ]}
                  footer={
                    <div className="w-full">
                      {/* Description excerpt with its links, as on the old page (outside the card link: no nested <a>) */}
                      {tour.content && (
                        <div
                          className="text-sm text-slate-ink line-clamp-2 [&_a]:text-teal [&_a]:font-semibold [&_*]:inline"
                          dangerouslySetInnerHTML={{ __html: tour.content }}
                        />
                      )}
                      <Link href={`/grouptour/${tour.slug}`} className="gk-btn gk-btn-ink w-full mt-3">View tour</Link>
                    </div>
                  }
                >
                  <p className="text-xs text-slate-ink">Starting from</p>
                  <Price tour={tour} />
                </TourCard>
              </div>
            ))}
          </div>

          {/* Upcoming departures (only dates from today on) */}
          {upcoming.length > 0 && (
            <div className="mt-12">
              <h2 className="gk-h2 mb-5">Upcoming dates</h2>
              <div className="gk-card overflow-x-auto">
                <table className="w-full text-sm min-w-140">
                  <thead className="bg-ink text-white text-left">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">Trip</th>
                      <th className="px-5 py-3 font-semibold">Seats</th>
                      <th className="px-5 py-3 font-semibold">Price</th>
                      <th className="px-5 py-3"><span className="sr-only">Reserve</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map(({ date, dep, tour }) => (
                      <tr key={`${tour.id}-${date}`} className="border-t border-line">
                        <td className="px-5 py-3 font-bold text-ink whitespace-nowrap">{formatDate(date)}</td>
                        <td className="px-5 py-3 font-semibold text-ink">{tour.name}</td>
                        <td className="px-5 py-3">
                          {dep.bookable && dep.seatsLeft != null
                            ? <span className="gk-chip gk-chip-sun">{dep.seatsLeft} left</span>
                            : <span className="gk-chip">{dep.label}</span>}
                        </td>
                        <td className="px-5 py-3"><Price tour={tour} size="text-base" unit="" /></td>
                        <td className="px-5 py-3 text-right">
                          <Link href={`/grouptour/${tour.slug}`} className="gk-btn gk-btn-ink py-2!">{dep.bookable ? "Reserve" : "View"}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* 3. Why Choose Our Group Tours */}
        <section className="bg-white">
          <div className="gk-wrap gk-section">
            <p className="gk-eyebrow mb-2">Why travel in a group</p>
            <h2 className="gk-h2">Why Choose Our Group Tours?</h2>
            <p className="gk-lead mt-2 mb-7 max-w-2xl">
              Thoughtfully designed experiences that balance comfort, cost, and connection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="bg-mist rounded-2xl p-5">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="gk-h3">{feature.title}</h3>
                  <p className="text-[15px] text-slate-ink mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Who We Cater To */}
        <section className="gk-wrap gk-section">
          <p className="gk-eyebrow mb-2">For Every Kind of Group</p>
          <h2 className="gk-h2">Who We Cater To</h2>
          <p className="gk-lead mt-2 mb-7 max-w-2xl">
            Whether it’s fun, bonding, learning, or relaxation — we design group journeys that fit perfectly.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {GROUPS.map((group) => (
              <div key={group.name} className="relative h-48 md:h-60 rounded-2xl overflow-hidden group bg-chip">
                <Image
                  src={group.image}
                  alt={group.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 gk-h3 text-white! text-lg">{group.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Testimonials */}
        <section className="bg-white">
          <div className="gk-wrap gk-section">
            <p className="gk-eyebrow mb-2">Guest Experiences</p>
            <h2 className="gk-h2">What Our Groups Say</h2>
            <p className="gk-lead mt-2 mb-7">Real stories from travelers who explored India together with us.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.name} className="bg-mist rounded-2xl p-6 flex flex-col">
                  <div className="flex mb-3" aria-label={`${testimonial.rating} out of 5`}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? "text-sun" : "text-slate-300"}>★</span>
                    ))}
                  </div>
                  <p className="text-[15px] text-slate-ink leading-relaxed mb-5">“{testimonial.quote}”</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden bg-chip">
                      <Image src={testimonial.image} alt={testimonial.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-slate-ink">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Your Journey */}
        <section className="gk-wrap gk-section">
          <p className="gk-eyebrow mb-2">Simple Process</p>
          <h2 className="gk-h2">Your Journey in 4 Easy Steps</h2>
          <p className="gk-lead mt-2 mb-7">From your first enquiry to unforgettable memories — we handle everything.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((item, index) => (
              <div key={item.step} className="gk-card p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sun text-xs font-bold text-ink">{index + 1}</span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="gk-h3 mt-3">{item.step}</h3>
                <p className="text-[15px] text-slate-ink mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CTA */}
        <section className="gk-wrap pb-14">
          <CtaBand
            tone="ink"
            title="Ready to Plan Your Group Adventure?"
            text="Tell us your group size, destination, and travel dates — our experts will handle the rest."
          >
            <Link href="/contact" className="gk-btn gk-btn-sun">Plan My Trip</Link>
            <Link href="/contact" className="gk-btn gk-btn-white">Get Callback</Link>
          </CtaBand>
        </section>

        {/* 8. FAQ */}
        <section className="gk-wrap pb-14 grid lg:grid-cols-[1fr_1.5fr] gap-8">
          <div>
            <p className="gk-eyebrow mb-2">Need Help?</p>
            <h2 className="gk-h2">Frequently Asked Questions</h2>
            <p className="gk-lead mt-3">Everything you need to know before booking your group tour.</p>
          </div>
          <FaqList items={faqs} />
        </section>

        {/* 9. Newsletter */}
        <section className="gk-wrap pb-16">
          <div className="rounded-2xl bg-ink p-7 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="gk-eyebrow gk-eyebrow-sun mb-2">Stay Updated</p>
              <h2 className="gk-h2 text-white!">Get Exclusive Group Tour Deals</h2>
              <p className="text-slate-300 mt-2">
                Be the first to know about new group departures, early-bird prices, and special travel offers.
              </p>
            </div>
            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                required
                className="gk-field flex-1 py-3!"
              />
              <button type="submit" className="gk-btn gk-btn-sun">Subscribe</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
