import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: "About Us",
    description: "Discover the best Char Dham, Uttarakhand, and Himalayan tours with Gokeys.",
    alternates: {
      canonical: `${siteUrl}/about/`,
    },
    openGraph: {
      title: "About Us ",
      description: "Discover the best Char Dham, Uttarakhand, and Himalayan tours with Gokeys.",
      url: `${siteUrl}/about/`,
    },
    twitter: {
      card: "summary_large_image",
      title: "About Us ",
      description: "Discover the best Char Dham, Uttarakhand, and Himalayan tours with Gokeys.",
    },
  };
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
      <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-center text-green-700">About Gokeys</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-5">
          <div>
            <img
              src="https://cdn.pixabay.com/photo/2023/01/07/11/30/alpine-7703066_1280.jpg"
              alt="about-gokeys"
              className="w-full h-auto rounded"
            />
          </div>
          <div>
            <p className="text-md text-gray-700 mb-3">
              Welcome to Gokeys India, a premier subsidiary of Travel In Himalayas, a leading travel agency based in the amazing city of Haridwar, Uttarakhand. With a decade of rich experience in the travel industry, Gokeys India has emerged as one of the finest travel agencies not only in Haridwar but throughout Uttarakhand. Our dedication to providing exceptional service and unforgettable experiences has earned us the reputation of being among the best in the region.
              At Gokeys India. </p>
            <p className="text-md text-gray-700 mb-3">
             we specialize in crafting unparalleled tour packages for Uttarakhand, including revered pilgrimages like Char Dham Yatra, Kedarnath Yatra, Badrinath Yatra, Yamunotri Yatra, and Gangotri Yatra, all at the most competitive prices. With a highly skilled and dedicated team available round the clock, we ensure that every guest receives top-notch service at every step of their journey. Whether it's hotel bookings, ticketing for buses, trains, or flights, tour packages across India, cab bookings, corporate event planning (MICE), trekking trips, or tour guide services, Gokeys India is your trusted partner for all your travel needs.</p>
            <p className="text-md text-gray-700 mb-3">
              Driven by a vision to revolutionize the travel industry, Gokeys India strives to tackle the challenges faced by travelers and provide innovative solutions. Our commitment to excellence and customer satisfaction is unwavering, and we constantly seek to enhance the travel experience for all our clients.
            </p>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-green-700">History of Gokeys</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-5">
          
         <div>
            <p className="text-md text-gray-700 mb-3">
            Established in 2011 as Travel In Himalayas, our parent company laid the foundation for exceptional travel experiences in the Himalayan regions of Northern India. In our quest to offer even better deals and expand our services across the country, Gokeys India was founded on January 1, 2019. Since then, we have been dedicated to exploring new territories and providing comprehensive travel packages throughout India. Our journey from Travel In Himalayas to Gokeys India represents our commitment to innovation and excellence in the travel industry. </p>
            <p className="text-md text-gray-700 mb-3">
            Here,s the complete story behind how the Idea came to us. One day, we were reading reviews of different travel company and found complaints and in various forums peoples were still trying to find their trip solution in best possible way, so we thought of doing something, that will give customers exception services and then the Idea of travel services throughout the India is started at Gokeys. We started providing services to our customers to different parts of India and many happy customers returned to us with their next packages.</p>
            <p className="text-md text-gray-700 mb-3">
            Since then, we made our vision to provide better travel services at best price to everyone. And once the tour package is done, the customers should be very happy which is our motto..
            </p>
          </div>
          <div>
            <img
              src="https://cdn.pixabay.com/photo/2023/01/07/11/30/alpine-7703066_1280.jpg"
              alt="about-gokeys"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-7">
          {/* Services Section */}
          <div>
            <h1 className="text-4xl font-bold text-green-700 mb-4">Our Services</h1>
            <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
              <li>Tour Packages for Char Dham Yatra, Kedarnath Yatra, Badrinath Yatra, Yamunotri Yatra, Gangotri Yatra, and more</li>
              <li>Hotel Bookings</li>
              <li>Ticketing (Buses, Trains, Flights)</li>
              <li>Tour Packages across India</li>
              <li>Cab Booking</li>
              <li>Corporate Event Planning (MICE)</li>
              <li>Trekking Trips</li>
              <li>Tour Guide Services</li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h1 className="text-4xl font-bold text-green-700 mb-4">How to Reach Us:</h1>
            <div className="space-y-1 text-gray-700">
              <p><strong>Address:</strong> Near Bus Stand, Haridwar - 249401</p>
              <p><strong>Phone:</strong> +91 9999999999</p>
              <p><strong>Email:</strong> gokeysindia@gmail.com, helpdesk@gokeys.in</p>
              <p><strong>Website:</strong> www.gokeys.in</p>
            </div>
          </div>
        </div>

      </div>
      < Footer/>  
      </>
    );
  }