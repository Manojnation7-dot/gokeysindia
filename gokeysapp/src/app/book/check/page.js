import CheckBooking from "@/components/booking/CheckBooking";

export const dynamic = "force-dynamic";

// /book/check: "Check my booking" without an account (booking reference + phone or email, then a code sent to the
// booking email). Like every /book page: noindex (book/layout.js), Disallowed in robots.txt, not in the sitemap.
export const metadata = { title: "Check my booking" };

export default function CheckBookingPage() {
  return <CheckBooking />;
}
