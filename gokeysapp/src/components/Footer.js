import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand & Address */}
        <div>
          <Image
            src="/images/gokeyslogo-1.png"
            alt="Gokeys India"
            width={144}
            height={60}
            className="mb-6"
          />
          <p className="text-sm leading-relaxed mb-4 text-slate-400">
            4th Shop, Zila Panchayat Market, Railway Road,  
            Haridwar, Uttarakhand, India
          </p>
          <p className="text-sm">📧 gokeysindia@gmail.com</p>
          <p className="text-sm mt-2">📞 +91-9045916770</p>
          <p className="text-sm">📞 +91-7830718687</p>
          <p className="text-sm">📞 +91-7830718680</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
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

        {/* Payment & Trust */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
            Payments & Trust
          </h3>
          <p className="text-sm text-slate-400 mb-6">
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
                      className="w-40"
                    />
                  </a>
                </li>
              </ul>
            </div>
            <script
              async
              src="https://www.jscache.com/wejs?wtype=certificateOfExcellence&uniq=316&locationId=15685215&lang=en_IN&year=2025&display_version=2"
            ></script>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
            Follow Us
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Travel inspiration, updates & offers.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://facebook.com/gokeysindia"
              target="_blank"
              className="p-3 rounded-full bg-slate-800 hover:bg-blue-600 transition"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://twitter.com/gokeys4"
              target="_blank"
              className="p-3 rounded-full bg-slate-800 hover:bg-sky-500 transition"
            >
              <FaTwitter />
            </Link>
            <Link
              href="https://instagram.com/gokeysharidwar"
              target="_blank"
              className="p-3 rounded-full bg-slate-800 hover:bg-pink-500 transition"
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-16 border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Gokeys India. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
