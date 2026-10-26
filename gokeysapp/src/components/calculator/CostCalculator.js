"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import {
  CALC_API, fromParams, inr, inrShort, iso, niceDate, saveEstimate, toParams, track, whatsAppText,
} from "@/lib/calculatorApi";

// Char Dham cost calculator: four steps on the left, live estimate on the right (sticky on desktop),
// a price bar fixed to the bottom on phones. Prices come from Django (/api/calculator/quote/).
// Helicopter, pony and palki are never offered here: Gokeys does not sell them.

const HOTELS = [
  { slug: "standard", name: "Standard", hint: "Clean budget hotels, GMVN camp at Kedarnath" },
  { slug: "deluxe", name: "Deluxe", hint: "Better rooms, guest house at Kedarnath" },
  { slug: "luxury", name: "Luxury", hint: "Best available; price confirmed on request" },
];

// ---------------------------------------------------------------- small UI parts
function Chip({ on, children, onClick }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={on}
      className={`gk-pill shrink-0 min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${on ? "gk-pill-on" : ""}`}
    >{children}</button>
  );
}

function Stepper({ id, label, hint, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 py-2">
      <label htmlFor={id} className="min-w-0 text-sm">
        <span className="block font-semibold text-ink">{label}</span>
        {hint && <span className="block text-xs text-slate-ink">{hint}</span>}
      </label>
      <div className="flex items-center gap-1">
        <button type="button" aria-label={`Fewer: ${label}`} onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-11 w-11 rounded-full border border-line text-lg leading-none text-ink hover:border-ink disabled:opacity-30">−</button>
        <input id={id} inputMode="numeric" value={value} readOnly aria-live="polite"
          className="w-9 bg-transparent text-center text-base font-bold tabular-nums text-ink" />
        <button type="button" aria-label={`More: ${label}`} onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-11 w-11 rounded-full border border-line text-lg leading-none text-ink hover:border-ink disabled:opacity-30">+</button>
      </div>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <section className="gk-panel p-4 sm:p-5">
      <h2 className="gk-h3 mb-4 flex items-center gap-2.5 text-lg!">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{n}</span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const Check = ({ checked, onChange, children }) => (
  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 shrink-0 accent-teal" />
    <span>{children}</span>
  </label>
);

// ---------------------------------------------------------------- main component
export default function CostCalculator({ config, initialInput, initialQuote }) {
  const [input, setInput] = useState(initialInput);
  const [quote, setQuote] = useState(initialQuote);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [today, setToday] = useState(undefined);
  const [lead, setLead] = useState({ open: false, name: "", phone: "", state: "", msg: "" });
  const abortRef = useRef(null);
  const startedRef = useRef(false);
  const lastQuoteEventRef = useRef(0);
  const resultRef = useRef(null);
  const firstInputRef = useRef(initialInput);

  const trip = config.trips.find((t) => t.slug === input.trip) || config.trips[0];
  const startName = config.starts.find((s) => s.slug === input.start)?.name || "Haridwar";
  const seatsNeeded = input.adults + input.children_5_7;

  // Read a shared link (?trip=…&adults=…) once on load; today's date only in the browser (no hydration mismatch).
  useEffect(() => {
    setToday(iso(new Date()));
    const p = new URLSearchParams(window.location.search);
    if ([...p.keys()].length) setInput((cur) => fromParams(p, cur));
  }, []);

  const update = useCallback((key, value) => {
    setInput((cur) => {
      const next = { ...cur, [key]: value };
      if (key === "adults" && next.seniors > value) next.seniors = value;
      if (key === "trip") next.sightseeing = []; // stops differ per trip
      return next;
    });
    if (!startedRef.current) {
      startedRef.current = true;
      track("calc_start", { trip: input.trip });
    }
  }, [input.trip]);

  // Re-price on every change (250 ms debounce, the previous request aborted) and keep the URL shareable.
  useEffect(() => {
    // The server already priced the default selection; nothing to fetch until something changes.
    if (input === firstInputRef.current && initialQuote) return;
    window.history.replaceState(null, "", `${window.location.pathname}?${toParams(input)}`);
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const r = await fetch(`${CALC_API}/quote/`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input), signal: ctrl.signal,
        });
        const data = await r.json();
        if (!r.ok) {
          setError(data.error || "Could not calculate this trip. Please change an option.");
          return;
        }
        setError("");
        setQuote(data);
        const now = Date.now();
        if (startedRef.current && now - lastQuoteEventRef.current > 10000) {
          lastQuoteEventRef.current = now;
          track("calc_quote", {
            trip: data.trip.slug, travellers: input.adults + input.children_5_7, hotel: input.hotel,
            vehicle: data.vehicles[0]?.slug, per_person_min: data.per_person.min,
          });
        }
      } catch (e) {
        if (e?.name !== "AbortError") setError("No connection. Showing the last estimate.");
      } finally {
        if (abortRef.current === ctrl) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  const waHref = useMemo(() => {
    if (!quote) return `https://wa.me/${config.whatsapp}`;
    return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(whatsAppText(quote, input, startName))}`;
  }, [quote, input, startName, config.whatsapp]);

  function onWhatsApp() {
    if (!quote) return;
    track("calc_whatsapp", { quote_id: quote.ref, trip: quote.trip.slug, value: quote.total.min, currency: "INR" });
    saveEstimate(input); // stored under its ref, so the team can look it up from the WhatsApp message
  }

  async function sendLead(e) {
    e.preventDefault();
    setLead((l) => ({ ...l, state: "sending", msg: "" }));
    try {
      const r = await fetch(`${CALC_API}/lead/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, name: lead.name, phone: lead.phone }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setLead((l) => ({ ...l, state: "error", msg: data.error || "Please check your name and mobile number." }));
        return;
      }
      track("calc_lead", { quote_id: data.ref, trip: input.trip });
      setLead((l) => ({ ...l, state: "sent", msg: `Thank you. Our team will WhatsApp you the exact price shortly. Your reference is ${data.ref}.` }));
    } catch {
      setLead((l) => ({ ...l, state: "error", msg: "Could not send. Please use the WhatsApp button instead." }));
    }
  }

  const notes = quote?.notes || [];
  const sightOptions = config.sightseeing.filter((s) => trip.sightseeing.includes(s.slug));
  const rangeText = quote ? `${inr(quote.per_person.min)} – ${inr(quote.per_person.max)}` : "";

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* ------------------------------------------------ options */}
        <div className="min-w-0 space-y-4">
          <Step n={1} title="Your trip">
            <div className="flex flex-wrap gap-2">
              {config.trips.map((t) => (
                <Chip key={t.slug} on={input.trip === t.slug} onClick={() => update("trip", t.slug)}>
                  {t.name} · {t.days}D
                </Chip>
              ))}
            </div>
            <div>
              <p className="gk-label">Starting from</p>
              <div className="flex flex-wrap gap-2">
                {config.starts.map((s) => (
                  <Chip key={s.slug} on={input.start === s.slug} onClick={() => update("start", s.slug)}>{s.name}</Chip>
                ))}
              </div>
              {input.start === "delhi" && <p className="mt-2 text-xs text-slate-ink">Includes a Delhi ↔ Haridwar cab both ways.</p>}
            </div>
          </Step>

          <Step n={2} title="When and who">
            <div>
              <label htmlFor="calc-date" className="gk-label">Start date</label>
              <input id="calc-date" type="date" min={today} value={input.start_date}
                onChange={(e) => e.target.value && update("start_date", e.target.value)}
                className="gk-field h-11 text-base! sm:w-64" />
              {config.season && (
                <p className="mt-1.5 text-xs text-slate-ink">
                  Yatra season {config.season.tentative ? "expected " : ""}{niceDate(config.season.opens)} – {niceDate(config.season.closes)}.
                </p>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Stepper id="calc-adults" label="Adults" hint="Age 8 and above" value={input.adults} min={1} max={60} onChange={(v) => update("adults", v)} />
              <Stepper id="calc-seniors" label="Of these, seniors" hint="Age 60+" value={input.seniors} min={0} max={input.adults} onChange={(v) => update("seniors", v)} />
              <Stepper id="calc-kids" label="Children 5–7" hint="Half price" value={input.children_5_7} min={0} max={30} onChange={(v) => update("children_5_7", v)} />
              <Stepper id="calc-infants" label="Children under 5" hint="Free" value={input.children_under_5} min={0} max={30} onChange={(v) => update("children_under_5", v)} />
            </div>
          </Step>

          <Step n={3} title="Vehicle and hotels">
            <div>
              <label htmlFor="calc-vehicle" className="gk-label">Vehicle</label>
              <select id="calc-vehicle" value={input.vehicle} onChange={(e) => update("vehicle", e.target.value)}
                className="gk-field h-11 text-base!">
                <option value="auto">Best for {seatsNeeded} {seatsNeeded === 1 ? "person" : "people"} (recommended)</option>
                {config.vehicles.map((v) => (
                  <option key={v.slug} value={v.slug}>
                    {v.name} · up to {v.seats}{seatsNeeded > v.seats ? ` (${Math.ceil(seatsNeeded / v.seats)} needed)` : ""}
                  </option>
                ))}
              </select>
              {quote && <p className="mt-1.5 text-xs text-slate-ink">Using: {quote.vehicles.map((v) => v.name).join(" + ")}</p>}
            </div>
            <div>
              <p className="gk-label">Hotels</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {HOTELS.map((h) => (
                  <button key={h.slug} type="button" aria-pressed={input.hotel === h.slug} onClick={() => update("hotel", h.slug)}
                    className={`rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                      input.hotel === h.slug ? "border-teal bg-brand-50 ring-1 ring-teal" : "border-line bg-white hover:border-ink"}`}>
                    <span className="block text-sm font-bold text-ink">{h.name}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-slate-ink">{h.hint}</span>
                  </button>
                ))}
              </div>
            </div>
            <Check checked={input.two_per_room} onChange={(v) => update("two_per_room", v)}>Only 2 people per room</Check>
          </Step>

          <Step n={4} title="Extras">
            <div>
              <p className="gk-label">Extra rest days</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: config.max_extra_days + 1 }, (_, i) => (
                  <Chip key={i} on={input.extra_days === i} onClick={() => update("extra_days", i)}>{i === 0 ? "None" : `+${i} day${i > 1 ? "s" : ""}`}</Chip>
                ))}
              </div>
            </div>
            <Check checked={input.guide} onChange={(v) => update("guide", v)}>
              Guide for the whole trip (₹3,500 a day, his stay and meals included)
            </Check>
            {sightOptions.length > 0 && (
              <fieldset>
                <legend className="gk-label">Extra sightseeing <span className="normal-case tracking-normal font-medium">(paid directly to the driver)</span></legend>
                <div className="grid sm:grid-cols-2">
                  {sightOptions.map((s) => (
                    <Check key={s.slug} checked={input.sightseeing.includes(s.slug)}
                      onChange={(on) => update("sightseeing", on ? [...input.sightseeing, s.slug] : input.sightseeing.filter((x) => x !== s.slug))}>
                      {s.name}
                    </Check>
                  ))}
                </div>
              </fieldset>
            )}
          </Step>
        </div>

        {/* ------------------------------------------------ estimate */}
        <div ref={resultRef} id="estimate" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className={`gk-card border-2 border-teal p-5 transition-opacity ${loading ? "opacity-60" : ""}`} aria-live="polite" aria-busy={loading}>
            <p className="gk-eyebrow">Estimated cost · per person</p>
            {quote ? (
              <>
                <p className="gk-price mt-1 text-3xl tabular-nums">{rangeText}</p>
                <p className="text-sm text-slate-ink">+ {quote.gst_pct}% GST</p>
                <p className="mt-2 text-sm text-ink">
                  {quote.trip.name} · {quote.days} days · {niceDate(quote.start_date)} – {niceDate(quote.end_date)}
                </p>

                <dl className="mt-4 divide-y divide-line border-t border-line text-sm">
                  {quote.breakdown.map((b) => (
                    <div key={b.key} className="flex justify-between gap-3 py-2">
                      <dt className="text-slate-ink">{b.label}</dt>
                      <dd className="whitespace-nowrap tabular-nums text-ink">{inr(b.amount)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 py-2.5 font-bold text-ink">
                    <dt>Group total</dt>
                    <dd className="whitespace-nowrap tabular-nums">{inrShort(quote.total.min)} – {inrShort(quote.total.max)}</dd>
                  </div>
                </dl>

                {quote.pay_to_driver.total > 0 && (
                  <div className="mt-2 rounded-xl bg-sun-soft p-3 text-sm text-ink">
                    <p className="font-bold">Pay directly to the driver: {inr(quote.pay_to_driver.total)}</p>
                    <p className="text-xs text-ink/75">{quote.pay_to_driver.lines.map((l) => `${l.label} ${inr(l.amount)}`).join(" · ")}</p>
                    <p className="mt-1 text-xs text-ink/75">Not included in the total above.</p>
                  </div>
                )}

                {notes.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs text-ink">
                    {notes.includes("holiday_peak") && <li>{quote.holiday_peak_days} of your days fall on a long weekend, so vehicle rates are higher on those days.</li>}
                    {notes.includes("hotel_on_request") && <li>Luxury hotel prices change by date. This is a guide price; we confirm the exact amount on WhatsApp.</li>}
                    {notes.includes("outside_season") && <li>Some dates fall outside the expected yatra season. Temples are closed in winter; please check your dates.</li>}
                    {notes.includes("seniors") && <li>Travelling with seniors? Pony or palki can be hired locally at Yamunotri and Kedarnath, and an extra rest day helps.</li>}
                  </ul>
                )}

                <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp}
                  className="gk-btn gk-btn-wa mt-4 h-12 w-full text-[15px]">
                  <FaWhatsapp size={20} aria-hidden="true" /> Get exact quote on WhatsApp
                </a>

                {!lead.open && lead.state !== "sent" && (
                  <button type="button" onClick={() => setLead((l) => ({ ...l, open: true }))}
                    className="gk-btn gk-btn-line mt-2 h-11 w-full">
                    Send this estimate to my phone
                  </button>
                )}
                {lead.open && lead.state !== "sent" && (
                  <form onSubmit={sendLead} className="mt-3 space-y-2">
                    <label htmlFor="lead-name" className="sr-only">Your name</label>
                    <input id="lead-name" required autoComplete="name" placeholder="Your name" value={lead.name}
                      onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                      className="gk-field h-11 text-base!" />
                    <label htmlFor="lead-phone" className="sr-only">Mobile number</label>
                    <input id="lead-phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="Mobile number (WhatsApp)" value={lead.phone}
                      onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))}
                      className="gk-field h-11 text-base!" />
                    <button type="submit" disabled={lead.state === "sending"} className="gk-btn gk-btn-ink h-11 w-full disabled:opacity-60">
                      {lead.state === "sending" ? "Sending…" : "Send me this estimate"}
                    </button>
                  </form>
                )}
                {lead.msg && <p role="status" className={`mt-2 text-sm ${lead.state === "error" ? "text-red-700" : "text-teal"}`}>{lead.msg}</p>}

                <details className="gk-faq mt-4 rounded-xl border border-line text-sm">
                  <summary className="flex items-center justify-between gap-3 px-3 py-2.5 font-bold text-ink">
                    What&apos;s included and not included
                    <ChevronDown size={16} className="gk-faq-icon shrink-0 transition-transform" />
                  </summary>
                  <div className="px-3 pb-3">
                    <p className="font-bold text-ink">Included</p>
                    <ul className="mt-1 list-disc pl-5 text-slate-ink">{quote.inclusions.map((x) => <li key={x}>{x}</li>)}</ul>
                    <p className="mt-2 font-bold text-ink">Not included</p>
                    <ul className="mt-1 list-disc pl-5 text-slate-ink">{quote.exclusions.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                </details>

                {quote.trip.package_url && (
                  <a href={quote.trip.package_url} onClick={() => track("calc_package_click", { trip: quote.trip.slug })}
                    className="mt-3 block text-sm font-bold text-teal underline underline-offset-2 hover:text-ink">
                    See the full {quote.days}-day {quote.trip.name} itinerary
                  </a>
                )}
                <p className="mt-3 text-xs text-slate-ink">
                  Estimate only. The final price depends on dates and hotel availability. Ref {quote.ref}.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-ink">Choose your options to see the price.</p>
            )}
            {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ phone price bar (the site's floating WhatsApp button is hidden on this page) */}
      {quote && (
        <div className="gk-calc-bar fixed inset-x-0 bottom-0 z-40 border-t-2 border-teal bg-white px-4 pt-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden"
          style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <button type="button" onClick={() => resultRef.current?.scrollIntoView({ behavior: "smooth" })} className="min-w-0 text-left">
              <span className={`gk-price block text-lg tabular-nums transition-opacity ${loading ? "opacity-60" : ""}`}>
                {inr(quote.per_person.min)}–{inr(quote.per_person.max).replace("₹", "")}
              </span>
              <span className="block text-xs text-slate-ink">per person + GST · tap for details</span>
            </button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp}
              className="gk-btn gk-btn-wa shrink-0 px-4 py-3">
              <FaWhatsapp size={18} aria-hidden="true" /> WhatsApp quote
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
