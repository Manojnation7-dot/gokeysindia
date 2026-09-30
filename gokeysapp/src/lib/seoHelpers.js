export const SITE_URL = "https://gokeys.in";
export const SITE_NAME = "Gokeys India"; // same name as the WebSite schema (Google site name)
export const TITLE_SUFFIX = ` | ${SITE_NAME}`; // added by the title template in layout.js
export const TWITTER_HANDLE = "@gokeys4";
export const DEFAULT_IMAGE = "/images/gokeyslogo.png"; // 512 x 512
const TITLE_LIMIT = 60; // Google cuts longer titles

const absoluteUrl = (url) =>
  url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

// "<title> | Gokeys India", or the title alone when it already names the brand
// or would become too long with the suffix
export function pageTitle(title) {
  if (!title) return undefined;
  const clean = title.trim();
  if (/gokeys/i.test(clean) || (clean + TITLE_SUFFIX).length > TITLE_LIMIT) {
    return { absolute: clean };
  }
  return clean;
}

// Meta tags for every page: title, description, canonical, Open Graph and Twitter.
// Pages set their own openGraph/twitter objects, which replace the ones from layout.js
// completely (Next.js does not merge them), so site-wide values are repeated here.
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  imageAlt,
  canonical, // admin "Canonical URL" (only when this page is a copy of another page)
  noindex = false, // admin "Hide from Google", or a draft preview
  type = "website", // "article" for blog posts
  publishedTime,
  modifiedTime,
  section,
  tags,
  keywords,
}) {
  const canonicalUrl = new URL(path, SITE_URL);
  canonicalUrl.pathname = canonicalUrl.pathname.replace(/\/+$/, "") || "/";
  canonicalUrl.hash = "";
  const shareImage = absoluteUrl(image || DEFAULT_IMAGE);
  const isLogo = shareImage.endsWith(DEFAULT_IMAGE);
  const socialTitle = title?.trim();

  return {
    title: pageTitle(title),
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: canonical || canonicalUrl.href,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: socialTitle,
      description,
      url: canonicalUrl.href,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [
        {
          url: shareImage,
          alt: imageAlt || socialTitle,
          ...(isLogo ? { width: 512, height: 512 } : {}),
        },
      ],
      ...(type === "article"
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
            ...(section ? { section } : {}),
            ...(tags?.length ? { tags } : {}),
          }
        : {}),
    },
    twitter: {
      // a square logo looks wrong as a large banner
      card: isLogo ? "summary" : "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: socialTitle,
      description,
      images: [{ url: shareImage, alt: imageAlt || socialTitle }],
    },
  };
}

// SEO panel settings from the API (tours, group tours, destinations, hotels, places, blogs)
export function seoFromApi(item, { preview = false } = {}) {
  return {
    canonical: item?.canonical_url || undefined,
    noindex: Boolean(item?.noindex) || preview,
    ogImage: item?.og_image?.optimized_banner || item?.og_image?.image || null,
  };
}
