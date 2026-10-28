import { CACHED } from "@/lib/api";
import { getPageData } from "@/lib/calculatorApi";

// Built on every request from the API. The API calls themselves stay cached (CACHED, tag "api") and are refreshed at
// once when the admin saves (Django calls /api/revalidate with /sitemap.xml). (With "revalidate = 300" the sitemap was
// stored as a static file on Vercel and served for hours without refreshing; pages were not affected.)
export const dynamic = "force-dynamic";

// Last change to each page whose text is written in the code (not in the admin): the date of its last commit.
// Update the date when you change one of these pages, so Google re-reads it.
const STATIC_PAGE_DATES = {
  "/about": "2026-10-13",
  "/contact": "2026-10-10",
  "/cabs": "2026-10-28",
  "/terms-and-conditions": "2026-10-10",
  "/privacy-policy": "2026-10-10",
  "/cancellation-policy": "2026-10-10",
  "/char-dham-yatra-cost-calculator": "2026-10-26", // or the last rate change, if later (below)
  "/services/taxi-service-haridwar": "2026-10-13",
  "/services/uttarakhand-tour-operators": "2026-10-13",
  "/services/travel-agency-haridwar": "2026-10-28",
  "/services/char-dham-yatra-operators-haridwar": "2026-10-13",
  "/services/hotel-booking-uttarakhand": "2026-10-13",
  "/services/delhi-to-haridwar-cab": "2026-10-13",
  "/services/haridwar-railway-station-taxi": "2026-10-13",
  "/services/haridwar-to-dehradun-taxi": "2026-10-13",
  "/services/haridwar-to-rishikesh-taxi": "2026-10-13",
};
const dateOf = (iso) => ({ lastModified: new Date(`${iso}T12:00:00+05:30`) }); // midday in India: the same date in UTC

export default async function sitemap() {
  const BASE_URL = "https://gokeys.in"; 
 

  async function fetchUrls(endpoint, prefix, priority, freq) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";
      const res = await fetch(`${apiUrl}${endpoint}`, CACHED);

      if (!res.ok) return [];

      const data = await res.json();

      return data.map((item) => ({
        // Hotels live under their destination: /hotels/<destination>/<hotel>
        url: item.destination_slug
          ? `${BASE_URL}/${prefix}/${item.destination_slug}/${item.slug}`
          : `${BASE_URL}/${prefix}/${item.slug}`,
        ...(item.updated_at ? { lastModified: new Date(item.updated_at) } : {}),
        changeFrequency: freq,
        priority: priority,
      }));
    } catch (err) {
      console.error("Sitemap fetch error:", endpoint, err);
      return [];
    }
  }

  // Dynamic URLs from Django
  const tours = await fetchUrls("/api/sitemap/tours", "tours", 0.9, "weekly");
  const blogs = await fetchUrls("/api/sitemap/blogs", "blog", 0.7, "monthly");
  const blogCategories = await fetchUrls("/api/sitemap/blog-categories", "blog/category", 0.6, "weekly");
  const destinations = await fetchUrls(
    "/api/sitemap/destinations",
    "destinations",
    0.8,
    "monthly"
  );
  const groupTours = await fetchUrls(
    "/api/sitemap/group-tours",
    "grouptour",
    0.8,
    "weekly"
  );
  const hotels = await fetchUrls("/api/sitemap/hotels", "hotels", 0.6, "monthly");
  const sightseeing = await fetchUrls(
    "/api/sitemap/sightseeing",
    "sightseeing",
    0.6,
    "monthly"
  );

  // List pages change when one of their items changes; the other static pages only when their code changes, so they
  // get the fixed date above (never "now": a date that is always "now" teaches Google to ignore the whole sitemap's dates)
  const newest = (items) => {
    const times = items.map((i) => i.lastModified?.getTime()).filter(Boolean);
    return times.length ? { lastModified: new Date(Math.max(...times)) } : {};
  };
  const listDates = {
    "": newest([...tours, ...blogs, ...groupTours]),
    "/tours": newest(tours),
    "/blog": newest(blogs),
    "/destinations": newest(destinations),
    "/grouptour": newest(groupTours),
    "/hotels": newest(hotels),
    "/sightseeing": newest(sightseeing),
    ...Object.fromEntries(Object.entries(STATIC_PAGE_DATES).map(([path, iso]) => [path, dateOf(iso)])),
  };
  // The calculator page shows live prices: it changes when a rate changes in the admin too.
  const calc = listDates["/char-dham-yatra-cost-calculator"];
  const ratesUpdated = (await getPageData())?.rates_updated;
  if (ratesUpdated && new Date(ratesUpdated) > calc.lastModified) calc.lastModified = new Date(ratesUpdated);

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/tours",
    "/destinations",
    "/blog",
    "/cabs",
    "/grouptour",
    "/hotels",
    "/sightseeing",
    "/terms-and-conditions",
    "/privacy-policy",
    "/cancellation-policy",
    "/char-dham-yatra-cost-calculator",
    "/services/taxi-service-haridwar",
    "/services/uttarakhand-tour-operators",
    "/services/travel-agency-haridwar",
    "/services/char-dham-yatra-operators-haridwar",
    "/services/hotel-booking-uttarakhand",
    "/services/delhi-to-haridwar-cab",
    "/services/haridwar-railway-station-taxi",
    "/services/haridwar-to-dehradun-taxi",
    "/services/haridwar-to-rishikesh-taxi",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    ...(listDates[path] || {}),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  // Hotel city pages (/hotels/<city>): the cities that have hotels, dated by their newest hotel
  const hotelCities = new Map();
  for (const hotel of hotels) {
    const city = hotel.url.slice(`${BASE_URL}/hotels/`.length).split("/")[0];
    const time = hotel.lastModified?.getTime() || 0;
    if (city && time >= (hotelCities.get(city) || 0)) hotelCities.set(city, time);
  }
  const hotelCityPages = [...hotelCities].map(([city, time]) => ({
    url: `${BASE_URL}/hotels/${city}`,
    ...(time ? { lastModified: new Date(time) } : {}),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...hotelCityPages,
    ...tours,
    ...blogCategories,
    ...blogs,
    ...destinations,
    ...groupTours,
    ...hotels,
    ...sightseeing,
  ];

  
}
