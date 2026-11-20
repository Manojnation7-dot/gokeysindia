// The /book page's short "Booking rules" (3 lines), built from the same data as the full rules: the admin's Group tour
// settings, this departure, and the cancellation rules the refund calculation uses (bookings/refunds.py, sent by
// /api/site-settings/). The full wording stays in groupDepartureTerms.json (shown in "Read full booking rules").
// Pure functions (tested in checkoutSummary.test.mjs).

/** "30+ days before: ₹2,000 per person kept · 7–29 days: the advance kept · under 7 days: no refund" */
export function cancellationLine(rules) {
  const parts = (rules || []).map((r) => {
    const from = Number(r.from_days), to = r.to_days == null ? null : Number(r.to_days);
    const when = to == null ? `${from}+ days before` : from === 0 ? `under ${to + 1} days` : `${from}–${to} days`;
    const what = String(r.charge_base || "").toLowerCase() === "no refund" ? "no refund"
      : `${String(r.charge || "").replace(/^The /, "the ")} kept`;
    return `${when}: ${what}`;
  });
  return parts.length ? `If you cancel: ${parts.join(" · ")}.` : "";
}

/**
 * Three lines: advance and balance; cancellation; minimum group.
 * dep: { advancePercent, balanceDueDateText, minPax, decisionDateText, guaranteed }; group: Group tour settings;
 * minimumGroupFallback: the shared terms' first minimum-group line; fee: the processing charge % ("" when off).
 */
export function rulesSummary({ dep = {}, group = {}, rules = [], fee = "", minimumGroupFallback = "" }) {
  const advance = dep.advancePercent || group.advance_percent;
  const balance = dep.balanceDueDateText ? `the balance is due by ${dep.balanceDueDateText}`
    : `the balance is due ${group.balance_due_days} days before departure`;
  const pay = `Pay ${advance}% now to confirm your seats (or pay in full); ${balance}.`
    + (fee ? ` Each online payment has a ${fee}% payment processing charge.` : "");
  const minimum = dep.guaranteed ? "Guaranteed departure: this date will run."
    : dep.minPax ? `Runs with at least ${dep.minPax} travellers${dep.decisionDateText ? `, confirmed by ${dep.decisionDateText}` : ""}; if it does not, you choose a full refund, a free move or a private trip.`
      : minimumGroupFallback;
  return [pay, cancellationLine(rules), minimum].filter(Boolean);
}
