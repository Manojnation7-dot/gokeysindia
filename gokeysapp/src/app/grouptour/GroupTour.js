
"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Slider from "react-slick";
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SmartSEO from '@/components/SmartSEO';
import { buildBreadcrumbList, buildItemListSchema, buildFAQSchema } from '@/lib/seoSchemas';

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

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

export default function GroupTour({ tours = [] }) {
  const [openFaq, setOpenFaq] = useState(null);

  const isPriceOnRequest = (pricing) => {
    if (!pricing) return true;
    if (pricing.price_on_request) return true;
    const numeric = parseFloat(pricing.discount_price || pricing.price);
    return isNaN(numeric) || numeric === 0;
  };

  const formatPrice = (pricing) => {
    if (isPriceOnRequest(pricing)) return 'Price on Request';
    const numeric = parseFloat(pricing.discount_price || pricing.price);
    return `₹${numeric.toLocaleString('en-IN')}`;
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
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
      description: tour.content || 'Explore this amazing group tour!',
    };
  });

  const schemas = [];

// BreadcrumbList Schema
schemas.push(
  buildBreadcrumbList([
    { name: 'Home', url: '/' },
    { name: 'Group Tours', url: '/group-tours' },
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gokeys.in'}/grouptour/${tour.slug}`, // Use correct path
      description: tour.meta_description || tour.description || 'Explore this amazing group tour with Gokeys India.', // Non-empty description
      image: tour.image,
      offers: isPriceOnRequest(tour.price)
        ? undefined
        : {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gokeys.in'}/grouptour/${tour.slug}`, // Use correct path
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
    }))
  )
);

  return (
    <>
      <Head>
        <title>Group Tours | Gokeys India</title>
        <meta name="description" content="Explore curated group tours with Gokeys India for unforgettable travel experiences." />
      </Head>
      <main className="bg-gray-50">
        <Header />
        <SmartSEO schema={schemas} />
        {/* 1. Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center">
          <Image
            src="/images/banner-image.png"
            alt="Explore Group Tours with Gokeys India"
            fill
            style={{ objectFit: 'cover' }}
            className="z-0"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-40 z-[5]" />
          <div className="relative z-10 text-center text-white px-4">
            <motion.h1
              className="text-4xl md:text-6xl font-bold drop-shadow-lg"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Explore Group Tours with Unmatched Experiences
            </motion.h1>
            <motion.p
              className="mt-4 text-lg md:text-2xl drop-shadow-md max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Affordable adventures, curated itineraries, and fun-filled group travel await you.
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 120 }}
            >
              <Link href="#tours">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                  Explore Packages
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. Why Choose Group Tours */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Why Choose Our Group Tours?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Budget Friendly", desc: "Save more with group discounts and shared costs.", icon: "💰" },
                { title: "Local Experts", desc: "Guided by knowledgeable locals for authentic experiences.", icon: "🧑‍🏫" },
                { title: "Hassle-Free Planning", desc: "We handle logistics so you can focus on fun.", icon: "📋" },
                { title: "Customizable", desc: "Tailor your itinerary to suit your group’s needs.", icon: "⚙️" },
                { title: "Safety & Support", desc: "24/7 support and safety measures for peace of mind.", icon: "🛡️" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

 {/* 3. Popular Group Tour Packages */}
<section className="py-16 bg-gray-50" id="tours">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Popular Group Tour Packages</h2>
    <div className="relative">
      <Slider {...sliderSettings}>
        {processedTours.map((tour) => (
          <motion.div
            key={tour.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="px-3 pb-10"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 h-[400px] flex flex-col"> {/* Adjusted height */}
              {/* Image Section - Made larger */}
              <div className="relative h-52 flex-shrink-0 group overflow-hidden"> {/* Increased to h-52 */}
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-500 ease-in-out" /* Smoother animation */
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" /> {/* Subtle overlay */}
              </div>
              
              {/* Content Section - Tightened layout */}
              <div className="p-5 flex flex-col flex-grow space-y-2.5"> {/* Tighter spacing */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-snug"> {/* Better line height */}
                    {tour.title}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full whitespace-nowrap flex-shrink-0 mt-1">
                    {tour.type}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mt-1 flex-grow line-clamp-2 overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: tour.description }}
                    className="line-clamp-2"
                  />
                </div>
                
                {/* Price & CTA Section */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                  <span className="text-blue-600 font-bold text-base whitespace-nowrap">
                    {isPriceOnRequest(tour.price) ? 'Price on Request' : `From ${formatPrice(tour.price)}`}
                  </span>
                  <Link href={`/grouptour/${tour.slug}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition whitespace-nowrap text-sm font-medium">
                      View Tour
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
    </div>
  </div>
</section>

        {/* 4. Group Types You Cater To */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Who We Cater To</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: "Friends", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205" },
                { name: "Corporate Teams", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f475" },
                { name: "Students", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" },
                { name: "Families", image: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08" },
                { name: "Senior Citizens", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
              ].map((group, index) => (
                <motion.div
                  key={index}
                  className="relative h-40 rounded-lg overflow-hidden shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={group.image}
                    alt={group.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-lg font-semibold">{group.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Customer Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Groups Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya Sharma, Delhi",
                  quote: "Our Manali trip was a blast! The guides were amazing, and everything was perfectly planned.",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                },
                {
                  name: "Rahul Patel, Mumbai",
                  quote: "Varanasi with Gokeys was a spiritual journey we’ll never forget. Highly recommend!",
                  rating: 4,
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                },
                {
                  name: "Anita Rao, Bangalore",
                  quote: "The Goa beach tour was so much fun for our family. Hassle-free and affordable!",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "Choose Package", desc: "Browse our curated group tours.", icon: "🔍" },
                { step: "Customize", desc: "Tailor the itinerary to your group’s needs.", icon: "✏️" },
                { step: "Book & Pay", desc: "Secure your spot with easy payments.", icon: "💳" },
                { step: "Enjoy the Trip", desc: "Relax and make memories with your group.", icon: "🎉" },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-gray-50 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.step}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA Section */}
        <motion.section
          className="bg-blue-600 text-white py-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Group Trip?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Let’s create an unforgettable adventure tailored for your group!
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition">
              Plan My Trip
            </button>
          </Link>
        </motion.section>

        {/* 8. FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <button
                    className="w-full text-left p-4 flex justify-between items-center"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <span>{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && (
                    <div className="p-4 bg-gray-50">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Newsletter Section */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Want Exclusive Group Deals?</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest offers and travel tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}