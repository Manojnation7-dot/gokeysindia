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

// { quad: { adult: "20500.00", child_with_bed: "15000.00" }, triple: {...}, double: {...} } (known keys only)
function priceTable(rows) {
  const table = {};
  for (const row of Array.isArray(rows) ? rows : []) {
    const amount = money(row?.amount);
    if (!amount || !SHARING.includes(row.sharing) || !TRAVELLERS.includes(row.traveller_type)) continue;
    (table[row.sharing] ||= {})[row.traveller_type] = amount;
  }
  return table;
}

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
        price: d.price ?? null,
        guaranteed: d.guaranteed === true,
        fillingFast: d.filling_fast === true,
        moreNeeded: num(d.more_needed_to_confirm),
        minPax: num(d.min_pax),
        decisionDate: typeof d.decision_date === "string" ? d.decision_date : null,
        balanceDueDate: typeof d.balance_due_date === "string" ? d.balance_due_date : null,
        advancePercent: num(d.advance_percent),
        prices: priceTable(d.prices),
        pickups: pickupList(d.pickups),
        // Phase 2: online booking switched on and this date can be booked online
        bookOnline: d.book_online === true && Boolean(d.bookable) && d.id != null,
      }));
  } else if (tour && "departure_dates" in tour) {
    legacy = true;
    const seats = Number.isFinite(tour.available_seats) ? tour.available_seats : null;
    list = legacyDates(tour.departure_dates)
      .filter((d) => d >= today)
      .map((date) => ({
        id: null, date, status: "open", label: LABELS.open, seatsLeft: seats, bookable: true, closesOn: null, price: null,
        guaranteed: false, fillingFast: false, moreNeeded: null, minPax: null, decisionDate: null,
        balanceDueDate: null, advancePercent: null, prices: {}, pickups: [], bookOnline: false,
      }));
  } else {
    return { state: "error", list: [], next: null, legacy: false };
  }
  list = [...new Map(list.map((d) => [d.date, d])).values()].sort((a, b) => a.date.localeCompare(b.date));
  const state = list.some((d) => d.bookable) ? "available" : list.length ? "unavailable" : "none";
  return { state, list, next: list[0] || null, legacy };
}

/** The chip a date shows: Guaranteed, Filling fast, or "X more needed to confirm" (null when none applies). */
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
