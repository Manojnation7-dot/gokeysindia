
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
  slidesToShow: 4, // ← CHANGED (was 3)
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1280,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1 },
    },
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
       {/* 1. Hero Section – Redesigned (Safe with Sticky Header) */}
          <section className="relative h-[80vh] flex items-center justify-center">
            {/* Background Image */}
            <Image
              src="/images/banner-image.png"
              alt="Explore Group Tours with Gokeys India"
              fill
              priority
              className="object-cover z-0"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-[5]" />

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg"
              >
                Explore Group Tours <br />
                <span className="text-blue-400">Together.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl mx-auto"
              >
                Affordable adventures, curated itineraries, and unforgettable group travel experiences.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
              >
                <Link href="#tours">
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg">
                    Explore Packages
                  </button>
                </Link>

                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-semibold rounded-xl transition">
                    Get Callback
                  </button>
                </Link>
              </motion.div>
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
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="px-3 pb-10"
                >
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col h-[400px] group">

                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                        {tour.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {tour.title}
                      </h3>

                      <div
                        className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4"
                        dangerouslySetInnerHTML={{ __html: tour.description }}
                      />

                      {/* Price + CTA */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                            Starting from
                          </p>
                          <p className="text-base font-extrabold text-slate-900">
                            {isPriceOnRequest(tour.price)
                              ? "Price on Request"
                              : formatPrice(tour.price)}
                          </p>
                        </div>

                        <Link href={`/grouptour/${tour.slug}`}>
                          <button className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 flex items-center justify-center transition-all">
                            →
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
        {/* 2. Why Choose Group Tours – Redesigned */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Why Choose Our Group Tours?
              </h2>
              <p className="text-slate-500 text-lg">
                Thoughtfully designed experiences that balance comfort, cost, and connection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  title: "Budget Friendly",
                  desc: "Save more with group discounts and shared travel costs.",
                  icon: "💰",
                },
                {
                  title: "Local Experts",
                  desc: "Explore destinations with knowledgeable local guides.",
                  icon: "🧑‍🏫",
                },
                {
                  title: "Hassle-Free",
                  desc: "We manage planning, bookings, and logistics end-to-end.",
                  icon: "📋",
                },
                {
                  title: "Customizable",
                  desc: "Trips tailored to your group’s interests and pace.",
                  icon: "⚙️",
                },
                {
                  title: "24×7 Support",
                  desc: "On-trip assistance and support whenever you need it.",
                  icon: "🛡️",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-slate-50 border border-slate-100 rounded-[1.75rem] p-6 text-center shadow-sm hover:shadow-md transition flex flex-col h-full"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
       {/* 4. Who We Cater To – Redesigned */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    
    {/* Premium Heading */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="inline-block mb-3 text-sm font-bold tracking-widest text-blue-600 uppercase">
        For Every Kind of Group
      </span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
        Who We Cater To
      </h2>
      <p className="text-lg text-slate-500">
        Whether it’s fun, bonding, learning, or relaxation — we design group journeys that fit perfectly.
      </p>
    </div>

    {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[
              { name: "Friends", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205" },
              { name: "Corporate Teams", image: "https://images.unsplash.com/photo-1630487656049-6db93a53a7e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Students", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" },
              { name: "Families", image: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08" },
              { name: "Senior Citizens", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
            ].map((group, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative h-52 md:h-64 rounded-[1.75rem] overflow-hidden group shadow-sm hover:shadow-md"
              >
                <Image
                  src={group.image}
                  alt={group.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-lg font-bold tracking-wide">
                    {group.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* 5. Testimonials – Redesigned */}
  <section className="py-24 bg-brand-600 relative overflow-hidden">
  {/* Soft background glow */}
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-40" />
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full blur-[120px] opacity-30" />

  <div className="relative max-w-7xl mx-auto px-4">
    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="inline-block mb-3 text-sm font-bold tracking-widest text-blue-200 uppercase">
        Guest Experiences
      </span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
        What Our Groups Say
      </h2>
      <p className="text-lg text-blue-100">
        Real stories from travelers who explored India together with us.
      </p>
    </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya Sharma",
                  location: "Delhi",
                  quote:
                    "Our Manali group trip was incredibly well planned. The coordination, hotels, and guides were all perfect.",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                },
                {
                  name: "Rahul Patel",
                  location: "Mumbai",
                  quote:
                    "The Varanasi tour was a deeply spiritual experience. Everything was smooth and hassle-free.",
                  rating: 4,
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                },
                {
                  name: "Anita Rao",
                  location: "Bangalore",
                  quote:
                    "Perfect family group tour to Goa. Safe, fun, and very affordable. Highly recommended!",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-white shadow-lg"
                >
                  {/* Stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg leading-relaxed italic mb-8 text-white/90">
                    “{testimonial.quote}”
                  </p>

                  {/* User */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/30">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-white/70">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* 6. Your Journey – Redesigned */}
  <section className="py-24 bg-slate-50">
  <div className="max-w-7xl mx-auto px-4">

    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto mb-20">
      <span className="inline-block mb-3 text-sm font-bold tracking-widest text-blue-600 uppercase">
        Simple Process
      </span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
        Your Journey in 4 Easy Steps
      </h2>
      <p className="text-lg text-slate-500">
        From your first enquiry to unforgettable memories — we handle everything.
      </p>
    </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
        
        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-slate-200" />

        {[
          {
            step: "Choose Your Trip",
            desc: "Browse and select the group tour that fits your travel style.",
            icon: "🔍",
          },
          {
            step: "Customize Details",
            desc: "Personalize dates, hotels, or activities if needed.",
            icon: "⚙️",
          },
          {
            step: "Confirm & Pay",
            desc: "Lock your spot with secure and flexible payment options.",
            icon: "💳",
          },
          {
            step: "Travel & Enjoy",
            desc: "Relax, explore, and make memories with your group.",
            icon: "🎉",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center text-4xl mb-6 border border-slate-100">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {item.step}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
        {/* 7. CTA – Redesigned */}
        <section className="py-24 bg-white px-4">
          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[3rem]">
            
            {/* Background Image */}
            <Image
              src="/images/banner-image.png"
              alt="Plan Your Group Trip"
              fill
              className="object-cover opacity-30"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl p-10 md:p-16 text-white">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
              >
                Ready to Plan Your <br /> Group Adventure?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-lg text-white/90 mb-10"
              >
                Tell us your group size, destination, and travel dates — our experts will handle the rest.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/contact">
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg">
                    Plan My Trip
                  </button>
                </Link>

                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-semibold rounded-xl transition">
                    Get Callback
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. FAQ – Redesigned */}
<section className="py-24 bg-slate-50">
  <div className="max-w-4xl mx-auto px-4">
    
    {/* Heading */}
    <div className="text-center max-w-2xl mx-auto mb-16">
      <span className="inline-block mb-3 text-sm font-bold tracking-widest text-blue-600 uppercase">
        Need Help?
      </span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-lg text-slate-500">
        Everything you need to know before booking your group tour.
      </p>
    </div>

    {/* FAQ List */}
        <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="border-b last:border-0 border-slate-100"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {faq.question}
                </h3>
                <span className="text-2xl font-bold text-blue-600">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 text-slate-600 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

        {/* 9. Newsletter – Redesigned */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="relative overflow-hidden rounded-[3rem] bg-blue-50 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                
                {/* Left Content */}
                <div className="max-w-xl">
                  <span className="inline-block mb-3 text-sm font-bold tracking-widest text-blue-600 uppercase">
                    Stay Updated
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                    Get Exclusive <br /> Group Tour Deals
                  </h2>
                  <p className="text-lg text-slate-600">
                    Be the first to know about new group departures, early-bird prices, and special travel offers.
                  </p>
                </div>

                {/* Form */}
                <form className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="flex-1 h-14 px-6 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                  <button
                    type="submit"
                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>

                {/* Decorative blur */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400 rounded-full blur-[120px] opacity-30" />
              </div>
            </div>
          </section>

        <Footer />
      </main>
    </>
  );
}