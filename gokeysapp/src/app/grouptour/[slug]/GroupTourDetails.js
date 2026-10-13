'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimilarTours from '@/components/SimilarGroupTours';
import ReviewSection from '@/components/ReviewSection';
import EnquiryForm from '@/components/EnquiryForm';
import TourItineraryMain from '@/components/TourItineraryMain';
import TourPDFContent from '@/components/TourPDFContent';
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
import { getDepartures, formatDepartureDate } from '@/lib/departures';
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
  const generatePDF = async () => {
    if (!tourData) {
      alert('Tour data is not available. Please try again later.');
      return;
    }

    const element = document.getElementById('pdf-tour-content');
    if (!element) {
      alert('Failed to generate PDF: Content not found.');
      return;
    }

    const container = document.getElementById('pdf-tour-content-container');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.height = 'auto';
    container.style.overflow = 'visible';

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0.3,
        filename: `${tourData.slug || 'group-tour'}-details.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '';
      container.style.height = '';
      container.style.overflow = '';
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
              <section>
                <h2 className="gk-h2 mb-4">Upcoming departures</h2>
                <div className="gk-card overflow-x-auto">
                  <table className="w-full text-sm min-w-110">
                    <thead className="bg-ink text-white text-left">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Date</th>
                        <th className="px-5 py-3 font-semibold">Seats</th>
                        <th className="px-5 py-3 font-semibold">Price</th>
                        <th className="px-5 py-3"><span className="sr-only">Reserve</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcoming.map((dep) => (
                        <tr key={dep.date} className="border-t border-line">
                          <td className="px-5 py-3 font-bold whitespace-nowrap">{formatDate(dep.date)}</td>
                          <td className="px-5 py-3">
                            {dep.bookable && dep.seatsLeft != null ? (
                              <span className="gk-chip gk-chip-sun">{dep.seatsLeft} left</span>
                            ) : (
                              <span className="gk-chip">{dep.label}</span>
                            )}
                          </td>
                          <td className="px-5 py-3 font-semibold">
                            {dep.price ? formatPrice(dep.price) : isPriceOnRequest(selectedPackage) ? "Price on Request" : formatPrice(basePrice)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {dep.bookable ? (
                              <button onClick={() => reserve(dep)} className="gk-btn gk-btn-ink py-2!">Reserve</button>
                            ) : (
                              <span className="text-xs font-semibold text-slate-ink">{dep.label}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
            <div id="group-enquiry" className="gk-card p-5 scroll-mt-24">
              <p className="text-xs text-slate-ink">Group price</p>
              <p className="flex flex-wrap items-baseline gap-x-2">{priceLine}</p>
              <form onSubmit={handleEnquirySubmit} className="mt-4">
                <EnquiryForm
                  isInline={true}
                  showSubmitButton={false}
                  formData={enquiryFormData}
                  onChange={setEnquiryFormData}
                  onSubmit={handleEnquirySubmit}
                />
                <button type="submit" className="gk-btn gk-btn-sun w-full mt-4">
                  Enquire Now
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
                Download Itinerary
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

        {/* Sticky CTA (mobile) */}
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

        {/* Hidden PDF Content */}
        <div
          id="pdf-tour-content-container"
          style={{ position: 'absolute', left: '-9999px', top: '0' }}
        >
          <div id="pdf-tour-content">
            <TourPDFContent
            tourData={tourData}
            baseUrl={baseUrl}
            documentNumber={documentNumber}
            currentDate={currentDate}
            tourPath={tourPath}
            />
          </div>
        </div>
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
