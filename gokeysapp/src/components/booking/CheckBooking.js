"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, lookupBooking, verifyBookingCode } from "@/lib/booking";

// Step 1: reference + phone or email -> the backend emails a code if they match (same answer either way).
// Step 2: the 6-digit code -> a 2-hour link to the booking (put after "#", so it never reaches a server log).
export default function CheckBooking({ initialReference = "" }) {
  const router = useRouter();
  const [reference, setReference] = useState(initialReference);
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendCode(event) {
    event.preventDefault();
    setBusy(true); setError("");
    const { ok, data } = await lookupBooking(reference.trim().toUpperCase(), contact.trim());
    setBusy(false);
    if (!ok) return setError(errorMessage(data));
    setMessage(data.detail);
    setStep(2);
  }

  async function verify(event) {
    event.preventDefault();
    setBusy(true); setError("");
    const { ok, data } = await verifyBookingCode(reference.trim().toUpperCase(), code.trim());
    setBusy(false);
    if (!ok) return setError(errorMessage(data));
    router.push(`/book/booking#${encodeURIComponent(data.booking_token)}`);
  }

  return (
    <div className="max-w-md">
      <section className="gk-card p-5">
        <h1 className="gk-h2 mb-2">Check my booking</h1>
        <p className="text-sm text-slate-ink mb-3">See your booking, pay the balance, download the voucher, or cancel.</p>
        {step === 1 ? (
          <form onSubmit={sendCode} className="space-y-3">
            <p className="text-sm text-ink">Enter your booking reference and the mobile number or email you used when booking. We will email you a
              6-digit code.</p>
            <label className="block text-sm font-semibold">Booking reference
              <input className="gk-field uppercase" value={reference} onChange={(e) => setReference(e.target.value)}
                placeholder="GK-XXXXXXXX" maxLength={20} required autoComplete="off" /></label>
            <label className="block text-sm font-semibold">Mobile number or email
              <input className="gk-field" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={254} required /></label>
            <button type="submit" className="gk-btn gk-btn-ink" disabled={busy}>{busy ? "Sending…" : "Email me a code"}</button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-3">
            <p className="text-sm text-ink">{message}</p>
            <label className="block text-sm font-semibold">6-digit code
              <input className="gk-field tracking-widest" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric" maxLength={6} required autoComplete="one-time-code" /></label>
            <button type="submit" className="gk-btn gk-btn-ink" disabled={busy || code.length !== 6}>{busy ? "Checking…" : "Open my booking"}</button>
            <button type="button" className="gk-btn gk-btn-line ml-2" onClick={() => { setStep(1); setCode(""); setError(""); }}>Start again</button>
          </form>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      </section>
      <p className="mt-3 text-sm text-slate-ink">No email? Call or WhatsApp <a className="underline" href="tel:+917830718687">+91-7830718687</a> with your
        booking reference.</p>
    </div>
  );
}
