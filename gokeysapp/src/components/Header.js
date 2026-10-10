"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/hotels", label: "Hotels" },
  { href: "/grouptour", label: "Group Tours" },
  { href: "/sightseeing", label: "Sightseeing" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="bg-white/95 backdrop-blur border-b border-line sticky top-0 z-50">
        <div className="gk-wrap h-16 flex items-center justify-between gap-4">
          {/* Logo + Title */}
          <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Gokeys India home">
            <Image
              src="/images/gokeyslogo.png"
              alt="Gokeys Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="gk-display text-xl font-extrabold text-ink">
              Gokeys <span className="text-teal">India</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[15px] font-semibold text-ink">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative py-5 hover:text-teal transition-colors ${
                  isActive(item.href)
                    ? "after:absolute after:left-0 after:right-0 after:bottom-3 after:h-0.5 after:rounded-full after:bg-sun"
                    : ""
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Contact */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+919045916770" className="flex items-center gap-2 text-[15px] font-semibold text-ink hover:text-teal transition-colors">
              <Phone size={16} className="text-teal" />
              +91-9045916770
            </a>
            <a href="/contact" className="gk-btn gk-btn-sun">Plan my trip</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 -mr-2 text-ink"
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu: outside <header>, whose backdrop blur would trap it */}
      {isOpen && (
        <div className="fixed inset-0 bg-ink z-60 flex flex-col overflow-y-auto" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="gk-wrap h-16 flex items-center justify-between shrink-0">
            <span className="gk-display text-xl font-extrabold text-white">
              Gokeys <span className="text-sun">India</span>
            </span>
            <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-white" aria-label="Close menu">
              <X size={28} />
            </button>
          </div>
          <nav className="gk-wrap flex flex-col gap-1 pt-4 pb-10">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`gk-display text-2xl font-bold py-2.5 border-b border-white/10 ${
                  isActive(item.href) ? "text-sun" : "text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a href="tel:+919045916770" className="flex items-center gap-2 pt-6 text-base font-semibold text-white">
              <Phone size={17} className="text-sun" />
              +91-9045916770
            </a>
            <a href="/contact" onClick={() => setIsOpen(false)} className="gk-btn gk-btn-sun self-start mt-6">
              Plan my trip
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
