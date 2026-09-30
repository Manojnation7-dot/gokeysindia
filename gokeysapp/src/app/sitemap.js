import { CACHED } from "@/lib/api";

// Built from the API, cached for 5 minutes and refreshed when the admin saves
export const revalidate = 300;

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

  // List pages change when one of their items changes; the other static pages only
  // when their code changes, so they get no date (a date that is always "now" teaches
  // Google to ignore the dates of the whole sitemap)
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
  };

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

  return [
    ...staticPages,
    ...tours,
    ...blogs,
    ...destinations,
    ...groupTours,
    ...hotels,
    ...sightseeing,
  ];

  
}
