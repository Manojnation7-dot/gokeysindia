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
      <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="space-y-6">
          <p>
            This Privacy Policy outlines how Gokeys India (www.gokeys.in) collects, uses, and protects
            your personal information. By using our services, you agree to the terms described below.
          </p>

          <h2 className="text-2xl font-semibold mt-8">1. What Information We Collect</h2>
          <ul className="list-disc pl-6">
            <li>Name, email, phone number</li>
            <li>Government ID (e.g., Aadhar or passport)</li>
            <li>Travel and itinerary details</li>
            <li>Payment details (via secure payment gateways)</li>
            <li>IP address, browser, and usage behavior (via analytics)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">2. How We Use Your Data</h2>
          <ul className="list-disc pl-6">
            <li>To process bookings and offer support</li>
            <li>To meet legal or government travel regulations</li>
            <li>To send updates or promotions (with your consent)</li>
            <li>To improve website functionality using analytics</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">3. Cookies & Tracking</h2>
          <p>
            We use cookies and third-party tools like Google Analytics to enhance your browsing
            experience. Cookies help us remember preferences and understand site usage.
          </p>
          <p>
            You may disable cookies in your browser settings, but some features of our site may not
            function properly.
          </p>

          <h2 className="text-2xl font-semibold mt-8">4. GDPR: EU User Rights</h2>
          <p>
            If you're located in the European Union, you have the following rights under the General
            Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-6">
            <li>The right to access, update or delete your data</li>
            <li>The right to withdraw consent at any time</li>
            <li>The right to object to processing</li>
            <li>The right to data portability</li>
          </ul>
          <p>
            To exercise your rights, please contact us at{" "}
            <a href="mailto:helpdesk@gokeys.in" className="text-blue-600 underline">
              helpdesk@gokeys.in
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-8">5. Data Security</h2>
          <p>
            We store your information on secure servers and protect it using encryption, firewalls, and
            access controls. Payments are processed via PCI-compliant third-party gateways.
          </p>

          <h2 className="text-2xl font-semibold mt-8">6. Data Sharing</h2>
          <p>
            We do not sell your data. We only share information with service providers like hotels or
            transport partners — strictly to fulfill your booking. We may disclose data when required by
            law or government authorities.
          </p>

          <h2 className="text-2xl font-semibold mt-8">7. Third-Party Links</h2>
          <p>
            Our site may include links to external websites. We are not responsible for their privacy
            practices. Please review their policies separately.
          </p>

          <h2 className="text-2xl font-semibold mt-8">8. Policy Updates</h2>
          <p>
            We may update this policy periodically. Changes will be posted on this page with the updated
            date.
          </p>

          <h2 className="text-2xl font-semibold mt-8">9. Contact</h2>
          <p>
            For questions or privacy requests, contact us at:
            <br />
            📧 <a href="mailto:helpdesk@gokeys.in" className="text-blue-600 underline">helpdesk@gokeys.in</a>
            <br />
            📞 +91-7830718687
            <br />
            🌐 www.gokeys.in
          </p>

          <p className="text-sm text-gray-500 mt-6">Last updated: July 31, 2025</p>
        </section>
      </main>
      < Footer/>  
      </>
    );
  }