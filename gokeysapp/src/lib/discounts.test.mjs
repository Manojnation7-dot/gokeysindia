// Run: npm test. Date-limited discount on the website (prices from the server already include it while it runs) and
// the checkout coupon (checked and priced by the server only).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fromPriceWithWas, getDepartures, offerFor, offerText } from "./departures.js";
import { buildDepartureOffers } from "./seoSchemas.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(src, file), "utf8");
const NOW = new Date("2026-11-21T06:00:00Z"); // 21 Nov 2026 in India

// What the API sends while a Rs 1,000 per person offer runs till 30 Nov: discounted amount, normal as compare_at
const apiDep = (offerTill = "2026-11-30") => ({
  id: 20, date: "2027-05-10", status: "open", status_label: "Open", seats_left: 9, bookable: true, book_online: true,
  booking_closes_on: "2027-05-08", offer: { per_person_paise: 100000, per_person: "1000.00", valid_till: offerTill },
  prices: [
    { sharing: "quad", traveller_type: "adult", amount: "19500.00", compare_at_paise: 2050000, discount_paise: 100000 },
    { sharing: "double", traveller_type: "adult", amount: "25000.00", compare_at_paise: 2600000, discount_paise: 100000 },
  ],
});

test("while the offer runs: the offer price, the normal price struck through, Save and Offer till", () => {
  const d = getDepartures({ departures: [apiDep()] }, NOW).list[0];
  assert.deepEqual(d.offer, { perPersonPaise: 100000, till: "2026-11-30" });
  assert.equal(d.prices.quad.adult, "19500.00");
  assert.equal(d.compareAt.quad, 2050000);
  assert.equal(offerText(d.offer), "Save ₹1,000 per person · Offer till 30 Nov 2026");
  assert.deepEqual(fromPriceWithWas([d]), { from: 19500, was: 20500, offer: d.offer });
  const offer = buildDepartureOffers([d], "https://gokeys.in/grouptour/x")[0];
  assert.equal(offer.price, "19500");                        // JSON-LD: the price customers pay today
  assert.equal(offer.priceValidUntil, "2026-11-30");
});

test("the last day counts; the day after, a cached page shows the normal price again", () => {
  assert.ok(offerFor(apiDep("2026-11-21"), "2026-11-21"));
  const d = getDepartures({ departures: [apiDep("2026-11-20")] }, NOW).list[0]; // ended yesterday, page still cached
  assert.equal(d.offer, null);
  assert.equal(d.prices.quad.adult, "20500.00");
  assert.equal(d.compareAt.quad, undefined);
  assert.equal(offerText(d.offer), "");
  assert.deepEqual(fromPriceWithWas([d]), { from: 20500, was: null, offer: null });
  assert.equal(buildDepartureOffers([d], "u")[0].priceValidUntil, undefined);
});

test("no offer: nothing changes (older backends too)", () => {
  const plain = { ...apiDep(), offer: null, prices: [{ sharing: "quad", traveller_type: "adult", amount: "20500.00", compare_at_paise: null }] };
  const d = getDepartures({ departures: [plain] }, NOW).list[0];
  assert.equal(d.offer, null);
  assert.equal(d.prices.quad.adult, "20500.00");
});

test("checkout: the coupon is checked by the server and only its code is sent; discount and coupon lines shown", () => {
  const checkout = read("components/booking/BookingCheckout.js");
  assert.match(checkout, /\.\.\.\(coupon \? \{ coupon_code: coupon \} : \{\}\),/); // never an empty coupon_code field
  assert.match(checkout, /await applyCoupon\(departureId, couponInput\.trim\(\), \{ sharing, counts, pickupId \}\)/);
  assert.match(checkout, /Coupon \{shownQuote\.coupon_code\}/);
  assert.match(checkout, /shownQuote\.discount_paise > 0/);
  assert.match(checkout, /if \(e\.key === "Enter"\) \{ e\.preventDefault\(\);/); // Enter applies, never submits the booking
  const booking = read("lib/booking.js");
  const apply = booking.slice(booking.indexOf("export function applyCoupon"), booking.indexOf("export async function createBooking"));
  assert.ok(!/amount|price|total/i.test(apply.replace(/\/\*\*[\s\S]*?\*\//, "")));
});

test("layout fixes from the browser check: struck-through price on each departure tile, Discount line in the price box", () => {
  const page = read("app/grouptour/[slug]/GroupTourDetails.js");
  assert.match(page, /Number\(dep\.compareAt\?\.\[s\]\) \/ 100 > Number\(dep\.prices\[s\]\.adult\) && \(\s+<span className="block text-xs font-normal text-slate-400 line-through">/);
  const box = read("components/PriceBox.js");
  assert.match(box, /quote\.discount_paise > 0 && \(/);
  assert.match(box, /-\{rupeesFromPaise\(quote\.discount_paise\)\}/);
  const checkout = read("components/booking/BookingCheckout.js");
  assert.equal((checkout.match(/<span className="whitespace-nowrap">-\{rupeesFromPaise\(shownQuote\.(discount|coupon)_paise\)\}<\/span>/g) || []).length, 2);
});
