// Meta Pixel events (Phase F, minimal): PageView (components/Analytics.js), Lead after an enquiry is saved, and
// Purchase on the checkout page after the payment is verified. Only when the Pixel is loaded, i.e. with
// NEXT_PUBLIC_META_PIXEL_ID set and the visitor's "Accept" (lib/consent.js). No booking token or personal data is
// ever sent: events carry only a value and the currency. Google is not touched here.
import { hasAdConsent } from "./consent.js";

/** One Meta standard event, only with consent and a loaded Pixel. Returns true when it was sent. */
export function trackEvent(metaName, params = {}) {
  if (typeof window === "undefined" || !hasAdConsent() || typeof window.fbq !== "function") return false;
  try {
    window.fbq("track", metaName, params);
    return true;
  } catch {
    return false; // ad measurement never breaks the page
  }
}

/** Lead: an enquiry form was saved. Nothing about the visitor is sent. */
export const trackLead = () => trackEvent("Lead");

/** Purchase params: what was paid now (rupees, without the payment processing charge) in INR. */
export const purchaseParams = (paidNowPaise) => ({ value: Math.round(Number(paidNowPaise) || 0) / 100, currency: "INR" });

/** Purchase once per booking on this browser (a retry or second tab never counts twice). The booking reference only
 *  names the "already sent" note kept in this browser; it is never sent to Meta. */
export function trackPurchaseOnce(reference, paidNowPaise) {
  if (typeof window === "undefined" || !reference) return false;
  const key = `gk_purchase_${reference}`;
  try {
    if (localStorage.getItem(key)) return false;
  } catch { /* storage blocked: still send once for this page */ }
  const sent = trackEvent("Purchase", purchaseParams(paidNowPaise));
  if (sent) { try { localStorage.setItem(key, "1"); } catch { /* ignore */ } }
  return sent;
}

/** Pages where the Pixel never runs: the guest's booking pages (their address carries a booking token). */
export const isUntrackedPath = (pathname) => /^\/book\/(check|booking)(\/|$)/.test(pathname || "");

/** The Meta Pixel id when it is a real one ("1234567890"), else "" (no Pixel code at all). */
export const pixelId = (value) => (/^\d{5,20}$/.test(String(value || "").trim()) ? String(value).trim() : "");

/** Load the Pixel? Only with an id, the visitor's "Accept", and not on a guest's booking pages. */
export const shouldLoadPixel = ({ id, consent, pathname }) => Boolean(pixelId(id)) && consent === "granted" && !isUntrackedPath(pathname);
