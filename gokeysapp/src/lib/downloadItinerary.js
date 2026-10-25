// "Download Itinerary": builds the itinerary PDF only when the visitor clicks. The printable layout
// (src/components/ItineraryPdf.js) is rendered off-screen for a moment, turned into a PDF and removed, so it is
// never part of the page HTML that search engines read (the itinerary is not on the page twice).
//
// Pages are laid out here rather than cut by the PDF library: every block (a day's heading, each paragraph, each box)
// is measured, then A4 pages are filled with whole blocks, so no line of text is ever split across two pages.
import { createElement } from "react";

const randomCode = (length) => Array.from({ length }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

/** Block indexes per page: whole blocks only, and a block marked `keep` (a heading) never ends a page. */
export function paginate(heights, keeps, firstPageHeight, pageHeight) {
  const pages = [[]];
  let room = firstPageHeight;
  heights.forEach((h, i) => {
    const page = pages.at(-1);
    if (h > room && page.length) {
      // Carry trailing headings over with the block they introduce.
      const carried = [];
      while (page.length > 1 && keeps[page.at(-1)]) carried.unshift(page.pop());
      pages.push(carried);
      room = pageHeight - carried.reduce((sum, k) => sum + heights[k], 0);
    }
    pages.at(-1).push(i);
    room -= h;
  });
  return pages;
}

async function settle(host) {
  // The PDF fonts (Lora) and the logo must be loaded before anything is measured or captured.
  await Promise.all(["400 12px Lora", "italic 400 12px Lora", "600 12px Lora", "700 12px Lora"].map(f => document.fonts.load(f).catch(() => null)));
  await document.fonts.ready;
  await Promise.all([...host.querySelectorAll("img")].map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
}

export async function downloadItinerary(tourData, { tourPath = "tours" } = {}) {
  if (!tourData) throw new Error("Tour details are not available. Please try again later.");
  const [{ createRoot }, { flushSync }, { default: html2pdf }, { default: ItineraryPdf, itineraryBlocks, PAGE }] = await Promise.all([
    import("react-dom/client"), import("react-dom"), import("html2pdf.js"), import("@/components/ItineraryPdf"),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gokeys.in";
  const props = {
    tourData,
    tourUrl: `${siteUrl.replace(/^https?:\/\//, "")}/${tourPath}/${tourData.slug ?? ""}`,
    docNumber: `GK-${String(tourData.slug ?? "TOUR").slice(0, 4).toUpperCase()}-${randomCode(6)}`,
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }),
  };

  // Off-screen, at A4 width, outside the page content.
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-10000px;top:0;width:210mm;background:#fff;z-index:-1;";
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    // 1. Measure every block in one column.
    flushSync(() => root.render(createElement(ItineraryPdf, props)));
    await settle(host);
    const pxPerMm = host.getBoundingClientRect().width / 210;
    const heights = [...host.querySelectorAll(".pdf-block")].map(el => el.getBoundingClientRect().height / pxPerMm);
    const keeps = itineraryBlocks(props).blocks.map(b => b.keep);
    // 2. Fill the pages (from page 2 the running header takes its space).
    const usable = PAGE.height - PAGE.top - PAGE.bottom;
    const pages = paginate(heights, keeps, usable, usable - PAGE.runningHeader);
    flushSync(() => root.render(createElement(ItineraryPdf, { ...props, pages })));
    await settle(host);
    // 3. One PDF page per laid-out page.
    await html2pdf().set({
      margin: 0,
      filename: `${tourData.slug || "gokeys-tour"}-itinerary.pdf`,
      image: { type: "jpeg", quality: 0.96 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css"] },
    }).from(host.firstElementChild).save();
  } finally {
    root.unmount();
    host.remove();
  }
}
