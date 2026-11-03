// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { errorMessage, hashValue, rupeesFromPaise, travellerSlots } from "./booking.js";

test("rupees from paise", () => {
  assert.equal(rupeesFromPaise(1470000), "₹14,700");
  assert.equal(rupeesFromPaise(8751), "₹87.51");
  assert.equal(rupeesFromPaise(1076250), "₹10,762.50");  // never "10,762.5"
  assert.equal(rupeesFromPaise(0), "₹0");
});

test("tokens after #", () => {
  assert.equal(hashValue("preview", "#preview=abc%3Adef"), "abc:def");
  assert.equal(hashValue("", "#Zm9vYmFy-_x"), "Zm9vYmFy-_x");
  assert.equal(hashValue("", "#preview=abc"), "");   // a staff test token is never taken as a booking token
  assert.equal(hashValue("preview", ""), "");
});

test("traveller rows in the order the backend expects", () => {
  assert.deepEqual(travellerSlots({ adult: 2, child_with_bed: 1, child_no_bed: 0, infant: 1 }),
    ["adult", "adult", "child_with_bed", "infant"]);
});

test("API error messages for the guest", () => {
  assert.equal(errorMessage({ lead_phone: ["Enter a 10-digit Indian mobile number."] }, { lead_phone: "Mobile number" }),
    "Mobile number: Enter a 10-digit Indian mobile number.");
  assert.equal(errorMessage({ travellers: [{ age: ["Age 13 does not match"] }] }), "age: Age 13 does not match");
  assert.equal(errorMessage({ detail: "Online booking is not open yet." }), "Online booking is not open yet.");
});
