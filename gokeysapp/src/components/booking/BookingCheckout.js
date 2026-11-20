"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  TRAVELLER_TYPES, changeCount, createBooking, errorMessage, getBookingDeparture, getQuote, loadRazorpay, previewToken,
  quoteKey, rupeesFromPaise, sendPaymentCallback, travellerRows, travellerSlots, WOMEN_ONLY_MESSAGE,
} from "@/lib/booking";
import { formatDepartureDate, formatPickupTime, SHARING_LABELS } from "@/lib/departures";
import { startRecaptcha } from "@/lib/recaptcha";
import GroupDepartureTerms from "@/components/GroupDepartureTerms";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { processingFeePercent } from "@/lib/siteSettings";
import { rulesSummary } from "@/lib/checkoutSummary";
import { trackPurchaseOnce } from "@/lib/tracking";

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
  // One box for the booking rules and the privacy policy; the guardian / medical boxes only when they apply
  const [consent, setConsent] = useState({ consent: false, guardian: false, medical: false });
  // The latest price answer and the inputs it was for: an answer for older inputs is never shown as the price
  const [priced, setPriced] = useState({ key: "", quote: null, error: "" });
  const [stage, setStage] = useState("form"); // form | opening | sending | paying | dismissed | confirming
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [scriptFailed, setScriptFailed] = useState(false); // Razorpay's script failed to load or took over 15 s
  const checkoutRef = useRef(null);
  const formRef = useRef(null);
  const paidNowRef = useRef(0); // Meta Purchase value (paise), set when the booking is made
  const payPressed = useRef(false);
  const rulesRef = useRef(null);       // the "Read full booking rules" dialog
  const consentRef = useRef(null);     // the consent box(es) just above Pay
  const [payButton, setPayButton] = useState(null);
  const [payVisible, setPayVisible] = useState(false); // the real Pay button is on screen: no sticky bar
  const [typing, setTyping] = useState(false);         // an input has focus (phone keyboard open): no sticky bar
  const site = useSiteSettings();

  useEffect(() => {
    const field = (el) => el && el.matches?.("input:not([type=checkbox]):not([type=radio]), select, textarea");
    const onIn = (e) => setTyping(field(e.target));
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => { document.removeEventListener("focusin", onIn); document.removeEventListener("focusout", onOut); };
  }, []);

  useEffect(() => {
    if (!payButton || typeof IntersectionObserver === "undefined") return undefined;
    const seen = new IntersectionObserver(([entry]) => setPayVisible(entry.isIntersecting), { threshold: 0.5 });
    seen.observe(payButton);
    return () => seen.disconnect();
  }, [payButton]);

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
      // Choices made in the price box on the tour page (?sharing=&adults=...); the server prices them again
      const ask = new URLSearchParams(window.location.search);
      setSharing(withAdult.includes(ask.get("sharing")) ? ask.get("sharing") : withAdult[0] || "");
      const count = (name, min) => { const n = Number(ask.get(name)); return Number.isInteger(n) && n >= min && n <= 20 ? n : null; };
      const asked = { adult: count("adults", 1), child_with_bed: count("children_with_bed", 0),
        child_no_bed: count("children_without_bed", 0), infant: count("infants", 0) };
      if (asked.adult) setCounts((c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, asked[k] ?? v])));
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
  // "Booking rules" in 3 lines: the same settings, departure and cancellation rules as the full text
  const shortRules = rulesSummary({
    dep: { advancePercent: dep.advance_percent, guaranteed: dep.guaranteed === true, minPax: dep.min_pax,
      balanceDueDateText: dep.balance_due_date ? formatDepartureDate(dep.balance_due_date) : "",
      decisionDateText: dep.decision_date ? formatDepartureDate(dep.decision_date) : "" },
    group: site.group, rules: site.cancellation_rules, fee: processingFeePercent(site.group),
    minimumGroupFallback: site.terms.minimumGroup[0],
  });
  const openRules = () => rulesRef.current?.showModal?.();
  // What Razorpay will ask for: the advance or the full amount plus its payment processing charge (the server's quote)
  const option = quote ? (payOption === "full"
    ? { label: "Full amount", paise: quote.total_paise, fee: quote.full_fee_paise || 0, toPay: quote.full_to_pay_paise ?? quote.total_paise }
    : { label: `Advance ${dep.advance_percent}%`, paise: quote.advance_paise, fee: quote.advance_fee_paise || 0, toPay: quote.advance_to_pay_paise ?? quote.advance_paise })
    : null;
  const amountNow = option ? option.toPay : null;
  const setTraveller = (i, key, value) => setTravellers((typed) => {
    const next = [...typed];
    while (next.length <= i) next.push({ ...EMPTY_TRAVELLER });
    next[i] = { ...next[i], [key]: value };
    return next;
  });

  // Women-only batch: every traveller, the lead booker included, must be female (the backend checks it again)
  const womenOnly = dep.women_only === true;
  const notFemale = (t) => womenOnly && t.gender !== "" && t.gender !== "female";
  const womenOnlyBlocked = rows.some(notFemale);

  // skipConsent: the sticky bar shows once everything else is filled in (the boxes are just above the Pay button)
  function check(skipConsent = false) {
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
      if (notFemale(t)) return WOMEN_ONLY_MESSAGE;
    }
    if (Number(rows[0]?.age) < 18) return "Traveller 1 is the lead booker and must be 18 or over.";
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(contact.lead_phone.replace(/[\s-]/g, ""))) return "Enter a 10-digit Indian mobile number.";
    if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(contact.lead_email.trim())) return "Enter a valid email address.";
    if (!contact.emergency_name.trim() || !/^(\+?91)?[6-9]\d{9}$/.test(contact.emergency_phone.replace(/[\s-]/g, ""))) return "Enter an emergency contact who is not travelling, with a 10-digit mobile number.";
    if (!skipConsent && !consent.consent) return "Please tick the box to agree to the booking rules and the privacy policy.";
    if (!skipConsent && anyMinor && !consent.guardian) return "Please confirm you are the parent or guardian of every traveller under 18.";
    if (!skipConsent && anyMedical && !consent.medical) return "Please tick the box for the medical notes, or leave them empty.";
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
          const verified = await sendPaymentCallback(response); // only checks the payment; the booking is confirmed by Razorpay's webhook
          // Meta Pixel "Purchase" once the server verified the payment: the tour amount paid now (without the payment
          // processing charge) in INR; nothing else. Fired here, not on /book/booking, whose address has the booking token.
          if (verified?.ok) trackPurchaseOnce(result.reference, paidNowRef.current);
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
    paidNowRef.current = option ? option.paise : 0; // advance or full amount, without the processing charge
    setBooking(data);
    openCheckout(data);
  }

  const busy = stage === "opening" || stage === "sending" || stage === "paying" || stage === "confirming";
  const holdUntil = booking?.hold_expires_at
    ? new Date(booking.hold_expires_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "";

  return (
    <form ref={formRef} onSubmit={submit} onFocus={startRecaptcha} className="grid gap-6 lg:grid-cols-[1fr_340px] items-start pb-24 lg:pb-0" noValidate>
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
          {womenOnly && <p className="mt-2 text-sm text-ink"><span className="gk-chip bg-pink-50! text-pink-800! mr-2">Women only</span>
            Only women can book this batch.</p>}
        </section>

        {/* Steps (phones and tablets): jump to each part of the form */}
        <nav aria-label="Booking steps" className="lg:hidden">
          <ol className="grid grid-cols-2 gap-2 text-xs font-semibold text-ink">
            {[["step-1", "1. Rooms and travellers"], ["step-2", "2. Traveller details"], ["step-3", "3. Booking rules"], ["step-4", "4. Price and payment"]].map(([id, text]) => (
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
            <p className="mt-2 text-xs text-slate-ink">Single room: on request (please send an enquiry).</p>
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
                  {notFemale(t) && <p className="mt-2 text-sm text-red-700" role="alert">{WOMEN_ONLY_MESSAGE}</p>}
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
          <h2 className="gk-h3 text-lg! mb-2">3. Booking rules</h2>
          {/* In short (3 lines). The full rules and how we use your details are one tap away, without leaving the page */}
          <ul className="list-disc pl-5 space-y-1 text-sm text-ink" aria-label="Booking rules in short">
            {shortRules.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <button type="button" onClick={openRules} className="mt-1 min-h-[44px] text-sm font-semibold text-teal underline underline-offset-2">
            Read full booking rules
          </button>
          <dialog ref={rulesRef} aria-labelledby="rules-title" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
            className="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[85vh] rounded-xl p-0 backdrop:bg-black/50">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-2">
              <h2 id="rules-title" className="gk-h3 text-lg!">Booking rules</h2>
              <button type="button" onClick={() => rulesRef.current?.close()} className="gk-btn gk-btn-line py-1.5! min-h-[44px]">Close</button>
            </div>
            <div className="px-4 py-3 text-sm text-ink">
              <GroupDepartureTerms headingClass="font-semibold mt-2 first:mt-0" listClass="list-disc pl-5 space-y-0.5" />
              <h3 className="font-semibold mt-4 mb-1">Your details</h3>
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
            </div>
          </dialog>
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
              {shownQuote.gst_paise > 0 && <>
                <li className="flex justify-between gap-2 border-t border-line pt-1"><span>Subtotal</span><span>{rupeesFromPaise(shownQuote.subtotal_paise)}</span></li>
                <li className="flex justify-between gap-2"><span>GST {shownQuote.gst_percent}%</span><span>{rupeesFromPaise(shownQuote.gst_paise)}</span></li>
              </>}
              <li className={`flex justify-between gap-2 font-bold text-ink ${shownQuote.gst_paise > 0 ? "" : "border-t border-line pt-1"}`}><span>Total</span><span>{rupeesFromPaise(shownQuote.total_paise)}</span></li>
            </ul>
            {quote && dep.advance_percent < 100 && quote.advance_paise >= MIN_PAYMENT_PAISE && (
              <fieldset className="mt-4 space-y-2 text-sm">
                <legend className="gk-label">Pay now</legend>
                <label className="flex gap-2"><input type="radio" name="pay" checked={payOption === "advance"} onChange={() => setPayOption("advance")} />
                  <span>Advance {dep.advance_percent}%: <strong>{rupeesFromPaise(quote.advance_paise)}</strong>
                    <span className="block text-xs text-slate-ink">Balance {rupeesFromPaise(quote.balance_paise)}{quote.balance_due_date ? ` due by ${formatDepartureDate(quote.balance_due_date)}` : ""}
                      {quote.advance_fee_paise > 0 ? ` (plus the ${quote.processing_fee_percent}% payment processing charge when paid online)` : ""}</span></span></label>
                <label className="flex gap-2"><input type="radio" name="pay" checked={payOption === "full"} onChange={() => setPayOption("full")} />
                  <span>Full amount: <strong>{rupeesFromPaise(quote.total_paise)}</strong></span></label>
              </fieldset>
            )}
            {option && option.fee > 0 && (
              <ul className="mt-4 text-sm space-y-1 border-t border-line pt-3" aria-label="Amount to pay now">
                <li className="flex justify-between gap-2"><span>{option.label}</span><span>{rupeesFromPaise(option.paise)}</span></li>
                <li className="flex justify-between gap-2"><span>Payment processing charge ({quote.processing_fee_percent}%)</span><span>{rupeesFromPaise(option.fee)}</span></li>
                <li className="flex justify-between gap-2 font-bold text-ink"><span>To pay now</span><span>{rupeesFromPaise(option.toPay)}</span></li>
                <li className="text-xs text-slate-ink">The processing charge is not part of the tour price. It is not refunded if you cancel; it is refunded if Gokeys cancels the date.</li>
              </ul>
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
          <>
          {womenOnly && <p className="mt-4 text-sm text-ink"><span className="gk-chip bg-pink-50! text-pink-800! mr-2">Women only</span>Only women can book this batch.</p>}
          <div ref={consentRef} className="mt-4 space-y-2 text-sm scroll-mt-24">
            <label className="flex gap-2 items-start">
              <input type="checkbox" checked={consent.consent} onChange={(e) => setConsent({ ...consent, consent: e.target.checked })} className="mt-0.5 size-5 shrink-0" required />
              <span>I agree to the <button type="button" onClick={openRules} className="underline">booking rules</button> and the{" "}
                <Link href="/privacy-policy" className="underline" target="_blank">privacy policy</Link>.</span>
            </label>
            {anyMinor && (
              <label className="flex gap-2 items-start">
                <input type="checkbox" checked={consent.guardian} onChange={(e) => setConsent({ ...consent, guardian: e.target.checked })} className="mt-0.5 size-5 shrink-0" />
                <span>I am the parent or legal guardian of every traveller under 18 in this booking, and they travel with me.</span>
              </label>
            )}
            {anyMedical && (
              <label className="flex gap-2 items-start">
                <input type="checkbox" checked={consent.medical} onChange={(e) => setConsent({ ...consent, medical: e.target.checked })} className="mt-0.5 size-5 shrink-0" />
                <span>I agree to Gokeys keeping the medical notes above to look after the travellers on this trip (deleted 7 days after it).</span>
              </label>
            )}
          </div>
          <button ref={setPayButton} type="submit" className="gk-btn gk-btn-sun w-full mt-4" disabled={busy || !quote || !quote.bookable || womenOnlyBlocked || !consent.consent}>
            {stage === "opening" ? "Opening secure payment…" : stage === "sending" ? "Holding your seats…" : stage === "confirming" ? "Payment received, confirming…"
              : stage === "paying" ? "Complete the payment…" : amountNow != null ? `Pay ${rupeesFromPaise(amountNow)} securely` : "Pay securely"}
          </button>
          </>
        )}
        <p className="mt-3 text-xs text-slate-ink">Seats are held for {info.hold_minutes} minutes while you pay. Secure payment by Razorpay
          (UPI, cards, net banking). By paying you accept the <Link href="/terms-and-conditions" className="underline" target="_blank">Terms</Link>.</p>
      </aside>
      {/* Phones: the amount and Pay at the bottom once everything is filled in; hidden while typing (keyboard) and while
          the real Pay button, its boxes and messages are on screen, so it never covers them */}
      {!booking && stage === "form" && amountNow != null && quote?.bookable && !womenOnlyBlocked && !typing && !payVisible
        && check(true) === "" && <PayBar amount={rupeesFromPaise(amountNow)} onPay={() => {
          if (check() === "") return formRef.current?.requestSubmit();
          consentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          consentRef.current?.querySelector("input:not(:checked)")?.focus({ preventScroll: true });
        }} />}
    </form>
  );
}

// Phones only: a bar fixed to the bottom with the amount to pay now and Pay. While it shows, the page's WhatsApp
// button moves up above it (globals.css: body.gk-paybar), so nothing is covered.
function PayBar({ amount, onPay }) {
  useEffect(() => {
    document.body.classList.add("gk-paybar");
    return () => document.body.classList.remove("gk-paybar");
  }, []);
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <p className="min-w-0 flex-1 text-sm text-slate-ink">To pay now<span className="block text-lg font-bold text-ink">{amount}</span></p>
        <button type="button" onClick={onPay} className="gk-btn gk-btn-sun min-h-[44px] px-5!">Pay {amount}</button>
      </div>
    </div>
  );
}
