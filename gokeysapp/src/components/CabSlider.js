'use client';

import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CabCard from '@/components/CabsCard';

const cabs = [
  {
    id: 1,
    name: 'Swift Dzire',
    type: 'Sedan',
    image: '/images/swift-dzire.png',
    seats: 4,
    ac: true,
    pricePerDay: 4000,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999998',
    whatsapp: 'https://wa.me/919999999998?text=Hi%20I%27m%20interested%20in%20Swift%20Dzire%20cab',
  },
  {
    id: 2,
    name: 'Maruti Ertiga',
    type: 'SUV',
    image: '/images/ertiga.png',
    seats: 6,
    ac: true,
    pricePerDay: 5000,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999999',
    whatsapp: 'https://wa.me/919999999999?text=Hi%20I%27m%20interested%20in%20Maruti%20Ertiga%20cab',
  },
  {
    id: 3,
    name: 'Kia Carens',
    type: 'SUV',
    image: '/images/kia-carens.png',
    seats: 6,
    ac: true,
    pricePerDay: 5500,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999998',
    whatsapp: 'https://wa.me/919999999998?text=Hi%20I%27m%20interested%20in%20Kia%20Carens%20cab',
  },
  {
    id: 4,
    name: 'Innova',
    type: 'SUV',
    image: '/images/innova.png',
    seats: '6-7',
    ac: true,
    pricePerDay: 5800,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999998',
    whatsapp: 'https://wa.me/919999999998?text=Hi%20I%27m%20interested%20in%20Innova%20cab',
  },
  {
    id: 5,
    name: 'Innova Crysta',
    type: 'SUV',
    image: '/images/innova-crysta.png',
    seats: 6,
    ac: true,
    pricePerDay: 6500,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999999',
    whatsapp: 'https://wa.me/919999999999?text=Hi%20I%27m%20interested%20in%20Innova%20Crysta%20cab',
  },
  {
    id: 6,
    name: 'Bolero',
    type: 'SUV',
    image: '/images/bolero.png',
    seats: '6-8',
    ac: false,
    pricePerDay: 4200,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999998',
    whatsapp: 'https://wa.me/919999999998?text=Hi%20I%27m%20interested%20in%20Bolero%20cab',
  },
  {
    id: 7,
    name: 'Cruiser',
    type: 'Maxi Cab',
    image: '/images/cruiser.png',
    seats: '10-11',
    ac: false,
    pricePerDay: 6500,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999998',
    whatsapp: 'https://wa.me/919999999998?text=Hi%20I%27m%20interested%20in%20Cruiser%20cab',
  },
  {
    id: 8,
    name: 'Tempo Travellers',
    type: 'Mini Bus',
    image: '/images/tempo-14-seater.png',
    seats: '11-14',
    ac: false,
    pricePerDay: 8500,
    minKmPerDay: 250,
    location: 'Haridwar',
    phone: '+919999999998',
    whatsapp: 'https://wa.me/919999999998?text=Hi%20I%27m%20interested%20in%20Tempo%20Travellers%20cab',
  },
];

export default function CabSlider() {
  // Animation variants for cab cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Staggered animation for each card
      },
    }),
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: cabs.length > 4,
    speed: 600,
    slidesToShow: Math.min(4, cabs.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    lazyLoad: 'ondemand', // Added for better performance
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-blue-900 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Book a Cab Now
        </motion.h2>
        <Slider {...settings}>
          {cabs.map((cab, index) => (
            <div key={cab.id} className="px-2">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.3 }}
              >
                <CabCard cab={cab} />
              </motion.div>
            </div>
          ))}
        </Slider>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OfferCatalog',
              name: 'Cab Services',
              itemListElement: cabs.map((cab) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: cab.name,
                  description: `${cab.type} with ${cab.seats} seats, ${cab.ac ? 'AC' : 'Non-AC'}, available in ${cab.location}`,
                  image: cab.image,
                  offers: {
                    '@type': 'Offer',
                    price: cab.pricePerDay,
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                  },
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}