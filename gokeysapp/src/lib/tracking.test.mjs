// Run: npm test. Phase F (minimal): the Meta Pixel only. Google stays exactly as it was.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readConsent } from "./consent.js";
import { isUntrackedPath, pixelId, purchaseParams, shouldLoadPixel, trackLead, trackPurchaseOnce } from "./tracking.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(src, file), "utf8");

// A tiny browser: cookies, localStorage, and recorders for gtag / fbq
let calls;
function browser({ cookie = "", fbq = true } = {}) {
  calls = { gtag: [], fbq: [] };
  const store = new Map();
  globalThis.document = { cookie };
  globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  globalThis.window = { gtag: (...a) => calls.gtag.push(a), ...(fbq ? { fbq: (...a) => calls.fbq.push(a) } : {}) };
}
beforeEach(() => browser());

test("consent cookie: granted, denied or not chosen", () => {
  assert.equal(readConsent("a=1; gk_ad_consent=granted; b=2"), "granted");
  assert.equal(readConsent("gk_ad_consent=denied"), "denied");
  assert.equal(readConsent("gk_ad_consent=maybe"), "");
  assert.equal(readConsent(""), "");
});

test("the Pixel: never without an id or Accept, never on the guest's booking pages", () => {
  assert.equal(pixelId(""), "");
  assert.equal(pixelId(undefined), "");
  assert.equal(pixelId("abc');alert(1);//"), "");                       // only digits ever reach the page
  assert.equal(pixelId(" 1234567890 "), "1234567890");
  assert.equal(shouldLoadPixel({ id: "", consent: "granted", pathname: "/" }), false);
  assert.equal(shouldLoadPixel({ id: "1234567890", consent: "", pathname: "/" }), false);
  assert.equal(shouldLoadPixel({ id: "1234567890", consent: "denied", pathname: "/" }), false);
  assert.equal(shouldLoadPixel({ id: "1234567890", consent: "granted", pathname: "/book/booking" }), false);
  assert.equal(shouldLoadPixel({ id: "1234567890", consent: "granted", pathname: "/book/check" }), false);
  assert.equal(shouldLoadPixel({ id: "1234567890", consent: "granted", pathname: "/book/42" }), true);
  assert.equal(isUntrackedPath("/grouptour/kedarnath"), false);
});

test("Lead: only with Accept and the Pixel loaded; nothing about the visitor", () => {
  browser({ cookie: "" });
  assert.equal(trackLead(), false);
  browser({ cookie: "gk_ad_consent=denied" });
  assert.equal(trackLead(), false);
  browser({ cookie: "gk_ad_consent=granted", fbq: false });              // accepted but no Pixel (no id): nothing
  assert.equal(trackLead(), false);
  browser({ cookie: "gk_ad_consent=granted" });
  assert.equal(trackLead(), true);
  assert.deepEqual(calls.fbq, [["track", "Lead", {}]]);
  assert.deepEqual(calls.gtag, []);                                         // Google never called
});

test("Purchase: once per booking, the amount paid now without the 2% charge, INR, no reference or token", () => {
  browser({ cookie: "gk_ad_consent=granted" });
  // advance Rs 14,000 (tour money); Razorpay charged Rs 14,280 with the 2% processing charge
  assert.equal(trackPurchaseOnce("GK-7H3K9QXM", 1400000), true);
  assert.equal(trackPurchaseOnce("GK-7H3K9QXM", 1400000), false);             // a retry or second tab: not again
  assert.deepEqual(calls.fbq, [["track", "Purchase", { value: 14000, currency: "INR" }]]);
  assert.ok(!JSON.stringify(calls.fbq).includes("GK-7H3K9QXM"));
  assert.deepEqual(purchaseParams(1076250), { value: 10762.5, currency: "INR" });
  assert.deepEqual(calls.gtag, []);
  browser({ cookie: "" });
  assert.equal(trackPurchaseOnce("GK-AAAAAAAA", 1400000), false);             // no Accept: no Purchase
});

test("checkout: Purchase after the verified payment, with the price without the charge", () => {
  const checkout = read("components/booking/BookingCheckout.js");
  assert.match(checkout, /const verified = await sendPaymentCallback\(response\);[\s\S]{0,400}if \(verified\?\.ok\) trackPurchaseOnce\(result\.reference, paidNowRef\.current\);/);
  assert.match(checkout, /paidNowRef\.current = option \? option\.paise : 0;/);
  assert.ok(!read("components/booking/BookingStatus.js").includes("trackPurchase"));   // never on /book/booking
  for (const file of ["components/EnquiryForm.js", "components/NextDepartureRequest.js", "components/QuoteDialog.js",
    "components/SimpleEnquiryForm.js", "lib/tourEnquiry.js"]) {
    assert.equal((read(file).match(/trackLead\(\);/g) || []).length, 1, file);
  }
});

test("security policy: only the Meta hosts the Pixel needs; Razorpay still on /book only", () => {
  const config = read("../next.config.mjs");
  assert.match(config, /const META_SCRIPT = " https:\/\/connect\.facebook\.net";/);
  assert.match(config, /const META_IMG = " https:\/\/www\.facebook\.com https:\/\/connect\.facebook\.net";/);
  assert.match(config, /const META_CONNECT = " https:\/\/www\.facebook\.com https:\/\/connect\.facebook\.net";/);
  assert.match(config, /"script-src [^\n]*\+ META_SCRIPT \+ \(razorpay \? " https:\/\/checkout\.razorpay\.com" : ""\)/);
  assert.match(config, /"img-src [^\n]*\+ META_IMG \+ \(razorpay \? " https:\/\/cdn\.razorpay\.com" : ""\)/);
  assert.match(config, /"connect-src [^\n]*\+ META_CONNECT \+ \(razorpay \? /);
  assert.equal((config.match(/https:\/\/[a-z.]*facebook\.(com|net)/g) || []).length, 6); // no other Meta host
  // frames: www.facebook.com only (added in commit b4522e9), never connect.facebook.net
  assert.match(config, /"frame-src [^\n]*https:\/\/www\.facebook\.com"/);
  assert.ok(!/"frame-src [^\n]*connect\.facebook\.net/.test(config));
  assert.ok(config.split("\n").filter((l) => l.includes("razorpay.com")).every((l) => /razorpay \? "/.test(l)));
  assert.match(config, /source: '\/book', headers: checkout/);
  assert.match(config, /value: csp\(false\)/);
});

test("Google exactly as before: one gtag.js, the same configs, no consent mode; Meta code never touches Google", () => {
  const layout = read("app/layout.js");
  assert.equal((layout.match(/googletagmanager\.com\/gtag\/js\?id=G-WPMX23NEML/g) || []).length, 1);
  assert.equal((layout.match(/gtag\('config', 'G-WPMX23NEML'\)/g) || []).length, 1);
  assert.equal((layout.match(/gtag\('config', 'AW-956670461'\)/g) || []).length, 1);
  assert.ok(!/consent/i.test(layout.slice(layout.indexOf("google-gtag"), layout.indexOf("</Script>", layout.indexOf("google-gtag")))));
  for (const file of ["lib/tracking.js", "lib/consent.js", "components/Analytics.js", "components/ConsentBanner.js"]) {
    assert.ok(!/gtag|dataLayer/.test(read(file).replace(/\/\/[^\n]*/g, "")), `${file} touches Google`);
  }
  const analytics = read("components/Analytics.js");
  assert.match(analytics, /shouldLoadPixel\(\{ id: PIXEL_ID, consent, pathname \}\)/);
  assert.equal((analytics.match(/fbevents\.js/g) || []).length, 1);
  for (const file of ["components/Analytics.js", "app/layout.js", "lib/tracking.js"]) assert.ok(!/fbq\("init", "\d/.test(read(file)), file);
});
