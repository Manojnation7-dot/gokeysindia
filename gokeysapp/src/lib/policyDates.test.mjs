// Run: npm test. One "Last updated" date for the policy pages, the same in the text and in the structured data.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { POLICY_UPDATED, formatPolicyDate } from "./policyDates.js";

const app = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "app");

test("date format", () => {
  assert.equal(POLICY_UPDATED, "2026-11-03");
  assert.equal(formatPolicyDate(), "November 3, 2026");
  assert.equal(formatPolicyDate("2025-07-31"), "July 31, 2025");
});

test("the policy pages take both dates from the constant, never a typed date", () => {
  for (const page of ["terms-and-conditions", "cancellation-policy", "privacy-policy"]) {
    const source = fs.readFileSync(path.join(app, page, "page.js"), "utf8");
    assert.ok(source.includes("Last updated: {formatPolicyDate()}"), page);
    assert.ok(!/Last updated: [A-Z][a-z]+ \d/.test(source), `${page} has a typed date`);
    if (source.includes("dateModified")) assert.ok(source.includes("dateModified: POLICY_UPDATED"), page);
  }
});
