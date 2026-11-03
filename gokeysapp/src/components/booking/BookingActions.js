"use client";

import { useState } from "react";
import { chooseAfterCancellation, errorMessage, getBalanceLink, requestCancellation, rupeesFromPaise } from "@/lib/booking";
import { formatDepartureDate } from "@/lib/departures";

const fromRupees = (value) => rupeesFromPaise(Math.round(Number(value || 0) * 100));

// What the guest can do from their link (Phase 3). The backend says what this link may do (signed in with a code,
// or the emailed options link) and works out every amount; nothing here is ever refunded or charged by itself.
export default function BookingActions({ booking: b, token, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [target, setTarget] = useState("");

  async function run(fn) {
    setBusy(true); setError("");
    const { ok, data } = await fn();
    setBusy(false);
    if (!ok) { setError(errorMessage(data)); return null; }
    return data;
  }

  const payBalance = async () => {
    if (b.balance_link) return window.location.assign(b.balance_link);
    const data = await run(() => getBalanceLink(token));
    if (data?.url) window.location.assign(data.url);
  };

  const cancel = async () => {
    const q = b.cancel_quote;
    if (!window.confirm(`Ask to cancel booking ${b.reference}? ${q.rule_label}. Refund: ${rupeesFromPaise(q.refund_paise)}. Our office confirms it; nothing changes until then.`)) return;
    const data = await run(() => requestCancellation(token));
    if (data) onChange(data);
  };

  const choose = async (choice) => {
    const labels = { refund: "a 100% refund", move: "the new date", private: "a private trip (our team will call you with the price)" };
    if (choice === "move" && !target) return setError("Choose the new date first.");
    if (!window.confirm(`Confirm ${labels[choice]}? You cannot change this choice online afterwards.`)) return;
    const data = await run(() => chooseAfterCancellation(token, choice, choice === "move" ? target : null));
    if (data) onChange(data);
  };

  const c = b.choice;
  const anything = b.can_pay_balance || b.balance_link || b.refund_request || b.can_cancel || c;
  if (!anything) return null;
  return (
    <section className="gk-card p-5 space-y-4">
      {c && <div>
        <h2 className="gk-h3 text-lg! mb-1">Choose what happens next</h2>
        {c.chosen !== "pending" ? <p className="text-sm text-ink">Your choice: <strong>{{ refund: "100% refund", move: "move to another date", private: "private trip" }[c.chosen]}</strong>.
          We will be in touch.</p> : c.can_choose ? <div className="space-y-3 text-sm">
          <div className="gk-panel p-3"><p className="font-semibold">1. A 100% refund of {fromRupees(c.refund)}</p><p className="text-slate-ink">Within 7 working days, after our office confirms it.</p>
            <button type="button" className="gk-btn gk-btn-ink mt-2" disabled={busy} onClick={() => choose("refund")}>Choose the refund</button></div>
          <div className="gk-panel p-3"><p className="font-semibold">2. Move to another departure, free of charge</p>
            {c.move_options.length ? <>
              <select className="gk-field mt-2" value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="">Choose a date</option>
                {c.move_options.map((o) => <option key={o.departure_id} value={o.departure_id}>{o.tour && o.tour !== b.tour ? `${o.tour}, ` : ""}{formatDepartureDate(o.date)}: total {rupeesFromPaise(o.total_paise)}
                  {o.difference_paise ? ` (${o.difference_paise > 0 ? "+" : "-"}${rupeesFromPaise(Math.abs(o.difference_paise))})` : ""}</option>)}
              </select>
              <p className="text-slate-ink mt-1">A higher fare: pay the difference with the balance. A lower fare: we refund the difference.</p>
              <button type="button" className="gk-btn gk-btn-ink mt-2" disabled={busy} onClick={() => choose("move")}>Move to this departure</button>
            </> : <p className="text-slate-ink">No other date has seats right now. Please call us.</p>}</div>
          <div className="gk-panel p-3"><p className="font-semibold">3. Run it as a private trip</p><p className="text-slate-ink">You pay the difference; our team calls you with the price.</p>
            <button type="button" className="gk-btn gk-btn-line mt-2" disabled={busy} onClick={() => choose("private")}>Choose a private trip</button></div>
        </div> : <p className="text-sm text-ink">Please open the link from the email we sent you, or use Check my booking, to choose.</p>}
      </div>}

      {(b.can_pay_balance || b.balance_link) && b.balance_paise > 0 && <div>
        <h2 className="gk-h3 text-lg! mb-1">Pay the balance</h2>
        <p className="text-sm text-ink">{rupeesFromPaise(b.balance_paise)}{b.balance_due_date ? `, due by ${formatDepartureDate(b.balance_due_date)}` : ""}. Secure payment with Razorpay
          (UPI, cards, net banking).</p>
        <button type="button" className="gk-btn gk-btn-sun mt-2" disabled={busy} onClick={payBalance}>{busy ? "Opening…" : "Pay balance"}</button>
      </div>}

      {b.refund_request && <p className="text-sm text-ink">Your request{b.refund_request.cancels_booking ? " to cancel" : ""} is with our office
        (refund {Number(b.refund_request.amount) > 0 ? fromRupees(b.refund_request.amount) : "none due"}). We will email you once it is done.</p>}

      {b.can_cancel && b.cancel_quote && <div>
        <h2 className="gk-h3 text-lg! mb-1">Cancel this booking</h2>
        <p className="text-sm text-ink">{b.cancel_quote.days_before} days before departure. {b.cancel_quote.rule_label}: you would get back
          <strong> {rupeesFromPaise(b.cancel_quote.refund_paise)}</strong>. You can also transfer your seat to someone else free of charge, or change the date, up to 7 days before departure: call us.</p>
        <button type="button" className="gk-btn gk-btn-line mt-2" disabled={busy} onClick={cancel}>Ask to cancel</button>
      </div>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </section>
  );
}
