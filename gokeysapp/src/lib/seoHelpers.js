export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/images/default-og.jpg",
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
      canonical: canonicalUrl.href,
    },
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
