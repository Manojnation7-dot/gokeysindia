"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/gokeyslogo.png"
            alt="Gokeys Logo"
            width={40}
            height={40}
            className="object-contain"
          />
            <a
          href="/"
          className="text-xl font-extrabold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent hover:opacity-90 transition duration-300"
        >
          Gokeys India
        </a>

        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
          <a href="/tours" className="text-gray-700 hover:text-blue-600 font-medium">Tours</a>
          <a href="/destinations" className="text-gray-700 hover:text-blue-600 font-medium">Destinations</a>
          <a href="/hotels" className="text-gray-700 hover:text-blue-600 font-medium">Hotels</a>
          <a href="/grouptour" className="text-gray-700 hover:text-blue-600 font-medium">Group Tours</a>
          <a href="/sightseeing" className="text-gray-700 hover:text-blue-600 font-medium">Sightseeing</a>
          <a href="/cabs" className="text-gray-700 hover:text-blue-600 font-medium">Cabs</a>
          <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</a>
        </nav>

        {/* Desktop Contact */}
        <div className="hidden md:block text-sm text-gray-600 font-medium">
          📞 +91-9045916770
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-700 hover:text-blue-600"
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/93 z-50 flex flex-col items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-6 text-center">
            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-medium hover:text-blue-600"
            >
              Home
            </a>
            <a
              href="/tours"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-medium hover:text-blue-600"
            >
              Tours
            </a>
            <a
              href="/destinations"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-medium hover:text-blue-600"
            >
              Destinations
            </a>
            <a
              href="/hotels"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-medium hover:text-blue-600"
            >
              Hotels
            </a>
            <a
              href="/grouptour"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-medium hover:text-blue-600"
            >
              Group Tours
            </a>
            <a
              href="/cabs"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-medium hover:text-blue-600"
            >
              Cabs
            </a>
            <a
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl font-medium hover:text-blue-600"
            >
              Blog
            </a>
            <div className="pt-6 text-base text-gray-300">
              📞 +91-9876543210
            </div>
          </div>
        </div>
      )}
    </header>
  );
}