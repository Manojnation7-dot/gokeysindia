"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimilarTours from "@/components/SimilarTours";
import TourPDFContent from "@/components/TourPDFContent";
import ReviewSection from "@/components/ReviewSection";
import EnquiryForm from "@/components/EnquiryForm";
import TourItineraryMain from "@/components/TourItineraryMain";
import { getCSRFToken } from "@/lib/getCSRFToken";
import ImageGallery from "@/components/ImageGallery";

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
  buildBreadcrumbList,
  buildFAQSchema,
} from "@/lib/seoSchemas";


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
  const [basePrice, setBasePrice] = useState(
    selectedPackage ? selectedPackage.discount_price || selectedPackage.price : null
  );
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
  setBasePrice(pkg.discount_price || pkg.price);
};

  const formatPrice = (price) => `₹${Number(price).toLocaleString()}`;

  const getSavings = (pkg) =>
    pkg.discount_price && pkg.price > pkg.discount_price
      ? formatPrice(pkg.price - pkg.discount_price)
      : null;
      

  const capitalizeFirst = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

  const handleEnquirySubmit = async (e) => {
  e.preventDefault();

  try {
    const csrfToken = getCSRFToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-enquiries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        tour_name: tourData.name,
        package_type: selectedPackage?.package_type,
        package_price: basePrice,
        name: enquiryFormData.name,
        email: enquiryFormData.email,
        contact_no: enquiryFormData.contactNo,
        total_persons: parseInt(enquiryFormData.totalPersons || "0", 10),
        travel_date: enquiryFormData.travelDate,
        message: enquiryFormData.message,
      }),
    });

    if (res.ok) {
      console.log("Enquiry submitted successfully!");
      setEnquiryFormData({ name: "", email: "", contactNo: "", totalPersons: "", travelDate: "", message: "" });
    } else {
      const errorText = await res.text();
      console.error("Submit failed:", res.status, errorText);
    }

  } catch (error) {
    console.error("❌ Network or unexpected error:", error);
    alert("Something went wrong while submitting your enquiry. Please try again later.");
  }
};
    const capitalizedDestinations = tourData?.destinations?.map(dest =>
      capitalizeFirst(dest)
    ) || [];



  const generatePDF = async () => {
    if (!tourData) {
      alert("Tour data is not available. Please try again later.");
      return;
    }

    const element = document.getElementById("pdf-tour-content");
    if (!element) {
      alert("Failed to generate PDF: Content not found.");
      return;
    }

    const container = document.getElementById("pdf-tour-content-container");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "210mm";
    container.style.height = "auto";
    container.style.overflow = "visible";

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.3,
        filename: `${tourData.slug || "tour"}-details.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert("Failed to generate PDF: " + err.message);
    } finally {
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "";
      container.style.height = "";
      container.style.overflow = "";
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
  price: selectedPackage?.discount_price || selectedPackage?.price,
  itineraryItems,
});

const breadcrumbSchema = buildBreadcrumbList([
  { name: "Home", url: "/" },
  { name: "Tours", url: "/tours" },
  { name: tourData.name, url: `/tours/${tourData.slug}` }
]);

const faqSchema = tourData.faqs?.length > 0 
  ? buildFAQSchema(tourData.faqs, tourData.slug) // 👈 Pass slug here
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

  return (
    <>
        <SmartSEO schema={[tourSchema, breadcrumbSchema, faqSchema]} />
      <Header />
      <div className="text-gray-800 bg-white">
        {/* Hero Banner */}
              
        <div className="text-gray-800 bg-white">
  {/* Full-width Image Gallery */}
  <div className="w-full mt-4">
    <ImageGallery
      images={[
        tourData.featured_image?.optimized_banner || tourData.featured_image?.image,
        ...(tourData.gallery_images?.map(img => img.optimized || img.image) || [])
      ]}
    />
  </div>

  {/* Title + Pricing + CTAs */}
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="bg-gradient-to-r from-blue-50 to-brand-50 rounded-2xl p-6 md:p-8 shadow-lg">
      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Left: Title + Pricing */}
        <div className="md:col-span-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            {tourData.name}
          </h1>

          {/* Pricing Card */}
          <div className="inline-block bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-baseline gap-3">
              <span className="text-gray-400 line-through text-lg">
                {formatPrice(selectedPackage?.price)}
              </span>
              <span className="text-3xl font-bold text-brand-600">
                {formatPrice(basePrice)}
              </span>
            </div>
            {getSavings(selectedPackage) && (
              <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                💰 Save {getSavings(selectedPackage)}
              </div>
            )}
          </div>
        </div>

        {/* Right: CTA buttons */}
        <div className="flex flex-col gap-3 justify-center md:justify-end">
          <button
            onClick={() => setIsEnquiryOpen(true)}   
            className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-600 text-white rounded-xl hover:from-brand-700 hover:to-brand-700 shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            ✨ Send Query
          </button>
          <button
            onClick={generatePDF}   
            className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-800 rounded-xl hover:bg-gray-50 shadow-md transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            📄 Download Itinerary
          </button>
        </div>
      </div>
    </div>
  </div>
</div>





        {/* Quick Facts Bar */}
        <div className="bg-brand-600 text-white py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>Starting Location: {tourData.starting_location || "TBD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon />
                <span>Minimum Pax: {tourData.min_pax || "6 Persons"}</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon />
                <span>
                  {tourData.rating || "4.8"} ({tourData.reviews_count || 126} Reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon />
                {(tourData?.destinations || []).map((dest, idx) => (
                  <span key={idx}>
                    {capitalizeFirst(dest.name)}
                    {idx !== tourData.destinations.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            {["overview", "itinerary", "inclusions"].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-6 font-medium ${
                  activeTab === tab
                    ? "text-brand-600 border-b-2 border-brand-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content and Sidebar */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="md:col-span-2">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Tour Overview</h2>
                  <div
                    className="text-gray-700 mb-6 prose"
                    dangerouslySetInnerHTML={{ __html: tourData.content }}
                  />
                  {/* Package Selection */}
                  <div className="my-8">
                    <h3 className="text-lg font-semibold mb-4">Choose Your Package</h3>
                    <div className="flex flex-wrap gap-4">
                      {tourData.pricing.map((pkg, index) => (
                        <button
                          key={index}
                          onClick={() => handlePackageSelect(pkg)}
                          className={`px-4 py-2 rounded-lg border text-center ${
                            selectedPackage?.package_type === pkg.package_type
                              ? "bg-brand-600 text-white -ml-2"
                              : "bg-white text-black hover:bg-gray-100"
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {capitalizeFirst(pkg.package_type)}
                          </div>
                          <div className="text-sm">
                            <span className="line-through">{formatPrice(pkg.price)}</span>
                            {pkg.discount_price && (
                              <>
                                {" "}
                                <span className="font-semibold">{formatPrice(pkg.discount_price)}</span>
                                <div className="text-xs text-green-500">
                                  Save {getSavings(pkg)}
                                </div>
                              </>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Tour Highlights</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {(tourData.highlights || []).map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-1 text-brand-600">
                            <CheckCircleIcon />
                          </div>
                          <span className="text-gray-700">{highlight.highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === "itinerary" && tourData && <TourItineraryMain tourData={tourData} />}

              {/* Inclusions Tab */}
              {activeTab === "inclusions" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">What's Included</h3>
                    <div className="space-y-4">
                      {(tourData.inclusions_exclusions || [])
                        .filter((item) => item.is_inclusion)
                        .map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="mt-1 text-green-500">
                              <CheckIcon />
                            </div>
                            <span className="text-gray-700">{item.description}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">What's Not Included</h3>
                    <div className="space-y-4">
                      {(tourData.inclusions_exclusions || [])
                        .filter((item) => !item.is_inclusion)
                        .map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="mt-1 text-red-500">
                              <XIcon />
                            </div>
                            <span className="text-gray-700">{item.description}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (Visible for All Tabs) */}
            <div>
              <div className="bg-grey-50 p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-semibold">{tourData.name}</h3>
                  <p className="text-xl md:text-base font-medium">
                    <span className="line-through">{formatPrice(selectedPackage?.price)}</span>{" "}
                    {formatPrice(basePrice)}
                    <span className="text-xs text-gray-700"> Per Adult</span>
                  </p>
                  <hr />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{`${
                      tourData.duration_nights ? `${tourData.duration_nights} Nights ` : ""
                    }${tourData.duration_days ? `${tourData.duration_days} Days` : ""}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minium Pax</span>
                    <span className="font-medium">{tourData.min_pax || "6"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Season</span>
                    <span className="font-medium">{tourData.best_season || "Year Round"}</span>
                  </div>
              <form onSubmit={handleEnquirySubmit}>
                <EnquiryForm
                  isInline={true}
                  showSubmitButton={false}
                  formData={enquiryFormData}
                  onChange={setEnquiryFormData}
                  onSubmit={handleEnquirySubmit}
                />
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium transition-all"
                  >
                    Enquire Now
                  </button>
                  {/* Contact info below the button */}
                  <p className="mt-3 text-center text-gray-700 text-sm">
                    Need More Information? Call/WhatsApp our Yatra Expert on <span className="font-semibold">+91-78307-18687</span>
                  </p>
                </div>
              </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <ReviewSection contentType="tours" objectSlug={tourData.slug} />
        </div>

        {/* Popular Group Tours Section */}
       {tourData && (
          <SimilarTours tours={similarTours} />
        )}

        {/* FAQ Section */}
        <section className="py-12 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {(tourData.faqs || []).map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50 transition-all"
                  onClick={() => toggleDay(index + 10)}
                >
                  <span>{faq.question}</span>
                  {expandedDay === index + 10 ? <MinusIcon /> : <PlusIcon />}
                </button>
                {expandedDay === index + 10 && (
                  <div
                    className="p-4 pt-2 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="sticky bottom-0 w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white py-4 flex justify-between items-center px-4 md:px-16 z-50 shadow-lg">
          <div>
            <p className="text-sm md:text-base font-medium">
              <span className="line-through">{formatPrice(selectedPackage?.price)}</span>{" "}
              {formatPrice(basePrice)} • {tourData.duration_days} Days
              {getSavings(selectedPackage) && (
                <span className="text-xs text-green-400"> Save {getSavings(selectedPackage)}</span>
              )}
            </p>
            <p className="text-xs md:text-sm opacity-90">
              Send your query Now, Prices are rising so fast
            </p>
          </div>
          <button
            onClick={() => setIsEnquiryOpen(true)}
            className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-md"
          >
            Send Query
          </button>
        </div>

        {/* Hidden PDF Content */}
        <div
          id="pdf-tour-content-container"
          style={{ position: "absolute", left: "-9999px", top: "0" }}
        >
          <div id="pdf-tour-content">
            <TourPDFContent tourData={tourData} 
             baseUrl={baseUrl}
             tourPath={tourPath}
             />
          </div>
        </div>
      </div>
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