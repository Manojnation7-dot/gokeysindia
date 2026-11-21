// Run: npm test. The enquiry form on group tour pages: every field required, no travel date before today (India).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(src, file), "utf8");

// lib/tourEnquiry.js imports "@/lib/..." (Next aliases): read the checker's source and run it on its own
const code = read("lib/tourEnquiry.js");
const fn = code.slice(code.indexOf("export function enquiryProblem")).replace("export function", "function");
const enquiryProblem = new Function(`${fn}; return enquiryProblem;`)();

const ok = { name: "Asha Verma", email: "asha@example.in", contactNo: "+91 98765 43210", totalPersons: "3",
  travelDate: "2026-12-12", message: "Is there a room for 3?" };
const today = "2026-11-21";

test("a complete enquiry passes", () => {
  assert.equal(enquiryProblem(ok, { today, requireMessage: true }), "");
  assert.equal(enquiryProblem({ ...ok, travelDate: today }, { today, requireMessage: true }), ""); // today is fine
});

test("every field is required on group tour pages", () => {
  for (const [field, value, text] of [["name", " ", /full name/], ["email", "asha@", /valid email/], ["contactNo", "98765", /10-digit/],
    ["totalPersons", "", /number of people/], ["travelDate", "", /travel date/], ["message", "   ", /message/]]) {
    assert.match(enquiryProblem({ ...ok, [field]: value }, { today, requireMessage: true }), text, field);
  }
  assert.equal(enquiryProblem({ ...ok, message: "" }, { today }), "");   // other pages: the message stays optional
});

test("no travel date before today", () => {
  assert.match(enquiryProblem({ ...ok, travelDate: "2026-11-20" }, { today, requireMessage: true }), /from today onwards/);
});

test("the form: past dates blocked in the picker, * on every field and the message required on group tour pages", () => {
  const form = read("components/EnquiryForm.js");
  assert.match(form, /min=\{minDate \|\| undefined\}/);
  assert.match(form, /useEffect\(\(\) => \{ setMinDate\(todayIST\(\)\); \}, \[\]\);/);
  assert.equal((form.match(/\{star\}/g) || []).length, 6);
  assert.match(form, /required=\{allRequired\}/);
  assert.match(form, /const problem = enquiryProblem\(formData, \{ today: todayIST\(\), requireMessage: allRequired \}\);/);
  const page = read("app/grouptour/[slug]/GroupTourDetails.js");
  assert.equal((page.match(/<EnquiryForm[\s\S]{0,80}allRequired/g) || []).length, 2);
  assert.match(page, /enquiryProblem\(enquiryFormData, \{ today: todayIST\(\), requireMessage: true \}\)/);
});
