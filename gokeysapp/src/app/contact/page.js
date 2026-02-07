import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import GoogleMap from "@/components/MapIframe";
import InquiryFormCard from "@/components/SimpleEnquiryForm";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

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

      {/* Hero */}
      <section className="relative py-24 bg-brand-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block mb-4 text-sm tracking-widest uppercase text-blue-300 font-semibold">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Let’s Plan Your Next Trip Together
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Have questions about group tours, spiritual journeys, or custom itineraries?
            Our travel experts are just a message away.
          </p>
        </div>
      </section>

      {/* Contact + Enquiry */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
{/* Left: Contact Info */}
<div className="space-y-8">
  <div>
    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
      Contact Information
    </h2>
    <p className="text-slate-600 text-lg">
      Reach out to us directly or submit your enquiry — we usually respond within a few hours.
    </p>
  </div>

  {/* Contact cards – stacked */}
  <div className="space-y-6">

    {/* Phone */}
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
        <FaPhoneAlt className="text-blue-600 text-lg" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
        <p className="text-slate-600 text-sm mb-1">
          Speak directly with our travel experts
        </p>
       <p className="text-brand-800 font-semibold tracking-wide">
           +91 9045916770, +91 7830718680, +91 7830718687
        </p>
      </div>
    </div>

    {/* Email */}
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <FaEnvelope className="text-blue-600 text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
            <p className="text-slate-600 text-sm mb-1">
              For itineraries, pricing & support
            </p>
            <div className="space-y-1">
            {emailAddresses.map((item, index) => (
              <a
                key={index}
                href={`mailto:${item.email}`}
                className="block text-slate-800 font-semibold hover:text-blue-600 transition"
              >
                {item.label}: {item.email}
              </a>
            ))}
          </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <FaMapMarkerAlt className="text-blue-600 text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Our Location</h3>
            <p className="text-slate-600 text-sm">
              Uttarakhand, India <br />
              PAN India Travel Support
            </p>
          </div>
        </div>

      </div>
    </div>
          {/* Right: Enquiry Form */}
          <div>
            <InquiryFormCard placeName="your trip" />
          </div>

        </div>
      </section>

      {/* Map */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Find Us on Map
            </h2>
            <p className="text-slate-600 text-lg">
              Visit us or connect online — we’re always here to help.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <GoogleMap />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
