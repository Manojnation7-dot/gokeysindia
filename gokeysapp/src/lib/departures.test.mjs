// Run: npm test   (Node's built-in test runner, no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import { getDepartures, todayIST, departureChip, formatPickupTime } from "./departures.js";

// 10 Oct 2026, 23:30 in India = 18:00 UTC
const BEFORE_MIDNIGHT = new Date("2026-10-10T18:00:00Z");
const AFTER_MIDNIGHT = new Date("2026-10-10T18:31:00Z"); // 00:01 on 11 Oct in India

const dep = (date, extra = {}) => ({
  id: 1, date, status: "open", status_label: "Open", seats_left: 5, bookable: true,
  booking_closes_on: date, price: null, ...extra,
});

test("today is computed in Asia/Kolkata, not UTC", () => {
  assert.equal(todayIST(BEFORE_MIDNIGHT), "2026-10-10");
  assert.equal(todayIST(AFTER_MIDNIGHT), "2026-10-11");
});

test("upcoming departure cards: sorted, bookable, seats shown", () => {
  const r = getDepartures({ departures: [dep("2026-12-01", { id: 2 }), dep("2026-11-01")] }, BEFORE_MIDNIGHT);
  assert.equal(r.state, "available");
  assert.deepEqual(r.list.map((d) => d.date), ["2026-11-01", "2026-12-01"]);
  assert.equal(r.next.seatsLeft, 5);
});

test("expired date disappears after midnight even from a cached API response", () => {
  const tour = { departures: [dep("2026-10-10")] };
  assert.equal(getDepartures(tour, BEFORE_MIDNIGHT).state, "available");
  const after = getDepartures(tour, AFTER_MIDNIGHT);
  assert.equal(after.state, "none");
  assert.equal(after.list.length, 0);
});

test("no upcoming departures -> 'none' (shows the Coming Soon request form)", () => {
  assert.equal(getDepartures({ departures: [] }, BEFORE_MIDNIGHT).state, "none");
});

test("sold out / closed only -> 'unavailable', nothing bookable", () => {
  const r = getDepartures({
    departures: [dep("2026-11-01", { status: "sold_out", status_label: "Sold out", bookable: false, seats_left: 0 })],
  }, BEFORE_MIDNIGHT);
  assert.equal(r.state, "unavailable");
  assert.equal(r.list[0].label, "Sold out");
  assert.equal(r.list[0].bookable, false);
});

test("drafts or unknown statuses are never shown even if an API sends them", () => {
  const r = getDepartures({ departures: [dep("2026-11-01", { status: "draft" })] }, BEFORE_MIDNIGHT);
  assert.equal(r.state, "none");
});

test("API problem is an error, never 'no departures'", () => {
  assert.equal(getDepartures(null).state, "error");
  assert.equal(getDepartures({ name: "x" }).state, "error");
});

test("older backend: legacy departure_dates still work and past dates are dropped", () => {
  const r = getDepartures({ departure_dates: ["2026-09-01", "2026-11-20"], available_seats: 8 }, BEFORE_MIDNIGHT);
  assert.equal(r.legacy, true);
  assert.deepEqual(r.list.map((d) => d.date), ["2026-11-20"]);
  assert.equal(r.next.seatsLeft, 8);
});

test("group departure fields: prices by sharing, pickups, flags", () => {
  const r = getDepartures({
    departures: [dep("2026-11-01", {
      guaranteed: false, filling_fast: false, more_needed_to_confirm: 9, min_pax: 15,
      decision_date: "2026-10-11", balance_due_date: "2026-10-11", advance_percent: 25,
      prices: [
        { sharing: "quad", traveller_type: "adult", amount_paise: 2050000, amount: "20500.00" },
        { sharing: "quad", traveller_type: "child_with_bed", amount_paise: 1500000, amount: "15000.00" },
        { sharing: "double", traveller_type: "adult", amount_paise: 2600000, amount: "26000.00" },
        { sharing: "single", traveller_type: "adult", amount: "99999.00" },   // unknown: ignored
        { sharing: "quad", traveller_type: "infant", amount: "0.00" },        // under 5 is always free
      ],
      pickups: [
        { id: 3, name: "Haridwar Railway Station", time: "06:00", extra_charge: "0.00", map_url: "javascript:x" },
        { id: 4, name: "Dehradun ISBT", time: "07:30", extra_charge: "500.00", map_url: "https://maps.app.goo.gl/x" },
      ],
    })],
  }, BEFORE_MIDNIGHT);
  const d = r.list[0];
  assert.deepEqual(d.prices, { quad: { adult: "20500.00", child_with_bed: "15000.00" }, double: { adult: "26000.00" } });
  assert.deepEqual(d.pickups.map((p) => [p.name, p.time, p.extra, p.mapUrl]), [
    ["Haridwar Railway Station", "06:00", "0.00", ""],                 // unsafe link dropped
    ["Dehradun ISBT", "07:30", "500.00", "https://maps.app.goo.gl/x"],
  ]);
  assert.deepEqual([d.minPax, d.moreNeeded, d.decisionDate, d.advancePercent], [15, 9, "2026-10-11", 25]);
  assert.deepEqual(departureChip(d), { kind: "needed", text: "9 more needed to confirm" });
});

test("older API without the new fields: same page as before (no chips, prices or pickups)", () => {
  const d = getDepartures({ departures: [dep("2026-11-01", { price: "18000.00" })] }, BEFORE_MIDNIGHT).list[0];
  assert.deepEqual([d.guaranteed, d.fillingFast, d.moreNeeded, d.minPax], [false, false, null, null]);
  assert.deepEqual([d.prices, d.pickups, d.price], [{}, [], "18000.00"]);
  assert.equal(departureChip(d), null);
  const legacy = getDepartures({ departure_dates: ["2026-11-20"] }, BEFORE_MIDNIGHT).list[0];
  assert.deepEqual([legacy.prices, legacy.pickups, departureChip(legacy)], [{}, [], null]);
});

test("chip priority: guaranteed, then filling fast, then more needed; none when not bookable", () => {
  const chip = (extra) => departureChip(getDepartures({ departures: [dep("2026-11-01", extra)] }, BEFORE_MIDNIGHT).list[0]);
  assert.equal(chip({ guaranteed: true, filling_fast: true, more_needed_to_confirm: 0 }).kind, "guaranteed");
  assert.equal(chip({ filling_fast: true, more_needed_to_confirm: 3 }).kind, "filling");
  assert.equal(chip({ more_needed_to_confirm: 3 }).text, "3 more needed to confirm");
  assert.equal(chip({ more_needed_to_confirm: 0 }), null);
  assert.equal(chip({ more_needed_to_confirm: 3, bookable: false, status: "sold_out" }), null);
});

test("pickup times print the same on server and browser", () => {
  assert.equal(formatPickupTime("06:00"), "6:00 AM");
  assert.equal(formatPickupTime("00:15"), "12:15 AM");
  assert.equal(formatPickupTime("12:05"), "12:05 PM");
  assert.equal(formatPickupTime("19:30"), "7:30 PM");
  assert.equal(formatPickupTime(null), "");
});

test("'more needed' switched off on the backend (null): no chip, the rest of the card stays", () => {
  const d = getDepartures({ departures: [dep("2026-11-01", { more_needed_to_confirm: null, min_pax: 15, guaranteed: false })] }, BEFORE_MIDNIGHT).list[0];
  assert.equal(d.moreNeeded, null);
  assert.equal(d.minPax, 15);
  assert.equal(departureChip(d), null);
});
