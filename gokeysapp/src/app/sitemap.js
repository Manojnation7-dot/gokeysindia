export default async function sitemap() {
  const BASE_URL = "https://gokeys.in"; 
  

  async function fetchUrls(endpoint, prefix, priority, freq) {
    try {
      const res = await fetch(`https://api.gokeys.in${endpoint}`, {
        cache: "no-store",
      });

      if (!res.ok) return [];

      const data = await res.json();

      return data.map((item) => ({
        url: `${BASE_URL}/${prefix}/${item.slug}`,
        lastModified: item.updated_at
          ? new Date(item.updated_at)
          : new Date(),
        changeFrequency: freq,
        priority: priority,
      }));
    } catch (err) {
      console.error("Sitemap fetch error:", endpoint, err);
      return [];
    }
  }

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/tours",
    "/destinations",
    "/blogs",
    "/cabs",
    "/grouptour",
    "/hotels",
    "/sightseeing",
    "/terms-and-conditions",
    "/privacy-policy",
    "/cancellation-policy",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

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
