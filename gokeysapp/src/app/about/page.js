import { buildMetadata } from "@/lib/seoHelpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import GoogleMap from "@/components/MapIframe";
import Link from "next/link";
import { Breadcrumbs, CtaBand } from "@/components/ui/kit";

export async function generateMetadata() {
  return buildMetadata({
    title: "About Us",
    description: "Gokeys India is a travel agency in Haridwar for Char Dham Yatra, Uttarakhand and Himalayan tour packages, hotel bookings and taxi services since 2019.",
    path: "/about",
    keywords: [
      "Travel Agents in Haridwar",
      "Tour Operators in Haridwar",
      "Travel Agency in Haridwar",
      "Delhi to Haridwar taxi booking",
      "Travel Agency in Uttarakhand",
      "Char Dham Yatra Tour Operators in Haridwar",
      "Kedarnath Yatra Tour Operators in Haridwar",
      "Haridwar to Delhi Taxi Services",
      "Char Dham Yatra Packages in Haridwar",
      "Ardh Kumbh Mela 2027 Tour Packages in Haridwar",
      "Kumbh Mela Haridwar Tour Operators",
      "Best travel agency in Haridwar",
      "best travel agency in Uttarakhand",
      "Haridwar cab booking",
      "Haridwar taxi service",
      "Haridwar to Dehradun Cab",
      "Nainital tour package from haridwar",
    ],
  });
}

export default function About() {
const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

    return (
      <>
      <Header/>
      <SmartSEO schema={breadcrumbSchema} />
      <main className="bg-mist">
        {/* Hero */}
        <section className="gk-wrap pt-10 pb-12 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About us" }]} />
            <h1 className="gk-h1">About Gokeys</h1>
            <div className="mt-6 [&_a]:text-brand-600 [&_a]:font-semibold">
            <p className="gk-lead mb-4">
              Welcome to Gokeys India - Travel In Himalayas, a leading <a href="https://gokeys.in/services/travel-agency-haridwar" className="text-brand-600 font-semibold hover:underline">travel agency in Haridwar</a>, based in the amazing city of Haridwar, Uttarakhand. With a decade of rich experience in the travel industry, Gokeys India has emerged as one of the finest travel agencies not only in Haridwar but throughout Uttarakhand. Our dedication to providing exceptional service and unforgettable experiences has earned us the reputation of being among the best in the region.
              At Gokeys India. </p>
            <p className="gk-lead mb-4">
             we specialize in crafting unparalleled tour packages for Uttarakhand, including revered pilgrimages like <a href="https://gokeys.in/blog/char-dham-yatra-2027" className="text-brand-600 font-semibold hover:underline">Char Dham Yatra</a>, Kedarnath Yatra, Badrinath Yatra, Yamunotri Yatra, and Gangotri Yatra, all at the most competitive prices. With a highly skilled and dedicated team available round the clock, we ensure that every guest receives top-notch service at every step of their journey. Whether it's hotel bookings, ticketing for buses, trains, or flights, tour packages across India, cab bookings, corporate event planning (MICE), trekking trips, or tour guide services, Gokeys India is your trusted partner for all your travel needs.</p>
            <p className="gk-lead mb-4">
              Driven by a vision to revolutionize the travel industry, Gokeys India strives to tackle the challenges faced by travelers and provide innovative solutions. Our commitment to excellence and customer satisfaction is unwavering, and we constantly seek to enhance the travel experience for all our clients.
            </p>
            </div>
          </div>
          <img
            src="https://cdn.pixabay.com/photo/2023/01/07/11/30/alpine-7703066_1280.jpg"
            alt="about-gokeys"
            className="w-full h-72 lg:h-96 object-cover rounded-2xl lg:mt-12"
          />
        </section>

        {/* Stats */}
        <section className="gk-wrap pb-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["10+", "Years of experience"],
            ["2011", "Started as Travel In Himalayas"],
            ["2019", "Gokeys India founded"],
            ["24x7", "Team available round the clock"],
          ].map(([n, label]) => (
            <div key={label} className="gk-card p-5">
              <p className="gk-price text-3xl text-teal!">{n}</p>
              <p className="text-[15px] text-slate-ink mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* History */}
        <section className="bg-white">
          <div className="gk-wrap gk-section grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
            <div>
              <p className="gk-eyebrow mb-2">Our story</p>
              <h2 className="gk-h2">History of Gokeys</h2>
            </div>
            <div>
            <p className="gk-lead mb-4">
            Established in 2011 as Travel In Himalayas, as we laid the foundation for exceptional travel experiences in the Himalayan regions of Northern India. In our quest to offer even better deals and expand our services across the country, Gokeys India was founded on January 1, 2019. Since then, we have been dedicated to exploring new territories and providing comprehensive travel packages throughout India. Our journey from Travel In Himalayas to Gokeys India represents our commitment to innovation and excellence in the travel industry. </p>
            <p className="gk-lead mb-4">
            Here,s the complete story behind how the Idea came to us. One day, we were reading reviews of different travel company and found complaints and in various forums peoples were still trying to find their trip solution in best possible way, so we thought of doing something, that will give customers exception services and then the Idea of travel services throughout the India is started at Gokeys. We started providing services to our customers to different parts of India and many happy customers returned to us with their next packages.</p>
            <p className="gk-lead mb-4">
            Since then, we made our vision to provide better travel services at best price to everyone. And once the tour package is done, the customers should be very happy which is our motto..
            </p>
            </div>
          </div>
        </section>

        {/* Services + contact */}
        <section className="gk-wrap gk-section grid lg:grid-cols-2 gap-6">
          <div className="gk-card p-6 md:p-8">
            <h2 className="gk-h2 mb-4">Our Services</h2>
            <ul className="list-disc list-outside pl-5 space-y-2 text-gray-800 marker:text-sun">
              <li>Tour Packages for <a href="https://gokeys.in/tours/char-dham-yatra-package-from-haridwar" className="text-brand-600 font-semibold hover:underline">Char Dham Yatra</a>, Kedarnath Yatra, Badrinath Yatra, Yamunotri Yatra, Gangotri Yatra, and more</li>
              <li>Hotel Bookings</li>
              <li>Ticketing (Buses, Trains, Flights)</li>
              <li>Tour Packages across India</li>
              <li>Cab Booking</li>
              <li>Corporate Event Planning (MICE)</li>
              <li>Trekking Trips</li>
              <li>Tour Guide Services</li>
            </ul>
          </div>
          <div className="gk-card p-6 md:p-8">
            <h2 className="gk-h2 mb-4">How to Reach Us:</h2>
            <div className="space-y-2 text-gray-800">
              <p><strong>Address:</strong>  4th Shop, Zila Panchayat Market, Railway Road,  
            Haridwar, Uttarakhand, India - 249401</p>
              <p><strong>Phone:</strong> +91 9045916770, 7830718687, 7830718680</p>
              <p><strong>Email:</strong> gokeysindia@gmail.com, helpdesk@gokeys.in</p>
              <p><strong>Website:</strong> www.gokeys.in</p>
            </div>
          </div>
          <GoogleMap className="lg:col-span-2 h-80 rounded-2xl overflow-hidden" />
        </section>

        <section className="gk-wrap pb-16">
          <CtaBand title="Ready to plan your Himalayan trip?" text="Tell us where and when. We reply with a plan and a price.">
            <Link href="/contact" className="gk-btn gk-btn-ink">Contact us</Link>
            <a href="https://wa.me/917830718687" target="_blank" rel="noopener noreferrer" className="gk-btn gk-btn-wa">WhatsApp</a>
          </CtaBand>
        </section>
      </main>
      < Footer/>
      </>
    );
  }
