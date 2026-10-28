import { test } from "node:test";
import assert from "node:assert/strict";
import { cabs, homeCabs, seatLabel } from "./cabs.js";

test("every cab has a valid seat count (a range written without quotes would be a negative number)", () => {
  for (const cab of cabs) assert.ok(seatLabel(cab.seats), `${cab.name}: seats ${JSON.stringify(cab.seats)}`);
});

test("seatLabel shows whole numbers and ranges, and hides anything invalid", () => {
  assert.equal(seatLabel(4), "4");
  assert.equal(seatLabel("6-7"), "6–7");
  assert.equal(seatLabel("11 - 14"), "11–14");
  for (const bad of [6 - 7, 0, -3, 1.5, "7-6", "6-6", "0-4", "", "six", null, undefined]) assert.equal(seatLabel(bad), null, String(bad));
});

test("ids are unique; the home page keeps its eight cabs", () => {
  assert.equal(new Set(cabs.map((c) => c.id)).size, cabs.length);
  assert.equal(homeCabs.length, 8);
});
