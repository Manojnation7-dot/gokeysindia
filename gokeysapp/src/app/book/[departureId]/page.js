import { notFound } from "next/navigation";
import BookingCheckout from "@/components/booking/BookingCheckout";
import CheckoutErrorBoundary from "@/components/booking/CheckoutErrorBoundary";

export const dynamic = "force-dynamic";

// /book/<departure id>: the checkout for one date. The page is a shell; everything is loaded in the browser from
// the booking API (which answers only while online booking is on, or with a staff test link).
export default async function BookPage({ params }) {
  const { departureId } = await params;
  if (!/^\d{1,9}$/.test(departureId)) notFound();
  return <CheckoutErrorBoundary><BookingCheckout departureId={departureId} /></CheckoutErrorBoundary>;
}
