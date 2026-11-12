// Group tour policy, trust numbers and business details from the Django admin (Group tour settings, Voucher and
// email settings), read from /api/site-settings/. One fetch per page build, cached like every API call and refreshed
// when the owner saves the settings. If the API cannot be reached, today's values below are used, so no page breaks.
import TERMS from "./groupDepartureTerms.json" with { type: "json" };
import { CACHED } from "./api.js";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";
const TERM_KEYS = ["payment", "cancellation", "minimumGroup"];

/** The shared rule wording with its {placeholders} filled in (the backend does the same for the voucher). Lines about
 * the payment processing charge are left out while it is 0 (off). */
export function fillTerms(values, source = TERMS) {
  const fill = (line) => line.replace(/\{(\w+)\}/g, (all, key) => (values[key] != null ? String(values[key]) : all));
  const off = !(Number(values.processing_fee_percent) > 0);
  const keep = (line) => !(off && line.includes("{processing_fee_percent}"));
  return Object.fromEntries(TERM_KEYS.map((key) => [key, source[key].filter(keep).map(fill)]));
}

/** "2" when the payment processing charge is on (Group tour settings), else "" (0 = off). */
export const processingFeePercent = (group) => (Number(group?.processing_fee_percent) > 0 ? String(group.processing_fee_percent) : "");

const GROUP = { advance_percent: 25, balance_due_days: 7, default_min_pax: 12, gokeys_cancel_refund_days: 7,
  filling_fast_percent: 50, few_seats_left: 5, hide_seats_below_booked: 5, processing_fee_percent: "0", terms_changed_on: null };

export const SITE_DEFAULTS = {
  group: GROUP,
  trust: { experience_years: 10, owner_experience_years: 15, founded_year: 2019, google_rating: "4.8", google_review_count: 180 },
  business: { name: "Gokeys India", email: "gokeysindia@gmail.com", phone: "+91-9045916770, +91-7830718680",
    whatsapp: "+91-7830718687", website: "gokeys.in", gstin: "", tourism_registration: "", tour_desk_phone: "+91-7830718687",
    office_address: "4th Shop, Zila Panchayat Market, Railway Road, Haridwar, Uttarakhand, India" },
  cancellation_rules: [
    { from_days: 30, to_days: null, charge: "₹2,000 per person", charge_base: "of what you paid",
      text: "30 or more days before departure: we keep ₹2,000 per person and refund the rest of what you paid." },
    { from_days: 7, to_days: 29, charge: "The advance", charge_base: "25% of the total",
      text: "7 to 29 days before departure: we keep the advance (25% of the total) and refund anything you paid above it." },
    { from_days: 0, to_days: 6, charge: "Everything paid", charge_base: "no refund",
      text: "Less than 7 days before departure, or if you do not show up: no refund." },
  ],
  terms: fillTerms({ advance_percent: GROUP.advance_percent, balance_due_days: GROUP.balance_due_days, refund_days: GROUP.gokeys_cancel_refund_days }),
  terms_version: "",
};

/** Settings from the API merged over the defaults (a missing part never leaves a hole). */
export function mergeSiteSettings(data) {
  if (!data || typeof data !== "object") return SITE_DEFAULTS;
  const part = (key) => ({ ...SITE_DEFAULTS[key], ...(data[key] && typeof data[key] === "object" ? data[key] : {}) });
  const terms = data.terms && TERM_KEYS.every((k) => Array.isArray(data.terms[k])) ? data.terms : SITE_DEFAULTS.terms;
  return {
    group: part("group"), trust: part("trust"), business: part("business"), terms,
    cancellation_rules: Array.isArray(data.cancellation_rules) && data.cancellation_rules.length
      ? data.cancellation_rules : SITE_DEFAULTS.cancellation_rules,
    terms_version: data.terms_version || "",
  };
}

/** Server components and the root layout. */
export async function getSiteSettings() {
  try {
    const res = await fetch(`${API}/api/site-settings/`, CACHED);
    if (!res.ok) return SITE_DEFAULTS;
    return mergeSiteSettings(await res.json());
  } catch {
    return SITE_DEFAULTS;
  }
}

/** "4.8 · 180 Google reviews" */
export const googleLine = (trust) => `${trust.google_rating} · ${trust.google_review_count} Google reviews`;

/** wa.me link for the business WhatsApp number with a prefilled message. */
export function whatsappLink(business, text) {
  const digits = String(business?.whatsapp || "").replace(/\D/g, "");
  const number = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
