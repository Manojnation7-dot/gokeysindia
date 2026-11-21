// Group tour departures as the website shows them.
//
// New API (backend with migration 0027+): tour.departures = [{ id, date, status, status_label,
// seats_left, bookable, booking_closes_on, price }] — only approved dates from today on.
// Old API: only tour.departure_dates (list of "YYYY-MM-DD"). Both work, so the website and the
// backend can be deployed in either order.
//
// Group departures (backend migration 0036+) add per date: guaranteed, filling_fast,
// more_needed_to_confirm, min_pax, decision_date, balance_due_date, advance_percent,
// prices [{ sharing, traveller_type, amount }] and pickups [{ id, name, time, extra_charge, ... }].
// Missing fields become false / null / empty, so the page then looks as it did before.
//
// The date filter is repeated here (Asia/Kolkata) so a cached page never shows yesterday's date.

const IST = "Asia/Kolkata";

export function todayIST(now = new Date()) {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

const LABELS = { scheduled: "Bookings open soon", open: "Open", sold_out: "Sold out", closed: "Booking closed" };

const SHARING = ["quad", "triple", "double"];
const TRAVELLERS = ["adult", "child_with_bed", "child_no_bed"];
const num = (v) => (Number.isFinite(v) ? v : null);
const money = (v) => (v != null && v !== "" && Number.isFinite(Number(v)) ? String(v) : null);

// The date-limited offer while it runs today: { perPersonPaise, till }. The server stops it after its last day; a
// cached page can be up to a day old, so the date is checked here too (then the normal price is shown again).
export function offerFor(d, today) {
  const o = d?.offer;
  if (!o || typeof o.valid_till !== "string" || o.valid_till < today || !(Number(o.per_person_paise) > 0)) return null;
  return { perPersonPaise: Number(o.per_person_paise), till: o.valid_till };
}

// A row's price: what customers pay today; with `undo` (an offer that has ended) the normal price again
const rowAmount = (row, undo) => {
  const amount = money(row?.amount);
  if (!amount || !undo || !(Number(row?.discount_paise) > 0)) return amount;
  return (Number(amount) + Number(row.discount_paise) / 100).toFixed(2);
};

// { quad: { adult: "20500.00", child_with_bed: "15000.00" }, triple: {...}, double: {...} } (known keys only)
function priceTable(rows, undo = false) {
  const table = {};
  for (const row of Array.isArray(rows) ? rows : []) {
    const amount = rowAmount(row, undo);
    if (!amount || !SHARING.includes(row.sharing) || !TRAVELLERS.includes(row.traveller_type)) continue;
    (table[row.sharing] ||= {})[row.traveller_type] = amount;
  }
  return table;
}

// { quad: 2400000 } : the admin's optional "was" price per adult, in paise (only when higher than the price)
function compareAtTable(rows, undo = false) {
  const table = {};
  for (const row of Array.isArray(rows) ? rows : []) {
    if (row?.traveller_type === "adult" && SHARING.includes(row.sharing) && Number(row.compare_at_paise) > 0) {
      // an ended offer: the struck-through price was the normal price, now shown as the price itself
      if (undo && Number(row.compare_at_paise) <= Math.round(Number(rowAmount(row, true)) * 100)) continue;
      table[row.sharing] = Number(row.compare_at_paise);
    }
  }
  return table;
}

const BADGES = ["open", "filling_fast", "few_left", "guaranteed", "sold_out", "enquiry"];

function pickupList(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((p) => p && typeof p.name === "string" && p.name)
    .map((p) => ({
      id: p.id ?? null,
      name: p.name,
      address: p.address || "",
      mapUrl: /^https?:\/\//.test(p.map_url || "") ? p.map_url : "",
      time: /^\d{2}:\d{2}$/.test(p.time || "") ? p.time : null,
      extra: money(p.extra_charge),
    }));
}

function legacyDates(value) {
  const list = Array.isArray(value) ? value : String(value || "").split(",");
  return list.map((d) => String(d).trim().replace(/['"[\]]/g, "")).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
}

/**
 * @returns {{ state: "available" | "unavailable" | "none" | "error", list: Array, next: object | null, legacy: boolean }}
 *  available   = at least one date can be booked
 *  unavailable = dates exist but none can be booked (sold out / closed / opening soon)
 *  none        = no upcoming confirmed dates (show "New Departure Dates Coming Soon")
 *  error       = departure data missing or malformed (show an error, never "no departures")
 */
export function getDepartures(tour, now = new Date()) {
  const today = todayIST(now);
  let list;
  let legacy = false;
  if (Array.isArray(tour?.departures)) {
    list = tour.departures
      .filter((d) => d && typeof d.date === "string" && d.date >= today && LABELS[d.status])
      .map((d) => ({
        id: d.id ?? null,
        date: d.date,
        status: d.status,
        label: d.status_label || LABELS[d.status],
        seatsLeft: Number.isFinite(d.seats_left) ? d.seats_left : null,
        bookable: Boolean(d.bookable) && (!d.booking_closes_on || d.booking_closes_on >= today),
        closesOn: d.booking_closes_on || null,
        listedOn: typeof d.listed_on === "string" ? d.listed_on : null, // on sale since (Offer validFrom)
        price: d.price ?? null,
        guaranteed: d.guaranteed === true,
        fillingFast: d.filling_fast === true,
        moreNeeded: num(d.more_needed_to_confirm),
        minPax: num(d.min_pax),
        decisionDate: typeof d.decision_date === "string" ? d.decision_date : null,
        balanceDueDate: typeof d.balance_due_date === "string" ? d.balance_due_date : null,
        advancePercent: num(d.advance_percent),
        // Date-limited discount: prices already include it while it runs (offerFor checks the date again)
        offer: offerFor(d, today),
        prices: priceTable(d.prices, Boolean(d.offer) && !offerFor(d, today)),
        compareAt: compareAtTable(d.prices, Boolean(d.offer) && !offerFor(d, today)),
        // One status badge per date, worked out by the backend (thresholds in the admin's Group tour settings)
        badge: BADGES.includes(d.badge) ? d.badge : null,
        badgeLabel: BADGES.includes(d.badge) && typeof d.badge_label === "string" ? d.badge_label : null,
        pickups: pickupList(d.pickups),
        // Phase 2: online booking switched on and this date can be booked online
        bookOnline: d.book_online === true && Boolean(d.bookable) && d.id != null,
        // Women-only batch: only female travellers can book it (the backend checks it again)
        womenOnly: d.women_only === true,
      }));
  } else if (tour && "departure_dates" in tour) {
    legacy = true;
    const seats = Number.isFinite(tour.available_seats) ? tour.available_seats : null;
    list = legacyDates(tour.departure_dates)
      .filter((d) => d >= today)
      .map((date) => ({
        id: null, date, status: "open", label: LABELS.open, seatsLeft: seats, bookable: true, closesOn: null, price: null,
        guaranteed: false, fillingFast: false, moreNeeded: null, minPax: null, decisionDate: null,
        balanceDueDate: null, advancePercent: null, prices: {}, compareAt: {}, offer: null, badge: null, badgeLabel: null,
        pickups: [], bookOnline: false, womenOnly: false,
      }));
  } else {
    return { state: "error", list: [], next: null, legacy: false };
  }
  list = [...new Map(list.map((d) => [d.date, d])).values()].sort((a, b) => a.date.localeCompare(b.date));
  const state = list.some((d) => d.bookable) ? "available" : list.length ? "unavailable" : "none";
  return { state, list, next: list[0] || null, legacy };
}

/** The chip a date shows: Guaranteed, Filling fast, or "X more needed to confirm" (null when none applies). */
/** Lowest adult price (rupees, as a number) over these departures and their room sharings, or null. */
/** "Save ₹1,000 per person · Offer till 30 Nov 2026" for an offer ({ perPersonPaise, till }), else "". */
export function offerText(offer) {
  if (!offer) return "";
  const save = `₹${(offer.perPersonPaise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  return `Save ${save} per person · Offer till ${formatDepartureDate(offer.till)}`;
}

/** The lowest adult price of these dates and its normal (struck-through) price: { from, was } (rupees), or null. */
export function fromPriceWithWas(deps) {
  let best = null;
  for (const d of deps || []) {
    for (const s of SHARING) {
      const price = Number(d.prices?.[s]?.adult);
      if (!(price > 0) || (best && price >= best.from)) continue;
      const was = Number(d.compareAt?.[s] || 0) / 100;
      best = { from: price, was: was > price ? was : null, offer: d.offer || null };
    }
  }
  return best;
}

export function lowestAdultPrice(deps) {
  const prices = (deps || []).flatMap((d) => SHARING.map((s) => Number(d.prices?.[s]?.adult)).filter((n) => n > 0));
  return prices.length ? Math.min(...prices) : null;
}

export function departureChip(dep) {
  if (dep.guaranteed) return { kind: "guaranteed", text: "Guaranteed departure" };
  if (dep.fillingFast && dep.bookable) return { kind: "filling", text: "Filling fast" };
  if (dep.moreNeeded > 0 && dep.bookable) return { kind: "needed", text: `${dep.moreNeeded} more needed to confirm` };
  return null;
}

/** "06:30" -> "6:30 AM" (no Date object, so server and browser print the same text). */
export function formatPickupTime(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export const SHARING_LABELS = { quad: "Quad sharing", triple: "Triple sharing", double: "Double sharing" };

export const formatDepartureDate = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
