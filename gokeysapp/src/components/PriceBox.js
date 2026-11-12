"use client";

import { useEffect, useMemo, useState } from "react";
import { TRAVELLER_TYPES, changeCount, getQuote, quoteKey, rupeesFromPaise } from "@/lib/booking";
import { formatDepartureDate, SHARING_LABELS } from "@/lib/departures";
import BookingSummary from "@/components/BookingSummary";
import StatusBadge from "@/components/StatusBadge";

const SHARING = ["quad", "triple", "double"];
const QUERY = { adult: "adults", child_with_bed: "children_with_bed", child_no_bed: "children_without_bed", infant: "infants" };

// Price box on a group tour page: date, room sharing and travellers -> base price, GST, total, the advance to pay now
// and the balance date. Every amount is the backend's quote (GET /api/departures/<id>/quote/), the same calculation
// /book charges with; nothing is worked out here. "Book now" opens /book with these choices filled in.
// deps: the dates bookable online (lib/departures.js), minAge: the tour's minimum age.
export default function PriceBox({ deps, minAge = 0 }) {
  const [depId, setDepId] = useState(deps[0]?.id ?? null);
  const dep = deps.find((d) => d.id === depId) || deps[0];
  const sharingOptions = useMemo(() => SHARING.filter((s) => dep?.prices[s]?.adult), [dep]);
  const [sharing, setSharing] = useState(sharingOptions[0] || "");
  const [counts, setCounts] = useState({ adult: 2, child_with_bed: 0, child_no_bed: 0, infant: 0 });
  const [priced, setPriced] = useState({ key: "", quote: null, error: "" });

  // A date without the chosen sharing falls back to its first; types this sharing or tour does not offer go to 0
  const shown = sharingOptions.includes(sharing) ? sharing : sharingOptions[0] || "";
  const allowed = (key) => key === "adult" || (key === "infant" ? minAge < 5 : minAge < 12 && Boolean(dep?.prices[shown]?.[key]));
  const live = Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, allowed(k) ? v : 0]));
  const key = quoteKey({ sharing: shown, counts: live, pickupId: "" });

  useEffect(() => {
    if (!dep?.id || !shown) return undefined;
    let current = true;
    const timer = setTimeout(async () => {
      const { ok, data } = await getQuote(dep.id, { sharing: shown, counts: live, pickupId: "" });
      if (!current) return;
      setPriced(ok ? { key: `${dep.id}|${key}`, quote: data, error: "" }
        : { key: `${dep.id}|${key}`, quote: null, error: data?.detail || Object.values(data || {}).flat()[0] || "This choice cannot be booked online." });
    }, 300);
    return () => { current = false; clearTimeout(timer); };
  }, [dep?.id, key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!dep) return null;
  const fresh = priced.key === `${dep.id}|${key}`;
  const quote = fresh ? priced.quote : null;
  const was = dep.compareAt?.[shown];
  const adultPaise = Math.round(Number(dep.prices[shown]?.adult || 0) * 100);
  const params = new URLSearchParams({ sharing: shown, ...Object.fromEntries(Object.entries(live).map(([k, v]) => [QUERY[k], v])) });
  const extraPickups = dep.pickups.some((p) => Number(p.extra) > 0);

  return (
    <div className="gk-card p-5 mb-4" aria-label="Price and booking">
      <p className="flex flex-wrap items-baseline gap-x-2">
        {was > adultPaise && <span className="text-sm text-slate-400 line-through">{rupeesFromPaise(was)}</span>}
        <span className="gk-price text-3xl">{rupeesFromPaise(adultPaise)}</span>
        <span className="text-xs text-slate-ink">per adult + GST · {SHARING_LABELS[shown]}</span>
      </p>

      {deps.length > 1 ? (
        <label className="block mt-3"><span className="gk-label">Date</span>
          <select className="gk-field" value={dep.id} onChange={(e) => setDepId(Number(e.target.value))}>
            {deps.map((d) => <option key={d.id} value={d.id}>{formatDepartureDate(d.date)}{d.badgeLabel ? ` · ${d.badgeLabel}` : ""}</option>)}
          </select>
        </label>
      ) : (
        <p className="mt-3 text-sm text-ink flex flex-wrap items-center gap-2">
          <span className="font-semibold">{formatDepartureDate(dep.date)}</span>
          <StatusBadge kind={dep.badge} label={dep.badgeLabel} />
        </p>
      )}

      {sharingOptions.length > 1 && (
        <fieldset className="mt-3">
          <legend className="gk-label">Room sharing</legend>
          <div className="grid grid-cols-3 gap-1.5">
            {sharingOptions.map((s) => (
              <label key={s} className={`rounded-lg border px-2 py-1.5 text-xs cursor-pointer text-center ${shown === s ? "border-ink bg-slate-50 font-semibold" : "border-line"}`}>
                <input type="radio" name="pricebox-sharing" className="sr-only" checked={shown === s} onChange={() => setSharing(s)} />
                {SHARING_LABELS[s].replace(" sharing", "")}
                <span className="block font-normal">{rupeesFromPaise(Math.round(Number(dep.prices[s].adult) * 100))}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-3 divide-y divide-line">
        {TRAVELLER_TYPES.filter((t) => allowed(t.key)).map((t) => (
          <div key={t.key} className="flex items-center justify-between gap-2 py-1.5">
            <p className="text-sm"><span className="font-semibold text-ink">{t.label}</span> <span className="text-xs text-slate-ink">{t.hint}</span></p>
            <div className="flex items-center gap-1.5">
              <button type="button" className="gk-btn gk-btn-line py-0.5! px-2.5!" aria-label={`Fewer ${t.label}`}
                disabled={live[t.key] <= (t.key === "adult" ? 1 : 0)} onClick={() => setCounts((c) => changeCount(c, t.key, -1))}>−</button>
              <span className="w-5 text-center font-bold" aria-live="polite">{live[t.key]}</span>
              <button type="button" className="gk-btn gk-btn-line py-0.5! px-2.5!" aria-label={`More ${t.label}`}
                disabled={live[t.key] >= 20} onClick={() => setCounts((c) => changeCount(c, t.key, 1))}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3" aria-busy={!fresh} aria-live="polite">
        {quote ? (
          <ul className="text-sm space-y-1">
            {quote.lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-2"><span>{l.label} × {l.count}</span><span>{rupeesFromPaise(l.amount_paise)}</span></li>
            ))}
            <li className="flex justify-between gap-2"><span>GST {Number(quote.gst_percent)}%</span><span>{rupeesFromPaise(quote.gst_paise)}</span></li>
            <li className="flex justify-between gap-2 font-bold text-ink border-t border-line pt-1"><span>Total</span><span>{rupeesFromPaise(quote.total_paise)}</span></li>
            {quote.advance_percent < 100 && <>
              <li className="flex justify-between gap-2 font-semibold"><span>Pay now ({quote.advance_percent}%)</span><span>{rupeesFromPaise(quote.advance_paise)}</span></li>
              <li className="flex justify-between gap-2 text-slate-ink"><span>Balance{quote.balance_due_date ? ` due by ${formatDepartureDate(quote.balance_due_date)}` : ""}</span><span>{rupeesFromPaise(quote.balance_paise)}</span></li>
            </>}
          </ul>
        ) : fresh && priced.error ? (
          <p className="text-sm text-red-700" role="alert">{priced.error}</p>
        ) : (
          <p className="text-sm text-slate-ink">Working out the price…</p>
        )}
        {quote && !quote.bookable && <p className="mt-2 text-sm text-red-700">{quote.not_bookable_reason}</p>}
        {extraPickups && <p className="mt-2 text-xs text-slate-ink">Some pickup points cost extra: you choose yours on the next step.</p>}
      </div>

      {/* A full page load: /book has its own security policy that allows Razorpay */}
      <a href={`/book/${dep.id}?${params}`} className={`gk-btn gk-btn-sun w-full mt-4 ${quote && quote.bookable ? "" : "pointer-events-none opacity-60"}`}
        aria-disabled={!(quote && quote.bookable)}>Book now</a>

      <BookingSummary dep={dep} className="mt-4 border-t border-line pt-3" />
    </div>
  );
}
