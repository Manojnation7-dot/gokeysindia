import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | Gokeys India</title>
        <meta name="description" content="Read the terms and conditions for booking tours with Gokeys India." />
      </Head>
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

         <section className="space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold">1. Booking Terms</h2>
          <p>To confirm your tour booking, a payment of <strong>40% of the total amount</strong> is required in advance. Once payment is received, we will send a booking confirmation. The remaining balance must be paid on the day of arrival, prior to the start of the trip.</p>

          <h2 className="text-xl font-semibold">2. Vehicle Usage</h2>
          <ul className="list-disc pl-6">
            <li>Vehicles are provided on a point-to-point basis as per the itinerary.</li>
            <li>Vehicles will not be used beyond the itinerary for personal use such as shopping, meals, or unscheduled activities.</li>
            <li>Air Conditioning (AC) will not function in hilly terrain.</li>
            <li>In case of cab change requests, please allow 2–3 hours for arrangement.</li>
            <li>If a breakdown or technical issue occurs, vehicle replacement time will depend on the distance of the replacement vehicle from the operating base.</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Extra Sightseeing Charges</h2>
          <p>Any extra sightseeing not mentioned in the itinerary — such as Mana Village, Trijuginarayan, or Ukhimath during Chardham Yatra — will incur additional charges, payable directly to the driver.</p>

          <h2 className="text-xl font-semibold">4. Yatra Duration & Minimum Booking</h2>
          <ul className="list-disc pl-6">
            <li>Ek Dham Yatra: Minimum 3 Days</li>
            <li>Do Dham Yatra: Minimum 5 Days</li>
            <li>Teen Dham Yatra: Minimum 7 Days</li>
            <li>Char Dham Yatra: Minimum 9 Days</li>
          </ul>
          <p>Minimum payment will be charged based on the respective yatra duration.</p>

          <h2 className="text-xl font-semibold">5. Legal Jurisdiction</h2>
          <p>All disputes are subject to the jurisdiction of competent courts in India, preferably in the state of Uttarakhand where the operator is registered.</p>

          <p className="pt-4">
            Please also review our <a href="/cancellation-policy" className="text-blue-600 underline">Cancellation & Refund Policy</a>.
          </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: July 31, 2025</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
