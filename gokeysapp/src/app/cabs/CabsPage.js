"use client";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CabList from "@/components/CabList";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import SmartSEO from "@/components/SmartSEO";

export default function CabsPage() {
  const breadcrumbSchema = buildBreadcrumbList([
        { name: "Home", url: "/" },
        { name: "Book Cab with Us", url: "/cabs" },
      ]);
  return (
    <>
    <Header />
    <SmartSEO schema={breadcrumbSchema} />
    <div className="max-w-7xl mx-auto px-4 py-8">
     <CabList/>
    </div>
    <Footer />
    </>
  );
}
