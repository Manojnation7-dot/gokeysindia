export async function fetchData(endpoint, slug = null, notFoundOnError = true) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";
  const url = slug ? `${apiUrl}/api/${endpoint}/${slug}/` : `${apiUrl}/api/${endpoint}/`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok && notFoundOnError) return null;
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);

  const data = await res.json();

  return data;
}

export async function fetchListData(endpoint, query = {}, notFoundOnError = false) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";

  const url = new URL(`${apiUrl}/api/${endpoint}/`);
  Object.entries(query).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok && notFoundOnError) return [];
  if (!res.ok) throw new Error(`Failed to fetch list: ${endpoint}`);

  return await res.json();
}