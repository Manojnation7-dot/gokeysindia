import Header from "@/components/Header";
import { buildMetadata } from "@/lib/seoHelpers";
import Footer from "@/components/Footer";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import GoogleMap from "@/components/MapIframe";
import { Breadcrumbs } from "@/components/ui/kit";
import InquiryFormCard from "@/components/SimpleEnquiryForm";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const metadata = buildMetadata({
  title: "Contact Gokeys India",
  description: "Contact Gokeys India in Haridwar for tours, hotel bookings and taxi enquiries.",
  path: "/contact",
  image: "/images/gokeyslogo.png",
});

export default function Contact() {
  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

const emailAddresses = [
  { label: "Support", email: "helpdesk@gokeys.in" },
  { label: "Operations", email: "gokeysindia@gmail.com" },
];

  return (
    <>
      <Header />
      <SmartSEO schema={breadcrumbSchema} />

      <main className="bg-mist">
        {/* Hero */}
        <section className="gk-wrap pt-10 pb-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact us" }]} />
          <p className="gk-eyebrow mb-2">Get in Touch</p>
          <h1 className="gk-h1">Let’s Plan Your Next Trip Together</h1>
          <p className="mt-4 gk-lead max-w-2xl [&_a]:text-brand-600 [&_a]:font-semibold">
            Have questions about group tours, spiritual journeys, or custom itineraries for Uttarakhand or <a href="https://gokeys.in/services/travel-agency-haridwar" className="hover:underline">Haridwar</a>?
            Our travel experts are just a message away.
          </p>
        </section>

        {/* Contact + Enquiry */}
        <section className="gk-wrap pb-16 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 items-start">
          <div className="space-y-5">
            <div className="gk-card p-6">
              <h2 className="gk-h3">Contact Information</h2>
              <p className="text-[15px] text-slate-ink mt-1 mb-5">
                Reach out to us directly or submit your enquiry — we usually respond within a few hours.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="text-teal mt-1 shrink-0" />
                  <div>
                    <h3 className="gk-label mb-0.5!">Call Us</h3>
                    <p className="text-xs text-slate-ink">Speak directly with our travel experts</p>
                    <p className="text-[15px] font-semibold text-ink mt-1">
                      +91 9045916770, +91 7830718680, +91 7830718687
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-teal mt-1 shrink-0" />
                  <div>
                    <h3 className="gk-label mb-0.5!">Email Us</h3>
                    <p className="text-xs text-slate-ink">For itineraries, pricing & support</p>
                    <div className="space-y-0.5 mt-1">
                      {emailAddresses.map((item, index) => (
                        <a key={index} href={`mailto:${item.email}`} className="block text-sm font-semibold text-ink hover:text-teal transition">
                          {item.label}: {item.email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-teal mt-1 shrink-0" />
                  <div>
                    <h3 className="gk-label mb-0.5!">Our Location</h3>
                    <p className="text-[15px] text-ink">
                      Uttarakhand, India <br />
                      PAN India Travel Support
                    </p>
                  </div>
                </div>
              </div>
              <a href="https://wa.me/917830718687" target="_blank" rel="noopener noreferrer" className="gk-btn gk-btn-wa w-full mt-6">
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Enquiry Form */}
          <InquiryFormCard placeName="your trip" />
        </section>

        {/* Map */}
        <section className="bg-white">
          <div className="gk-wrap gk-section">
            <h2 className="gk-h2">Find Us on Map</h2>
            <p className="gk-lead mt-2 mb-6">Visit us or connect online — we’re always here to help.</p>
            <GoogleMap className="h-96 rounded-2xl overflow-hidden" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
