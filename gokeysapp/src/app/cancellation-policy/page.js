import { buildMetadata } from '@/lib/seoHelpers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmartSEO from '@/components/SmartSEO';
import { buildBreadcrumbList } from '@/lib/seoSchemas';
import { SITE_URL, SITE_NAME } from '@/lib/seoHelpers';

const DESCRIPTION =
  "Gokeys India cancellation and refund policy: full refund 30+ days before the trip, charges for later cancellations, and refunds within 7 to 10 working days.";

export const metadata = buildMetadata({
  title: "Cancellation & Refund Policy",
  description: DESCRIPTION,
  path: "/cancellation-policy",
  image: "/images/gokeyslogo.png",
});

const schema = [
  {
    "@type": "WebPage",
    "@id": `${SITE_URL}/cancellation-policy#webpage`,
    url: `${SITE_URL}/cancellation-policy`,
    name: "Cancellation & Refund Policy",
    description: DESCRIPTION,
    inLanguage: "en-IN",
    dateModified: "2025-07-31", // "Last updated" date shown on the page
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "TravelAgency", name: SITE_NAME, url: SITE_URL },
  },
  buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Cancellation & Refund Policy", url: "/cancellation-policy" },
  ]),
];

export default function CancellationPolicy() {
  return (
    <>
      <SmartSEO schema={schema} />
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Cancellation & Refund Policy</h1>

        <section className="space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold">1. Cancellation Charges</h2>
          <ul className="list-disc pl-6">
            <li><strong>30 days or more before trip:</strong> Full refund, no cancellation fee.</li>
            <li><strong>15–30 days before trip:</strong> 50% of the booking amount will be charged.</li>
            <li><strong>7–15 days before trip:</strong> 75% of the booking amount will be charged.</li>
            <li><strong>Less than 7 days before trip:</strong> 100% of the booking amount will be charged.</li>
            <li><strong>No Show:</strong> No refund under any circumstances.</li>
          </ul>

          <h2 className="text-xl font-semibold">2. Refund Processing</h2>
          <p>Refunds (if applicable) will be made to the original mode of payment and processed within <strong>7 to 10 working days</strong>.</p>

          <h2 className="text-xl font-semibold">3. Contact for Cancellations</h2>
          <p>To initiate a cancellation or request a refund, please contact us at:</p>
          <ul className="pl-6">
            <li>📞 Phone: +91-7830718687</li>
            <li>📧 Email: <a href="mailto:helpdesk@gokeys.in" className="text-blue-600 underline">helpdesk@gokeys.in</a></li>
          </ul>

          <h2 className="text-xl font-semibold">4. Force Majeure</h2>
          <p>No refunds shall be made in case of cancellation or delay caused by force majeure events such as natural disasters, strikes, political unrest, or government orders.</p>
          
            <p className="text-sm text-gray-400 mt-4">Last updated: July 31, 2025</p>
        </section>
      </main>
      <Footer/>
    </>
  );
}
