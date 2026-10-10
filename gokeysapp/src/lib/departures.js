// Group tour departures as the website shows them.
//
// New API (backend with migration 0027+): tour.departures = [{ id, date, status, status_label,
// seats_left, bookable, booking_closes_on, price }] — only approved dates from today on.
// Old API: only tour.departure_dates (list of "YYYY-MM-DD"). Both work, so the website and the
// backend can be deployed in either order.
//
// The date filter is repeated here (Asia/Kolkata) so a cached page never shows yesterday's date.

const IST = "Asia/Kolkata";

export function todayIST(now = new Date()) {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

const LABELS = { scheduled: "Bookings open soon", open: "Open", sold_out: "Sold out", closed: "Booking closed" };

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
      }));
  } else if (tour && "departure_dates" in tour) {
    legacy = true;
    const seats = Number.isFinite(tour.available_seats) ? tour.available_seats : null;
    list = legacyDates(tour.departure_dates)
      .filter((d) => d >= today)
      .map((date) => ({ id: null, date, status: "open", label: LABELS.open, seatsLeft: seats, bookable: true, closesOn: null, price: null }));
  } else {
    return { state: "error", list: [], next: null, legacy: false };
  }
  list = [...new Map(list.map((d) => [d.date, d])).values()].sort((a, b) => a.date.localeCompare(b.date));
  const state = list.some((d) => d.bookable) ? "available" : list.length ? "unavailable" : "none";
  return { state, list, next: list[0] || null, legacy };
}

export const formatDepartureDate = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
