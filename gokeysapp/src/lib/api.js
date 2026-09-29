const API_BASE = () => process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";

// "tours" -> /api/tours/ ; "blogs/?page=2" -> /api/blogs/?page=2 ;
// "tours/x?preview=t" -> /api/tours/x/?preview=t (Django URLs end with a slash)
function apiUrl(endpoint, slug = null) {
  const full = slug ? `${endpoint}/${slug}` : endpoint;
  const [path, query] = full.split(/\?(.*)/s);
  return `${API_BASE()}/api/${path.replace(/\/$/, "")}/${query ? `?${query}` : ""}`;
}

export async function fetchData(endpoint, slug = null, notFoundOnError = true) {
  const url = apiUrl(endpoint, slug);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok && notFoundOnError) return null;
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);

  const data = await res.json();

  return data;
}

export async function fetchListData(endpoint, query = {}, notFoundOnError = false) {
  const url = new URL(`${API_BASE()}/api/${endpoint}/`);
  Object.entries(query).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok && notFoundOnError) return [];
  if (!res.ok) throw new Error(`Failed to list: ${endpoint}`);

  return await res.json();
}

// Every item of a paginated list endpoint (follows "next" pages, 100 per request).
// Returns [] if the API fails, so a list page never crashes.
export async function fetchAllResults(endpoint, query = {}) {
  const url = new URL(`${API_BASE()}/api/${endpoint}/`);
  Object.entries({ ...query, page_size: 100 }).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const items = [];
  let next = url.toString();
  for (let page = 0; next && page < 20; page++) {
    const res = await fetch(next, { cache: "no-store" });
    if (!res.ok) break;
    const data = await res.json();
    if (Array.isArray(data)) return data; // endpoint without pagination
    items.push(...(data.results || []));
    next = data.next;
  }
  return items;
}

// Items from either a paginated ({results: [...]}) or plain list response
export function asList(data) {
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.results) ? data.results : [];
}
