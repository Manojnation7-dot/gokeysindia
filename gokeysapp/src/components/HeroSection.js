"use client";

import { motion } from "framer-motion";
import AnimatedSearchInput from "./AnimatedSearchInput";

export default function HeroSection() {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/hero-bg.png"
          alt="Himalayan Adventure"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="hero-overlay z-5" />
      <div className="relative z-10 text-center text-white px-4 sm:px-6">
        <motion.h1
         className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
         Explore{" "}
          <span className="bg-gradient-to-r from-orange-400 via-white to-green-500 bg-clip-text text-transparent drop-shadow-sm">
            India
          </span>{" "}
          with Gokeys
        </motion.h1>
       <motion.p
        className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        India's trusted travel agency based in Haridwar — curated group journeys from sacred Char Dham and Kedarnath to Adi Kailash, 12 Jyotirlinga pilgrimages, and unforgettable Himalayan treks.
      </motion.p>

      <motion.div
        className="mt-10 w-full flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 120 }}
      >
        <AnimatedSearchInput />
      </motion.div>
      </div>
    </section>
  );
}
