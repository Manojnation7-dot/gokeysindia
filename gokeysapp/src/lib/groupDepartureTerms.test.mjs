// Run: npm test. The group-departure rules have one wording everywhere: the Terms page, the cancellation policy,
// the checkout, the departure cards and the voucher PDF (backend copy of the same file).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, "..", "app");
const terms = JSON.parse(fs.readFileSync(path.join(here, "groupDepartureTerms.json"), "utf8"));

test("the backend's copy (used by the voucher PDF) is identical", (t) => {
  const backend = path.join(here, "..", "..", "..", "..", "GokeysNext", "bookings", "group_departure_terms.json");
  if (!fs.existsSync(backend)) return t.skip("backend repository not next to this one");
  assert.deepEqual(JSON.parse(fs.readFileSync(backend, "utf8")), terms);
});

test("the rules say what the decisions file says", () => {
  const all = [...terms.payment, ...terms.cancellation, ...terms.minimumGroup].join(" ");
  for (const part of ["25% of the total", "7 days before departure", "30 or more days", "₹2,000 per person",
    "7 to 29 days", "keep the advance", "less than 7 days", "no refund", "transfer your seat", "100% refund within 7 working days",
    "move to another departure", "private trip"]) {
    assert.ok(all.includes(part), part);
  }
});

test("every page shows the rules from the shared file, not its own copy", () => {
  const pages = {
    "terms-and-conditions/page.js": "<GroupDepartureTerms",
    "cancellation-policy/page.js": "<GroupDepartureTerms",
    "grouptour/[slug]/GroupTourDetails.js": "<GroupDepartureTerms",
  };
  for (const [file, marker] of Object.entries(pages)) {
    const source = fs.readFileSync(path.join(app, file), "utf8");
    assert.ok(source.includes(marker), file);
    assert.ok(!/2,000 per person|7 to 29 days|100% refund within 7 working/.test(source), `${file} repeats the wording`);
  }
  const checkout = fs.readFileSync(path.join(here, "..", "components", "booking", "BookingCheckout.js"), "utf8");
  assert.ok(checkout.includes("<GroupDepartureTerms"));
});
