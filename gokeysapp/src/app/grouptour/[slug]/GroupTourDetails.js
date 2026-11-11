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
import { downloadItinerary } from '@/lib/downloadItinerary';
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
  getSavings,
} from '@/lib/pricingUtils';
import { submitTourEnquiry } from '@/lib/tourEnquiry';
import ImageGallery from '@/components/ImageGallery';
import { Breadcrumbs, FaqList } from '@/components/ui/kit';
import {
  getDepartures, formatDepartureDate, departureChip, formatPickupTime, SHARING_LABELS, lowestAdultPrice,
} from '@/lib/departures';
import NextDepartureRequest from '@/components/NextDepartureRequest';

import SmartSEO from '@/components/SmartSEO'; 
import {
  buildTourSchema,
  hasValidReviewRating,
  buildBreadcrumbList,
  buildImageObject,
} from '@/lib/seoSchemas';
import { buildFAQSchema } from '@/lib/seoSchemas';

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
  const advancePercent = onlineDeps.find((d) => d.advancePercent)?.advancePercent || 25;
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
const [isLoading, setIsLoading] = useState(false);
  // The itinerary PDF is built only on click (src/lib/downloadItinerary.js); it is no longer hidden in the page.
  const generatePDF = async () => {
    setIsLoading(true);
    try {
      await downloadItinerary(tourData, { tourPath });
    } catch (err) {
      alert('Could not prepare the itinerary: ' + (err?.message || err));
    } finally {
      setIsLoading(false);
    }
  };

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
        rating: tourData.rating,
        reviewsCount: tourData.reviews_count,
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
        width: tourData.featured_image.width || 600,
        height: tourData.featured_image.height || 400,
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
  const whatsappUrl = `https://wa.me/917830718687?text=${encodeURIComponent(`Hello Gokeys India, I want to enquire about ${tourData.name} (Group Tour).`)}`;
  const reserve = (dep) => {
    setReserved(dep.id ? { id: dep.id, date: dep.date } : null);
    setEnquiryFormData((prev) => ({ ...prev, travelDate: dep.date }));
    document.getElementById("group-enquiry")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const noDates = departureInfo.state === "none";
  const facts = [
    ["Next Departure", departureInfo.state === "error" ? "Please enquire" : upcoming[0] ? formatDate(upcoming[0].date) : "Dates coming soon"],
    ["Duration", tourData.duration ? `${tourData.duration} Days` : "N/A"],
    ["Group Size", tourData.max_group_size || "12-20 People"],
    [
      "Reviews",
      hasValidReviewRating(tourData.rating, tourData.reviews_count)
        ? `${tourData.rating} (${tourData.reviews_count} Tour Reviews)`
        : "Gokeys India — 4.8 · 164 Google Reviews",
    ],
  ];
  const priceLine = isPriceOnRequest(selectedPackage) ? (
    <span className="gk-price text-3xl">Price on Request</span>
  ) : (
    <>
      {getSavings(selectedPackage) && (
        <span className="text-sm text-slate-400 line-through">{formatPrice(selectedPackage?.price)}</span>
      )}
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
                dangerouslySetInnerHTML={{ __html: tourData.content }}
              />

              {/* Package Selection */}
              {Array.isArray(tourData.pricing) && tourData.pricing.length > 0 && (
                <div className="mt-8">
                  <h3 className="gk-h3 mb-3">Choose Your Package</h3>
                  <div className="flex flex-wrap gap-3">
                    {tourData.pricing.map((pkg, index) => {
                      const active = selectedPackage?.package_type === pkg.package_type;
                      const isDiscounted =
                        Number(pkg.discount_price) && Number(pkg.discount_price) < Number(pkg.price);
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
                            ) : isDiscounted ? (
                              <>
                                <span className="line-through opacity-60">{formatPrice(pkg.price)}</span>{' '}
                                <span className="font-bold">{formatPrice(pkg.discount_price)}</span>
                                {getSavings(pkg) && (
                                  <div className={`text-xs ${active ? "text-sun" : "text-wa"}`}>Save {getSavings(pkg)}</div>
                                )}
                              </>
                            ) : (
                              <span className="font-bold">{formatPrice(pkg.price)}</span>
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
                <h3 className="gk-h3 mb-3">Tour Highlights</h3>
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
                    <li className="gk-panel px-3 py-2"><span className="font-semibold">Pay {advancePercent}% now</span>, the balance 7 days before departure</li>
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
                          {chip?.kind === "guaranteed" && (
                            <span className="gk-chip bg-green-50! text-green-800!">{chip.text}</span>
                          )}
                          {chip?.kind === "filling" && <span className="gk-chip gk-chip-sun">{chip.text}</span>}
                          {chip?.kind === "needed" && <span className="gk-chip">{chip.text}</span>}
                          {dep.bookable && dep.seatsLeft != null ? (
                            <span className="gk-chip gk-chip-sun">{dep.seatsLeft} seats left</span>
                          ) : (
                            <span className="gk-chip">{dep.label}</span>
                          )}
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
            {bookOnline && (
              <div className="gk-card p-5 mb-4">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  {fromPrice ? <>
                    <span className="text-xs text-slate-ink">From</span>
                    <span className="gk-price text-3xl">{formatPrice(fromPrice)}</span>
                    <span className="text-xs text-slate-ink">per person + GST</span>
                  </> : <span className="gk-price text-2xl">Book online</span>}
                </p>
                {fromPrice && <p className="mt-1 text-xs font-semibold text-teal">Book online</p>}
                <a href="#departures" onClick={toDepartures} className="gk-btn gk-btn-sun w-full mt-3">Book now</a>
                <p className="mt-2 text-xs text-slate-ink">Choose your date below. Pay {advancePercent}% now, the rest 7 days before departure.</p>
              </div>
            )}
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
              <button
                onClick={generatePDF}
                disabled={isLoading || !tourData}
                className="gk-btn gk-btn-line w-full mt-2.5 disabled:opacity-50"
              >
                {isLoading ? 'Preparing PDF…' : 'Download Itinerary'}
              </button>
              <p className="mt-3 text-center text-slate-ink text-xs leading-relaxed">
                Need More Information? Call/WhatsApp our Yatra Coordinator on <span className="font-semibold">+91-7830718687</span>
              </p>
            </div>
          </aside>
        </div>

        {/* Blog posts that picked this group tour in the admin */}
        <RelatedContent title="Travel guides for this trip" items={tourData.related_posts} />

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
            {fromPrice ? <>From {formatPrice(fromPrice)} <span className="text-xs font-normal opacity-80">per person + GST</span></> : 'Book online'}
          </p>
          <a href="#departures" onClick={toDepartures} tabIndex={barHidden ? -1 : 0} className="gk-btn gk-btn-sun shrink-0">Book now</a>
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
                  {getSavings(selectedPackage) && (
                    <span className="text-xs text-sun"> Save {getSavings(selectedPackage)}</span>
                  )}
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
