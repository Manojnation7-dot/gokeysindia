"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  TRAVELLER_TYPES, createBooking, errorMessage, getBookingDeparture, getQuote, loadRazorpay, previewToken,
  rupeesFromPaise, sendPaymentCallback, travellerSlots,
} from "@/lib/booking";
import { formatDepartureDate, formatPickupTime, SHARING_LABELS } from "@/lib/departures";
import { startRecaptcha } from "@/lib/recaptcha";
import GroupDepartureTerms from "@/components/GroupDepartureTerms";

const LABELS = {
  departure_id: "Date", travellers: "Travellers", lead_phone: "Mobile number", lead_email: "Email",
  emergency_name: "Emergency contact", emergency_phone: "Emergency contact number", consent: "Consent",
  guardian_confirmed: "Parent or guardian", medical_consent: "Medical note", sharing: "Room sharing",
  pickup_id: "Pickup point", adults: "Adults", children_with_bed: "Children with bed",
  children_without_bed: "Children without bed", infants: "Under 5", recaptcha: "Security check",
};
const EMPTY_TRAVELLER = { full_name: "", age: "", gender: "", medical_note: "" };
const field = "gk-field";

function Counter({ label, hint, value, onChange, min = 0, max = 20 }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div><p className="font-semibold text-ink text-sm">{label}</p><p className="text-xs text-slate-ink">{hint}</p></div>
      <div className="flex items-center gap-2">
        <button type="button" className="gk-btn gk-btn-line py-1! px-3!" aria-label={`Fewer ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
        <span className="w-6 text-center font-bold" aria-live="polite">{value}</span>
        <button type="button" className="gk-btn gk-btn-line py-1! px-3!" aria-label={`More ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

export default function BookingCheckout({ departureId }) {
  const [info, setInfo] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [sharing, setSharing] = useState("");
  const [counts, setCounts] = useState({ adult: 2, child_with_bed: 0, child_no_bed: 0, infant: 0 });
  const [pickupId, setPickupId] = useState("");
  const [payOption, setPayOption] = useState("advance");
  const [travellers, setTravellers] = useState([]);
  const [contact, setContact] = useState({ lead_phone: "", lead_email: "", emergency_name: "", emergency_phone: "" });
  const [consent, setConsent] = useState({ consent: false, guardian: false, medical: false });
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [stage, setStage] = useState("form"); // form | sending | paying | dismissed | confirming
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const checkoutRef = useRef(null);

  useEffect(() => {
    previewToken(); // keep a staff test token for this tab
    getBookingDeparture(departureId).then(({ ok, data }) => {
      if (!ok) return setLoadError(data?.detail || "Online booking is not available for this date.");
      setInfo(data);
      const withAdult = ["quad", "triple", "double"].filter((s) => data.departure.prices.some((p) => p.sharing === s && p.traveller_type === "adult"));
      setSharing(withAdult[0] || "");
      if (data.departure.pickups.length === 1) setPickupId(String(data.departure.pickups[0].id));
      if (data.departure.advance_percent >= 100) setPayOption("full");
    });
  }, [departureId]);

  const minAge = info?.tour.min_age || 0;
  const priceOf = (s, type) => info?.departure.prices.find((p) => p.sharing === s && p.traveller_type === type);
  const sharingOptions = useMemo(() => ["quad", "triple", "double"].filter((s) => priceOf(s, "adult")), [info]); // eslint-disable-line react-hooks/exhaustive-deps
  const typeAllowed = (key) => key === "adult" || (key === "infant" ? minAge < 5 : minAge < 12 && Boolean(priceOf(sharing, key)));
  const slots = travellerSlots(counts);

  // Keep one traveller row per slot (rows keep what was typed when counts change)
  useEffect(() => {
    setTravellers((rows) => slots.map((_, i) => rows[i] || { ...EMPTY_TRAVELLER }));
  }, [slots.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drop counts of types this sharing or tour does not offer
  useEffect(() => {
    if (!info) return;
    setCounts((c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, typeAllowed(k) ? v : 0])));
  }, [sharing, info]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live price from the server (the browser never decides an amount)
  useEffect(() => {
    if (!info || !sharing || counts.adult < 1) return;
    let current = true; // an answer that arrives after a newer change is ignored (answers can arrive out of order)
    const timer = setTimeout(async () => {
      const { ok, data } = await getQuote(departureId, { sharing, counts, pickupId });
      if (!current) return;
      if (ok) { setQuote(data); setQuoteError(""); } else { setQuote(null); setQuoteError(errorMessage(data, LABELS)); }
    }, 350);
    return () => { current = false; clearTimeout(timer); };
  }, [info, departureId, sharing, counts, pickupId]);

  if (loadError) {
    return (
      <div className="gk-panel p-6 max-w-xl">
        <h1 className="gk-h3 mb-2">Online booking not available</h1>
        <p className="text-[15px] text-ink">{loadError}</p>
        <p className="mt-4"><Link href="/grouptour" className="gk-btn gk-btn-ink">See group tours</Link></p>
      </div>
    );
  }
  if (!info) return <p className="text-slate-ink" aria-live="polite">Loading the booking form…</p>;

  const dep = info.departure;
  const anyMinor = travellers.some((t, i) => slots[i] !== "adult" || (t.age !== "" && Number(t.age) < 18));
  const anyMedical = travellers.some((t) => t.medical_note.trim());
  const amountNow = quote ? (payOption === "full" ? quote.total_paise : quote.advance_paise) : null;
  const setTraveller = (i, key, value) => setTravellers((rows) => rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));

  function check() {
    if (!sharing) return "Choose a room sharing option.";
    if (dep.pickups.length && !pickupId) return "Choose a pickup point.";
    for (const [i, t] of travellers.entries()) {
      const type = TRAVELLER_TYPES.find((x) => x.key === slots[i]);
      if (!/^[A-Za-z][A-Za-z .'-]+$/.test(t.full_name.trim())) return `Traveller ${i + 1}: enter the full name in English letters, as on the photo ID.`;
      const age = Number(t.age);
      if (t.age === "" || !Number.isInteger(age) || age < type.min || age > type.max) return `Traveller ${i + 1}: age must be ${type.min} to ${type.max} for "${type.label.toLowerCase()}".`;
      if (age < minAge) return `This tour is for travellers aged ${minAge} and over.`;
      if (!t.gender) return `Traveller ${i + 1}: choose a gender.`;
    }
    if (Number(travellers[0]?.age) < 18) return "Traveller 1 is the lead booker and must be 18 or over.";
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(contact.lead_phone.replace(/[\s-]/g, ""))) return "Enter a 10-digit Indian mobile number.";
    if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(contact.lead_email.trim())) return "Enter a valid email address.";
    if (!contact.emergency_name.trim() || !/^(\+?91)?[6-9]\d{9}$/.test(contact.emergency_phone.replace(/[\s-]/g, ""))) return "Enter an emergency contact who is not travelling, with a 10-digit mobile number.";
    if (!consent.consent) return "Please read the notice and tick the box to agree.";
    if (anyMinor && !consent.guardian) return "Please confirm you are the parent or guardian of every traveller under 18.";
    if (anyMedical && !consent.medical) return "Please tick the box for the medical notes, or leave them empty.";
    if (quoteError) return quoteError;
    return "";
  }

  function openCheckout(result) {
    loadRazorpay().then((Razorpay) => {
      const r = result.razorpay;
      const checkout = new Razorpay({
        key: r.key_id, order_id: r.order_id, amount: r.amount, currency: r.currency, name: r.name,
        description: r.description, prefill: r.prefill, timeout: r.timeout, theme: { color: "#12232a" },
        notes: { booking: result.reference },
        handler: async (response) => {
          setStage("confirming");
          await sendPaymentCallback(response); // only checks the payment; the booking is confirmed by Razorpay's webhook
          window.location.assign(`/book/booking#${result.booking_token}`);
        },
        modal: { ondismiss: () => setStage((s) => (s === "confirming" ? s : "dismissed")) },
      });
      checkout.on("payment.failed", () => setError("The payment did not go through. You can try again while your seats are held."));
      checkoutRef.current = checkout;
      setStage("paying");
      checkout.open();
    }).catch(() => {
      setStage("dismissed");
      setError("The payment window could not be loaded. Please check your connection and press Pay again.");
    });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const problem = check();
    if (problem) return setError(problem);
    setStage("sending");
    const { ok, data } = await createBooking({
      departure_id: Number(departureId), sharing, pickup_id: pickupId ? Number(pickupId) : null, pay_option: payOption,
      travellers: travellers.map((t, i) => ({
        full_name: t.full_name.trim(), age: Number(t.age), gender: t.gender, traveller_type: slots[i],
        medical_note: t.medical_note.trim(),
      })),
      lead_phone: contact.lead_phone, lead_email: contact.lead_email.trim(), emergency_name: contact.emergency_name.trim(),
      emergency_phone: contact.emergency_phone, consent: consent.consent, consent_text_version: info.consent_text_version,
      guardian_confirmed: consent.guardian, medical_consent: consent.medical,
    });
    if (!ok) { setStage("form"); return setError(errorMessage(data, LABELS)); }
    setBooking(data);
    openCheckout(data);
  }

  const busy = stage === "sending" || stage === "paying" || stage === "confirming";
  const holdUntil = booking?.hold_expires_at
    ? new Date(booking.hold_expires_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "";

  return (
    <form onSubmit={submit} onFocus={startRecaptcha} className="grid gap-6 lg:grid-cols-[1fr_340px] items-start" noValidate>
      <div className="space-y-6 min-w-0">
        {(info.preview || info.payment_mode === "test") && (
          <p className="gk-panel p-3 text-sm bg-amber-50! border-amber-300! text-amber-900">
            <strong>Test booking.</strong> {info.preview ? "Opened with a staff test link. " : ""}
            {info.payment_mode === "test" ? "Razorpay is in test mode: no real money is taken." : ""}
          </p>
        )}

        <section className="gk-card p-4 sm:p-5">
          <p className="gk-eyebrow mb-1">Book your seats</p>
          <h1 className="gk-h2">{info.tour.name}</h1>
          <p className="mt-1 text-ink">
            Departure <strong>{formatDepartureDate(dep.date)}</strong> · {info.tour.duration} days · from {info.tour.starting_from}
            {dep.seats_left != null && <> · <span className="font-semibold">{dep.seats_left} seats left</span></>}
          </p>
          {dep.guaranteed && <p className="mt-2"><span className="gk-chip bg-green-50! text-green-800!">Guaranteed departure</span></p>}
        </section>

        <section className="gk-card p-4 sm:p-5">
          <h2 className="gk-h3 text-lg! mb-3">1. Room sharing and travellers</h2>
          <fieldset>
            <legend className="gk-label">Room sharing</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sharingOptions.map((s) => (
                <label key={s} className={`rounded-lg border p-3 cursor-pointer ${sharing === s ? "border-ink bg-slate-50" : "border-line"}`}>
                  <input type="radio" name="sharing" value={s} checked={sharing === s} onChange={() => setSharing(s)} className="mr-2" />
                  <span className="font-semibold text-sm">{SHARING_LABELS[s]}</span>
                  <span className="block text-sm text-slate-ink">{rupeesFromPaise(priceOf(s, "adult").amount_paise)} per adult</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-ink">Single room: on request (please send an enquiry). Prices exclude 5% GST.</p>
          </fieldset>
          <div className="mt-4 divide-y divide-line">
            {TRAVELLER_TYPES.filter((t) => typeAllowed(t.key)).map((t) => (
              <Counter key={t.key} label={t.label}
                hint={`${t.hint}${t.key !== "adult" && t.key !== "infant" && priceOf(sharing, t.key) ? ` · ${rupeesFromPaise(priceOf(sharing, t.key).amount_paise)}` : ""}`}
                value={counts[t.key]} min={t.key === "adult" ? 1 : 0}
                onChange={(v) => setCounts((c) => ({ ...c, [t.key]: v }))} />
            ))}
          </div>
          {minAge > 0 && <p className="mt-2 text-xs text-slate-ink">This tour is for travellers aged {minAge} and over.</p>}
          {dep.pickups.length > 0 && (
            <label className="block mt-4">
              <span className="gk-label">Pickup point</span>
              <select className={field} value={pickupId} onChange={(e) => setPickupId(e.target.value)} required>
                <option value="">Choose a pickup point</option>
                {dep.pickups.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.time ? ` · ${formatPickupTime(p.time)}` : ""}{Number(p.extra_charge) > 0 ? ` · +${rupeesFromPaise(p.extra_charge_paise)} per person` : " · included"}
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>

        <section className="gk-card p-4 sm:p-5">
          <h2 className="gk-h3 text-lg! mb-1">2. Traveller details</h2>
          <p className="text-sm text-slate-ink mb-3">Names as on each traveller&apos;s photo ID. Traveller 1 is the lead booker (18 or over).
            Please carry an original photo ID for every traveller; we check it at pickup and never ask for ID numbers.</p>
          <div className="space-y-4">
            {travellers.map((t, i) => {
              const type = TRAVELLER_TYPES.find((x) => x.key === slots[i]);
              return (
                <fieldset key={i} className="rounded-lg border border-line p-3">
                  <legend className="px-1 text-sm font-semibold text-ink">Traveller {i + 1} · {type.label.replace(/s$/, "")} ({type.hint})</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px_130px] gap-2">
                    <label><span className="gk-label">Full name (as on your photo ID, in English)</span>
                      <input className={field} value={t.full_name} onChange={(e) => setTraveller(i, "full_name", e.target.value)} autoComplete={i === 0 ? "name" : "off"} maxLength={120}
                        placeholder="e.g. Asha Verma" lang="en" required /></label>
                    <label><span className="gk-label">Age</span>
                      <input className={field} inputMode="numeric" value={t.age} onChange={(e) => setTraveller(i, "age", e.target.value.replace(/\D/g, "").slice(0, 3))} required /></label>
                    <label><span className="gk-label">Gender</span>
                      <select className={field} value={t.gender} onChange={(e) => setTraveller(i, "gender", e.target.value)} required>
                        <option value="">Choose</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
                      </select></label>
                  </div>
                  <label className="block mt-2"><span className="gk-label">Medical note (optional, max 200 characters)</span>
                    <input className={field} value={t.medical_note} onChange={(e) => setTraveller(i, "medical_note", e.target.value)} maxLength={200}
                      placeholder="e.g. asthma, carries inhaler" /></label>
                </fieldset>
              );
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <label><span className="gk-label">Lead booker&apos;s mobile</span>
              <input className={field} type="tel" inputMode="tel" autoComplete="tel" value={contact.lead_phone} onChange={(e) => setContact({ ...contact, lead_phone: e.target.value })} required /></label>
            <label><span className="gk-label">Lead booker&apos;s email (voucher is sent here)</span>
              <input className={field} type="email" autoComplete="email" value={contact.lead_email} onChange={(e) => setContact({ ...contact, lead_email: e.target.value })} required /></label>
            <label><span className="gk-label">Emergency contact (not travelling)</span>
              <input className={field} value={contact.emergency_name} onChange={(e) => setContact({ ...contact, emergency_name: e.target.value })} required /></label>
            <label><span className="gk-label">Emergency contact&apos;s mobile</span>
              <input className={field} type="tel" inputMode="tel" value={contact.emergency_phone} onChange={(e) => setContact({ ...contact, emergency_phone: e.target.value })} required /></label>
          </div>
        </section>

        <section className="gk-card p-4 sm:p-5">
          <h2 className="gk-h3 text-lg! mb-2">3. Group tour rules, your data and consent</h2>
          <div className="rounded-lg border border-line p-3 text-sm text-ink mb-3">
            <GroupDepartureTerms headingClass="font-semibold mt-2 first:mt-0" listClass="list-disc pl-5 space-y-0.5" />
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-ink space-y-1">
            <p><strong>What we store:</strong> each traveller&apos;s name, age and gender; the lead booker&apos;s mobile and email;
              one emergency contact; the pickup point; and any medical note you add. We never ask for or store ID numbers or ID copies.</p>
            <p><strong>Why:</strong> to run your trip (hotels, transport, pickup, safety) and to contact you about it.</p>
            <p><strong>How long:</strong> medical notes are deleted 7 days after the trip; traveller details are removed 6 months after
              the trip. Payment records, and the lead booker&apos;s name, phone and email as our customer record, are kept for the
              period Indian tax and accounting law requires.</p>
            <p><strong>Who sees it:</strong> our staff, and hotels and transport partners for your rooms and seats. Payments go through
              Razorpay; booking emails through Google (Gmail). See our <Link href="/privacy-policy" className="underline" target="_blank">Privacy Policy</Link>.</p>
          </div>
          <label className="flex gap-2 items-start mt-3 text-sm">
            <input type="checkbox" checked={consent.consent} onChange={(e) => setConsent({ ...consent, consent: e.target.checked })} className="mt-1" />
            <span>I agree to Gokeys processing these traveller details to run this trip, and I confirm I may share the details of
              everyone in this booking. I accept the <Link href="/terms-and-conditions" className="underline" target="_blank">Terms and Conditions</Link>.</span>
          </label>
          {anyMinor && (
            <label className="flex gap-2 items-start mt-2 text-sm">
              <input type="checkbox" checked={consent.guardian} onChange={(e) => setConsent({ ...consent, guardian: e.target.checked })} className="mt-1" />
              <span>I am the parent or legal guardian of every traveller under 18 in this booking, and they travel with me.</span>
            </label>
          )}
          {anyMedical && (
            <label className="flex gap-2 items-start mt-2 text-sm">
              <input type="checkbox" checked={consent.medical} onChange={(e) => setConsent({ ...consent, medical: e.target.checked })} className="mt-1" />
              <span>I agree to Gokeys keeping the medical notes above to look after the travellers on this trip (deleted 7 days after it).</span>
            </label>
          )}
        </section>
      </div>

      <aside className="gk-card p-4 sm:p-5 lg:sticky lg:top-24">
        <h2 className="gk-h3 text-lg! mb-3">Price</h2>
        {quote ? (
          <>
            <ul className="text-sm space-y-1">
              {quote.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-2"><span>{l.label} × {l.count}</span><span>{rupeesFromPaise(l.amount_paise)}</span></li>
              ))}
              <li className="flex justify-between gap-2 border-t border-line pt-1"><span>Subtotal</span><span>{rupeesFromPaise(quote.subtotal_paise)}</span></li>
              <li className="flex justify-between gap-2"><span>GST {quote.gst_percent}%</span><span>{rupeesFromPaise(quote.gst_paise)}</span></li>
              <li className="flex justify-between gap-2 font-bold text-ink"><span>Total</span><span>{rupeesFromPaise(quote.total_paise)}</span></li>
            </ul>
            {dep.advance_percent < 100 && (
              <fieldset className="mt-4 space-y-2 text-sm">
                <legend className="gk-label">Pay now</legend>
                <label className="flex gap-2"><input type="radio" name="pay" checked={payOption === "advance"} onChange={() => setPayOption("advance")} />
                  <span>Advance {dep.advance_percent}%: <strong>{rupeesFromPaise(quote.advance_paise)}</strong>
                    <span className="block text-xs text-slate-ink">Balance {rupeesFromPaise(quote.balance_paise)}{quote.balance_due_date ? ` due by ${formatDepartureDate(quote.balance_due_date)}` : ""}</span></span></label>
                <label className="flex gap-2"><input type="radio" name="pay" checked={payOption === "full"} onChange={() => setPayOption("full")} />
                  <span>Full amount: <strong>{rupeesFromPaise(quote.total_paise)}</strong></span></label>
              </fieldset>
            )}
            {!quote.bookable && <p className="mt-3 text-sm text-red-700">{quote.not_bookable_reason}</p>}
          </>
        ) : (
          <p className="text-sm text-slate-ink">{quoteError || "Working out the price…"}</p>
        )}
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        {stage === "dismissed" && booking && (
          <p className="mt-3 text-sm text-ink">Payment not finished. Your seats are held until <strong>{holdUntil}</strong>.</p>
        )}
        {stage === "dismissed" && booking ? (
          <button type="button" className="gk-btn gk-btn-sun w-full mt-4" onClick={() => { setError(""); setStage("paying"); checkoutRef.current ? checkoutRef.current.open() : openCheckout(booking); }}>
            Pay {rupeesFromPaise(booking.amount_due_now_paise)} now
          </button>
        ) : (
          <button type="submit" className="gk-btn gk-btn-sun w-full mt-4" disabled={busy || !quote || !quote.bookable}>
            {stage === "sending" ? "Holding your seats…" : stage === "confirming" ? "Payment received, confirming…"
              : stage === "paying" ? "Complete the payment…" : amountNow != null ? `Pay ${rupeesFromPaise(amountNow)} securely` : "Pay securely"}
          </button>
        )}
        <p className="mt-3 text-xs text-slate-ink">Seats are held for {info.hold_minutes} minutes while you pay. Secure payment by Razorpay
          (UPI, cards, net banking). By paying you accept the <Link href="/terms-and-conditions" className="underline" target="_blank">Terms</Link>.</p>
      </aside>
    </form>
  );
}
