import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seoHelpers";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
  

export async function generateMetadata() {
  return buildMetadata({
    title: "Privacy Policy",
    description: "Check Out Here the Privacy Policy of Gokeys India and Please go through the document if you want to know about this.",
    path: "/privacy-policy",
    image: "/images/gokeyslogo.png",
  });
}


export default function Privacy() {
  const breadcrumbSchema = buildBreadcrumbList([
          { name: "Home", url: "/" },
          { name: "Privacy Policy ", url: "/privacy-policy" },
        ]);
    return (
      <>
      <Header/>
      <SmartSEO schema={breadcrumbSchema} />
      <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
        <p className="text-lg text-center mt-4">
          Welcome to our travel website. We offer the best tours and adventures.
        </p>
      </div>
      < Footer/>  
      </>
    );
  }