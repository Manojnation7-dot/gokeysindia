// "Last updated" date of the Terms, Cancellation & Refund Policy and Privacy Policy pages. The visible line and the
// pages' structured data (dateModified) both come from here, so they always match. Change it when a policy changes.
export const POLICY_UPDATED = "2026-11-11"; // SET TO THE PHASE 5 DEPLOY DATE (how to cancel, in groupDepartureTerms.json)

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
  "November", "December"];

/** "2026-11-03" -> "November 3, 2026" (no Date object: the same text on the server and in every time zone). */
export function formatPolicyDate(iso = POLICY_UPDATED) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
