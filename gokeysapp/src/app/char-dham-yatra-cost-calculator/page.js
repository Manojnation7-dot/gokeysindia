import Link from "next/link";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSEO from "@/components/SmartSEO";
import CostCalculator from "@/components/calculator/CostCalculator";
import { Breadcrumbs, FaqList } from "@/components/ui/kit";
import { buildMetadata, SITE_URL } from "@/lib/seoHelpers";
import { buildBreadcrumbList, buildFAQSchema } from "@/lib/seoSchemas";
import {
  CALC_PATH, defaultInput, getConfig, getPageData, getQuoteServer, holidayText, inr, monthYear,
} from "@/lib/calculatorApi";

// Content: CALCULATOR_PAGE_CONTENT.md. Every price on this page comes from the calculator API (Django rate card run
// through the pricing engine), so the page stays right when a rate is edited in admin. Cached for an hour; a rate
// save in admin clears the cache at once.
export const revalidate = 3600;

const TITLE = (year) => `Char Dham Yatra Cost Calculator ${year} | Price Per Person`;
const DESCRIPTION = (year) =>
  `Calculate your Char Dham Yatra ${year} cost per person from Haridwar or Delhi. Pick group size, car and hotels for an instant price. No sign-up.`;

export async function generateMetadata() {
  const data = await getPageData();
  const year = data?.year || 2027;
  return buildMetadata({
    title: TITLE(year), description: DESCRIPTION(year), path: CALC_PATH,
    image: `${CALC_PATH}/opengraph-image`, imageAlt: `Char Dham Yatra Cost ${year}`, // share card with the live price
  });
}

async function loadPage() {
  const [config, data] = await Promise.all([getConfig(), getPageData()]);
  if (!config || !data) {
    // While the site is regenerated, an error keeps the last good page online. Only the very first build (before
    // the backend has the calculator) renders the fallback below.
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw new Error("Calculator API unavailable");
    return { config, data, input: null, quote: null };
  }
  const input = defaultInput(config); // Char Dham, Haridwar, 4 adults, Standard, season opening + 11 days
  return { config, data, input, quote: await getQuoteServer(input) };
}

// ---------------------------------------------------------------- page parts
function Section({ id, title, intro, children, tone = "white" }) {
  return (
    <section id={id} className={`${tone === "mist" ? "bg-mist" : "bg-white"} py-10 md:py-14`}>
      <div className="gk-wrap max-w-4xl!">
        <h2 className="gk-h2">{title}</h2>
        {intro && <p className="gk-lead mt-3">{intro}</p>}
        <div className="mt-6 space-y-6">{children}</div>
      </div>
    </section>
  );
}

function Table({ head, rows, caption, firstColWide = false }) {
  return (
    <div className="gk-panel overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-mist text-ink">
            {head.map((h, i) => (
              <th key={i} scope="col" className={`px-4 py-3 font-bold ${i === 0 && firstColWide ? "w-2/5" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t border-line">
              {row.map((cell, c) => c === 0
                ? <th key={c} scope="row" className="px-4 py-3 font-semibold text-ink">{cell}</th>
                : <td key={c} className="px-4 py-3 tabular-nums text-slate-ink">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Note = ({ children }) => <p className="text-sm italic text-slate-ink">{children}</p>;

// ---------------------------------------------------------------- page
export default async function CostCalculatorPage() {
  const { config, data, input, quote } = await loadPage();
  const year = data?.year || 2027;
  const pagePath = CALC_PATH;

  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Char Dham Cost Calculator", url: pagePath },
  ]);
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}${pagePath}#calculator`,
    name: "Char Dham Yatra Cost Calculator",
    url: `${SITE_URL}${pagePath}`,
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: { "@type": "TravelAgency", name: "Gokeys India", url: SITE_URL },
  };

  if (!data || !config) {
    return (
      <>
        <Header />
        <main className="gk-calc-page bg-mist">
          <div className="gk-wrap py-12">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Char Dham Cost Calculator" }]} />
            <h1 className="gk-h1">Char Dham Yatra Cost Calculator {year}</h1>
            <p className="gk-lead mt-4 max-w-2xl">
              The calculator is being updated. Send us your dates and group size on{" "}
              <a className="font-bold text-teal underline" href="https://wa.me/917830718687">WhatsApp</a> for the exact price.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const f = data.figures;
  const gst = Number(data.gst_pct);
  const days = data.trip_days;
  const rows = Object.fromEntries(data.per_person.map((r) => [r.people, r]));
  const range = (a, b) => `${inr(a)}–${inr(b).replace("₹", "")}`;
  const ex = data.worked_example;
  const h = data.hotels;
  const k = data.kedarnath;
  const holidays = holidayText(data.holidays);
  const yatra = Object.fromEntries(data.yatras.map((y) => [y.slug, y]));
  const cityName = { haridwar: "Haridwar / Rishikesh", "dehradun-airport": "Dehradun airport", delhi: "Delhi" };
  const ratesUpdated = monthYear(data.rates_updated);

  const faqs = [
    {
      question: "How much does Char Dham Yatra cost per person?",
      answer: `From Haridwar, a ${days}-day Char Dham Yatra with Standard hotels costs about ${inr(f.standard_min)}–${inr(f.standard_max)} per person plus ${gst}% GST, depending on group size and month. Use the calculator for your exact dates.`,
    },
    {
      question: "What is the Char Dham Yatra cost for 2 persons?",
      answer: `About ${inr(f.couple_peak_total)} in total (${inr(f.couple_peak_each)} each) in May–June and ${inr(f.couple_sept_oct_total)} in September–October, with a ${rows[2]?.vehicle || "Dzire"} and Standard hotels.`,
    },
    {
      question: "What is the Char Dham Yatra cost for a family of 4?",
      answer: `About ${inr(f.family4_peak_total)} in May–June and ${inr(f.family4_sept_oct_total)} in September–October with Standard hotels, before GST.`,
    },
    {
      question: "Why is May–June more expensive?",
      answer: "It is the busiest time of the season, so vehicle rates are highest. Hotel rates are the same in May–June and September–October.",
    },
    { question: "Is GST included in the price?", answer: `No. GST of ${gst}% is added on top and shown separately.` },
    {
      question: "Are meals included at Kedarnath?",
      answer: "No. The Kedarnath camp or guest house is room only. Breakfast and dinner are included at every other hotel.",
    },
    {
      question: "Do children pay for Char Dham Yatra?",
      answer: "Children aged 8 and above pay the adult price, children aged 5–7 pay half, and children under 5 travel free.",
    },
    {
      question: "Are pony and palki charges included?",
      answer: "No. Ponies and palkis at Yamunotri and Kedarnath are hired locally at the official counters and paid directly.",
    },
    {
      question: "How many days are needed for Char Dham Yatra from Haridwar?",
      answer: `${days} days. You can add 1 or 2 rest days in the calculator, which is useful for senior citizens.`,
    },
    {
      question: "Is Char Dham Yatra cheaper from Haridwar or Delhi?",
      answer: `From Haridwar or Rishikesh. Starting from Delhi adds a cab to Haridwar and back, about ${range(f.delhi_extra_min, f.delhi_extra_max)} for a small group.`,
    },
  ];

  const links = [
    { href: yatra["char-dham"]?.package_url, label: "Char Dham package from Haridwar" },
    { href: yatra["do-dham"]?.package_url, label: "Do Dham package" },
    { href: yatra.kedarnath?.package_url, label: "Kedarnath package" },
    { href: yatra.badrinath?.package_url, label: "Badrinath package" },
    { href: yatra["gangotri-yamunotri"]?.package_url, label: "Gangotri Yamunotri package" },
    { href: "/blog/char-dham-yatra-2027", label: `Char Dham Yatra ${year} dates and registration guide` },
    { href: "/blog/route-map-of-char-dham-yatra", label: "Char Dham route map" },
    { href: "/blog/char-dham-yatra-with-elderly-parents", label: "Char Dham with elderly parents" },
    { href: "/blog/char-dham-yatra-cost-from-haridwar", label: "Char Dham cost guide" },
  ].filter((l) => l.href);

  return (
    <>
      <Header />
      <SmartSEO schema={[webAppSchema, buildFAQSchema(faqs, pagePath), breadcrumbSchema]} />
      {/* gk-calc-page hides the site's floating WhatsApp button (globals.css): the price bar has its own */}
      <main className="gk-calc-page bg-mist">
        {/* 3.1 H1 and intro */}
        <section className="gk-wrap pt-8 pb-6 md:pt-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Char Dham Cost Calculator" }]} />
          <h1 className="gk-h1">Char Dham Yatra Cost Calculator {year}</h1>
          {ratesUpdated && <p className="mt-3 text-xs font-semibold text-slate-ink">Rates updated: {ratesUpdated}</p>}
          <p className="gk-lead mt-4 max-w-3xl">
            Find out what your Char Dham Yatra will cost before you book. Choose your trip, travel date, group size, vehicle
            and hotel category, and the calculator works out the price per person from Gokeys&apos; current rates in Haridwar.
            It includes your cab, hotels with breakfast and dinner, and the stay at Kedarnath, so the figure is close to what
            you will actually pay.
          </p>
        </section>

        {/* 3.2 The calculator */}
        <section className="gk-wrap pb-10" aria-label="Cost calculator">
          <CostCalculator config={config} initialInput={input} initialQuote={quote} />
        </section>

        {/* 3.3 Quick answer */}
        <section className="gk-wrap pb-12">
          <div className="max-w-4xl rounded-2xl border-l-4 border-sun bg-white p-6 shadow-sm md:p-8">
            <h2 className="gk-h3">How much does Char Dham Yatra cost in {year}?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">
              A {days}-day Char Dham Yatra from Haridwar costs about{" "}
              <strong>{inr(f.standard_min)} to {inr(f.standard_max)} per person</strong> with Standard hotels, plus {gst}% GST.
              Groups of 6 travelling in September–October pay the least (about {inr(f.six_sept_oct_each)} each); a couple
              travelling in May–June pays the most (about {inr(f.couple_peak_each)} each). Deluxe hotels add roughly{" "}
              {range(f.deluxe_extra_min, f.deluxe_extra_max)} per person.
            </p>
          </div>
        </section>

        {/* 3.4 Per person */}
        <Section
          id="cost-per-person"
          title={`Char Dham Yatra cost per person in ${year}`}
          intro={`The biggest factor is how many people share the vehicle and rooms. Prices are per person for the full ${days}-day yatra from Haridwar, Standard hotels, before GST.`}
        >
          <Table
            caption="Char Dham Yatra cost per person by group size and season"
            head={["Group size", "Vehicle", "May–June", "Sept–Oct", "July–Aug"]}
            rows={data.per_person.map((r) => [
              `${r.people} people`, r.vehicle.replace(/ \(\d+\)$/, ""), inr(r.standard_peak), inr(r.standard_sept_oct), inr(r.standard_monsoon),
            ])}
          />
          <p className="gk-lead">
            Deluxe hotels, same yatra (May–June):{" "}
            {data.per_person.map((r) => `${r.people} people ${inr(r.deluxe_peak)}`).join(" · ")} per person.
          </p>
          <Note>
            For a family of 4, the Char Dham Yatra costs about {inr(f.family4_peak_total)} in May–June ({inr(f.family4_peak_each)} each)
            with Standard hotels. For 2 persons it is about {inr(f.couple_peak_total)} in total.
          </Note>
        </Section>

        {/* 3.5 Breakdown */}
        <Section
          id="cost-breakdown"
          tone="mist"
          title="Char Dham Yatra cost breakdown: where the money goes"
          intro="A Char Dham package has four parts. The calculator prices each one for your exact dates."
        >
          <Table
            caption="Parts of a Char Dham Yatra package"
            firstColWide={false}
            head={["Part", "What it covers", "How it is charged"]}
            rows={[
              ["Vehicle", "Cab or tempo for every day of the trip with driver, fuel, tolls, parking and permits", "Per day, by season"],
              ["Hotels", "Rooms with breakfast and dinner at Barkot, Uttarkashi, Phata/Guptkashi, Badrinath and Pipalkoti", "Per room per night; per person in July–August"],
              ["Kedarnath stay", "GMVN camp (Standard) or guest house (Deluxe/Luxury), room only", "Per bed"],
              ["Your own costs", "Lunch, pony or palki, puja and donations, extra sightseeing", "Paid by you on the way"],
            ]}
          />

          <h3 className="gk-h3 pt-2">Char Dham taxi fare and tempo traveller price</h3>
          <p className="gk-lead">
            Vehicle cost for the {days}-day Char Dham Yatra, all inclusive (driver allowance, fuel, tolls, parking, permits).
          </p>
          <Table
            caption={`Vehicle cost for the ${days}-day Char Dham Yatra`}
            head={["Vehicle", "Seats", "May–June", "Sept–Oct", "July–Aug"]}
            rows={data.vehicles.map((v) => [v.name.replace(/ \(\d+\)$/, ""), v.seats, inr(v.peak), inr(v.sept_oct), inr(v.monsoon)])}
          />
          <Note>
            1–14 September is 5% below the Sept–Oct rate.
            {holidays && ` Vehicle rates go up to May–June levels on the Gandhi Jayanti and Dussehra long weekends (${holidays}).`}
          </Note>

          <h3 className="gk-h3 pt-2">Char Dham hotel cost and Kedarnath stay</h3>
          <Table
            caption="Char Dham hotel cost per night"
            firstColWide
            head={["Hotels per night (breakfast + dinner)", "May–June and Sept–Oct", "July–Aug and Nov"]}
            rows={[
              ["Standard, double room", inr(h.peak_standard?.double), lowStandard(h)],
              ["Standard, triple room", inr(h.peak_standard?.triple), lowStandard(h)],
              ["Standard, four-bed room", inr(h.peak_standard?.four_bed), lowStandard(h)],
              ["Deluxe, double room", inr(h.peak_deluxe?.double), roomRate(h.low_deluxe?.double)],
              ["Deluxe, triple room", inr(h.peak_deluxe?.triple), roomRate(h.low_deluxe?.triple)],
              ["Luxury", `from about ${inr(h.peak_luxury?.double)}, confirmed on request`, "on request"],
            ]}
          />
          <Table
            caption="Kedarnath stay price"
            firstColWide
            head={["Kedarnath stay (room only, no meals)", "Price"]}
            rows={[
              ["Standard: GMVN camp", `${inr(k.standard?.per_bed)} per bed`],
              [`Deluxe: guest house, ${k.deluxe?.beds_per_room}-bed rooms`,
                `${inr(k.deluxe?.per_bed)} per bed (a couple takes the whole room: ${inr(k.deluxe?.per_bed * k.deluxe?.beds_per_room)})`],
              [`Luxury: ${k.luxury?.beds_per_room}-bed rooms`, `${inr(k.luxury?.per_bed)} per bed`],
            ]}
          />
          <Note>Hotel prices on the Char Dham route stay the same on holidays and long weekends.</Note>
        </Section>

        {/* 3.6 Start city */}
        <Section
          id="cost-by-start-city"
          title="Char Dham Yatra cost from Haridwar, Rishikesh, Dehradun and Delhi"
          intro={`The yatra starts and ends in Haridwar. From Rishikesh the price is the same. From Dehradun airport add ₹500 for the pickup. From Delhi, a separate cab takes you to Haridwar and back, so the price rises by ${range(f.delhi_extra_min, f.delhi_extra_max)} for a small group.`}
        >
          <Table
            caption="Char Dham Yatra cost per person by starting city, Standard hotels, May–June"
            head={["Starting from", "2 people", "4 people", "6 people"]}
            rows={data.start_cities.map((c) => [cityName[c.slug] || c.slug, inr(c["2"]), inr(c["4"]), inr(c["6"])])}
          />
        </Section>

        {/* 3.7 Other yatras */}
        <Section
          id="other-yatras"
          tone="mist"
          title="Cost of Do Dham, Kedarnath, Badrinath and Gangotri–Yamunotri yatras"
          intro="Per person from Haridwar, Standard hotels, before GST."
        >
          <Table
            caption="Yatra cost per person"
            head={["Yatra", "Days", "2 people (May–June)", "4 people (May–June)", "4 people (Sept–Oct)"]}
            rows={data.yatras.map((y) => [
              y.package_url ? <Link key={y.slug} href={y.package_url} className="text-teal underline underline-offset-2 hover:text-ink">{y.name}</Link> : y.name,
              y.days, inr(y.two_peak), inr(y.four_peak), inr(y.four_sept_oct),
            ])}
          />
          <Note>
            A Kedarnath trip for 2 persons costs about {inr(f.kedarnath_couple_total)} in May–June with Standard stays, or about{" "}
            {inr(f.kedarnath_couple_deluxe_total)} with a Deluxe guest house at Kedarnath. A Kedarnath–Badrinath Do Dham for a couple
            in September costs about {inr(f.do_dham_couple_sept_total)} in total.
          </Note>
        </Section>

        {/* 3.8 Cheapest month */}
        <Section id="cheapest-month" title="Which month is cheapest for Char Dham Yatra?">
          <Table
            caption="Char Dham Yatra price level by month"
            head={["Period", "Price level", "What to know"]}
            rows={[
              ["Opening (May) – 19 June", "Highest", "Peak rush, school holidays; book early"],
              ["20 – 30 June", "Lower vehicle rates", "Before the monsoon sets in fully"],
              ["July – August", "Lowest", "Monsoon: landslides and road closures are common; keep spare days"],
              ["1 – 14 September", "Low", "Vehicles 5% below Sept–Oct rates"],
              ["15 September – October", "Medium", "Clear weather; vehicles cost more on the 1–3 and 8–10 October long weekends"],
              ["November (until closing)", "Low", "Cold; temples close for winter around Diwali"],
            ]}
          />
          <Note>
            Example: a family of 4 starting on {dayMonth(data.long_weekend.early)} pays about{" "}
            {inr(data.long_weekend.difference)} more per person than one starting on {dayMonth(data.long_weekend.late)}, because{" "}
            {numberWord(data.long_weekend.peak_days)} of their days fall on the Gandhi Jayanti long weekend.
          </Note>
        </Section>

        {/* 3.9 Worked example */}
        <Section
          id="family-example"
          tone="mist"
          title="Example: what a family of 5 actually pays"
          intro={`4 adults (including 2 parents over 60) and 1 child aged 6, Char Dham from Haridwar, starting ${longDate(ex.start_date)}, Ertiga, Standard hotels.`}
        >
          <Table
            caption="Char Dham Yatra cost for a family of 5"
            firstColWide
            head={["Item", "Amount"]}
            rows={[
              [`Ertiga, ${ex.days} days`, inr(ex.vehicle)],
              [`Hotels, ${ex.nights} nights (one four-bed room + child) incl. Kedarnath camp`, inr(ex.hotels)],
              [<strong key="t">Total before GST</strong>, <strong key="v" className="text-ink">{inr(ex.total)}</strong>],
              [`GST (${gst}%)`, inr(ex.gst)],
              ["Per adult (child pays half)", `about ${inr(ex.per_adult)}`],
              ["Paid on the way", "lunch, pony or palki if needed, puja"],
            ]}
          />
        </Section>

        {/* 3.10 Ways to save */}
        <Section id="save-money" title="7 ways to lower your Char Dham Yatra cost">
          <ol className="list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-slate-ink marker:font-bold marker:text-ink">
            <li><strong className="text-ink">Travel with 4–6 people.</strong> A couple pays about {inr(f.couple_peak_each)} each; six people sharing an Ertiga pay about {inr(f.six_peak_each)} each.</li>
            <li><strong className="text-ink">Go in September or October</strong> instead of May–June, and avoid the two October long weekends.</li>
            <li><strong className="text-ink">Choose the right vehicle.</strong> An Ertiga or Innova for 6–7 people costs much less than two small cars.</li>
            <li><strong className="text-ink">Share rooms.</strong> Triple and four-bed rooms cost less per person than doubles.</li>
            <li><strong className="text-ink">Start from Haridwar or Rishikesh.</strong> Coming by train saves the Delhi cab cost.</li>
            <li><strong className="text-ink">Pick Standard hotels.</strong> On this route they are clean and simple; the difference to Deluxe is about {range(f.deluxe_extra_min, f.deluxe_extra_max)} per person.</li>
            <li><strong className="text-ink">Do Do Dham</strong> (Kedarnath + Badrinath) in {yatra["do-dham"]?.days || 6} days if you are short on time or budget: about {inr(f.do_dham_four_peak_each)} per person for 4 people.</li>
          </ol>
        </Section>

        {/* 3.11 How it works */}
        <Section id="how-it-works" tone="mist" title="How this calculator works">
          <p className="gk-lead">
            Gokeys India is a registered travel agency in Haridwar that has run Char Dham yatras for over 10 years. The
            calculator uses the same rates our team quotes from: vehicle rates for each season, hotel rates on the route, and
            the Kedarnath camp and guest-house rates. Each day of your trip is priced by its date, so a trip that starts in late
            June or runs into a long weekend is priced correctly. The range you see allows about 10% for hotel availability and
            exact dates. Send the estimate on WhatsApp and we reply with the final price and hotel names.
          </p>
          <ul className="grid gap-2 text-sm text-ink sm:grid-cols-2">
            {[
              `${days}-day route Haridwar → Barkot → Uttarkashi → Phata → Kedarnath → Badrinath → Pipalkoti → Haridwar`,
              "Breakfast and dinner included except at Kedarnath",
              `GST ${gst}% extra`,
              "Children 5–7 half price, under 5 free",
            ].map((a) => (
              <li key={a} className="gk-panel flex gap-2 p-3"><span aria-hidden="true" className="text-teal">✓</span>{a}</li>
            ))}
          </ul>
        </Section>

        {/* 3.12 FAQ */}
        <Section id="faq" title="Frequently asked questions">
          <FaqList items={faqs} white={false} />
        </Section>

        {/* 3.13 Hindi (not in the FAQ schema) */}
        <Section id="hindi" tone="mist" title="हिंदी में जानकारी">
          <div lang="hi" className="space-y-5 text-[15px] leading-relaxed text-slate-ink">
            <div>
              <h3 className="font-bold text-ink">चार धाम यात्रा में कितना खर्चा आता है?</h3>
              <p className="mt-1">
                हरिद्वार से {days} दिन की चार धाम यात्रा का खर्च स्टैंडर्ड होटल के साथ लगभग {inr(f.standard_min)} से {inr(f.standard_max)} प्रति
                व्यक्ति आता है ({gst}% GST अलग)। 4–6 लोगों के ग्रुप में और सितंबर–अक्टूबर में खर्च सबसे कम होता है।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink">2 लोगों के लिए केदारनाथ यात्रा का खर्च कितना है?</h3>
              <p className="mt-1">
                हरिद्वार से {yatra.kedarnath?.days || 4} दिन की केदारनाथ यात्रा का खर्च 2 लोगों के लिए लगभग {inr(f.kedarnath_couple_total)} (मई–जून, स्टैंडर्ड) आता है।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink">क्या केदारनाथ में खाना शामिल है?</h3>
              <p className="mt-1">नहीं, केदारनाथ में केवल कमरा / टेंट शामिल है। बाकी सभी होटलों में नाश्ता और रात का खाना शामिल है।</p>
            </div>
          </div>
        </Section>

        {/* 3.14 Internal links */}
        <Section id="plan-your-yatra" title="Plan your yatra">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="gk-panel flex h-full items-center justify-between gap-3 p-4 text-sm font-bold text-ink transition hover:border-ink">
                  {l.label}<span aria-hidden="true" className="text-teal">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}

// ---------------------------------------------------------------- formatting helpers
function lowStandard(h) {
  return h.low_standard?.per_person ? `${inr(h.low_standard.per_person)} per person` : "on request";
}

function roomRate(v) {
  return v ? inr(v) : "on request";
}

function longDate(isoDate) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

const dayMonth = (isoDate) => longDate(isoDate).replace(/ \d{4}$/, "");

function numberWord(n) {
  return ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ?? String(n);
}
