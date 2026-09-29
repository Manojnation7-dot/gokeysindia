export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/images/default-og.jpg",
  canonical, // admin "Canonical URL" (only when this page is a copy of another page)
  noindex = false, // admin "Hide from Google", or a draft preview
}) {
  const normalizedSiteUrl = "https://gokeys.in";
  const canonicalUrl = new URL(path, normalizedSiteUrl);
  canonicalUrl.pathname = canonicalUrl.pathname.replace(/\/+$/, "") || "/";
  canonicalUrl.hash = "";
  const normalizedImage = image.startsWith("http") ? image : `${normalizedSiteUrl}${image.startsWith("/") ? "" : "/"}${image}`;


  return {
    title,
    description,
    alternates: {
      canonical: canonical || canonicalUrl.href,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl.href,
      images: [
        {
          url: normalizedImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [normalizedImage],
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
