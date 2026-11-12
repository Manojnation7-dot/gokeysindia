'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GroupDepartureTerms from '@/components/GroupDepartureTerms';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimilarTours from '@/components/SimilarGroupTours';
import dynamic from 'next/dynamic';
// Loaded after the page: reviews sit at the bottom (and load in the browser anyway); dialogs open only on a click
const ReviewSection = dynamic(() => import('@/components/ReviewSection'), { ssr: false });
import EnquiryForm from '@/components/EnquiryForm';
import TourItineraryMain from '@/components/TourItineraryMain';
import Image from 'next/image';
import GuestReviews from '@/components/GuestReviews';
import RelatedContent from '@/components/RelatedContent';
import {
  CalendarIcon,
  UserIcon,
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  MinusIcon,
} from '@/components/Icons';

import {
  isPriceOnRequest,
  formatPrice,
  getEffectivePrice,
} from '@/lib/pricingUtils';
import { submitTourEnquiry } from '@/lib/tourEnquiry';
import ImageGallery from '@/components/ImageGallery';
import { Breadcrumbs, FaqList } from '@/components/ui/kit';
import {
  getDepartures, formatDepartureDate, departureChip, formatPickupTime, SHARING_LABELS, lowestAdultPrice,
} from '@/lib/departures';
import NextDepartureRequest from '@/components/NextDepartureRequest';
import PriceBox from '@/components/PriceBox';
import StatusBadge from '@/components/StatusBadge';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { googleLine, whatsappLink } from '@/lib/siteSettings';

import SmartSEO from '@/components/SmartSEO'; 
import {
  buildTourSchema,
  hasValidReviewRating,
  buildBreadcrumbList,
  buildImageObject,
} from '@/lib/seoSchemas';
import { buildFAQSchema } from '@/lib/seoSchemas';

// Empty headings typed in the editor (e.g. <h2>&nbsp;</h2>) are dropped: they break the page's heading outline
const withoutEmptyHeadings = (html) =>
  String(html || '').replace(/<h([1-6])\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>)*<\/h\1>/gi, '');

export default function GroupTourDetails({ tourData, baseUrl, documentNumber, currentDate,tourPath,similarTours, renderedAt }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [selectedPackage, setSelectedPackage] = useState(() => {
    if (Array.isArray(tourData?.pricing) && tourData.pricing.length > 0) {
      return (
        tourData.pricing.find(pkg => pkg.package_type?.toLowerCase() === 'standard') ||
        tourData.pricing[0]
      );
    }
    return null;
  });

 const departureDates = Array.isArray(tourData?.departure_dates)
  ? tourData.departure_dates
  : (() => {
      try {
        const fixed = tourData?.departure_dates?.replace(/'/g, '"');
        return JSON.parse(fixed || '[]');
      } catch (err) {
        console.warn('Invalid departure_dates:', err);
        return [];
      }
    })();

  const [basePrice, setBasePrice] = useState(() =>
    selectedPackage ? getEffectivePrice(selectedPackage) : null
  );

  // Package buttons (this handler was missing, so choosing a package threw an error)
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setBasePrice(getEffectivePrice(pkg));
  };

  // Approved departures from today on (falls back to the old date list on an older backend)
  // First render uses the server's render time (identical HTML, no hydration mismatch); right after
  // loading, the visitor's clock takes over, so a page cached before midnight drops yesterday's date.
  const [now, setNow] = useState(() => new Date(renderedAt || Date.now()));
  useEffect(() => setNow(new Date()), []);
  const departureInfo = getDepartures(tourData, now);
  const upcoming = departureInfo.list;
  const formatDate = formatDepartureDate;
  const [reserved, setReserved] = useState(null); // departure picked with "Reserve"
  // Phase 5: at least one date can be booked online -> "Book now" is the main action (else the enquiry stays it)
  const onlineDeps = upcoming.filter((d) => d.bookOnline);
  const bookOnline = onlineDeps.length > 0;
  const fromPrice = lowestAdultPrice(onlineDeps);
  // Policy and trust numbers from the admin (Group tour settings), via the root layout
  const site = useSiteSettings();
  const advancePercent = onlineDeps.find((d) => d.advancePercent)?.advancePercent || site.group.advance_percent;
  // Mobile bar: hidden while the departures, the enquiry form or the footer are on screen (never covers them)
  const [barHidden, setBarHidden] = useState(false);
  useEffect(() => {
    if (!bookOnline || typeof IntersectionObserver === 'undefined') return undefined;
    const targets = [document.getElementById('departures'), document.getElementById('group-enquiry'), document.querySelector('footer')].filter(Boolean);
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setBarHidden(seen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [bookOnline]);
  // "Book now" at the top and in the mobile bar: a real link to #departures, scrolled smoothly (no motion if the
  // visitor asked for less), then the section heading gets focus for keyboard and screen-reader users
  const toDepartures = (e) => {
    const target = document.getElementById('departures');
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    document.getElementById('departures-heading')?.focus({ preventScroll: true });
    window.history.replaceState(null, '', '#departures');
  };

  // ✅ ✅ Add the missing states here:
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryFormData, setEnquiryFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    totalPersons: '',
    travelDate: '',
    message: '',
  });


  const capitalizeFirst = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  // Sidebar form: saved as a tour enquiry (it used to go to /api/enquiries/, which
  // needs a reCAPTCHA token this form never sent, so every submission was rejected).
  const handleEnquirySubmit = async (e) => {
    e?.preventDefault?.();
    const result = await submitTourEnquiry({
      tourName: `${tourData.name} (Group Tour)`,
      packageType: capitalizeFirst(selectedPackage?.package_type || ''),
      packagePrice: isPriceOnRequest(selectedPackage) ? 'Price on Request' : basePrice,
      formData: enquiryFormData,
      groupTourSlug: tourData.slug,
      // The backend re-checks this departure (open, before cutoff, enough seats)
      departureId: reserved && reserved.date === enquiryFormData.travelDate ? reserved.id : null,
    });

    if (result.ok) {
      alert('Your enquiry has been submitted successfully!');
      setEnquiryFormData({
        name: '',
        email: '',
        contactNo: '',
        totalPersons: '',
        travelDate: '',
        message: '',
      });
    } else {
      alert(result.message);
    }
  };
  // Itinerary PDF made on the server from the tour's data (title, dates and prices, days, inclusions, rules, contact)
  const itineraryPdfUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.gokeys.in'}/api/group-tours/${tourData?.slug}/itinerary.pdf`;

  const toggleDay = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  // Build SEO Schemas
  const schemas = [];

  // TouristTrip Schema
  if (tourData) {
    schemas.push(
      buildTourSchema({
        slug: tourData.slug,
        tourPath: "grouptour",
        name: tourData.name,
        description: tourData.meta_description || tourData.content.replace(/<\/?[^>]+(>|$)/g, ''),
        imageUrl: tourData.featured_image?.image || 'https://via.placeholder.com/600x400',
        pricingTiers: tourData.pricing,
        // One Offer per bookable date (price, INR, availability, on sale since); no rating or review markup
        departures: upcoming,
        itineraryItems: (tourData.itineraries || []).map((item) => ({
          name: item.title,
          description: item.description.replace(/<\/?[^>]+(>|$)/g, ''),
        })),
      })
    );
  }

  // BreadcrumbList Schema
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Group Tours', url: '/grouptour' },
    { name: tourData?.name || 'Tour Details', url: `/grouptour/${tourData?.slug}` },
  ];
  schemas.push(buildBreadcrumbList(breadcrumbItems));

  // ImageObject Schema
  if (tourData?.featured_image?.image) {
    schemas.push(
      buildImageObject({
        url: tourData.featured_image.image,
        width: tourData.featured_image.width,
        height: tourData.featured_image.height,
      })
    );
  }

  if (tourData?.faqs?.length) {
  schemas.push(
    buildFAQSchema(
      tourData.faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
      `/grouptour/${tourData.slug}`
    )
  );
}

  if (!tourData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Group tour not found.</p>
        </div>
        <Footer />
      </>
    );
  }


  const included = (tourData.inclusions_exclusions || []).filter((item) => item.is_inclusion);
  const excluded = (tourData.inclusions_exclusions || []).filter((item) => !item.is_inclusion);
  const destinationNames = (tourData.destinations || []).filter((dest) => dest && typeof dest === "string");
  const whatsappUrl = whatsappLink(site.business, `Hello ${site.business.name}, I want to enquire about ${tourData.name} (Group Tour).`);
  const reserve = (dep) => {
    setReserved(dep.id ? { id: dep.id, date: dep.date } : null);
    setEnquiryFormData((prev) => ({ ...prev, travelDate: dep.date }));
    document.getElementById("group-enquiry")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const noDates = departureInfo.state === "none";
  const anyBookable = upcoming.some((d) => d.bookable); // none: WhatsApp and the enquiry form are the way in
  const facts = [
    ["Next Departure", departureInfo.state === "error" ? "Please enquire" : upcoming[0] ? formatDate(upcoming[0].date) : "Dates coming soon"],
    ["Duration", tourData.duration ? `${tourData.duration} Days` : "N/A"],
    ["Group Size", tourData.max_group_size || "12-20 People"],
    [
      "Reviews",
      hasValidReviewRating(tourData.rating, tourData.reviews_count)
        ? `${tourData.rating} (${tourData.reviews_count} Tour Reviews)`
        : `${site.business.name} — ${googleLine(site.trust)}`,
    ],
  ];
  const priceLine = isPriceOnRequest(selectedPackage) ? (
    <span className="gk-price text-3xl">Price on Request</span>
  ) : (
    <>
      <span className="gk-price text-3xl">{formatPrice(basePrice)}</span>
      <span className="text-xs text-slate-ink">Per Adult</span>
    </>
  );

  return (
    <>
      <Header />
      <SmartSEO schema={schemas} />
      <main className="bg-mist text-ink">
        <div className="gk-wrap pt-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Group tours", href: "/grouptour" }, { label: tourData.name }]} />
          <h1 className="gk-h1 text-3xl! md:text-[2.6rem]! max-w-3xl">{tourData.name}</h1>
          <div className="flex flex-wrap gap-1.5 mt-3 mb-5">
            <span className="gk-chip gk-chip-sun">Group departure</span>
            {tourData.duration && <span className="gk-chip">{tourData.duration} days</span>}
            {tourData.starting_from && !/^\d+$/.test(tourData.starting_from) && (
              <span className="gk-chip">Pickup from {tourData.starting_from}</span>
            )}
            {destinationNames.map((dest, idx) => (
              <span key={idx} className="gk-chip">{capitalizeFirst(dest)}</span>
            ))}
          </div>

          <ImageGallery
            alt={tourData.featured_image?.alt_text || tourData.name}
            images={[
              tourData.featured_image?.optimized_banner || tourData.featured_image?.image || '/images/banner-image.png',
              ...(tourData.gallery_images?.map((img) => img.optimized || img.image) || []),
            ]}
            alts={[tourData.featured_image?.alt_text, ...(tourData.gallery_images || []).map((img) => img.alt_text)]}
          />
        </div>

        <div className="gk-wrap py-8 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="min-w-0 space-y-10">
            {/* Quick facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {facts.map(([label, value]) => (
                <div key={label} className="gk-panel px-4 py-3">
                  <p className="gk-label mb-0.5!">{label}</p>
                  <p className="text-[15px] font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>

            {/* Overview */}
            <section>
              <h2 className="gk-h2 mb-4">Tour Overview</h2>
              <div
                className="tour-content text-gray-800 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: withoutEmptyHeadings(tourData.content) }}
              />

              {/* Package Selection (tours not bookable online; a bookable tour's prices are in the price box) */}
              {!bookOnline && Array.isArray(tourData.pricing) && tourData.pricing.length > 0 && (
                <div className="mt-8">
                  <h3 className="gk-h3 mb-3">Choose Your Package</h3>
                  <div className="flex flex-wrap gap-3">
                    {tourData.pricing.map((pkg, index) => {
                      const active = selectedPackage?.package_type === pkg.package_type;
                      return (
                        <button
                          key={index}
                          onClick={() => handlePackageSelect(pkg)}
                          aria-pressed={active}
                          className={`px-4 py-2.5 rounded-xl border text-left transition ${
                            active ? "bg-ink border-ink text-white" : "bg-white border-line text-ink hover:border-ink"
                          }`}
                        >
                          <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                            {capitalizeFirst(pkg.package_type)}
                          </div>
                          <div className="text-sm mt-0.5">
                            {isPriceOnRequest(pkg) ? (
                              <span className="font-bold">Price on Request</span>
                            ) : (
                              <span className="font-bold">{formatPrice(getEffectivePrice(pkg))}</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tour Highlights */}
              <div className="mt-8">
                <h2 className="gk-h3 mb-3">Tour Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(tourData.highlights || []).map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 text-teal"><CheckIcon /></span>
                      <span className="text-gray-800">{highlight.highlight}</span>
                    </div>
                  ))}
                  {(!tourData.highlights || tourData.highlights.length === 0) && (
                    <p className="text-slate-ink text-[15px]">No highlights available for this tour.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Upcoming departures */}
            {upcoming.length > 0 && (
              <section id="departures" className="scroll-mt-24" aria-labelledby="departures-heading">
                <h2 id="departures-heading" tabIndex={-1} className="gk-h2 mb-4 outline-none">Upcoming departures</h2>
                {bookOnline && (
                  <ul className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm text-ink" aria-label="Booking online">
                    <li className="gk-panel px-3 py-2"><span className="font-semibold">Secure payment</span> by Razorpay (UPI, cards, net banking)</li>
                    <li className="gk-panel px-3 py-2"><span className="font-semibold">Pay {advancePercent}% now</span>, the balance {site.group.balance_due_days} days before departure</li>
                    <li className="gk-panel px-3 py-2"><span className="font-semibold">Clear rules:</span>{' '}
                      <Link href="/cancellation-policy" className="underline">cancellation and refunds</Link></li>
                    <li className="gk-panel px-3 py-2"><span className="font-semibold">Instant voucher</span> by email after payment</li>
                  </ul>
                )}
                <ul className="space-y-3">
                  {upcoming.map((dep) => {
                    const chip = departureChip(dep);
                    const sharing = ["quad", "triple", "double"].filter((s) => dep.prices[s]?.adult);
                    const child = dep.prices[sharing[0]] || {};
                    const oldPrice = dep.price ? formatPrice(dep.price)
                      : isPriceOnRequest(selectedPackage) ? "Price on Request" : formatPrice(basePrice);
                    return (
                      <li key={dep.date} className="gk-card p-4 sm:p-5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <p className="font-bold text-ink text-base whitespace-nowrap">{formatDate(dep.date)}</p>
                          {/* One status badge (backend; thresholds in the admin). The seat number only once enough
                              are booked: the backend sends none before that */}
                          {dep.badge ? <StatusBadge kind={dep.badge} label={dep.badgeLabel} /> : <>
                            {chip?.kind === "guaranteed" && (
                              <span className="gk-chip bg-green-50! text-green-800!">{chip.text}</span>
                            )}
                            {chip?.kind === "filling" && <span className="gk-chip gk-chip-sun">{chip.text}</span>}
                          </>}
                          {chip?.kind === "needed" && <span className="gk-chip">{chip.text}</span>}
                          {dep.bookable && dep.seatsLeft != null ? (
                            <span className="gk-chip">{dep.seatsLeft} seats left</span>
                          ) : !dep.badge ? (
                            <span className="gk-chip">{dep.label}</span>
                          ) : null}
                          <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-2">
                            {dep.bookOnline ? (
                              <>
                                <button type="button" onClick={() => reserve(dep)} className="text-sm font-semibold text-teal underline underline-offset-2"
                                  aria-label={`Ask a question about ${formatDate(dep.date)}`}>Ask a question</button>
                                {/* A full page load, never client-side routing: /book has its own security policy that
                                    allows Razorpay; a client-side move would keep this page's policy and block it */}
                                <a href={`/book/${dep.id}`} className="gk-btn gk-btn-sun py-2!"
                                  aria-label={`Book now: ${formatDate(dep.date)}`}>Book now</a>
                              </>
                            ) : dep.bookable ? (
                              <button onClick={() => reserve(dep)} className="gk-btn gk-btn-ink py-2!">Reserve</button>
                            ) : !anyBookable ? (
                              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="gk-btn gk-btn-wa py-2!"
                                aria-label={`Enquire on WhatsApp about ${tourData.name}`}>Enquire on WhatsApp</a>
                            ) : (
                              <span className="text-xs font-semibold text-slate-ink">{dep.label}</span>
                            )}
                          </div>
                        </div>

                        {sharing.length > 0 ? (
                          <div className="mt-3 text-sm text-ink">
                            <dl className="grid grid-cols-3 gap-2">
                              {sharing.map((s) => (
                                <div key={s} className="rounded-lg bg-slate-50 px-3 py-2">
                                  <dt className="text-xs text-slate-ink">{SHARING_LABELS[s]}</dt>
                                  <dd className="font-semibold">{formatPrice(dep.prices[s].adult)}</dd>
                                </div>
                              ))}
                            </dl>
                            <p className="mt-2 text-xs text-slate-ink">
                              Per adult (12+) · {child.child_with_bed && <>Child 5–11 with bed {formatPrice(child.child_with_bed)} · </>}
                              {child.child_no_bed && <>Child 5–11 without bed {formatPrice(child.child_no_bed)} · </>}
                              Under 5 free · Single room on request · GST 5% extra
                            </p>
                          </div>
                        ) : (
                          <p className="mt-2 text-sm font-semibold text-ink">{oldPrice}</p>
                        )}

                        {dep.pickups.length > 0 && (
                          <div className="mt-3 text-sm">
                            <p className="text-xs font-semibold text-slate-ink">Pickup points</p>
                            <ul className="mt-1 space-y-0.5 text-ink">
                              {dep.pickups.map((p) => (
                                <li key={p.id ?? p.name}>
                                  {p.mapUrl ? (
                                    <a href={p.mapUrl} target="_blank" rel="noopener noreferrer" className="underline">{p.name}</a>
                                  ) : p.name}
                                  {p.time && <> · {formatPickupTime(p.time)}</>}
                                  {Number(p.extra) > 0 ? <> · +{formatPrice(p.extra)} per person</> : <> · included</>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {dep.minPax && dep.decisionDate && !dep.guaranteed && (
                          <p className="mt-2 text-xs text-slate-ink">
                            Runs with at least {dep.minPax} travellers; we confirm by {formatDate(dep.decisionDate)}.
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {upcoming.some((d) => d.minPax) && (
                  <div className="gk-panel p-4 sm:p-5 mt-4 text-[15px] text-ink">
                    <h3 className="gk-h3 text-lg! mb-2">How this departure works</h3>
                    <GroupDepartureTerms only={["minimumGroup"]} listClass="list-disc pl-5 space-y-1" />
                    <p className="mt-2">A date marked &ldquo;Guaranteed departure&rdquo; will run. Full rules:{" "}
                      <Link href="/terms-and-conditions" className="underline">Terms</Link>.</p>
                  </div>
                )}
              </section>
            )}

            {/* No bookable date: collect "next departure" requests instead of an empty section */}
            {(noDates || departureInfo.state === "unavailable") && (
              <NextDepartureRequest tourSlug={tourData.slug} tourName={tourData.name} />
            )}
            {departureInfo.state === "error" && (
              <p className="gk-panel p-4 text-[15px] text-ink" role="alert">
                Departure dates could not be loaded right now. Please send an enquiry, call or WhatsApp us
                for the latest dates.
              </p>
            )}

            {/* Itinerary */}
            <TourItineraryMain tourData={{ ...tourData, itinerary: tourData.itineraries }} />

            {/* Inclusions */}
            {(included.length > 0 || excluded.length > 0) && (
              <section className="grid sm:grid-cols-2 gap-4">
                <div className="gk-panel p-5">
                  <h2 className="gk-h3 mb-4">What's Included</h2>
                  <ul className="space-y-2.5">
                    {included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-gray-800">
                        <span className="mt-0.5 text-teal"><CheckIcon /></span>
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="gk-panel p-5">
                  <h2 className="gk-h3 mb-4">What's Not Included</h2>
                  <ul className="space-y-2.5">
                    {excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-gray-800">
                        <span className="mt-0.5 text-[#d9603b]"><XIcon /></span>
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Stay plan, vehicle, things to carry, tour manager (admin; each hidden while empty) */}
            {(tourData.stays || []).length > 0 && (
              <section aria-labelledby="stays-heading">
                <h2 id="stays-heading" className="gk-h2 mb-4">Where you stay</h2>
                <ol className="space-y-3">
                  {tourData.stays.map((stay, i) => (
                    <li key={i} className="gk-card p-4 sm:flex gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-ink">Night {stay.nights} · {stay.town}</p>
                        <h3 className="gk-h3 text-lg!">{stay.hotel_name}{stay.or_similar && <span className="text-sm font-normal text-slate-ink"> or similar</span>}</h3>
                        {stay.room_note && <p className="text-sm text-ink mt-1">{stay.room_note}</p>}
                      </div>
                      {(stay.photos || []).length > 0 && (
                        <div className="mt-3 sm:mt-0 flex gap-2 shrink-0">
                          {stay.photos.slice(0, 3).map((ph) => (
                            <div key={ph.id} className="relative h-20 w-28 rounded-lg overflow-hidden bg-chip">
                              <Image src={ph.optimized_card || ph.image} alt={ph.alt_text || `${stay.hotel_name}, ${stay.town}`} fill sizes="112px" className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {tourData.vehicle && (
              <section aria-labelledby="vehicle-heading" className="gk-card p-4 sm:p-5 sm:flex gap-5 items-center">
                {tourData.vehicle.photo && (
                  <div className="relative h-32 sm:h-28 sm:w-44 rounded-lg overflow-hidden bg-chip shrink-0 mb-3 sm:mb-0">
                    <Image src={tourData.vehicle.photo.optimized_card || tourData.vehicle.photo.image}
                      alt={tourData.vehicle.photo.alt_text || tourData.vehicle.type || 'Tour vehicle'} fill sizes="176px" className="object-cover" />
                  </div>
                )}
                <div>
                  <h2 id="vehicle-heading" className="gk-h3 mb-1">Your vehicle</h2>
                  <p className="text-[15px] text-ink">{[tourData.vehicle.type, tourData.vehicle.seats ? `${tourData.vehicle.seats} seats` : '', tourData.vehicle.ac_note].filter(Boolean).join(' · ')}</p>
                </div>
              </section>
            )}

            {(tourData.things_to_carry || []).length > 0 && (
              <section aria-labelledby="carry-heading">
                <h2 id="carry-heading" className="gk-h2 mb-3">Things to carry</h2>
                <ul className="grid sm:grid-cols-2 gap-2 text-[15px] text-ink">
                  {tourData.things_to_carry.map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="mt-0.5 text-teal"><CheckIcon /></span>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {tourData.tour_manager && (
              <section aria-labelledby="manager-heading" className="gk-card p-4 sm:p-5 flex gap-4 items-center">
                {tourData.tour_manager.photo && (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-chip shrink-0">
                    <Image src={tourData.tour_manager.photo.optimized_card || tourData.tour_manager.photo.image}
                      alt={tourData.tour_manager.photo.alt_text || tourData.tour_manager.name} fill sizes="64px" className="object-cover" />
                  </div>
                )}
                <div>
                  <h2 id="manager-heading" className="text-xs font-semibold text-slate-ink">Your tour manager</h2>
                  <p className="gk-h3 text-lg!">{tourData.tour_manager.name}</p>
                  {tourData.tour_manager.line && <p className="text-sm text-ink">{tourData.tour_manager.line}</p>}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {(tourData.faqs || []).length > 0 && (
              <section>
                <h2 className="gk-h2 mb-5">Frequently Asked Questions</h2>
                <FaqList items={tourData.faqs.map((faq) => ({ question: faq.question, html: faq.answer }))} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20">
            {/* Price box: the backend's quote for the chosen date, sharing and travellers (the same as /book) */}
            {bookOnline && <PriceBox deps={onlineDeps} minAge={tourData.min_age || 0} />}
            <div id="group-enquiry" className="gk-card p-5 scroll-mt-24">
              {bookOnline ? (
                <p className="text-sm font-semibold text-ink">Have a question? Ask us</p>
              ) : (
                <>
                  <p className="text-xs text-slate-ink">Group price</p>
                  <p className="flex flex-wrap items-baseline gap-x-2">{priceLine}</p>
                </>
              )}
              <form onSubmit={handleEnquirySubmit} className="mt-4">
                <EnquiryForm
                  isInline={true}
                  showSubmitButton={false}
                  formData={enquiryFormData}
                  onChange={setEnquiryFormData}
                  onSubmit={handleEnquirySubmit}
                />
                <button type="submit" className={`gk-btn w-full mt-4 ${bookOnline ? 'gk-btn-line' : 'gk-btn-sun'}`}>
                  {bookOnline ? 'Send question' : 'Enquire Now'}
                </button>
              </form>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="gk-btn gk-btn-wa w-full mt-2.5">
                Chat on WhatsApp
              </a>
              <a href={itineraryPdfUrl} target="_blank" rel="noopener" className="gk-btn gk-btn-line w-full mt-2.5"
                aria-label={`Download the itinerary of ${tourData.name} (PDF)`}>
                Download Itinerary (PDF)
              </a>
              <p className="mt-3 text-center text-slate-ink text-xs leading-relaxed">
                Need More Information? Call/WhatsApp our Yatra Coordinator on <span className="font-semibold">{site.business.tour_desk_phone}</span>
              </p>
            </div>
          </aside>
        </div>

        {/* Blog posts that picked this group tour in the admin */}
        <RelatedContent title="Travel guides for this trip" items={tourData.related_posts} />

        {/* Guest reviews typed in by staff (text only); then the reviews guests sent from the site */}
        <GuestReviews reviews={tourData.guest_reviews} className="gk-wrap mb-10" />

        {/* Reviews Section */}
        <div className="gk-wrap mb-10">
          <ReviewSection contentType="group-tours" objectSlug={tourData.slug} />
        </div>

        {/* Popular Group Tours Section */}
        <SimilarTours tours={similarTours} />

        {/* Sticky CTA (mobile). Bookable online: "From ₹X · Book now" to #departures, out of the way while the
            departures, the enquiry form or the footer are on screen (it keeps its space: no layout shift). */}
        {bookOnline ? (
        <div className={`gk-sticky-cta lg:hidden sticky bottom-0 w-full bg-ink text-white py-3 flex justify-between items-center gap-3 px-4 z-40 shadow-lg transition-opacity duration-200 ${barHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-hidden={barHidden || undefined}>
          <p className="min-w-0 text-[15px] font-semibold">
            {fromPrice ? <>From {formatPrice(fromPrice)} <span className="text-xs font-normal opacity-80">+ GST</span></> : 'Book online'}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" tabIndex={barHidden ? -1 : 0}
              className="gk-btn gk-btn-wa px-3!" aria-label={`WhatsApp us about ${tourData.name}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>
            </a>
            <a href="#departures" onClick={toDepartures} tabIndex={barHidden ? -1 : 0} className="gk-btn gk-btn-sun">Book now</a>
          </div>
        </div>
        ) : (
        <div className="gk-sticky-cta lg:hidden sticky bottom-0 w-full bg-ink text-white py-3 flex justify-between items-center gap-3 px-4 z-40 shadow-lg">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold">
              {isPriceOnRequest(selectedPackage) ? (
                <span>Price on Request</span>
              ) : (
                <>
                  {formatPrice(basePrice)} • {tourData.duration} Days
                </>
              )}
            </p>
            <p className="text-xs opacity-80 truncate">
              {noDates ? "New departure dates coming soon" : "Send your query now, limited seats available"}
            </p>
          </div>
          {noDates ? (
            <a href="#next-departure" className="gk-btn gk-btn-sun shrink-0">Request dates</a>
          ) : (
            <button onClick={() => setIsEnquiryOpen(true)} className="gk-btn gk-btn-sun shrink-0">
              Send Query
            </button>
          )}
        </div>
        )}
      </main>
      <EnquiryForm
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        tourName={tourData.name}
        packageType={capitalizeFirst(selectedPackage?.package_type || '')}
        packagePrice={isPriceOnRequest(selectedPackage) ? 'Price on Request' : basePrice}
        formatPrice={formatPrice}
      />
      <Footer />
    </>
  );
}
