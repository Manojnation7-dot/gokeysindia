// Run: npm test. Contact numbers and WhatsApp (12 Nov 2026): every page lists the admin's numbers in one order,
// +91-9286600115 last; every WhatsApp link that went to 7830718687 now uses the admin's WhatsApp number (9286600115).
// Links that go to 9045916770 (service pages, cabs, hotel enquiry) and the JSON-LD telephone stay as they were.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_DEFAULTS, callWhatsapp, contactNumbers, mergeSiteSettings, telHref, whatsappDigits, whatsappLink } from "./siteSettings.js";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => fs.readFileSync(path.join(src, ...p), "utf8");
const ORDER = ["+91-9045916770", "+91-7830718687", "+91-7830718680", "+91-9286600115"];

function sources(dir = src, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sources(full, out);
    else if (/\.(js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

test("one ordered list: every old number kept, the new one last; WhatsApp is the new number", () => {
  assert.deepEqual(contactNumbers(SITE_DEFAULTS.business), ORDER);
  assert.deepEqual(contactNumbers({}), ORDER); // an API answer without the list
  assert.deepEqual(contactNumbers({ contact_numbers: ["+91-1", ""] }), ["+91-1"]); // the admin's list wins
  assert.equal(whatsappDigits(SITE_DEFAULTS.business), "919286600115");
  assert.equal(whatsappDigits({ whatsapp: "92866 00115" }), "919286600115");
  assert.equal(whatsappLink(SITE_DEFAULTS.business), "https://wa.me/919286600115");
  assert.equal(whatsappLink(SITE_DEFAULTS.business, "Hi there"), "https://wa.me/919286600115?text=Hi%20there");
  assert.equal(callWhatsapp(SITE_DEFAULTS.business), "Call +91-7830718687 · WhatsApp +91-9286600115");
  assert.equal(telHref("+91-7830718687"), "tel:+917830718687");
  assert.equal(SITE_DEFAULTS.business.main_phone, "+91-9045916770");
  // An older backend (no list yet) still gets the full list from the defaults
  assert.deepEqual(contactNumbers(mergeSiteSettings({ business: { email: "x@example.invalid" } }).business), ORDER);
});

test("no WhatsApp link goes to 7830718687 any more; 7830718687 stays a phone number", () => {
  for (const file of sources()) {
    const text = fs.readFileSync(file, "utf8");
    assert.ok(!/wa\.me\/(91)?7830718687|phone=(91)?7830718687|whatsapp\.com\/send\?phone=917830718687/.test(text), file);
  }
  assert.match(read("components", "WhatsAppFloat.js"), /whatsappDigits\(business\)/);
  assert.match(read("components", "WhatsAppFloat.js"), /business\.whatsapp_message/);
  for (const file of [["components", "TourDetailsClient.js"], ["app", "tours", "TourListPage.js"], ["app", "contact", "page.js"],
    ["app", "about", "page.js"], ["app", "hotels", "[destination]", "[slug]", "HotelDetailPage.js"],
    ["app", "sightseeing", "[slug]", "SightseeingDetailPage.js"], ["components", "KumbhBanner.js"],
    ["app", "char-dham-yatra-cost-calculator", "page.js"], ["app", "grouptour", "[slug]", "GroupTourDetails.js"]]) {
    assert.match(read(...file), /whatsappLink\(/, file.join("/"));
  }
});

test("every place that listed numbers lists the admin's numbers (old ones kept, new one added)", () => {
  for (const file of [["components", "Footer.js"], ["app", "page.js"], ["app", "contact", "page.js"], ["app", "about", "page.js"]]) {
    const text = read(...file);
    assert.match(text, /contactNumbers\((business|site\.business)\)/, file.join("/"));
    assert.ok(!/9045916770|7830718687|7830718680/.test(text), `${file.join("/")} still types a number`);
  }
  for (const file of [["app", "cancellation-policy", "page.js"], ["app", "privacy-policy", "page.js"]]) {
    assert.match(read(...file), /business\.tour_desk_phone\}, \{(site\.)?business\.whatsapp\}/, file.join("/"));
  }
  for (const file of [["components", "TourDetailsClient.js"], ["app", "grouptour", "[slug]", "GroupTourDetails.js"]]) {
    assert.match(read(...file), /callWhatsapp\(/, file.join("/")); // "Call +91-7830718687 · WhatsApp +91-9286600115"
  }
  for (const file of [["components", "booking", "BookingStatus.js"], ["components", "booking", "CheckBooking.js"]]) {
    const text = read(...file);
    assert.match(text, /Call <a[^>]*telHref\(business\.tour_desk_phone\)[^·]*· WhatsApp <a[^>]*whatsappLink\(business\)/, file.join("/"));
    assert.ok(!/Call or WhatsApp/.test(text), file.join("/"));
  }
  const pdf = read("components", "ItineraryPdf.js");
  assert.match(pdf, /\{business\.main_phone\}<br \/>WhatsApp \{business\.whatsapp\}/);
  assert.match(pdf, /\{business\.main_phone\} · WhatsApp \{business\.whatsapp\}/);
  assert.match(read("components", "Header.js"), /business\.main_phone \|\| "\+91-9045916770"/);
});

test("left as they were: 9045916770 WhatsApp links, the single call buttons, JSON-LD telephone", () => {
  assert.match(read("app", "cabs", "CabsPage.js"), /wa\.me\/919045916770/);
  assert.match(read("lib", "cabs.js"), /wa\.me\/919045916770/);
  assert.match(read("components", "HotelEnquiryModal.js"), /const adminPhone = "919045916770"/);
  for (const page of fs.readdirSync(path.join(src, "app", "services"))) {
    const text = read("app", "services", page, "page.js");
    assert.match(text, /telephone: "\+91 9045916770"/, page);
    assert.match(text, /wa\.me\/919045916770/, page);
  }
  assert.match(read("lib", "seoSchemas.js"), /"telephone": "\+91-9045916770"/);
  assert.match(read("components", "SimpleEnquiryForm.js"), /href="tel:\+917830718687"/);
  assert.match(read("components", "booking", "CheckoutErrorBoundary.js"), /Call \+91-7830718687/);
});
