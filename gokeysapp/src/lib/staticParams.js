import { CACHED } from "@/lib/api";

// Slugs of every live page, from Django's light sitemap endpoints (slug + dates only), so all detail pages are
// built at deploy time instead of on their first visit. If the API can't be reached the build still succeeds:
// pages are then built on their first visit (dynamicParams stays true).
const API_BASE = () => process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";

async function sitemapRows(type) {
  try {
    const res = await fetch(`${API_BASE()}/api/sitemap/${type}`, CACHED);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.filter((row) => row?.slug) : [];
  } catch {
    return [];
  }
}

/** [{ slug }] for tours, group-tours, destinations, sightseeing or blogs. */
export async function slugParams(type) {
  return (await sitemapRows(type)).map((row) => ({ slug: row.slug }));
}

/** [{ destination, slug }] for /hotels/[destination]/[slug]. */
export async function hotelParams() {
  return (await sitemapRows("hotels")).filter((row) => row.destination_slug).map((row) => ({ destination: row.destination_slug, slug: row.slug }));
}

/** [{ destination }] for /hotels/[destination]: destinations that have hotels. */
export async function hotelDestinationParams() {
  const slugs = new Set((await hotelParams()).map((row) => row.destination));
  return [...slugs].map((destination) => ({ destination }));
}
