"use client";

import Link from "next/link";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { formatDepartureDate } from "@/lib/departures";
import { processingFeePercent } from "@/lib/siteSettings";

// "Booking and cancellation summary" for one departure date, next to the booking box and on the /book review step.
// Every rule and number comes from the admin (Group tour settings) and the departure itself; the cancellation slabs
// are the refund calculation's own rules (bookings/refunds.py), sent by /api/site-settings/.
// dep: { advancePercent, balanceDueDate, minPax, decisionDate, guaranteed } (lib/departures.js names)
export default function BookingSummary({ dep, headingLevel = 3, className = "" }) {
  const { group, terms, cancellation_rules: rules } = useSiteSettings();
  const Heading = `h${headingLevel}`;
  const advance = dep?.advancePercent || group.advance_percent;
  // The 7-29 day rule names the advance %: this date's own, when it differs from the default
  const ruleText = (text) => (advance !== group.advance_percent
    ? text.replace(`${group.advance_percent}% of the total`, `${advance}% of the total`) : text);
  const gokeysCancels = terms.minimumGroup[terms.minimumGroup.length - 1];
  const fee = processingFeePercent(group); // "" while the payment processing charge is off
  const feeRefund = fee ? terms.cancellation.find((line) => line.includes("processing charge")) : null;
  return (
    <section className={`text-sm text-ink ${className}`} aria-label="Booking and cancellation summary">
      <Heading className="font-semibold text-ink mb-2">Booking and cancellation summary</Heading>
      <ul className="space-y-2">
        <li><span className="font-semibold">Pay {advance}% now</span> to confirm your seats.{" "}
          {dep?.balanceDueDate ? <>The balance is due by <strong>{formatDepartureDate(dep.balanceDueDate)}</strong>.</>
            : <>The balance is due {group.balance_due_days} days before departure.</>}
          {fee ? <> A {fee}% payment processing charge is added to each online payment.</> : null}</li>
        <li>{dep?.guaranteed ? <><span className="font-semibold">Guaranteed departure:</span> this date will run.</>
          : dep?.minPax ? <>Runs with at least <strong>{dep.minPax}</strong> travellers
            {dep.decisionDate ? <>; we confirm it by <strong>{formatDepartureDate(dep.decisionDate)}</strong></> : null}.</>
            : terms.minimumGroup[0]}</li>
        <li><span className="font-semibold">If Gokeys cancels the date:</span> {gokeysCancels}</li>
        <li>
          <span className="font-semibold">If you cancel:</span>
          <ul className="mt-1 list-disc pl-5 space-y-0.5">
            {rules.map((r) => <li key={r.from_days}>{ruleText(r.text)}</li>)}
            {feeRefund && <li>{feeRefund}</li>}
          </ul>
        </li>
      </ul>
      <p className="mt-2 text-xs text-slate-ink">
        Full rules: <Link href="/terms-and-conditions" className="underline">Group Tour Terms</Link> and{" "}
        <Link href="/cancellation-policy" className="underline">Cancellation Policy</Link>.
      </p>
    </section>
  );
}
