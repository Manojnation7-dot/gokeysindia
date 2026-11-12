// Run: npm test. Group tours C+D: page content from the admin, one gallery link, the server itinerary PDF,
// the hub's filters and status column.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slimGroupTour } from "./slim.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => fs.readFileSync(path.join(src, ...p), "utf8");

test("the hub's steps, cards, FAQs and reviews come from the admin, not the code", () => {
  const hub = read("app", "grouptour", "GroupTour.js");
  for (const gone of ["const TESTIMONIALS", "const FEATURES", "const STEPS", "const faqs = [", "Priya Sharma", "EMI options"]) {
    assert.ok(!hub.includes(gone), gone);
  }
  assert.match(hub, /hub\.steps/);
  assert.match(hub, /<GroupTourGrid /);
  assert.match(hub, /<UpcomingDatesTable /);
  assert.match(read("app", "grouptour", "page.js"), /\/api\/group-tour-hub\//);
});

test("one 'View all photos' link in the gallery", () => {
  assert.equal(read("components", "ImageGallery.js").match(/View all \{list\.length\} photos/g).length, 1);
});

test("the tour page links to the server-made itinerary PDF and shows each content block only when filled", () => {
  const page = read("app", "grouptour", "[slug]", "GroupTourDetails.js");
  assert.match(page, /\/api\/group-tours\/\$\{tourData\?\.slug\}\/itinerary\.pdf/);
  assert.ok(!page.includes("downloadItinerary"));
  for (const block of ["(tourData.stays || []).length > 0", "tourData.vehicle &&", "(tourData.things_to_carry || []).length > 0",
    "tourData.tour_manager &&", "<GuestReviews reviews={tourData.guest_reviews}"]) {
    assert.ok(page.includes(block), block);
  }
  assert.ok(!read("components", "GuestReviews.js").includes("★"), "guest reviews: text only, no stars");
});

test("the upcoming dates table has a status column and drops passed dates in the browser", () => {
  const table = read("components", "UpcomingDatesTable.js");
  assert.match(table, />Status</);
  assert.match(table, /r\.date >= today/);
});

test("the hub filter gets destination names", () => {
  const slim = slimGroupTour({ id: 1, name: "T", slug: "t", destination_refs: [{ name: "Kedarnath", slug: "kedarnath" }], departures: [] });
  assert.deepEqual(slim.destination_names, ["Kedarnath"]);
});
