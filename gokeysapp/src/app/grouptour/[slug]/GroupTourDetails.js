'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimilarTours from '@/components/SimilarGroupTours';
import ReviewSection from '@/components/ReviewSection';
import EnquiryForm from '@/components/EnquiryForm';
import TourItineraryMain from '@/components/TourItineraryMain';
import TourPDFContent from '@/components/TourPDFContent';
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
import { motion } from 'framer-motion';
import Image from 'next/image';

import SmartSEO from '@/components/SmartSEO'; 
import {
  buildTourSchema,
  buildBreadcrumbList,
  buildImageObject,
} from '@/lib/seoSchemas';
import { buildFAQSchema } from '@/lib/seoSchemas';

export default function GroupTourDetails({ tourData, baseUrl, documentNumber, currentDate,tourPath  }) {
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

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...enquiryFormData,
          tourName: tourData.name,
          packageType: capitalizeFirst(selectedPackage?.package_type || ''),
          packagePrice: isPriceOnRequest(selectedPackage)
            ? 'Price on Request'
            : basePrice,
        }),
      });

      if (res.ok) {
        console.log('Enquiry submitted');
        setEnquiryFormData({
          name: '',
          email: '',
          contactNo: '',
          totalPersons: '',
          travelDate: '',
          message: '',
        });
      } else {
        console.error('Failed to submit enquiry');
      }
    } catch (err) {
      console.error('Error:', err);
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
        name: tourData.name,
        description: tourData.meta_description || tourData.content.replace(/<\/?[^>]+(>|$)/g, ''),
        imageUrl: tourData.featured_image?.image || 'https://via.placeholder.com/600x400',
        price: isPriceOnRequest(selectedPackage)
          ? 'Price on Request'
          : getEffectivePrice(selectedPackage) || '0',
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
    { name: 'Group Tours', url: '/group-tours' },
    { name: tourData?.name || 'Tour Details', url: `/group-tours/${tourData?.slug}` },
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
      }))
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


  return (
    <>
      <Header />
      <SmartSEO schema={schemas} /> {/* Add SmartSEO with schemas */}
      <div className="text-gray-800 bg-white">
        {/* Hero Banner */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src={tourData.featured_image?.image || '/images/banner-image.png'}
            alt={`${tourData.name} Banner`}
            fill
            style={{ objectFit: 'cover' }}
            className="z-0"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-[5]"></div>
          <div className="absolute inset-0 flex items-end pb-16 md:items-center justify-center z-[6]">
            <div className="text-center text-white px-4 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-2">{tourData.name}</h1>
                <p className="text-lg md:text-2xl mb-6">
                    {isPriceOnRequest(selectedPackage) ? (
                      <span className="font-semibold">Price on Request</span>
                    ) : (
                      <>
                        <span className="line-through">{formatPrice(selectedPackage?.price)}</span>{' '}
                        <span className="font-semibold">{formatPrice(basePrice)}</span>
                        {getSavings(selectedPackage) && (
                          <span className="text-sm text-green-400"> Save {getSavings(selectedPackage)}</span>
                        )}
                      </>
                    )}
                  </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    Send Query
                  </button>
                  <button
                    onClick={generatePDF}
                    disabled={isLoading || !tourData}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      isLoading || !tourData
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                    }`}
                  >
                    Download Itinerary
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Facts Bar */}
        <div className="bg-blue-600 text-white py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>Next Departure: {departureDates[0] || 'TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon />
                <span>Group Size: {tourData.max_group_size || '12-20 People'}</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon />
                <span>4.8 ({tourData.reviews_count || 126} Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon />
                {tourData.destinations?.length ? (
                  tourData.destinations
                    .filter((dest) => dest && typeof dest === "string") // Remove undefined/null
                    .map((dest, idx) => (
                      <span key={idx}>
                        {capitalizeFirst(dest)} {/* Use dest directly */}
                        {idx !== tourData.destinations.filter((d) => d && typeof d === "string").length - 1 && ', '}
                      </span>
                    ))
                ) : (
                  <span>Harshil Valley</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            {['overview', 'itinerary', 'inclusions'].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-6 font-medium ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {capitalizeFirst(tab)}
              </button>
            ))}
          </div>

          {/* Content and Sidebar */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="md:col-span-2">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Tour Overview</h2>
                  <div
                    className="text-gray-700 mb-6 prose"
                    dangerouslySetInnerHTML={{ __html: tourData.content }}
                  />
                  {/* Package Selection */}
                  {Array.isArray(tourData.pricing) && tourData.pricing.length > 0 && (
                    <div className="my-8">
                      <h3 className="text-lg font-semibold mb-4">Choose Your Package</h3>
                      <div className="flex flex-wrap gap-4">
                           {tourData?.pricing?.map((pkg, index) => {
                                const effectivePrice = getEffectivePrice(pkg);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handlePackageSelect(pkg)}
                                    className={`px-4 py-2 rounded-lg border text-center ${
                                      selectedPackage?.package_type === pkg.package_type
                                        ? 'bg-blue-600 text-white -ml-2'
                                        : 'bg-white text-black hover:bg-gray-100'
                                    }`}
                                  >
                                    <div className="text-sm font-medium">
                                      {capitalizeFirst(pkg.package_type)}
                                    </div>

                                    <div className="text-sm">
                                      {isPriceOnRequest(pkg) ? (
                                        <span className="font-semibold">Price on Request</span>
                                      ) : (
                                        <>
                                          {pkg.discount_price && pkg.discount_price < pkg.price ? (
                                            <>
                                              <span className="line-through">{formatPrice(pkg.price)}</span>{' '}
                                              <span className="font-semibold">{formatPrice(pkg.discount_price)}</span>
                                              {getSavings(pkg) && (
                                                <div className="text-xs text-green-500">Save {getSavings(pkg)}</div>
                                              )}
                                            </>
                                          ) : (
                                            <span className="font-semibold">{formatPrice(pkg.price)}</span>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                      </div>
                    </div>
                  )}
                 {/* Tour Highlights */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Tour Highlights</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(tourData.highlights || []).map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 text-blue-600">
                        <CheckCircleIcon />
                      </div>
                      <span className="text-gray-700">{highlight.highlight}</span>
                    </div>
                  ))}
                  {(!tourData.highlights || tourData.highlights.length === 0) && (
                    <p className="text-gray-600">No highlights available for this tour.</p>
                  )}
                </div>
              </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === 'itinerary' && tourData && (
                <TourItineraryMain tourData={{ ...tourData, itinerary: tourData.itineraries }} />
              )}

              {/* Inclusions Tab */}
              {activeTab === 'inclusions' && (
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

            {/* Sidebar */}
            <div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-semibold">{tourData.name}</h3>
                  <p className="text-xl md:text-base font-medium">
                    {isPriceOnRequest(selectedPackage) ? (
                      <span className="font-semibold">Price on Request</span>
                    ) : (
                      <>
                        <span className="line-through">{formatPrice(selectedPackage?.price)}</span>{' '}
                        {formatPrice(basePrice)}
                        <span className="text-xs text-gray-700"> Per Adult</span>
                      </>
                    )}
                  </p>
                  <hr />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{tourData.duration} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Size</span>
                    <span className="font-medium">{tourData.max_group_size || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Season</span>
                    <span className="font-medium">{tourData.best_season || 'Year Round'}</span>
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all"
                      >
                        Enquire Now
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="py-12">
            <ReviewSection contentType="group-tours" objectSlug={tourData.slug} />
          </section>
        </div>

        {/* Popular Group Tours Section */}
            {tourData && (
                <SimilarTours
                  currentTourSlug={tourData.slug}
                  currentDestinations={tourData.destinations || []}
                />
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
        <div className="sticky bottom-0 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 flex justify-between items-center px-4 md:px-16 z-50 shadow-lg">
          <div>
            <p className="text-sm md:text-base font-medium">
                {isPriceOnRequest(selectedPackage) ? (
                  <span className="font-semibold">Price on Request</span>
                ) : (
                  <>
                    <span className="line-through">{formatPrice(selectedPackage?.price)}</span>{' '}
                    {formatPrice(basePrice)} • {tourData.duration} Days
                    {getSavings(selectedPackage) && (
                      <span className="text-xs text-green-400"> Save {getSavings(selectedPackage)}</span>
                    )}
                  </>
                )}
              </p>
            <p className="text-xs md:text-sm opacity-90">
              Send your query now, limited seats available
            </p>
          </div>
          <button
            onClick={() => setIsEnquiryOpen(true)}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-md"
          >
            Send Query
          </button>
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
      </div>
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