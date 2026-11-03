import BookingStatus from "@/components/booking/BookingStatus";

export const dynamic = "force-dynamic";

// /book/booking#<token>: the guest's own link (from the checkout, the confirmation email and WhatsApp). The token is
// after "#", so it never reaches a server; the page sends it to the booking API in a header.
export default function BookingStatusPage() {
  return <BookingStatus />;
}
