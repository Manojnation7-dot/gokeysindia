// Run: npm test. Checkout hotfix (Nov 2026): the minus button crashed the page; on a first visit Razorpay's window
// was blocked because "Book now" opened /book without a full page load (the tour page's security policy stayed).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { changeCount, loadRazorpay, quoteKey, travellerRows, travellerSlots } from "./booking.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("one typed row per traveller after every + and -, never a row without a type", () => {
  let counts = { adult: 4, child_with_bed: 1, child_no_bed: 1, infant: 1 };
  let typed = travellerRows(travellerSlots(counts), []).map((r, i) => ({ ...r, full_name: `Name ${i}` }));
  const steps = [["adult", -1], ["adult", -1], ["adult", -1], ["adult", -1], ["child_with_bed", -1], ["child_with_bed", -1],
    ["child_no_bed", -1], ["infant", -1], ["infant", -1], ["adult", 1], ["infant", 1], ["child_no_bed", 1]];
  for (const [key, delta] of steps) {
    counts = changeCount(counts, key, delta);
    const rows = travellerRows(travellerSlots(counts), typed); // `typed` may be longer than the slots: that crashed
    assert.equal(rows.length, counts.adult + counts.child_with_bed + counts.child_no_bed + counts.infant);
    for (const row of rows) assert.ok(row.type && row.type.label, `${key} ${delta}`);
  }
  assert.deepEqual(counts, { adult: 2, child_with_bed: 0, child_no_bed: 1, infant: 1 });
  assert.equal(travellerRows(["adult"], typed)[0].full_name, "Name 0"); // what was typed is kept
});

test("adults never below 1, others never below 0, fast taps all count", () => {
  assert.equal(changeCount({ adult: 1 }, "adult", -1).adult, 1);
  assert.equal(changeCount({ adult: 2, infant: 0 }, "infant", -1).infant, 0);
  assert.equal(changeCount({ adult: 20 }, "adult", 1).adult, 20);
  let c = { adult: 2, child_with_bed: 0, child_no_bed: 0, infant: 0 };
  for (let i = 0; i < 5; i++) c = changeCount(c, "adult", 1); // five quick taps before a re-render
  assert.equal(c.adult, 7);
});

test("a price answer belongs to exactly the inputs it was asked for", () => {
  const counts = { adult: 2, child_with_bed: 0, child_no_bed: 0, infant: 0 };
  const a = quoteKey({ sharing: "quad", counts, pickupId: "" });
  assert.equal(a, quoteKey({ sharing: "quad", counts: { ...counts }, pickupId: "" }));
  assert.notEqual(a, quoteKey({ sharing: "quad", counts: { ...counts, adult: 1 }, pickupId: "" }));
  assert.notEqual(a, quoteKey({ sharing: "double", counts, pickupId: "" }));
  assert.notEqual(a, quoteKey({ sharing: "quad", counts, pickupId: "3" }));
});

function fakeBrowser() {
  const scripts = [];
  globalThis.window = {};
  globalThis.document = { createElement: () => { const s = { remove() { s.removed = true; } }; scripts.push(s); return s; },
    head: { appendChild() {} } };
  return scripts;
}

test("Razorpay script: one load, everyone waits for onload; Pay never fails while it is still loading", async () => {
  const scripts = fakeBrowser();
  const first = loadRazorpay({ timeoutMs: 1000 });
  const second = loadRazorpay({ timeoutMs: 1000 }); // Pay pressed while loading: the same wait
  assert.equal(scripts.length, 1);
  window.Razorpay = function Razorpay() {};
  scripts[0].onload();
  assert.equal(await first, window.Razorpay);
  assert.equal(await second, window.Razorpay);
});

test("Razorpay script: fails on a real error or after the timeout, and Retry loads it again", async () => {
  const scripts = fakeBrowser();
  const blocked = loadRazorpay({ timeoutMs: 1000 });
  scripts[0].onerror();
  await assert.rejects(blocked, /could not be loaded/);
  const slow = loadRazorpay({ timeoutMs: 30 }); // Retry: a new script tag
  assert.equal(scripts.length, 2);
  await assert.rejects(slow, /too long/);
  const again = loadRazorpay({ timeoutMs: 1000 });
  window.Razorpay = function Razorpay() {};
  scripts[2].onload();
  assert.equal(await again, window.Razorpay);
  delete globalThis.window; delete globalThis.document;
});

test("every way into /book from another page is a full page load (never Next.js Link or router)", () => {
  const files = [];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (/\.(js|jsx)$/.test(e.name) && !e.name.endsWith(".test.mjs")) files.push(p);
  });
  walk(src);
  const bad = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    if (/<Link[^>]*href=\{?["'`]\/book/.test(text) || /router\.(push|replace)\(\s*["'`]\/book/.test(text)) bad.push(path.relative(src, file));
    if (/\{ href: "\/book/.test(text) && !/item\.href\.startsWith\("\/book"\)/.test(text)) bad.push(path.relative(src, file));
  }
  assert.deepEqual(bad, []);
  const details = fs.readFileSync(path.join(src, "app", "grouptour", "[slug]", "GroupTourDetails.js"), "utf8");
  assert.match(details, /<a href=\{`\/book\/\$\{dep\.id\}`\}/);
});

test("Razorpay stays allowed only on /book", () => {
  const config = fs.readFileSync(path.join(src, "..", "next.config.mjs"), "utf8");
  assert.match(config, /source: '\/\(\(\?!book\(\?:\/\|\$\)\)\.\*\)'/);
  assert.match(config, /value: csp\(false\)/);
});
