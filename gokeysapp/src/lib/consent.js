// Meta Pixel cookie consent (Phase F). One first-party cookie, gk_ad_consent = "granted" | "denied", kept 180 days.
// No choice yet or Decline = no Meta Pixel. Google Analytics / Google Ads and essential cookies are NOT affected.
export const CONSENT_COOKIE = "gk_ad_consent";
export const CONSENT_DAYS = 180;
export const CONSENT_EVENT = "gk-consent"; // fired on window when the choice changes ({ detail: "granted" | "denied" })

/** "granted", "denied" or "" (not chosen yet) from a cookie string. */
export function readConsent(cookieString) {
  const match = String(cookieString || "").match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)(?:;|$)`));
  return match ? match[1] : "";
}

export const currentConsent = () => (typeof document === "undefined" ? "" : readConsent(document.cookie));
export const hasAdConsent = () => currentConsent() === "granted";

/** Saves the choice; the Pixel loads on "granted" (components/Analytics.js). */
export function setConsent(value) {
  if (typeof document === "undefined" || (value !== "granted" && value !== "denied")) return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
