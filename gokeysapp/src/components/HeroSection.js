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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold hero-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Explore India with Gokeys
        </motion.h1>
        <motion.p
          className="mt-2 sm:mt-4 text-lg sm:text-xl md:text-2xl hero-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Group Tours to Char Dham, Kedarnath, 12 Jyotirling, Adi Kailash, Treks and more.
        </motion.p>
        <motion.div
          className="mt-4 sm:mt-6 px-4 sm:px-0 w-full flex justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 120 }}
        >
          <AnimatedSearchInput />
        </motion.div>
      </div>
    </section>
  );
}
