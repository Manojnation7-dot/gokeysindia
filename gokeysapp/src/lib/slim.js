// Card data for list pages. The API list endpoints send full records (content, itineraries,
// FAQs, whole destination articles...). Everything passed to a client component is copied
// into the page HTML, so list pages keep only the fields their cards use.

const plainText = (html, max) => {
  const text = (html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return max && text.length > max ? `${text.slice(0, max).trim()}...` : text;
};

const image = (img) =>
  img
    ? {
        image: img.image || null,
        optimized_card: img.optimized_card || null,
        alt_text: img.alt_text || "",
      }
    : null;

const tripTypes = (types) => (types || []).map((t) => ({ name: t.name, slug: t.slug }));

const pricing = (rows) =>
  (rows || []).map((p) => ({
    package_type: p.package_type,
    price: p.price,
    discount_price: p.discount_price,
  }));

// /tours list, best selling trips (home)
export const slimTour = (t) => ({
  id: t.id,
  name: t.name,
  slug: t.slug,
  duration_days: t.duration_days,
  duration_nights: t.duration_nights,
  base_price: t.base_price,
  meta_description: t.meta_description || plainText(t.content, 200),
  featured_image: image(t.featured_image),
  trip_types: tripTypes(t.trip_types),
  destinations: (t.destinations || []).map((d) => (typeof d === "string" ? d : d.slug)),
  pricing: pricing(t.pricing),
});

// /grouptour list (shows the start of the content as HTML), best selling group trips (home)
export const slimGroupTour = (t) => ({
  ...slimTour(t),
  content: t.content || "",
});

// Featured destinations (home), /destinations list
export const slimDestination = (d) => ({
  id: d.id,
  name: d.name,
  slug: d.slug,
  state: typeof d.state === "object" && d.state ? d.state.name : d.state,
  featured_image: image(d.featured_image),
});

// Sightseeing slider (home), /sightseeing list
export const slimPlace = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: plainText(p.description, 220),
  distance_from_center: p.distance_from_center,
  rating: p.rating,
  review_count: p.review_count,
  destination_name: p.destination_name || p.destination?.name || "",
  destination: p.destination ? { name: p.destination.name, slug: p.destination.slug } : null,
  category: p.category ? { name: p.category.name } : null,
  featured_image: image(p.featured_image),
});

// Travel stories (home), /blog list
export const slimPost = (p) => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  content: plainText(p.content, 220),
  published_date: p.published_date,
  categories: p.categories || [],
  cover_image_url: p.cover_image_url || null,
  cover_image: (p.cover_image || []).slice(0, 1).map(image),
});

// /hotels list
export const slimHotel = (h) => ({
  id: h.id,
  name: h.name,
  slug: h.slug,
  destination: h.destination,
  destination_slug: h.destination_slug,
  tariff_starting_from: h.tariff_starting_from,
  front_image_url: h.front_image_url,
});
