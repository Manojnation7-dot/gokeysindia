// Char Dham cost calculator: API calls, shareable URL (de)serialisation, formatting, WhatsApp text and GA4 events.
// Prices live in Django (admin > Cost Calculator); this page only shows what /api/calculator/ returns.

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in").replace(/\/$/, "");
export const CALC_API = `${API_BASE}/api/calculator`;
export const CALC_PATH = "/char-dham-yatra-cost-calculator";

// Page content is cached for an hour, and cleared at once when a rate is saved in the admin (Django revalidates "api").
const PAGE_CACHE = { next: { revalidate: 3600, tags: ["api"] } };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** YYYY-MM-DD in local time (toISOString would shift Indian dates back a day). */
export const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const addDays = (isoDate, n) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return iso(new Date(y, m - 1, d + n));
};

/** The page's default estimate starts 11 days after the temples open (mid-May, the busiest dates). */
export function defaultStartDate(config) {
  if (config?.season?.opens) return addDays(config.season.opens, 11);
  return addDays(iso(new Date()), 21);
}

export function defaultInput(config) {
  return {
    trip: "char-dham", start: "haridwar", start_date: defaultStartDate(config),
    adults: 4, seniors: 0, children_5_7: 0, children_under_5: 0,
    vehicle: "auto", hotel: "standard", two_per_room: false,
    extra_days: 0, guide: false, sightseeing: [],
  };
}

export function toParams(i) {
  const p = new URLSearchParams({
    trip: i.trip, start: i.start, start_date: i.start_date,
    adults: String(i.adults), seniors: String(i.seniors),
    children_5_7: String(i.children_5_7), children_under_5: String(i.children_under_5),
    vehicle: i.vehicle, hotel: i.hotel, extra_days: String(i.extra_days),
  });
  if (i.two_per_room) p.set("two_per_room", "1");
  if (i.guide) p.set("guide", "1");
  if (i.sightseeing.length) p.set("sightseeing", i.sightseeing.join(","));
  return p;
}

export function fromParams(p, base) {
  const n = (k, d) => {
    const v = parseInt(p.get(k) || "", 10);
    return Number.isFinite(v) && v >= 0 ? v : d;
  };
  const hotel = p.get("hotel");
  const adults = Math.max(1, n("adults", base.adults));
  return {
    trip: p.get("trip") || base.trip,
    start: p.get("start") || base.start,
    start_date: /^\d{4}-\d{2}-\d{2}$/.test(p.get("start_date") || "") ? p.get("start_date") : base.start_date,
    adults,
    seniors: Math.min(adults, n("seniors", base.seniors)),
    children_5_7: n("children_5_7", base.children_5_7),
    children_under_5: n("children_under_5", base.children_under_5),
    vehicle: p.get("vehicle") || base.vehicle,
    hotel: hotel === "deluxe" || hotel === "luxury" || hotel === "standard" ? hotel : base.hotel,
    two_per_room: p.get("two_per_room") === "1",
    extra_days: n("extra_days", base.extra_days),
    guide: p.get("guide") === "1",
    sightseeing: (p.get("sightseeing") || "").split(",").filter(Boolean),
  };
}

export const inr = (n) => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");

/** Group totals: ₹1.04 L above one lakh. */
export function inrShort(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2).replace(/\.?0+$/, "") + " L";
  return inr(n);
}

/** "20 May 2027", formatted by hand so the server and the browser render the same text. */
export function niceDate(isoDate) {
  const [y, m, d] = String(isoDate).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "October 2026" from an ISO timestamp (in India time). */
export function monthYear(isoStamp) {
  if (!isoStamp) return "";
  const d = new Date(new Date(isoStamp).getTime() + 330 * 60000);
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "1–3 and 8–10 October 2027" from the holiday windows. */
export function holidayText(holidays = []) {
  const parts = holidays.map(({ start, end }) => {
    const [, sm, sd] = start.split("-").map(Number);
    const [ey, em, ed] = end.split("-").map(Number);
    return { text: sm === em ? `${sd}–${ed}` : `${sd} ${MONTHS_LONG[sm - 1]} – ${ed}`, month: MONTHS_LONG[em - 1], year: ey };
  });
  if (!parts.length) return "";
  const last = parts[parts.length - 1];
  const sameMonth = parts.every((x) => x.month === last.month);
  const texts = sameMonth ? parts.map((x) => x.text) : parts.map((x) => `${x.text} ${x.month}`);
  const joined = texts.length > 1 ? `${texts.slice(0, -1).join(", ")} and ${texts[texts.length - 1]}` : texts[0];
  return sameMonth ? `${joined} ${last.month} ${last.year}` : `${joined} ${last.year}`;
}

export function whatsAppText(q, input, startName) {
  const t = q.travellers;
  const people = [
    `${t.adults} adult${t.adults > 1 ? "s" : ""}${t.seniors ? ` (${t.seniors} senior${t.seniors > 1 ? "s" : ""})` : ""}`,
    t.children_5_7 ? `${t.children_5_7} child 5–7` : "",
    t.children_under_5 ? `${t.children_under_5} child under 5` : "",
  ].filter(Boolean).join(", ");
  const lines = [
    "Hello Gokeys, I would like a quote:",
    `${q.trip.name} from ${startName}, starting ${niceDate(q.start_date)} (${q.days} days)`,
    people,
    `${q.vehicles.map((v) => v.name).join(" + ")} · ${input.hotel[0].toUpperCase() + input.hotel.slice(1)} hotels${input.two_per_room ? " · 2 per room" : ""}`,
  ];
  if (input.extra_days) lines.push(`Extra rest days: ${input.extra_days}`);
  if (input.guide) lines.push("With guide");
  if (q.pay_to_driver.lines.length) lines.push(`Sightseeing: ${q.pay_to_driver.lines.map((l) => l.label).join(", ")}`);
  lines.push(`Estimate: ${inr(q.per_person.min)}–${inr(q.per_person.max)} per person + GST`);
  lines.push(`Ref: ${q.ref}`);
  return lines.join("\n");
}

// ---------------------------------------------------------------- server-side fetches (page content)
async function getJson(url) {
  try {
    const r = await fetch(url, PAGE_CACHE);
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

export const getConfig = () => getJson(`${CALC_API}/config/`);
export const getPageData = () => getJson(`${CALC_API}/page-data/`);
export const getQuoteServer = (input) => getJson(`${CALC_API}/quote/?${toParams(input)}`);

// ---------------------------------------------------------------- browser
/** Stores the estimate under its ref when WhatsApp is tapped. sendBeacon survives the page switching to WhatsApp;
 *  text/plain keeps it a "simple" cross-site request (no CORS preflight). Django reads the body as JSON. */
export function saveEstimate(input) {
  const body = JSON.stringify(input);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(`${CALC_API}/save/`, new Blob([body], { type: "text/plain" }))) return;
  } catch {}
  fetch(`${CALC_API}/save/`, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

export function track(event, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
