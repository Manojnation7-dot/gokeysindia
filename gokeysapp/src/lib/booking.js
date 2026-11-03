// Online booking of group departures (/book pages). Every amount comes from the backend (api.gokeys.in), which
// works it out from its own prices; this file never sends an amount. Tokens (the guest's booking link and a staff
// test link) travel in request headers and live after the "#" of the page address, so they never reach a server log.
import { getRecaptchaToken } from "./recaptcha.js";

const API = process.env.NEXT_PUBLIC_API_URL;
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

/** Rupees from integer paise: 1470000 -> "₹14,700". Whole rupees without decimals, else 2 decimals. */
export function rupeesFromPaise(paise) {
  const value = Number(paise || 0) / 100;
  const whole = Number.isInteger(value);
  return "₹" + value.toLocaleString("en-IN", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 });
}

/** A value after "#" in the address: "#preview=abc" -> preview "abc"; "#abc" -> the booking token "abc". */
export function hashValue(name, hash = typeof window === "undefined" ? "" : window.location.hash) {
  const raw = (hash || "").replace(/^#/, "");
  if (!raw) return "";
  if (!name) return raw.includes("=") ? "" : decodeURIComponent(raw);
  const match = raw.split("&").map((part) => part.split("=")).find(([key]) => key === name);
  return match ? decodeURIComponent(match[1] || "") : "";
}

/** Staff test link token: read once from the address, then kept for this browser tab (reloads keep working). */
export function previewToken() {
  if (typeof window === "undefined") return "";
  const fromHash = hashValue("preview");
  try {
    if (fromHash) sessionStorage.setItem("gk_booking_preview", fromHash);
    return fromHash || sessionStorage.getItem("gk_booking_preview") || "";
  } catch {
    return fromHash;
  }
}

const headers = (extra = {}) => {
  const preview = previewToken();
  return { "Content-Type": "application/json", ...(preview ? { "X-Booking-Preview": preview } : {}), ...extra };
};

async function call(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API}${path}`, { cache: "no-store", ...options });
  } catch {
    return { ok: false, status: 0, data: { detail: "Network error. Please check your connection and try again." } };
  }
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const getBookingDeparture = (id) => call(`/api/bookings/departure/${encodeURIComponent(id)}/`, { headers: headers() });

/** Server-calculated price for these choices (never an amount from here). */
export function getQuote(departureId, { sharing, counts, pickupId }) {
  const params = new URLSearchParams({
    sharing, adults: counts.adult, children_with_bed: counts.child_with_bed,
    children_without_bed: counts.child_no_bed, infants: counts.infant,
  });
  if (pickupId) params.set("pickup", pickupId);
  return call(`/api/departures/${encodeURIComponent(departureId)}/quote/?${params}`);
}

export async function createBooking(body) {
  let recaptcha_token;
  try {
    recaptcha_token = await getRecaptchaToken("booking");
  } catch {
    return { ok: false, status: 0, data: { detail: "We couldn't complete the security check. Please check your connection and try again." } };
  }
  return call("/api/bookings/", { method: "POST", headers: headers(), body: JSON.stringify({ ...body, recaptcha_token }) });
}

export const sendPaymentCallback = (response) =>
  call("/api/bookings/payment-callback/", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  });

export const getBookingStatus = (token) => call("/api/bookings/status/", { headers: { "X-Booking-Token": token } });

/** Downloads the voucher PDF with the token in a header (never in a URL). */
export async function downloadVoucher(token, reference) {
  const res = await fetch(`${API}/api/bookings/voucher/`, { headers: { "X-Booking-Token": token }, cache: "no-store" });
  if (!res.ok) throw new Error("The voucher is not available yet.");
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = `Gokeys-${reference}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

let razorpayLoading = null;
/** Razorpay Checkout script, loaded only on the /book page (the site's other pages never load it). */
export function loadRazorpay() {
  if (typeof window === "undefined") return Promise.reject(new Error("browser only"));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!razorpayLoading) {
    razorpayLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT;
      script.async = true;
      script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error("Razorpay did not start")));
      script.onerror = () => { razorpayLoading = null; script.remove(); reject(new Error("Razorpay could not be loaded")); };
      document.head.appendChild(script);
    });
  }
  return razorpayLoading;
}

/** The first message of a DRF error answer, labelled for the guest. */
export function errorMessage(data, labels = {}) {
  if (!data || typeof data !== "object") return "Something went wrong. Please try again.";
  const key = Object.keys(data)[0];
  if (!key) return "Something went wrong. Please try again.";
  let value = data[key];
  while (Array.isArray(value)) value = value[0];
  if (value && typeof value === "object") return errorMessage(value, labels);
  const label = key === "detail" || key === "non_field_errors" ? "" : `${labels[key] || key.replace(/_/g, " ")}: `;
  return `${label}${value}`;
}

/** Traveller rows in the order the backend expects: adults, children with bed, children without bed, under 5. */
export const TRAVELLER_TYPES = [
  { key: "adult", label: "Adults", hint: "12 years and over", min: 12, max: 120 },
  { key: "child_with_bed", label: "Children with bed", hint: "5 to 11 years", min: 5, max: 11 },
  { key: "child_no_bed", label: "Children without bed", hint: "5 to 11 years", min: 5, max: 11 },
  { key: "infant", label: "Under 5", hint: "free, no seat or bed", min: 0, max: 4 },
];

export function travellerSlots(counts) {
  return TRAVELLER_TYPES.flatMap((t) => Array.from({ length: counts[t.key] || 0 }, () => t.key));
}
