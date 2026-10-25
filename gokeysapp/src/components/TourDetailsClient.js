"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimilarTours from "@/components/SimilarTours";
import { downloadItinerary } from "@/lib/downloadItinerary";
import ReviewSection from "@/components/ReviewSection";
import EnquiryForm from "@/components/EnquiryForm";
import TourItineraryMain from "@/components/TourItineraryMain";
import { submitTourEnquiry } from "@/lib/tourEnquiry";
import ImageGallery from "@/components/ImageGallery";
import RelatedContent from "@/components/RelatedContent";
import { Breadcrumbs, FaqList } from "@/components/ui/kit";

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
} from "@/components/Icons";
import SmartSEO from "@/components/SmartSEO";
import {
  buildTourSchema,
  hasValidReviewRating,
  buildBreadcrumbList,
  buildFAQSchema,
} from "@/lib/seoSchemas";


// Selling price of a package: the discount price if set, else the price.
// null when the package is "price on request" or has no price (the API sends 0 for empty).
function effectivePrice(pkg) {
  if (!pkg || pkg.price_on_request) return null;
  if (Number(pkg.discount_price) > 0) return pkg.discount_price;
  return Number(pkg.price) > 0 ? pkg.price : null;
}

function hasDiscount(pkg) {
  return !!pkg && !pkg.price_on_request && Number(pkg.discount_price) > 0 &&
    Number(pkg.price) > Number(pkg.discount_price);
}

export default function TourDetailClient({ tourData,baseUrl,tourPath,similarTours }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPackage, setSelectedPackage] = useState(() => {
    if (!tourData?.pricing) return null;
    const standard = tourData.pricing.find(
      (pkg) => pkg.package_type.toLowerCase() === "standard"
    );
    return standard || tourData.pricing[0];
  });
  const [basePrice, setBasePrice] = useState(() => effectivePrice(selectedPackage));
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryFormData, setEnquiryFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    totalPersons: "",
    travelDate: "",
    message: "",
  });

  const handlePackageSelect = (pkg) => {
  setSelectedPackage(pkg);
  setBasePrice(effectivePrice(pkg));
};

  // The API sends 0 for an empty price/discount, so 0 means "no price" here
  const formatPrice = (price) =>
    price === null || price === undefined || Number(price) <= 0
      ? "Price on Request"
      : `₹${Number(price).toLocaleString()}`;

  const getSavings = (pkg) =>
    hasDiscount(pkg) ? formatPrice(Number(pkg.price) - Number(pkg.discount_price)) : null;
      

  const capitalizeFirst = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

  const handleEnquirySubmit = async (e) => {
    e?.preventDefault?.();
    const result = await submitTourEnquiry({
      tourName: tourData.name,
      packageType: selectedPackage?.package_type,
      packagePrice: basePrice,
      formData: enquiryFormData,
    });

    if (result.ok) {
      alert("Your enquiry has been submitted successfully!");
      setEnquiryFormData({ name: "", email: "", contactNo: "", totalPersons: "", travelDate: "", message: "" });
    } else {
      alert(result.message);
    }
  };
    const capitalizedDestinations = tourData?.destinations?.map(dest =>
      capitalizeFirst(dest)
    ) || [];



  // The itinerary PDF is built only on click (src/lib/downloadItinerary.js); it is no longer hidden in the page.
  const [downloading, setDownloading] = useState(false);
  const generatePDF = async () => {
    setDownloading(true);
    try {
      await downloadItinerary(tourData, { tourPath });
    } catch (err) {
      alert("Could not prepare the itinerary: " + (err?.message || err));
    } finally {
      setDownloading(false);
    }
  };

  const toggleDay = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const itineraryItems = tourData.itineraries?.map((day, index) => ({
  name: day.title || `Day ${day.day || index + 1}`,
  description: day.description
    ? day.description.replace(/<[^>]+>/g, "") // strip HTML
    : `Activities planned for Day ${day.day || index + 1}`,
})).filter(item => item.name && item.description) || [];

const tourSchema = buildTourSchema({
  slug: tourData.slug,
  name: tourData.name,
  description: tourData.meta_description || tourData.excerpt,
  imageUrl: tourData.featured_image?.optimized_banner || tourData.featured_image?.image,
  pricingTiers: tourData.pricing,
  rating: tourData.rating,
  reviewsCount: tourData.reviews_count,
  itineraryItems,
});

const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Tours", url: "/tours" },
  { name: tourData.name, url: `/tours/${tourData.slug}` }
]);

const faqSchema = tourData.faqs?.length > 0 
  ? buildFAQSchema(tourData.faqs, `/tours/${tourData.slug}`)
  : null;

   if (!tourData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Tour not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  const included = (tourData.inclusions_exclusions || []).filter((item) => item.is_inclusion);
  const excluded = (tourData.inclusions_exclusions || []).filter((item) => !item.is_inclusion);
  const whatsappUrl = `https://wa.me/917830718687?text=${encodeURIComponent(`Hello Gokeys India, I want to enquire about ${tourData.name}.`)}`;
  const durationText = `${tourData.duration_nights ? `${tourData.duration_nights} Nights ` : ""}${tourData.duration_days ? `${tourData.duration_days} Days` : ""}`;
  const facts = [
    ["Duration", durationText],
    ["Starting Location", tourData.starting_location || "TBD"],
    ["Minimum Pax", tourData.min_pax || "6 Persons"],
    [
      "Reviews",
      hasValidReviewRating(tourData.rating, tourData.reviews_count)
        ? `${tourData.rating} (${tourData.reviews_count} Tour Reviews)`
        : "Gokeys India — 4.8 · 164 Google Reviews",
    ],
  ];

  return (
    <>
      <SmartSEO schema={[tourSchema, breadcrumbSchema, faqSchema]} />
      <Header />
      <main className="bg-mist text-ink">
        <div className="gk-wrap pt-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tours", href: "/tours" }, { label: tourData.name }]} />
          <h1 className="gk-h1 text-3xl! md:text-[2.6rem]! max-w-3xl">{tourData.name}</h1>
          <div className="flex flex-wrap gap-1.5 mt-3 mb-5">
            {tourData.trip_types?.[0]?.name && <span className="gk-chip gk-chip-sun">{tourData.trip_types[0].name}</span>}
            {tourData.duration_days && <span className="gk-chip">{tourData.duration_days} days</span>}
            {tourData.starting_location && <span className="gk-chip">Pickup from {tourData.starting_location}</span>}
            {(tourData?.destinations || []).map((dest, idx) => (
              <span key={idx} className="gk-chip">{capitalizeFirst(dest.name)}</span>
            ))}
          </div>

          {/* Gallery */}
          <ImageGallery
            alt={tourData.featured_image?.alt_text || tourData.name}
            images={[
              tourData.featured_image?.optimized_banner || tourData.featured_image?.image,
              ...(tourData.gallery_images?.map(img => img.optimized || img.image) || [])
            ]}
          />
        </div>

        <div className="gk-wrap py-8 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Main column */}
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
              {tourData.pricing?.length > 0 && (
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
                          <div className="text-sm">
                            {hasDiscount(pkg) ? (
                              <>
                                <span className="line-through opacity-60">{formatPrice(pkg.price)}</span>{" "}
                                <span className="font-bold">{formatPrice(pkg.discount_price)}</span>
                                <div className={`text-xs ${active ? "text-sun" : "text-wa"}`}>Save {getSavings(pkg)}</div>
                              </>
                            ) : (
                              <span className="font-bold">{formatPrice(effectivePrice(pkg))}</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {(tourData.highlights || []).length > 0 && (
                <div className="mt-8">
                  <h3 className="gk-h3 mb-3">Tour Highlights</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {tourData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 text-teal"><CheckIcon /></span>
                        <span className="text-gray-800">{highlight.highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Itinerary */}
            <TourItineraryMain tourData={tourData} />

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
            <div className="gk-card p-5">
              <p className="text-xs text-slate-ink">Price</p>
              <p className="flex flex-wrap items-baseline gap-x-2">
                {hasDiscount(selectedPackage) && (
                  <span className="text-sm text-slate-400 line-through">{formatPrice(selectedPackage?.price)}</span>
                )}
                <span className="gk-price text-3xl">{formatPrice(basePrice)}</span>
                <span className="text-xs text-slate-ink">Per Adult</span>
              </p>
              {getSavings(selectedPackage) && (
                <span className="inline-block mt-2 gk-chip bg-[#dff4e7]! text-[#13703b]!">Save {getSavings(selectedPackage)}</span>
              )}
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
              <button onClick={generatePDF} disabled={downloading} className="gk-btn gk-btn-line w-full mt-2.5">
                {downloading ? "Preparing PDF…" : "Download Itinerary"}
              </button>
              <p className="mt-3 text-center text-slate-ink text-xs leading-relaxed">
                Need More Information? Call/WhatsApp our Yatra Expert on <span className="font-semibold">+91-78307-18687</span>
              </p>
            </div>
          </aside>
        </div>

        {/* Blog posts that picked this tour in the admin */}
        <RelatedContent title="Travel guides for this trip" items={tourData.related_posts} />

        {/* Reviews Section */}
        <div className="gk-wrap mb-10">
          <ReviewSection contentType="tours" objectSlug={tourData.slug} />
        </div>

        {/* Similar tours */}
        {tourData && (
          <SimilarTours tours={similarTours} />
        )}

        {/* Sticky CTA (mobile) */}
        <div className="gk-sticky-cta lg:hidden sticky bottom-0 w-full bg-ink text-white py-3 flex justify-between items-center gap-3 px-4 z-40 shadow-lg">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold">
              {hasDiscount(selectedPackage) && (
                <><span className="line-through opacity-60">{formatPrice(selectedPackage?.price)}</span>{" "}</>
              )}
              {formatPrice(basePrice)} • {tourData.duration_days} Days
              {getSavings(selectedPackage) && (
                <span className="text-xs text-sun"> Save {getSavings(selectedPackage)}</span>
              )}
            </p>
            <p className="text-xs opacity-80 truncate">
              Send your query Now, Prices are rising so fast
            </p>
          </div>
          <button onClick={() => setIsEnquiryOpen(true)} className="gk-btn gk-btn-sun shrink-0">
            Send Query
          </button>
        </div>
      </main>
      <EnquiryForm
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        tourName={tourData.name}
        packageType={capitalizeFirst(selectedPackage?.package_type || "")}
        packagePrice={basePrice}
        formData={enquiryFormData}
        formatPrice={formatPrice}
      />
      <Footer />
    </>
  );
}
