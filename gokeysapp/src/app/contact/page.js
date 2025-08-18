import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";
import GoogleMap from "@/components/MapIframe";

export default function Contact() {
  const breadcrumbSchema = buildBreadcrumbList([
      { name: "Home", url: "/" },
      { name: "Contact Us", url: "/contact" },
    ]);
    return (
      <>
      <Header/>
      <SmartSEO schema={breadcrumbSchema} />
      <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-center">Contact Us</h1>
        <p className="text-lg text-center mt-4">
          Welcome to our travel website. We offer the best tours and adventures.
        </p>
      </div>
       <section className="py-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Find Us on Map</h2>
          <GoogleMap />
        </section>
      < Footer/>  
      </>
    );
  }