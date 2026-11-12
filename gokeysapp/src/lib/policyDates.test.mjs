// Run: npm test. One "Last updated" date for the policy pages, the same in the text and in the structured data.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { POLICY_UPDATED, formatPolicyDate, policyUpdated } from "./policyDates.js";

const app = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "app");

test("date format", () => {
  // Set to the deploy date when a policy changes (Phase 3: the date-change rules); a real date, not before Phase 2's
  assert.match(POLICY_UPDATED, /^20\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
  assert.ok(POLICY_UPDATED >= "2026-11-03");
  assert.equal(formatPolicyDate("2026-11-03"), "November 3, 2026");
  assert.equal(formatPolicyDate("2025-07-31"), "July 31, 2025");
});

test("the policy pages take both dates from one place, never a typed date", () => {
  const source = (page) => fs.readFileSync(path.join(app, page, "page.js"), "utf8");
  assert.ok(source("privacy-policy").includes("Last updated: {formatPolicyDate()}"));
  // The group tour rules follow Group tour settings: the date moves when the admin changes a number in them
  for (const page of ["terms-and-conditions", "cancellation-policy"]) {
    assert.ok(source(page).includes("Last updated: {formatPolicyDate(updated)}"), page);
    assert.ok(source(page).includes("dateModified: updated"), page);
    assert.ok(source(page).includes("policyUpdated((await getSiteSettings()).group)"), page);
  }
  for (const page of ["terms-and-conditions", "cancellation-policy", "privacy-policy"]) {
    assert.ok(!/Last updated: [A-Z][a-z]+ \d/.test(source(page)), `${page} has a typed date`);
  }
});

test("the later of the constant and the admin's last rule change", () => {
  assert.equal(policyUpdated({ terms_changed_on: null }), POLICY_UPDATED);
  assert.equal(policyUpdated(undefined), POLICY_UPDATED);
  assert.equal(policyUpdated({ terms_changed_on: "2020-01-01" }), POLICY_UPDATED);
  assert.equal(policyUpdated({ terms_changed_on: "2099-02-03" }), "2099-02-03");
});
