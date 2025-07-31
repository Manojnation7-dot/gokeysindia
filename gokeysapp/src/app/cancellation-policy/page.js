import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CancellationPolicy() {
  return (
    <>
      <Head>
        <title>Cancellation & Refund Policy | Gokeys India</title>
        <meta name="description" content="View Gokeys India's tour cancellation and refund policy here." />
      </Head>
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
