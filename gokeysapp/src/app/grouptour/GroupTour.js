import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';
import Link from 'next/link';
import SmartSEO from '@/components/SmartSEO';
import { buildBreadcrumbList, buildItemListSchema, buildFAQSchema } from '@/lib/seoSchemas';
import { Breadcrumbs, CtaBand, FaqList, TourCard, Price, Mountains } from '@/components/ui/kit';
import { getDepartures, formatDepartureDate, lowestAdultPrice } from '@/lib/departures';
import GroupTourGrid from '@/components/GroupTourGrid';
import UpcomingDatesTable from '@/components/UpcomingDatesTable';
import GuestReviews from '@/components/GuestReviews';

// The hub's own content (steps, "why choose" cards, FAQs, guest reviews) comes from the admin: Group Tours >
// Group tours page (/api/group-tour-hub/). A section with nothing in it is not shown.
const plainText = (html) => String(html || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const GROUPS = [
  { name: "Friends", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205" },
  { name: "Corporate Teams", image: "https://images.unsplash.com/photo-1630487656049-6db93a53a7e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Students", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" },
  { name: "Families", image: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08" },
  { name: "Senior Citizens", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
];

const formatDate = formatDepartureDate;

export default function GroupTour({ tours = [], hub = {}, renderedAt }) {
  const steps = hub.steps || [];
  const features = hub.features || [];
  const faqs = (hub.faqs || []).map((f) => (/<[a-z]/i.test(f.answer || "")
    ? { question: f.question, html: f.answer, answer: plainText(f.answer) } : { question: f.question, answer: f.answer }));
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
  // Phase 5: tours with a date bookable online show "Book online" and the lowest adult price of those dates
  const onlineOf = Object.fromEntries(tours.map((t) => {
    const online = departuresOf[t.id].list.filter((d) => d.bookOnline);
    return [t.id, online.length ? { from: lowestAdultPrice(online) } : null];
  }));
  const rupee = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const upcoming = tours
    .flatMap((t) => departuresOf[t.id].list.map((dep) => ({ date: dep.date, dep, tour: t })))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12); // the table shows the first 8 still to come (a cached page drops passed dates in the browser)

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

// FAQPage Schema (only when the hub has FAQs)
if (faqs.length) schemas.push(
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
          <GroupTourGrid cards={tours.map((tour) => ({
            id: tour.id,
            months: [...new Set(departuresOf[tour.id].list.map((d) => d.date.slice(0, 7)))],
            destinations: tour.destination_names || [],
            node: (
                <TourCard
                  tour={tour}
                  href={`/grouptour/${tour.slug}`}
                  imgHeight="h-44"
                  showWas={false}
                  badge={tour.trip_types?.[0]?.name || "Group Tour"}
                  chips={[
                    onlineOf[tour.id] && "Book online",
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
                  {onlineOf[tour.id]?.from ? (
                    <p className="flex flex-wrap items-baseline gap-x-1.5">
                      <span className="gk-price text-xl">{rupee(onlineOf[tour.id].from)}</span>
                      <span className="text-xs text-slate-ink">per person + GST</span>
                    </p>
                  ) : <Price tour={tour} showWas={false} />}
                </TourCard>
            ),
          }))} />

          {/* Upcoming departures (only dates from today on) */}
          <UpcomingDatesTable renderedAt={renderedAt} rows={upcoming.map(({ date, dep, tour }) => ({
            key: `${tour.id}-${date}`, date, tourName: tour.name, slug: tour.slug, badge: dep.badge,
            badgeLabel: dep.badgeLabel, label: dep.label, seatsLeft: dep.seatsLeft, bookable: dep.bookable,
            bookOnline: dep.bookOnline,
            price: dep.bookOnline && lowestAdultPrice([dep])
              ? <span className="gk-price text-base">{rupee(lowestAdultPrice([dep]))}</span>
              : <Price tour={tour} size="text-base" unit="" showWas={false} />,
          }))} />
        </section>

        {/* 3. Why Choose Our Group Tours */}
        {features.length > 0 && <section className="bg-white">
          <div className="gk-wrap gk-section">
            <p className="gk-eyebrow mb-2">Why travel in a group</p>
            <h2 className="gk-h2">Why Choose Our Group Tours?</h2>
            <p className="gk-lead mt-2 mb-7 max-w-2xl">
              Thoughtfully designed experiences that balance comfort, cost, and connection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="bg-mist rounded-2xl p-5">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="gk-h3">{feature.title}</h3>
                  <p className="text-[15px] text-slate-ink mt-1 leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>}

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

        {/* 5. Guest reviews (typed in by staff in the admin; hidden while there are none) */}
        {(hub.reviews || []).length > 0 && (
          <section className="bg-white">
            <div className="gk-wrap gk-section">
              <p className="gk-eyebrow mb-2">Guest Experiences</p>
              <GuestReviews reviews={hub.reviews} title="What Our Groups Say" />
            </div>
          </section>
        )}

        {/* 6. Your Journey */}
        {steps.length > 0 && <section className="gk-wrap gk-section">
          <p className="gk-eyebrow mb-2">Simple Process</p>
          <h2 className="gk-h2">Your Journey in {steps.length} Easy Steps</h2>
          <p className="gk-lead mt-2 mb-7">From your first enquiry to unforgettable memories — we handle everything.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((item, index) => (
              <div key={item.title} className="gk-card p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sun text-xs font-bold text-ink">{index + 1}</span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="gk-h3 mt-3">{item.title}</h3>
                <p className="text-[15px] text-slate-ink mt-1 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>}

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
        {faqs.length > 0 && <section className="gk-wrap pb-14 grid lg:grid-cols-[1fr_1.5fr] gap-8">
          <div>
            <p className="gk-eyebrow mb-2">Need Help?</p>
            <h2 className="gk-h2">Frequently Asked Questions</h2>
            <p className="gk-lead mt-3">Everything you need to know before booking your group tour.</p>
          </div>
          <FaqList items={faqs} />
        </section>}

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
