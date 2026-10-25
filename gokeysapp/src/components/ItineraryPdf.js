// The "Download Itinerary" document: laid out like the itinerary section of a Gokeys quotation (CRM), in
// Lora with the same teal and warm colours. It is never part of the page: src/lib/downloadItinerary.js renders it
// off-screen only when the visitor clicks, turns it into a PDF and removes it again (so search engines don't see
// the itinerary twice). Inline styles only, so html2canvas reproduces it exactly.

const C = {
  ink: "#17212B", body: "#3A4651", muted: "#6B7480", faint: "#9AA3AC", line: "#E2E8EC", panel: "#F1F4F7",
  teal: "#146E80", tealSoft: "#E4F2F6", tealLine: "#C6E2EA", warm: "#B4530F", warmSoft: "#FBEBDD", green: "#1E7B45", red: "#B42318",
};
const SERIF = "'Lora', Georgia, 'Times New Roman', serif";
const eyebrow = { fontSize: "7.5pt", letterSpacing: "0.22em", fontWeight: 700, color: C.teal, textTransform: "uppercase", margin: 0 };
const chip = (tone = "plain") => ({
  display: "inline-block", padding: "0.8mm 2.6mm", borderRadius: "999px", fontSize: "7.6pt", marginRight: "1.6mm", marginBottom: "1mm",
  background: tone === "teal" ? C.tealSoft : C.panel, color: tone === "teal" ? C.teal : C.body,
});

/** "Haridwar – Badrinath (320 Kms, 10-12 hrs)" → title "Haridwar → Badrinath" and chip "320 Kms, 10-12 hrs" (as in the CRM). */
export function dayTitle(raw) {
  const text = String(raw ?? "").trim();
  const match = text.match(/\(([^)]*\b(?:km|kms|hrs?|hours?)\b[^)]*)\)\s*$/i);
  const title = (match ? text.slice(0, match.index) : text).replace(/\s+[–—-]\s+/g, " → ").trim();
  return { title, chip: match ? match[1].trim() : null };
}

/** The day's description (HTML from the website admin) as paragraphs and bullet points. */
export function descriptionBlocks(html) {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  // Line breaks typed in the admin (<br>) separate lines such as "Distance: …" and "Stay: …".
  doc.querySelectorAll("br").forEach(br => br.replaceWith("\n"));
  const blocks = [];
  const push = (text, bullet = false) => String(text).split(/\n+/).map(t => t.trim()).filter(Boolean)
    .forEach(t => blocks.push({ bullet: bullet || /^[-*•]\s+/.test(t), text: t.replace(/^[-*•]\s+/, "") }));
  const walk = (node) => {
    for (const el of node.children) {
      const tag = el.tagName.toLowerCase();
      if (tag === "ul" || tag === "ol") el.querySelectorAll(":scope > li").forEach(li => push(li.textContent, true));
      else if (["p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"].includes(tag)) push(el.textContent);
      else if (el.children.length) walk(el);
      else push(el.textContent);
    }
  };
  walk(doc.body.firstElementChild);
  // Plain text without tags: one paragraph per line.
  if (!blocks.length) push(doc.body.textContent);
  return blocks;
}

/**
 * Lines that read as facts become chips, as on the quotation: "Distance: Approx. 180 km | Travel Time: 6–7 hours"
 * → "Approx. 180 km · 6–7 hours", and "Stay: Barkot" → "Stay: Barkot". Everything else stays as text.
 */
export function splitFacts(blocks) {
  const chips = [], rest = [];
  for (const b of blocks) {
    const stay = b.text.match(/^(?:night\s*)?stay\s*:\s*(.+)$/i);
    const trip = /^(distance|drive|travel time|trek)\b[^:]*:/i.test(b.text) && /\b(km|kms|hrs?|hours?)\b/i.test(b.text);
    if (stay && !b.bullet) chips.push({ text: `Stay: ${stay[1].trim()}`, teal: true });
    else if (trip && !b.bullet && b.text.length < 120) chips.push({ text: b.text.replace(/^(distance|drive)\s*:\s*/i, "").replace(/\s*\|\s*(travel time|trek)\s*:\s*/gi, " · ").replace(/\s*\|\s*/g, " · ") });
    else rest.push(b);
  }
  return { chips, rest };
}

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// A4 in mm. Pages are laid out here (not cut by the PDF library), so a line or a box is never split across pages.
export const PAGE = { height: 296, top: 12, bottom: 18, side: 14, runningHeader: 14 };

const FONTS = `
  @font-face { font-family: 'Lora'; src: url('/fonts/lora/Lora-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; }
  @font-face { font-family: 'Lora'; src: url('/fonts/lora/Lora-Italic.ttf') format('truetype'); font-weight: 400; font-style: italic; }
  @font-face { font-family: 'Lora'; src: url('/fonts/lora/Lora-SemiBold.ttf') format('truetype'); font-weight: 600; font-style: normal; }
  @font-face { font-family: 'Lora'; src: url('/fonts/lora/Lora-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; }`;
const base = { color: C.body, fontFamily: SERIF, fontSize: "9.4pt", lineHeight: 1.5 };

function Logo({ size = 13 }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/images/gokeyslogo.png" alt="Gokeys" style={{ height: `${size}mm`, width: "auto" }} crossOrigin="anonymous" />;
}

function Header({ docNumber, date, duration }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "5mm" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "3mm" }}>
      <Logo />
      <div>
        <p style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: "17pt", color: C.ink, lineHeight: 1.1 }}>Gokeys India</p>
        <p style={{ margin: "1mm 0 0", fontSize: "6.8pt", letterSpacing: "0.26em", color: C.muted }}>TRAVEL.EXPLORE.BELONG</p>
      </div>
    </div>
    <table style={{ fontSize: "7.8pt", color: C.muted, borderCollapse: "collapse" }}><tbody>
      {[["Itinerary no.", docNumber], ["Prepared", date], ["Duration", duration]].filter(([, v]) => v).map(([k, v]) =>
        <tr key={k}><td style={{ textAlign: "right", paddingRight: "3mm", paddingBottom: "0.8mm" }}>{k}</td><td style={{ fontWeight: 700, color: C.ink, paddingBottom: "0.8mm" }}>{v}</td></tr>)}
    </tbody></table>
  </div>;
}

/** Pages 2 onward, as on the quotation: small logo and name, the tour and the itinerary number. */
function RunningHeader({ name, docNumber }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: `${PAGE.runningHeader - 4}mm`, marginBottom: "4mm" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}><Logo size={7} /><span style={{ fontWeight: 700, fontSize: "11pt", color: C.ink }}>Gokeys India</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: "3mm", fontSize: "7.6pt", color: C.muted }}>
      <span>{name}</span><span style={{ background: C.panel, borderRadius: "999px", padding: "1mm 3mm", fontWeight: 700, color: C.ink }}>{docNumber}</span>
    </div>
  </div>;
}

function Footer({ page, total }) {
  return <div style={{ position: "absolute", left: `${PAGE.side}mm`, right: `${PAGE.side}mm`, bottom: "8mm", display: "flex", justifyContent: "space-between", borderTop: `0.3mm solid ${C.line}`, paddingTop: "2.5mm", fontSize: "7.2pt", color: C.muted }}>
    <span>Gokeys India · www.gokeys.in · +91 90459 16770 · helpdesk@gokeys.in</span><span>Page {page} of {total}</span>
  </div>;
}

function Heading({ eyebrowText, text, accent }) {
  return <div style={{ padding: "7mm 0 3mm" }}>
    <p style={eyebrow}>{eyebrowText}</p>
    <p style={{ margin: "1.5mm 0 0", fontFamily: SERIF, fontSize: "21pt", color: C.ink, lineHeight: 1.15 }}>{text} <span style={{ fontStyle: "italic", color: C.teal }}>{accent}</span></p>
  </div>;
}

/** One line of a day: the DAY badge column (filled on the first line only) and the text. */
function DayLine({ day, first, last, children }) {
  return <div style={{ display: "flex", gap: "5mm", paddingTop: first ? "4mm" : 0, paddingBottom: last ? "3.5mm" : 0, borderBottom: last ? `0.3mm solid ${C.line}` : "none" }}>
    <div style={{ width: "15mm", flexShrink: 0, textAlign: "center" }}>
      {first && <div style={{ background: C.warmSoft, borderRadius: "2.5mm", padding: "1.6mm 0 1.2mm" }}>
        <p style={{ margin: 0, fontSize: "6.4pt", letterSpacing: "0.18em", color: C.warm, fontWeight: 700 }}>DAY</p>
        <p style={{ margin: 0, fontSize: "15pt", fontWeight: 700, color: C.warm, lineHeight: 1.1 }}>{day}</p>
      </div>}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>;
}

/**
 * The document as a flat list of blocks that are never split (header, title, each day's heading, each paragraph,
 * the boxes). `keep: true` keeps a block on the same page as the next one (a heading never ends a page).
 */
export function itineraryBlocks({ tourData, tourUrl, docNumber, date }) {
  const days = Array.isArray(tourData.itineraries) ? [...tourData.itineraries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.day ?? 0) - (b.day ?? 0)) : [];
  const nights = tourData.duration_nights, dayCount = tourData.duration_days || days.length || null;
  // A bare number (group tours) is a number of days.
  const duration = tourData.duration ? (/^\d+$/.test(String(tourData.duration).trim()) ? `${String(tourData.duration).trim()} days` : `${tourData.duration}`) : dayCount ? `${nights ? `${nights} nights · ` : ""}${dayCount} days` : null;
  const items = Array.isArray(tourData.inclusions_exclusions) ? tourData.inclusions_exclusions : [];
  const strip = (h) => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const included = items.filter(i => i.is_inclusion).map(i => strip(i.description)).filter(Boolean);
  const excluded = items.filter(i => !i.is_inclusion).map(i => strip(i.description)).filter(Boolean);
  const prices = (Array.isArray(tourData.pricing) ? tourData.pricing : []).map(p => ({ name: cap(p.package_type) || "Package", price: Number(p.discount_price ?? p.price) })).filter(p => p.price > 0);
  const places = (tourData.destinations ?? []).map(d => (typeof d === "string" ? d : d?.name)).filter(Boolean).map(cap);
  const name = String(tourData.name ?? "Tour itinerary").trim();
  const words = name.split(/\s+/), accent = words.length > 1 ? words.pop() : "";
  const blocks = [];
  const add = (key, node, keep = false) => blocks.push({ key, node, keep });

  add("header", <Header docNumber={docNumber} date={date} duration={duration} />);
  add("title", <div>
    <p style={eyebrow}>Holiday itinerary · Gokeys India</p>
    <p style={{ margin: "2mm 0 0", fontFamily: SERIF, fontSize: "27pt", color: C.ink, lineHeight: 1.12 }}>{words.join(" ")} {accent && <span style={{ fontStyle: "italic", color: C.teal }}>{accent}</span>}</p>
    {places.length > 0 && <p style={{ margin: "2mm 0 0", fontSize: "10.5pt", color: C.body }}>{places.join(", ")}.</p>}
  </div>);
  add("facts", <div style={{ display: "flex", gap: "3mm", paddingTop: "5mm" }}>
    {[["Duration", duration || "—"], ...(places.length ? [["Places", places.length > 3 ? `${places.slice(0, 3).join(", ")} +${places.length - 3}` : places.join(", ")]] : []), ...(prices.length ? [["Starting from", `${inr(Math.min(...prices.map(p => p.price)))}`]] : [])].map(([k, v]) =>
      <div key={k} style={{ flex: 1, background: C.panel, borderRadius: "3mm", padding: "3mm 4mm" }}>
        <p style={{ margin: 0, fontSize: "6.8pt", letterSpacing: "0.18em", color: C.muted, textTransform: "uppercase" }}>{k}</p>
        <p style={{ margin: "1mm 0 0", fontWeight: 700, fontSize: "11.5pt", color: C.ink }}>{v}</p>
      </div>)}
  </div>);

  if (days.length) add("itinerary-heading", <Heading eyebrowText="Day by day" text="Your" accent="itinerary" />, true);
  days.forEach((d, i) => {
    const { title, chip: distance } = dayTitle(d.title);
    const { chips, rest } = splitFacts(descriptionBlocks(d.description));
    const label = String(d.day ?? i + 1).padStart(2, "0");
    add(`day-${i}`, <DayLine day={label} first last={!rest.length}>
      <p style={{ margin: "0 0 1.5mm", fontWeight: 700, fontSize: "12pt", color: C.ink, lineHeight: 1.25 }}>{title}</p>
      {(distance || chips.length > 0 || d.location) && <div style={{ marginBottom: "1.2mm" }}>
        {distance && <span style={chip()}>{distance}</span>}
        {chips.map((c, k) => <span key={k} style={chip(c.teal ? "teal" : "plain")}>{c.text}</span>)}
        {d.location && !chips.some(c => c.teal) && <span style={chip("teal")}>{d.location}</span>}
      </div>}
    </DayLine>, rest.length > 0);
    rest.forEach((b, k) => add(`day-${i}-${k}`, <DayLine last={k === rest.length - 1}>
      {b.bullet
        ? <p style={{ margin: "0 0 1mm", paddingLeft: "3.5mm", textIndent: "-3.5mm" }}><span style={{ color: C.teal }}>•&nbsp;</span>{b.text}</p>
        : <p style={{ margin: "0 0 1.4mm" }}>{b.text}</p>}
    </DayLine>));
  });

  if (included.length || excluded.length) add("included", <div style={{ display: "flex", gap: "4mm", paddingTop: "7mm" }}>
    {[["What's included", included, C.tealSoft, "✓", C.teal], ["Not included", excluded, C.panel, "✕", C.muted]].filter(([, list]) => list.length).map(([label, list, bg, mark, colour]) =>
      <div key={label} style={{ flex: 1, background: bg, borderRadius: "3mm", padding: "5mm 5mm 4mm" }}>
        <p style={{ margin: "0 0 2.5mm", fontWeight: 700, fontSize: "12pt", color: C.ink }}>{label}</p>
        {list.map((t, k) => <p key={k} style={{ margin: "0 0 1.4mm", paddingLeft: "4.5mm", textIndent: "-4.5mm", fontSize: "8.8pt" }}><span style={{ color: colour, fontWeight: 700 }}>{mark}&nbsp;&nbsp;</span>{t}</p>)}
      </div>)}
  </div>);

  if (prices.length) add("prices", <div style={{ paddingTop: "6mm" }}><div style={{ background: C.tealSoft, border: `0.3mm solid ${C.tealLine}`, borderRadius: "3mm", padding: "4mm 5mm", display: "flex", gap: "8mm" }}>
    {prices.map(p => <div key={p.name}>
      <p style={{ margin: 0, fontSize: "7pt", letterSpacing: "0.2em", color: C.teal, fontWeight: 700, textTransform: "uppercase" }}>{p.name}</p>
      <p style={{ margin: "0.5mm 0 0", fontSize: "16pt", fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>{inr(p.price)} <span style={{ fontSize: "8pt", fontWeight: 400, color: C.muted }}>/ person</span></p>
    </div>)}
    <p style={{ margin: "auto 0 0 auto", fontSize: "7.6pt", color: C.muted, maxWidth: "55mm", textAlign: "right" }}>Starting prices. Your exact quote depends on dates, travellers and hotels.</p>
  </div></div>);

  add("closing", <div style={{ paddingTop: "6mm" }}><div style={{ background: C.tealSoft, borderRadius: "3mm", padding: "5mm 6mm", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6mm" }}>
    <div>
      <p style={{ margin: 0, fontFamily: SERIF, fontSize: "17pt", color: C.ink }}>Ready to <span style={{ fontStyle: "italic", color: C.teal }}>begin?</span></p>
      <p style={{ margin: "1mm 0 0", fontSize: "8.4pt", color: C.body }}>Ask for your quotation on WhatsApp or call us. Full details: {tourUrl}</p>
      <p style={{ margin: "1mm 0 0", fontSize: "7.6pt", color: C.muted }}>Hotels and sightseeing are subject to availability and local conditions.</p>
    </div>
    <div style={{ textAlign: "right", fontSize: "8.6pt", color: C.ink, fontWeight: 700, lineHeight: 1.6, whiteSpace: "nowrap" }}>+91 90459 16770<br /><span style={{ fontWeight: 400, color: C.body }}>helpdesk@gokeys.in</span></div>
  </div></div>);
  return { blocks, name };
}

/**
 * Without `pages`: every block in one column, for measuring. With `pages` (block indexes per page, from
 * src/lib/downloadItinerary.js): A4 pages with the running header (from page 2) and the footer.
 */
export default function ItineraryPdf({ pages, ...props }) {
  const { blocks, name } = itineraryBlocks(props);
  if (!pages) return <div style={{ ...base, width: "210mm", boxSizing: "border-box", padding: `0 ${PAGE.side}mm`, background: "#fff" }}>
    <style>{FONTS}</style>
    {blocks.map(b => <div key={b.key} className="pdf-block">{b.node}</div>)}
  </div>;
  return <div style={{ ...base, width: "210mm" }}>
    <style>{FONTS}</style>
    {pages.map((indexes, p) => <div key={p} className="pdf-page" style={{ position: "relative", width: "210mm", height: `${PAGE.height}mm`, overflow: "hidden", boxSizing: "border-box",
      padding: `${PAGE.top}mm ${PAGE.side}mm ${PAGE.bottom}mm`, background: "#fff", pageBreakBefore: p ? "always" : "auto" }}>
      {p > 0 && <RunningHeader name={name} docNumber={props.docNumber} />}
      {indexes.map(i => <div key={blocks[i].key}>{blocks[i].node}</div>)}
      <Footer page={p + 1} total={pages.length} />
    </div>)}
  </div>;
}
