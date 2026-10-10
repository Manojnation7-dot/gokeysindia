// Run: npm test   (Node's built-in test runner, no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import { getDepartures, todayIST } from "./departures.js";

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
