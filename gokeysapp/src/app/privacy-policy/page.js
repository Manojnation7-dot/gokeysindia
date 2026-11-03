import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seoHelpers";
import SmartSEO from "@/components/SmartSEO";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import { formatPolicyDate } from "@/lib/policyDates";
  

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
      <main className="max-w-4xl mx-auto px-4 py-12 text-slate-ink">
        <h1 className="gk-h1 text-4xl! mb-6">Privacy Policy</h1>

        <section className="space-y-6">
          <p>
            This Privacy Policy explains what personal data Gokeys India (www.gokeys.in) collects, why we
            collect it, how long we keep it, who we share it with, and the rights you have under India&apos;s
            Digital Personal Data Protection Act, 2023 (DPDP Act). We collect only what we need to plan and run
            your trip.
          </p>

          <h2 className="text-2xl font-semibold mt-8">1. What We Collect</h2>
          <p><strong>When you send an enquiry</strong> (tour enquiry, contact form, cost calculator):</p>
          <ul className="list-disc pl-6">
            <li>Your name, phone number and email address</li>
            <li>Your trip details: tour, travel date or month, number of travellers and your message</li>
          </ul>
          <p><strong>When you book a group departure</strong>, for each traveller we store only:</p>
          <ul className="list-disc pl-6">
            <li>Name, age and gender</li>
            <li>Phone number and email address</li>
            <li>Emergency contact name and phone number</li>
            <li>Pickup point</li>
            <li>An optional short medical note (up to 200 characters), only if you choose to give one</li>
          </ul>
          <p><strong>When you visit our website:</strong> the pages you view, your browser and device type, the
            approximate city and country, and a shortened IP address (we store only the network part of the
            address, never the full address).</p>

          <h2 className="text-2xl font-semibold mt-8">2. Identity Documents: Checked, Never Stored</h2>
          <p>
            We do <strong>not</strong> collect or store Aadhaar, PAN, passport or any other ID numbers, ID photos
            or ID copies, and we will never ask you to upload or send them. Please carry your original
            government photo ID on the trip: our tour manager checks it in person at pickup and returns it to you
            straight away. Hotels may also ask to see your ID at check-in under their own rules.
          </p>

          <h2 className="text-2xl font-semibold mt-8">3. Why We Use Your Data</h2>
          <ul className="list-disc pl-6">
            <li>To answer your enquiry and prepare quotations</li>
            <li>To confirm and run your booking: seats, rooms, transport, pickup and your trip voucher</li>
            <li>To contact you about your trip by phone, email or WhatsApp (dates, pickup, changes, payments
              due, refunds)</li>
            <li>To keep you safe on the trip (emergency contact and medical note)</li>
            <li>To keep accounting and tax records as the law requires</li>
            <li>To protect our forms from spam and abuse, and to understand how our website is used</li>
            <li>To send offers only if you have agreed to receive them; you can stop them at any time</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">4. Payments</h2>
          <p>
            Online payments are processed by Razorpay. Your card, UPI or bank details are entered on Razorpay&apos;s
            secure payment page and go directly to Razorpay; we never see or store them. We keep only the payment
            record (amount, date, status and Razorpay&apos;s reference number).
          </p>

          <h2 className="text-2xl font-semibold mt-8">5. How Long We Keep It</h2>
          <ul className="list-disc pl-6">
            <li><strong>Medical notes:</strong> deleted 7 days after you return from the trip</li>
            <li><strong>Traveller details</strong> (names, ages, contacts, emergency contacts, pickup): anonymised
              6 months after the trip</li>
            <li><strong>Enquiries:</strong> anonymised 24 months after they are sent</li>
            <li><strong>Website visit records</strong> (including the shortened IP address): deleted after 90 days</li>
            <li><strong>Accounting records</strong> (invoices, payments and refunds): kept for the period required
              by Indian tax and accounting law</li>
            <li><strong>Lead booker&apos;s contact</strong> (name, phone and email): kept in our customer records for
              accounting and legal purposes for the same period as the accounting records, even after the other
              traveller details are anonymised</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">6. Who We Share It With</h2>
          <p>We do not sell your data. We share only what each service needs to do its job for us:</p>
          <ul className="list-disc pl-6">
            <li><strong>Razorpay</strong>: to take payments and make refunds</li>
            <li><strong>Google (Gmail)</strong>: to send booking emails and vouchers</li>
            <li><strong>WhatsApp (Meta)</strong>: when our staff send you your booking details and voucher link from
              our own WhatsApp number (no automated messaging service)</li>
            <li><strong>Hotels and transport partners</strong>: traveller names and the details they need for
              your rooms and seats</li>
            <li><strong>Google</strong>: reCAPTCHA (spam protection on our forms) and Google Analytics / Google Ads
              (website statistics)</li>
            <li><strong>Government authorities</strong>: only when the law requires it</li>
          </ul>
          <p>
            Staff see your contact details only when they need them for your enquiry or booking. Traveller details
            are kept only in our own booking and customer systems on our own server, and are not copied into other
            tools.
          </p>

          <h2 className="text-2xl font-semibold mt-8">7. Children</h2>
          <p>
            Travellers under 18 are booked by a parent or guardian, who gives consent for the child&apos;s details as
            part of the booking. We do not accept unaccompanied minors, and we do not use children&apos;s data for
            tracking or advertising.
          </p>

          <h2 className="text-2xl font-semibold mt-8">8. Cookies & Website Statistics</h2>
          <p>
            We use cookies and tools like Google Analytics to understand how our website is used and to improve it.
            You can block or delete cookies in your browser settings; the website will still work, though some
            features may not.
          </p>

          <h2 className="text-2xl font-semibold mt-8">9. Your Rights Under the DPDP Act</h2>
          <p>You can ask us to:</p>
          <ul className="list-disc pl-6">
            <li><strong>Access</strong>: get a summary of the personal data we hold about you and how we use it</li>
            <li><strong>Correct or complete</strong> your data if it is wrong or incomplete</li>
            <li><strong>Erase</strong> your data when it is no longer needed for your trip (records the law requires
              us to keep, such as invoices, are kept for that period only)</li>
            <li><strong>Withdraw your consent</strong> at any time; this does not affect what was done before</li>
            <li><strong>Nominate</strong> a person to use these rights for you in case of death or incapacity</li>
            <li><strong>Complain</strong> to our Grievance Officer (below) and, if you are not satisfied with the
              reply, to the Data Protection Board of India</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">10. How to Make a Request</h2>
          <p>
            Email{" "}
            <a href="mailto:helpdesk@gokeys.in" className="text-brand-600 underline">helpdesk@gokeys.in</a>{" "}
            from the email address you used with us (or call us from the phone number you used), saying what you
            would like us to do. If you have a booking, please include your booking number. To protect your data we
            confirm the request with a one-time code sent to the email or phone number we hold. We never ask for an
            ID document for this. We will reply as soon as possible and within the time the law requires.
          </p>

          <h2 className="text-2xl font-semibold mt-8">11. Grievance Officer</h2>
          {/* TODO(owner): add the Grievance Officer's name, email and phone here (still open in
              docs/group-departures-decisions.md). Until then the visible note below is shown. */}
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            The name and contact details of our Grievance Officer will be published here shortly. Until then,
            please send any privacy complaint to{" "}
            <a href="mailto:helpdesk@gokeys.in" className="text-brand-600 underline">helpdesk@gokeys.in</a> with
            the subject &quot;Privacy complaint&quot;.
          </p>

          <h2 className="text-2xl font-semibold mt-8">12. Data Security</h2>
          <p>
            Our website and booking system use encrypted connections (HTTPS). Logging in to our booking
            administration needs a password and a second login step, contact details are masked on staff screens,
            and only staff who need them can see them in full. Our databases are backed up and the backups are
            encrypted.
          </p>

          <h2 className="text-2xl font-semibold mt-8">13. Third-Party Links</h2>
          <p>
            Our site may include links to external websites. We are not responsible for their privacy
            practices. Please review their policies separately.
          </p>

          <h2 className="text-2xl font-semibold mt-8">14. Policy Updates</h2>
          <p>
            We may update this policy from time to time. Changes are posted on this page with the date of the
            update.
          </p>

          <h2 className="text-2xl font-semibold mt-8">15. Contact</h2>
          <p>
            For questions or privacy requests, contact us at:
            <br />
            📧 <a href="mailto:helpdesk@gokeys.in" className="text-brand-600 underline">helpdesk@gokeys.in</a>
            <br />
            📞 +91-7830718687
            <br />
            🌐 www.gokeys.in
          </p>

          <p className="text-[15px] text-gray-500 mt-6">Last updated: {formatPolicyDate()}</p>
        </section>
      </main>
      < Footer/>  
      </>
    );
  }