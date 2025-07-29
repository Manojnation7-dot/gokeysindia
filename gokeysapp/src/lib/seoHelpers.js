export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/images/default-og.jpg",
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https//gokeys.in";
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");
  const normalizedImage = image.startsWith("http") ? image : `${normalizedSiteUrl}${image.startsWith("/") ? "" : "/"}${image}`;


  return {
    title,
    description,
    alternates: {
      canonical: `${normalizedSiteUrl}${path.replace(/\/+$/, "")}/`,
    },
    openGraph: {
      title,
      description,
      url: `${normalizedSiteUrl}${path.replace(/\/+$/, "")}/`,
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