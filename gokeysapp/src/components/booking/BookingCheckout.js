"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  TRAVELLER_TYPES, changeCount, createBooking, errorMessage, getBookingDeparture, getQuote, loadRazorpay, previewToken,
  quoteKey, rupeesFromPaise, sendPaymentCallback, travellerRows, travellerSlots,
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
const MIN_PAYMENT_PAISE = 100; // Razorpay's smallest payment (Rs 1)
const field = "gk-field";

// onChange gets +1 or -1 and is applied to the latest counts, so fast repeated taps all count
function Counter({ label, hint, value, onChange, min = 0, max = 20 }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div><p className="font-semibold text-ink text-sm">{label}</p><p className="text-xs text-slate-ink">{hint}</p></div>
      <div className="flex items-center gap-2">
        <button type="button" className="gk-btn gk-btn-line py-1! px-3!" aria-label={`Fewer ${label}`}
          onClick={() => onChange(-1)} disabled={value <= min}>−</button>
        <span className="w-6 text-center font-bold" aria-live="polite">{value}</span>
        <button type="button" className="gk-btn gk-btn-line py-1! px-3!" aria-label={`More ${label}`}
          onClick={() => onChange(1)} disabled={value >= max}>+</button>
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
  // The latest price answer and the inputs it was for: an answer for older inputs is never shown as the price
  const [priced, setPriced] = useState({ key: "", quote: null, error: "" });
  const [stage, setStage] = useState("form"); // form | opening | sending | paying | dismissed | confirming
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [scriptFailed, setScriptFailed] = useState(false); // Razorpay's script failed to load or took over 15 s
  const checkoutRef = useRef(null);
  const formRef = useRef(null);
  const payPressed = useRef(false);

  // Start loading Razorpay's script with the page. A failure here is shown only once the guest presses Pay
  // (or straight away if it was a real error); while it is still loading, Pay says "Opening secure payment…".
  useEffect(() => { loadRazorpay().catch(() => setScriptFailed(true)); }, []);

  // Safety net: a page reached without a full page load can carry another page's security policy, which blocks
  // Razorpay. Reload once, before any seats are held (the form is still empty then).
  useEffect(() => {
    const onBlocked = (e) => {
      if (!String(e.blockedURI || "").includes("checkout.razorpay.com") || payPressed.current) return;
      try {
        if (sessionStorage.getItem("gk-book-reloaded")) return;
        sessionStorage.setItem("gk-book-reloaded", "1");
      } catch { return; }
      window.location.reload();
    };
    document.addEventListener("securitypolicyviolation", onBlocked);
    return () => document.removeEventListener("securitypolicyviolation", onBlocked);
  }, []);

  // Retry: load the script again, then carry on where the guest was (open the window, or press Pay again)
  const retryScript = () => {
    setScriptFailed(false); setError("");
    setStage("opening");
    loadRazorpay().then(() => {
      if (booking) return openCheckout(booking);
      setStage("form");
      if (payPressed.current) formRef.current?.requestSubmit();
    }).catch(() => { setScriptFailed(true); setStage(booking ? "dismissed" : "form"); });
  };

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
  // Built during render, so there is always exactly one row per traveller (fewer travellers can never leave a row
  // without a type behind; that crashed the page when a count went down)
  const rows = travellerRows(slots, travellers);
  const currentKey = quoteKey({ sharing, counts, pickupId });

  // Drop counts of types this sharing or tour does not offer
  useEffect(() => {
    if (!info) return;
    setCounts((c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, typeAllowed(k) ? v : 0])));
  }, [sharing, info]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live price from the server (the browser never decides an amount)
  useEffect(() => {
    if (!info || !sharing || counts.adult < 1) return;
    let current = true; // an answer that arrives after a newer change is ignored (answers can arrive out of order)
    const key = quoteKey({ sharing, counts, pickupId });
    const timer = setTimeout(async () => {
      const { ok, data } = await getQuote(departureId, { sharing, counts, pickupId });
      if (!current) return;
      setPriced(ok ? { key, quote: data, error: "" } : { key, quote: null, error: errorMessage(data, LABELS) });
      // Razorpay takes at least Rs 1: an advance below that is not offered (pay the full amount)
      if (ok && data.advance_paise < MIN_PAYMENT_PAISE) setPayOption("full");
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
  const fresh = priced.key === currentKey;
  const quote = fresh ? priced.quote : null; // the price for exactly what is chosen now
  const quoteError = fresh ? priced.error : "";
  const shownQuote = priced.quote; // shown greyed out while the new price is on its way
  const anyMinor = rows.some((t) => t.type.key !== "adult" || (t.age !== "" && Number(t.age) < 18));
  const anyMedical = rows.some((t) => t.medical_note.trim());
  const amountNow = quote ? (payOption === "full" ? quote.total_paise : quote.advance_paise) : null;
  const setTraveller = (i, key, value) => setTravellers((typed) => {
    const next = [...typed];
    while (next.length <= i) next.push({ ...EMPTY_TRAVELLER });
    next[i] = { ...next[i], [key]: value };
    return next;
  });

  function check() {
    if (!sharing) return "Choose a room sharing option.";
    if (dep.pickups.length && !pickupId) return "Choose a pickup point.";
    if (!fresh) return "The price is being updated. Please wait a moment.";
    for (const [i, t] of rows.entries()) {
      const { type } = t;
      if (!/^[A-Za-z][A-Za-z .'-]+$/.test(t.full_name.trim())) return `Traveller ${i + 1}: enter the full name in English letters, as on the photo ID.`;
      const age = Number(t.age);
      if (t.age === "" || !Number.isInteger(age) || age < type.min || age > type.max) return `Traveller ${i + 1}: age must be ${type.min} to ${type.max} for "${type.label.toLowerCase()}".`;
      if (age < minAge) return `This tour is for travellers aged ${minAge} and over.`;
      if (!t.gender) return `Traveller ${i + 1}: choose a gender.`;
    }
    if (Number(rows[0]?.age) < 18) return "Traveller 1 is the lead booker and must be 18 or over.";
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
      setScriptFailed(true);
    });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const problem = check();
    if (problem) return setError(problem);
    payPressed.current = true;
    if (scriptFailed) return undefined; // the message and Retry are shown: no seats are held until it loads
    // Wait for Razorpay's script before holding seats (it is normally loaded long before; up to 15 s on a slow network)
    setStage("opening");
    try { await loadRazorpay(); } catch { setStage("form"); return setScriptFailed(true); }
    setStage("sending");
    const { ok, data } = await createBooking({
      departure_id: Number(departureId), sharing, pickup_id: pickupId ? Number(pickupId) : null, pay_option: payOption,
      travellers: rows.map((t) => ({
        full_name: t.full_name.trim(), age: Number(t.age), gender: t.gender, traveller_type: t.type.key,
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

  const busy = stage === "opening" || stage === "sending" || stage === "paying" || stage === "confirming";
  const holdUntil = booking?.hold_expires_at
    ? new Date(booking.hold_expires_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "";

  return (
    <form ref={formRef} onSubmit={submit} onFocus={startRecaptcha} className="grid gap-6 lg:grid-cols-[1fr_340px] items-start" noValidate>
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

        {/* Steps (phones and tablets): jump to each part of the form */}
        <nav aria-label="Booking steps" className="lg:hidden">
          <ol className="grid grid-cols-2 gap-2 text-xs font-semibold text-ink">
            {[["step-1", "1. Rooms and travellers"], ["step-2", "2. Traveller details"], ["step-3", "3. Rules and consent"], ["step-4", "4. Price and payment"]].map(([id, text]) => (
              <li key={id}><a href={`#${id}`} className="block rounded-lg border border-line bg-white px-3 py-2">{text}</a></li>
            ))}
          </ol>
        </nav>

        <section id="step-1" className="gk-card p-4 sm:p-5 scroll-mt-24">
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
                onChange={(delta) => setCounts((c) => changeCount(c, t.key, delta))} />
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

        <section id="step-2" className="gk-card p-4 sm:p-5 scroll-mt-24">
          <h2 className="gk-h3 text-lg! mb-1">2. Traveller details</h2>
          <p className="text-sm text-slate-ink mb-3">Names as on each traveller&apos;s photo ID. Traveller 1 is the lead booker (18 or over).
            Please carry an original photo ID for every traveller; we check it at pickup and never ask for ID numbers.</p>
          <div className="space-y-4">
            {rows.map((t, i) => {
              const { type } = t;
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

        <section id="step-3" className="gk-card p-4 sm:p-5 scroll-mt-24">
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

      <aside id="step-4" className="gk-card p-4 sm:p-5 lg:sticky lg:top-24 scroll-mt-24">
        <h2 className="gk-h3 text-lg! mb-3"><span className="lg:hidden">4. </span>Price and payment</h2>
        {shownQuote && !quoteError ? (
          <div aria-busy={!fresh}>
            {!fresh && <p className="text-xs text-slate-ink mb-1" aria-live="polite">Updating the price…</p>}
            <ul className={`text-sm space-y-1 ${fresh ? "" : "opacity-50"}`}>
              {shownQuote.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-2"><span>{l.label} × {l.count}</span><span>{rupeesFromPaise(l.amount_paise)}</span></li>
              ))}
              <li className="flex justify-between gap-2 border-t border-line pt-1"><span>Subtotal</span><span>{rupeesFromPaise(shownQuote.subtotal_paise)}</span></li>
              <li className="flex justify-between gap-2"><span>GST {shownQuote.gst_percent}%</span><span>{rupeesFromPaise(shownQuote.gst_paise)}</span></li>
              <li className="flex justify-between gap-2 font-bold text-ink"><span>Total</span><span>{rupeesFromPaise(shownQuote.total_paise)}</span></li>
            </ul>
            {quote && dep.advance_percent < 100 && quote.advance_paise >= MIN_PAYMENT_PAISE && (
              <fieldset className="mt-4 space-y-2 text-sm">
                <legend className="gk-label">Pay now</legend>
                <label className="flex gap-2"><input type="radio" name="pay" checked={payOption === "advance"} onChange={() => setPayOption("advance")} />
                  <span>Advance {dep.advance_percent}%: <strong>{rupeesFromPaise(quote.advance_paise)}</strong>
                    <span className="block text-xs text-slate-ink">Balance {rupeesFromPaise(quote.balance_paise)}{quote.balance_due_date ? ` due by ${formatDepartureDate(quote.balance_due_date)}` : ""}</span></span></label>
                <label className="flex gap-2"><input type="radio" name="pay" checked={payOption === "full"} onChange={() => setPayOption("full")} />
                  <span>Full amount: <strong>{rupeesFromPaise(quote.total_paise)}</strong></span></label>
              </fieldset>
            )}
            {quote && !quote.bookable && <p className="mt-3 text-sm text-red-700">{quote.not_bookable_reason}</p>}
          </div>
        ) : quoteError ? (
          <p className="text-sm text-red-700" role="alert">{quoteError}</p>
        ) : (
          <p className="text-sm text-slate-ink">{quoteError || "Working out the price…"}</p>
        )}
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        {scriptFailed && (
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
            <p>The payment window could not load on this network. Try mobile data or another browser.</p>
            <button type="button" className="gk-btn gk-btn-line py-1.5! mt-2" onClick={retryScript}>Retry</button>
          </div>
        )}
        {stage === "dismissed" && booking && (
          <p className="mt-3 text-sm text-ink">Payment not finished. Your seats are held until <strong>{holdUntil}</strong>.</p>
        )}
        {stage === "dismissed" && booking ? (
          <button type="button" className="gk-btn gk-btn-sun w-full mt-4" onClick={() => { setError(""); setStage("paying"); checkoutRef.current ? checkoutRef.current.open() : openCheckout(booking); }}>
            Pay {rupeesFromPaise(booking.amount_due_now_paise)} now
          </button>
        ) : (
          <button type="submit" className="gk-btn gk-btn-sun w-full mt-4" disabled={busy || !quote || !quote.bookable}>
            {stage === "opening" ? "Opening secure payment…" : stage === "sending" ? "Holding your seats…" : stage === "confirming" ? "Payment received, confirming…"
              : stage === "paying" ? "Complete the payment…" : amountNow != null ? `Pay ${rupeesFromPaise(amountNow)} securely` : "Pay securely"}
          </button>
        )}
        <p className="mt-3 text-xs text-slate-ink">Seats are held for {info.hold_minutes} minutes while you pay. Secure payment by Razorpay
          (UPI, cards, net banking). By paying you accept the <Link href="/terms-and-conditions" className="underline" target="_blank">Terms</Link>.</p>
      </aside>
    </form>
  );
}
