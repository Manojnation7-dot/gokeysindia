// Run: npm test. /book: the 3-line booking rules, one consent box above Pay, the full rules in a dialog, and the
// phone pay bar. Everything else on the page stays as it was.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cancellationLine, rulesSummary } from "./checkoutSummary.js";
import { SITE_DEFAULTS } from "./siteSettings.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(src, file), "utf8");
const checkout = read("components/booking/BookingCheckout.js");

test("cancellation in one line, from the refund rules (not typed numbers)", () => {
  assert.equal(cancellationLine(SITE_DEFAULTS.cancellation_rules),
    "If you cancel: 30+ days before: ₹2,000 per person kept · 7–29 days: the advance kept · under 7 days: no refund.");
  assert.equal(cancellationLine([]), "");
  assert.equal(cancellationLine([{ from_days: 45, to_days: null, charge: "₹3,000 per person", charge_base: "of what you paid" }]),
    "If you cancel: 45+ days before: ₹3,000 per person kept.");
});

test("three lines: advance and balance, cancellation, minimum group", () => {
  const group = { advance_percent: 25, balance_due_days: 7 };
  const lines = rulesSummary({ group, rules: SITE_DEFAULTS.cancellation_rules, fee: "2",
    dep: { advancePercent: 30, balanceDueDateText: "1 May 2027", minPax: 10, decisionDateText: "10 Apr 2027" } });
  assert.equal(lines.length, 3);
  assert.equal(lines[0], "Pay 30% now to confirm your seats (or pay in full); the balance is due by 1 May 2027. Each online payment has a 2% payment processing charge.");
  assert.match(lines[1], /^If you cancel: /);
  assert.equal(lines[2], "Runs with at least 10 travellers, confirmed by 10 Apr 2027; if it does not, you choose a full refund, a free move or a private trip.");
  const plain = rulesSummary({ group, rules: SITE_DEFAULTS.cancellation_rules, dep: {}, minimumGroupFallback: "Each departure runs with a minimum number of travellers." });
  assert.equal(plain[0], "Pay 25% now to confirm your seats (or pay in full); the balance is due 7 days before departure.");
  assert.equal(plain[2], "Each departure runs with a minimum number of travellers.");
  assert.equal(rulesSummary({ group, rules: [], dep: { guaranteed: true } })[1], "Guaranteed departure: this date will run.");
});

test("the full rules: the one shared text, in a dialog on the page (no new page, no new wording)", () => {
  assert.match(checkout, /<dialog ref=\{rulesRef\}/);
  assert.match(checkout, /<GroupDepartureTerms headingClass=/);
  assert.equal((checkout.match(/^\s+Read full booking rules$/gm) || []).length, 1); // one button
  assert.match(checkout, /What we store:/);                    // the data notice is still on the page (in the dialog)
  assert.ok(!checkout.includes("BookingSummary"));
});

test("one consent box just above Pay; Pay stays off until it is ticked; the server still gets consent: true", () => {
  const consentAt = checkout.indexOf("I agree to the <button type=\"button\" onClick={openRules} className=\"underline\">booking rules</button>");
  const payAt = checkout.indexOf("<button ref={setPayButton} type=\"submit\"");
  assert.ok(consentAt > 0 && payAt > consentAt && payAt - consentAt < 2000);
  assert.match(checkout, /privacy-policy" className="underline" target="_blank">privacy policy<\/Link>/);
  assert.match(checkout, /disabled=\{busy \|\| !quote \|\| !quote\.bookable \|\| womenOnlyBlocked \|\| !consent\.consent\}/);
  assert.match(checkout, /consent: consent\.consent, consent_text_version: info\.consent_text_version/);
  assert.ok(!checkout.includes("consent.terms"));
});

test("phone pay bar: only when everything else is filled in, never while typing or with Pay on screen", () => {
  assert.match(checkout, /!booking && stage === "form" && amountNow != null && quote\?\.bookable && !womenOnlyBlocked && !typing && !payVisible\s+&& check\(true\) === "" && <PayBar/);
  assert.match(checkout, /lg:hidden fixed inset-x-0 bottom-0/);
  assert.match(read("app/globals.css"), /body\.gk-paybar \.whatsapp-float \{ bottom: 92px; \}/);
});

test("unchanged: server prices, Razorpay script before seats, Meta Purchase, full page load into /book", () => {
  assert.match(checkout, /try \{ await loadRazorpay\(\); \} catch \{ setStage\("form"\); return setScriptFailed\(true\); \}\s+setStage\("sending"\);/);
  assert.match(checkout, /if \(verified\?\.ok\) trackPurchaseOnce\(result\.reference, paidNowRef\.current\);/);
  assert.ok(!/gtag|dataLayer/.test(checkout));
});
