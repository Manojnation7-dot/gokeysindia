// Run: npm test. Group tour settings from the admin (/api/site-settings/), with today's values as the fallback.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_DEFAULTS, fillTerms, googleLine, mergeSiteSettings, processingFeePercent, whatsappLink } from "./siteSettings.js";
import { getDepartures } from "./departures.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => fs.readFileSync(path.join(src, ...p), "utf8");

test("with today's values the rules read exactly as before (no page changes until the owner edits a number)", () => {
  const t = SITE_DEFAULTS.terms;
  assert.equal(t.payment[0], "Pay an advance of 25% of the total to confirm your seats, or pay the full amount at booking.");
  assert.equal(t.payment[1], "The balance is due 7 days before departure. Your booking shows the exact date and amount.");
  assert.ok(t.minimumGroup.join(" ").includes("a 100% refund within 7 working days"));
  assert.ok(t.cancellation.join(" ").includes("we keep the advance (25% of the total)"));
});

test("numbers follow the settings; an unknown placeholder is left visible, never blank", () => {
  const t = fillTerms({ advance_percent: 30, balance_due_days: 10, refund_days: 5 });
  assert.ok(t.payment[0].includes("30% of the total"));
  assert.ok(t.payment[1].includes("due 10 days before"));
  assert.ok(t.minimumGroup.join(" ").includes("within 5 working days"));
  assert.equal(fillTerms({}, { payment: ["{x}"], cancellation: [], minimumGroup: [] }).payment[0], "{x}");
});

test("the payment processing charge: its lines only while it is on, never with GST", () => {
  const on = fillTerms({ advance_percent: 25, balance_due_days: 7, refund_days: 7, processing_fee_percent: "2" });
  assert.ok(on.payment.join(" ").includes("payment processing charge of 2% of that payment"));
  assert.ok(on.cancellation.join(" ").includes("The payment processing charge (2%) is not refunded when you cancel"));
  for (const off of ["0", 0, undefined]) {
    const t = fillTerms({ advance_percent: 25, balance_due_days: 7, refund_days: 7, processing_fee_percent: off });
    assert.ok(!JSON.stringify(t).includes("processing"), String(off));
    assert.ok(!/\{\w+\}/.test(Object.values(t).flat().join(" ")), String(off)); // no placeholder left
  }
  assert.ok(!JSON.stringify(SITE_DEFAULTS.terms).includes("processing"), "off when the API cannot be reached");
  assert.equal(processingFeePercent({ processing_fee_percent: "2" }), "2");
  assert.equal(processingFeePercent({ processing_fee_percent: "0" }), "");
  assert.equal(processingFeePercent(undefined), "");
  for (const file of [["components", "PriceBox.js"], ["components", "booking", "BookingCheckout.js"],
    ["app", "grouptour", "GroupTour.js"], ["app", "grouptour", "[slug]", "GroupTourDetails.js"]]) {
    assert.ok(!/\+ GST|GST 5%|exclude[s]? .*GST/.test(read(...file)), `${file.join("/")} still adds GST`);
  }
});

test("the checkout pays what the server quoted, the charge included", () => {
  const checkout = read("components", "booking", "BookingCheckout.js");
  assert.match(checkout, /quote\.full_to_pay_paise/);
  assert.match(checkout, /quote\.advance_to_pay_paise/);
  assert.match(checkout, /Payment processing charge \(\{quote\.processing_fee_percent\}%\)/);
});

test("a missing or broken API answer falls back to today's values", () => {
  assert.equal(mergeSiteSettings(null), SITE_DEFAULTS);
  const merged = mergeSiteSettings({ trust: { google_review_count: 181 }, terms: { payment: [] } });
  assert.equal(merged.trust.google_review_count, 181);
  assert.equal(merged.trust.google_rating, "4.8");
  assert.deepEqual(merged.terms, SITE_DEFAULTS.terms); // incomplete terms: the full default wording
  assert.equal(googleLine(SITE_DEFAULTS.trust), "4.8 · 180 Google reviews");
  assert.equal(whatsappLink({ whatsapp: "+91-7830718687" }, "Hi"), "https://wa.me/917830718687?text=Hi");
});

test("badge and compare-at price reach the page from the API", () => {
  const tour = { departures: [{ id: 1, date: "2099-05-10", status: "open", bookable: true, badge: "few_left", badge_label: "Few seats left",
    seats_left: null, prices: [{ sharing: "quad", traveller_type: "adult", amount: "20500.00", compare_at_paise: 2400000 }] }] };
  const [dep] = getDepartures(tour).list;
  assert.equal(dep.badge, "few_left");
  assert.equal(dep.badgeLabel, "Few seats left");
  assert.equal(dep.seatsLeft, null); // no seat number until enough are booked
  assert.equal(dep.compareAt.quad, 2400000);
  assert.equal(getDepartures({ departures: [{ ...tour.departures[0], badge: "nonsense" }] }).list[0].badge, null);
});

test("no hardcoded trust numbers, contacts or policy numbers left on the group tour pages and the checkout", () => {
  const files = [["app", "grouptour", "[slug]", "GroupTourDetails.js"], ["components", "PriceBox.js"], ["components", "BookingSummary.js"],
    ["components", "booking", "BookingCheckout.js"], ["components", "Footer.js"]];
  for (const f of files) {
    const text = read(...f);
    assert.ok(!/164 Google|4\.8 ·|gokeysindia@gmail\.com|wa\.me\/917830718687|balance 7 days|rest 7 days/.test(text), f.join("/"));
  }
  assert.ok(!/line-through/.test(read("app", "grouptour", "[slug]", "GroupTourDetails.js")), "struck prices only in the price box");
  assert.match(read("components", "WhyChooseUs.js"), /\$\{years\}\+ Years of Expertise/);
});

test("the price box takes every amount from the backend quote", () => {
  const box = read("components", "PriceBox.js");
  assert.match(box, /getQuote\(/);
  assert.ok(!/\* *0\.05|\* *1\.05|gst_percent *\*|\/ *100\) *\*/.test(box), "no GST or advance maths in the browser");
  assert.match(box, /href=\{`\/book\/\$\{dep\.id\}\?\$\{params\}`\}/); // a full page load into /book
});
