"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { downloadVoucher, getBookingStatus, hashValue, rupeesFromPaise } from "@/lib/booking";
import { formatDepartureDate, formatPickupTime } from "@/lib/departures";
import BookingActions from "./BookingActions";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { telHref, whatsappLink } from "@/lib/siteSettings";

const POLL_MS = 3000;
const POLL_FOR_MS = 3 * 60 * 1000; // the webhook normally arrives within seconds

export default function BookingStatus() {
  const { business } = useSiteSettings(); // tour desk and WhatsApp numbers from the admin (Voucher and email settings)
  const [token, setToken] = useState("");
  const [booking, setBooking] = useState(null);
  const [problem, setProblem] = useState("");
  const [slow, setSlow] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Read the link after "#"; again when it changes in the same tab (e.g. a second booking link opened here)
    const read = () => {
      const value = hashValue();
      if (!value) return setProblem("This link is incomplete. Please open the link from your booking email.");
      setProblem(""); setBooking(null); setToken(value);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    if (!token) return;
    let stop = false;
    const started = Date.now();
    let reported = false;
    async function poll() {
      const { ok, status, data } = await getBookingStatus(token);
      if (stop) return;
      if (!ok) {
        setProblem(status === 404 ? "We could not find this booking. Please use the link from your booking email, or call us."
          : "Could not load your booking right now. Please reload the page in a minute.");
        return;
      }
      setBooking(data);
      if ((data.status === "confirmed" || data.status === "fully_paid") && !reported && !data.signed_in) {
        reported = true;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "gokeys_booking_confirmed", tour_slug: data.tour_slug, value: data.paid_paise / 100, currency: "INR" });
      }
      if (data.status === "pending_payment") {
        if (Date.now() - started < POLL_FOR_MS) setTimeout(poll, POLL_MS);
        else setSlow(true);
      }
    }
    poll();
    return () => { stop = true; };
  }, [token]);

  if (problem) return <div className="gk-panel p-6 max-w-xl"><h1 className="gk-h3 mb-2">Your booking</h1><p className="text-ink">{problem}</p></div>;
  if (!booking) return <p className="text-slate-ink" aria-live="polite">Loading your booking…</p>;

  const b = booking;
  const confirmed = b.status === "confirmed" || b.status === "fully_paid";
  const cancellation = b.refund_reason && b.refund_reason !== "LATE_PAYMENT";
  return (
    <div className="max-w-2xl space-y-4" aria-live="polite">
      {b.is_test && <p className="gk-panel p-3 text-sm bg-amber-50! border-amber-300! text-amber-900"><strong>Test booking</strong> (Razorpay test mode): not a real booking.</p>}
      <section className="gk-card p-5">
        {confirmed && <><p className="gk-eyebrow mb-1">Booking confirmed</p><h1 className="gk-h2">Thank you! Your seats are booked.</h1></>}
        {b.status === "pending_payment" && b.confirming && <><p className="gk-eyebrow mb-1">Payment received</p><h1 className="gk-h2">Confirming your booking…</h1>
          <p className="mt-2 text-ink">This usually takes a few seconds. You can keep this page open.</p></>}
        {b.status === "pending_payment" && !b.confirming && <><p className="gk-eyebrow mb-1">Waiting for payment</p><h1 className="gk-h2">Your seats are held</h1>
          <p className="mt-2 text-ink">Please complete the payment on the booking page. Seats are held until{" "}
            {new Date(b.hold_expires_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}.</p></>}
        {b.status === "expired" && <><h1 className="gk-h2">Payment not completed</h1><p className="mt-2 text-ink">The 15-minute hold ended before the payment was made,
          so the seats were released. Nothing was charged. You can book again if seats are still free.</p></>}
        {b.status === "departure_cancelled" && <><p className="gk-eyebrow mb-1">Departure cancelled</p><h1 className="gk-h2">We are sorry: this date did not reach the minimum group size</h1>
          <p className="mt-2 text-ink">Gokeys has cancelled this departure. Please choose below what you would like to do.</p></>}
        {b.status === "private_trip" && <><h1 className="gk-h2">Your private trip is being arranged</h1>
          <p className="mt-2 text-ink">Our team will call you with the price difference and the plan.</p></>}
        {cancellation && ["refund_pending", "refunded", "cancelled"].includes(b.status) && <><h1 className="gk-h2">Your booking is cancelled</h1>
          <p className="mt-2 text-ink">{Number(b.refund_amount) > 0 ? `A refund of ${rupeesFromPaise(Math.round(Number(b.refund_amount) * 100))} ${b.status === "refunded" ? "has been processed" : "has been started"}; banks usually take 5 to 7 working days.`
            : "Under the cancellation rules no refund was due."}</p></>}
        {!cancellation && b.status === "cancelled" && <><h1 className="gk-h2">This booking is cancelled</h1></>}
        {!cancellation && (b.status === "refund_pending" || b.status === "refunded") && <><h1 className="gk-h2">Your payment is being refunded</h1>
          <p className="mt-2 text-ink">Your payment arrived after the seat hold had ended and the seats had been taken. We have started a full refund
            {b.status === "refunded" ? " (processed)" : ""}; banks usually take 5 to 7 working days. Please call us to find another date.</p></>}
        {slow && b.status === "pending_payment" && <p className="mt-3 text-sm text-ink">This is taking longer than usual. If you paid, you will get an email as soon as it is confirmed. Questions? Call +91-7830718687.</p>}
        <p className="mt-3 text-sm text-slate-ink">Booking reference <strong className="text-ink">{b.reference}</strong></p>
      </section>

      <section className="gk-card p-5">
        <h2 className="gk-h3 text-lg! mb-2">{b.tour}</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><dt className="text-slate-ink">Departure</dt><dd className="font-semibold">{formatDepartureDate(b.departure_date)}</dd></div>
          <div><dt className="text-slate-ink">Room sharing</dt><dd className="font-semibold">{b.sharing}</dd></div>
          {b.pickup && <div><dt className="text-slate-ink">Pickup</dt><dd className="font-semibold">{b.pickup.name}{b.pickup.time ? ` · ${formatPickupTime(b.pickup.time)}` : ""}</dd></div>}
          <div><dt className="text-slate-ink">Travellers</dt><dd className="font-semibold">{b.travellers.map((t) => `${t.name} (${t.age})`).join(", ")}</dd></div>
        </dl>
        <ul className="mt-4 text-sm space-y-1 border-t border-line pt-3">
          <li className="flex justify-between"><span>Total{Number(b.gst_percent) > 0 ? ` (incl. GST ${Number(b.gst_percent)}%)` : ""}</span><span className="font-semibold">{rupeesFromPaise(b.total_paise)}</span></li>
          <li className="flex justify-between"><span>Paid</span><span className="font-semibold">{rupeesFromPaise(b.paid_paise)}</span></li>
          {b.fees_paise > 0 && <li className="flex justify-between text-slate-ink"><span>Payment processing charges paid (not part of the tour price)</span><span>{rupeesFromPaise(b.fees_paise)}</span></li>}
          {confirmed && b.balance_paise > 0 && <li className="flex justify-between"><span>Balance{b.balance_due_date ? `, due by ${formatDepartureDate(b.balance_due_date)}` : ""}</span>
            <span className="font-semibold">{rupeesFromPaise(b.balance_paise)}</span></li>}
        </ul>
        {confirmed && (
          <button type="button" className="gk-btn gk-btn-ink mt-4" disabled={downloading} onClick={async () => {
            setDownloading(true);
            try { await downloadVoucher(token, b.reference); } catch { alert("The voucher could not be downloaded. Please try again."); }
            setDownloading(false);
          }}>{downloading ? "Preparing…" : "Download voucher (PDF)"}</button>
        )}
      </section>
      <BookingActions booking={b} token={token} onChange={setBooking} />
      <p className="text-sm text-slate-ink">Questions? Call <a className="underline" href={telHref(business.tour_desk_phone)}>{business.tour_desk_phone}</a> · WhatsApp <a className="underline" href={whatsappLink(business)} target="_blank" rel="noopener noreferrer">{business.whatsapp}</a> with your
        booking reference. <a href={`/book/check?ref=${encodeURIComponent(b.reference)}`} className="underline">Manage or cancel your booking</a> · <Link href="/terms-and-conditions" className="underline">Terms</Link> · <Link href="/privacy-policy" className="underline">Privacy</Link></p>
    </div>
  );
}
