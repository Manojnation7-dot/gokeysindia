import { fetchData } from "@/lib/api";
import { slimPost } from "@/lib/slim";

// Blog archive pages (/blog and /blog/category/<slug>): 24 posts a page, ?page=N from page 2 on.
export const BLOG_PAGE_SIZE = 24;

// The page number asked for: a whole number from 1, else null (?page=abc, ?page=0, ?page=1.5)
export function requestedPage(searchParams) {
  const raw = searchParams?.page;
  if (raw === undefined) return 1;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && String(raw) === String(n) ? n : null;
}

export const pageHref = (base, n) => (n <= 1 ? base : `${base}?page=${n}`);
export const withPage = (text, page) => (page > 1 ? `${text} – Page ${page}` : text);

// One page of live posts, newest first (optionally one category). null when that page does not exist.
export async function getBlogPage(page, category) {
  const query = `page=${page}&page_size=${BLOG_PAGE_SIZE}${category ? `&category=${encodeURIComponent(category)}` : ""}`;
  const data = await fetchData(`blogs/?${query}`);
  if (!data) return null;
  const totalPages = Math.max(1, Math.ceil((data.count || 0) / BLOG_PAGE_SIZE));
  return { posts: (data.results || []).map(slimPost), count: data.count || 0, totalPages };
}

// Categories that have published posts (the chips on /blog), in admin order. [] if the API fails.
export async function getBlogCategories() {
  const data = await fetchData("blog-categories");
  return Array.isArray(data) ? data : [];
}

export const getBlogCategory = (slug) => fetchData("blog-categories", slug);
