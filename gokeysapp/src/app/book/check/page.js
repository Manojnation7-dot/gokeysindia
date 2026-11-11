import CheckBooking from "@/components/booking/CheckBooking";

export const dynamic = "force-dynamic";

// /book/check: "Check my booking" without an account (booking reference + phone or email, then a code sent to the
// booking email). Like every /book page: noindex (book/layout.js), Disallowed in robots.txt, not in the sitemap.
export const metadata = { title: "Check my booking" };

// ?ref=GK-... (from the voucher QR code and the emails) fills in the reference: never a secret, the code is still needed
const REFERENCE = /^GK-[A-Z0-9]{4,16}$/;

export default async function CheckBookingPage({ searchParams }) {
  const ref = String((await searchParams)?.ref || "").trim().toUpperCase();
  return <CheckBooking initialReference={REFERENCE.test(ref) ? ref : ""} />;
}
