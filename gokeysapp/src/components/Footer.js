import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Script from "next/script";

const Footer = () => {
  return (
    <footer className="bg-ink-2 text-slate-300 pt-16">
      <div className="gk-wrap grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.3fr_0.9fr_1fr_1.25fr_1.2fr_0.9fr] gap-x-8 gap-y-10">

        {/* Brand & Address */}
        <div className="col-span-2 lg:col-span-1">
          <Image
            src="/images/gokeyslogo-1.png"
            alt="Gokeys India"
            width={144}
            height={60}
            className="mb-6"
          />
          <p className="text-[15px] leading-relaxed mb-4 text-slate-400">
            4th Shop, Zila Panchayat Market, Railway Road,  
            Haridwar, Uttarakhand, India
          </p>
          <p className="text-[15px]">📧 gokeysindia@gmail.com</p>
          <p className="text-[15px] mt-2">📞 +91-9045916770</p>
          <p className="text-[15px]">📞 +91-7830718687</p>
          <p className="text-[15px]">📞 +91-7830718680</p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="gk-display text-sm font-bold text-white mb-5">Explore</h3>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/tours", label: "Tours" },
              { href: "/destinations", label: "Destinations" },
              { href: "/hotels", label: "Hotels" },
              { href: "/grouptour", label: "Group tours" },
              { href: "/sightseeing", label: "Sightseeing" },
              { href: "/blog", label: "Blog" },
              { href: "/char-dham-yatra-cost-calculator", label: "Char Dham Cost Calculator" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="gk-display text-sm font-bold text-white mb-5">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/cabs", label: "Cabs" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact Us" },
              { href: "/terms-and-conditions", label: "Terms & Conditions" },
              { href: "/cancellation-policy", label: "Cancellation Policy" },
              { href: "/privacy-policy", label: "Privacy Policy" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-white transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services (links every service page from all pages) */}
        <div>
          <h3 className="gk-display text-sm font-bold text-white mb-5">Services</h3>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/services/travel-agency-haridwar", label: "Travel Agency in Haridwar" },
              { href: "/services/uttarakhand-tour-operators", label: "Uttarakhand Tour Operators" },
              { href: "/services/char-dham-yatra-operators-haridwar", label: "Char Dham Yatra Operators" },
              { href: "/services/taxi-service-haridwar", label: "Taxi Service in Haridwar" },
              { href: "/services/haridwar-to-rishikesh-taxi", label: "Haridwar to Rishikesh Taxi" },
              { href: "/services/haridwar-to-dehradun-taxi", label: "Haridwar to Dehradun Taxi" },
              { href: "/services/delhi-to-haridwar-cab", label: "Delhi to Haridwar Cab" },
              { href: "/services/haridwar-railway-station-taxi", label: "Haridwar Railway Station Taxi" },
              { href: "/services/hotel-booking-uttarakhand", label: "Hotel Booking in Uttarakhand" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment & Trust */}
        <div>
          <h3 className="gk-display text-sm font-bold text-white mb-5">
            Payments & Trust
          </h3>
          <p className="text-[15px] text-slate-400 mb-6">
            We accept secure and verified payment methods.  
            Contact us for UPI, Bank Transfer & Invoice payments.
          </p>

          {/* TripAdvisor Badge */}
          <div className="mt-4">
            <div
              id="TA_certificateOfExcellence316"
              className="TA_certificateOfExcellence"
            >
              <ul className="TA_links">
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.tripadvisor.in/Attraction_Review-g616028-d15685215-Reviews-Gokeys_India-Haridwar_Haridwar_District_Uttarakhand.html"
                  >
                    <img
                      src="https://static.tacdn.com/img2/travelers_choice/widgets/tchotel_2025_LL.png"
                      alt="TripAdvisor"
                      loading="lazy"
                      className="w-40"
                    />
                  </a>
                </li>
              </ul>
            </div>
            {/* Loaded after hydration: the widget rewrites this block, which broke React hydration */}
            <Script
              strategy="lazyOnload"
              src="https://www.jscache.com/wejs?wtype=certificateOfExcellence&uniq=316&locationId=15685215&lang=en_IN&year=2025&display_version=2"
            />
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="gk-display text-sm font-bold text-white mb-5">
            Follow Us
          </h3>
          <p className="text-[15px] text-slate-400 mb-4">
            Travel inspiration, updates & offers.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://facebook.com/gokeysindia"
              target="_blank"
              className="p-3 rounded-full bg-white/10 hover:bg-teal transition"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://twitter.com/gokeys4"
              target="_blank"
              className="p-3 rounded-full bg-white/10 hover:bg-teal transition"
            >
              <FaTwitter />
            </Link>
            <Link
              href="https://instagram.com/gokeysharidwar"
              target="_blank"
              className="p-3 rounded-full bg-white/10 hover:bg-teal transition"
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="gk-wrap mt-14 border-t border-white/10 py-6 text-sm text-slate-400">
        © {new Date().getFullYear()} Gokeys India. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
