// Run: npm test. Group tours E (SEO): one Offer per bookable date, no rating markup, no made-up image sizes,
// the hub's title and description from the admin, a clean heading outline on tour pages.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDepartureOffers, buildImageObject, buildTourSchema } from "./seoSchemas.js";
import { getDepartures } from "./departures.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => fs.readFileSync(path.join(src, ...p), "utf8");
const price = (sharing, amount) => ({ sharing, traveller_type: "adult", amount });
const tour = { departures: [
  { id: 1, date: "2099-05-08", status: "open", bookable: true, badge: "open", listed_on: "2026-11-01", prices: [price("quad", "20500.00"), price("double", "26000.00")] },
  { id: 2, date: "2099-05-20", status: "open", bookable: true, badge: "few_left", listed_on: "2026-11-02", prices: [price("triple", "21000.00")] },
  { id: 3, date: "2099-06-01", status: "scheduled", bookable: false, badge: "enquiry", prices: [price("quad", "19000.00")] },
  { id: 4, date: "2099-06-10", status: "open", bookable: true, badge: "open", prices: [] },
] };
const deps = getDepartures(tour).list;

test("one Offer per bookable date with a price: lowest adult price, INR, availability, on sale since", () => {
  const offers = buildDepartureOffers(deps, "https://gokeys.in/grouptour/x");
  assert.deepEqual(offers, [
    { "@type": "Offer", name: "Departure on 2099-05-08", price: "20500", priceCurrency: "INR",
      availability: "https://schema.org/InStock", validFrom: "2026-11-01", url: "https://gokeys.in/grouptour/x" },
    { "@type": "Offer", name: "Departure on 2099-05-20", price: "21000", priceCurrency: "INR",
      availability: "https://schema.org/LimitedAvailability", validFrom: "2026-11-02", url: "https://gokeys.in/grouptour/x" },
  ]);
});

test("tour schema: date offers replace the package prices; no aggregateRating; package prices kept without dates", () => {
  const pricing = [{ package_type: "standard", price: "22500", discount_price: "20500" }];
  const withDates = buildTourSchema({ slug: "x", tourPath: "grouptour", name: "X", pricingTiers: pricing, departures: deps });
  assert.ok(Array.isArray(withDates.offers) && withDates.offers.length === 2);
  assert.ok(!("aggregateRating" in withDates));
  const noDates = buildTourSchema({ slug: "x", tourPath: "grouptour", name: "X", pricingTiers: pricing, departures: [] });
  assert.equal(noDates.offers["@type"], "AggregateOffer");
});

test("image objects never claim a made-up size", () => {
  assert.deepEqual(buildImageObject({ url: "https://api.gokeys.in/a.webp" }), { "@type": "ImageObject", url: "https://api.gokeys.in/a.webp" });
  assert.equal(buildImageObject({ url: "/a.png", width: 512, height: 512 }).width, 512);
});

test("tour page: no rating passed, departures passed, empty editor headings dropped, Tour Highlights is a section", () => {
  const page = read("app", "grouptour", "[slug]", "GroupTourDetails.js");
  assert.ok(!/rating: tourData\.rating/.test(page) && /departures: upcoming/.test(page));
  assert.ok(!/\|\| 600|\|\| 400/.test(page), "no made-up image size");
  assert.match(page, /<h2 className="gk-h3 mb-3">Tour Highlights<\/h2>/);
  const strip = new Function(`return ${page.match(/const withoutEmptyHeadings = (\(html\) =>[\s\S]+?'\));/)[1]}`)();
  assert.equal(strip("<h2>&nbsp;</h2><p>x</p><h2 class='a'> <br/> </h2><h3>Keep</h3>"), "<p>x</p><h3>Keep</h3>");
});

test("hub title and description come from the admin, with today's values as the fallback", () => {
  const hubPage = read("app", "grouptour", "page.js");
  assert.match(hubPage, /hub\.meta_title\?\.trim\(\) \|\| DEFAULT_TITLE/);
  assert.match(hubPage, /DEFAULT_TITLE = "Group Tours in India"/);
});
