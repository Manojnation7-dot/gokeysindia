/**
 * seoSchemas.js
 * --------------------------------------------
 * Gokeys India - DRY Schema.org JSON-LD helpers
 * with auto SITE_URL prefixing.
 */

const SITE_URL = "https://gokeys.in";

export function hasValidReviewRating(rating, count) {
  return ["number", "string"].includes(typeof rating) &&
    ["number", "string"].includes(typeof count) && Number.isFinite(Number(rating)) && Number(rating) >= 1 &&
    Number(rating) <= 5 && Number.isInteger(Number(count)) && Number(count) > 0;
}

function publishedPrice(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const price = Number(value);
  return Number.isFinite(price) && price > 0 ? price : null;
}

export function buildOrganizationSchema({ name, logoUrl, sameAs = [], contactPoint }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: SITE_URL + logoUrl // ensure full URL
    },
    sameAs,
    contactPoint: contactPoint || [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9045916770",
        "contactType": "customer service"
      }
    ]
  };
}

export function buildLocalBusinessSchema({
  name = "Gokeys India",
  logoUrl = "/images/gokeyslogo.png",
  streetAddress = "4th Shop, Zila Panchayat Market, Railway Road",
  addressLocality = "Haridwar",
  addressRegion = "Uttarakhand",
  postalCode = "249401",
  addressCountry = "IN",
  telephone = "+91-9045916770",
  email = "gokeysindia@gmail.com",
  openingHours = "Mo-Su 09:00-20:00",
  priceRange = "₹1,000 - ₹50,000",
  latitude = "29.944171",
  longitude = "78.146256",
  hasMap = "https://maps.google.com/?cid=17331082390865979113",
  areaServed = ["Haridwar", "Rishikesh", "Uttarakhand", "Char Dham","Nainital"],
  sameAs = [
    "https://facebook.com/gokeysindia",
    "https://instagram.com/gokeysharidwar",
    "https://twitter.com/gokeys4",
    "https://www.tripadvisor.in/Attraction_Review-g616028-d15685215-Reviews-Gokeys_India-Haridwar_Haridwar_District_Uttarakhand.html",
  ],
 
  ratingValue = "4.8",
  reviewCount = "164",
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TravelAgency"],
    name,
    image: SITE_URL + logoUrl,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
    hasMap,
    telephone,
    email,
    openingHours,
    priceRange,
    areaServed,
    sameAs,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    },
  };
}

// ✅ WEBSITE
export function buildWebsiteSchema({ name, alternateName, description, searchUrlPattern }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name,
    ...(alternateName && { alternateName }),
    ...(description && { description }),
    url: SITE_URL,
    inLanguage: "en-IN",
    ...(searchUrlPattern && {
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}${searchUrlPattern}`,
        },
        "query-input": "required name=search_term_string",
      },
    }),
  };
}

// ✅ BLOG POST
export function buildBlogPostSchema({
  slug,
  title,
  description,
  datePublished,
  authorName,
  imageUrl
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: {
      "@type": "ImageObject",
      url: imageUrl
    },
    author: {
      "@type": "Person",
      name: authorName
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`
    },
    datePublished
  };
}

// ✅ FIXED: TOUR PACKAGE — now takes pricingTiers/rating/reviewsCount
// and outputs a Product schema with a real AggregateOffer, instead of
// a single hardcoded "price": "0".
export function buildTourSchema({
  slug,
  tourPath = "tours",
  name,
  description,
  imageUrl,
  pricingTiers = [],   // pass tourData.pricing (the full array)
  rating,               // pass tourData.rating
  reviewsCount,         // pass tourData.reviews_count
  itineraryItems = [],
}) {
  if (!slug || !["tours", "grouptour"].includes(tourPath)) return null;
  const tourUrl = `${SITE_URL}/${tourPath}/${slug}`;

  const offers = (Array.isArray(pricingTiers) ? pricingTiers : [])
    .filter((tier) => tier && ![true, "true"].includes(tier.price_on_request))
    .map((tier) => ({ tier, price: publishedPrice(tier.discount_price) ?? publishedPrice(tier.price) }))
    .filter(({ price }) => price !== null)
    .map(({ tier, price }) => ({
      "@type": "Offer",
      name: `${capitalize(tier.package_type)} Package`,
      price: String(price),
      priceCurrency: "INR",
      ...(tier.price_valid_until && { priceValidUntil: tier.price_valid_until }),
      url: tourUrl,
    }));

  const priceNumbers = offers.map((o) => Number(o.price));
  const lowPrice = priceNumbers.length ? Math.min(...priceNumbers) : undefined;
  const highPrice = priceNumbers.length ? Math.max(...priceNumbers) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${tourUrl}#tour`,
    name,
    description,
    image: imageUrl ? [imageUrl] : undefined,
    url: tourUrl,
    brand: {
      "@type": "Organization",
      name: "Gokeys India",
    },
    offers: offers.length
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: String(lowPrice),
          highPrice: String(highPrice),
          offerCount: String(offers.length),
          offers,
        }
      : undefined,
    ...(hasValidReviewRating(rating, reviewsCount)
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(rating),
            reviewCount: String(reviewsCount),
          },
        }
      : {}),
    itinerary: {
      "@type": "ItemList",
      name: `Itinerary for ${name}`,
      numberOfItems: itineraryItems.length,
      itemListElement: itineraryItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TouristAttraction",
          name: item.name,
          description: item.description,
        },
      })),
    },
  };
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ✅ HOTEL
export function buildHotelSchema({
   destinationSlug,
  slug,
  name,
  description,
  imageUrl,
  address = {},
  price,
  starRating,
  amenities
}) {
  if (!destinationSlug || !slug) return null;
  const hotelUrl = `${SITE_URL}/hotels/${destinationSlug}/${slug}`;
  const numericPrice = publishedPrice(price);
  const validAmenities = (Array.isArray(amenities) ? amenities : [])
    .filter((name) => typeof name === "string" && name.trim() && !/^N\/A$/i.test(name.trim()))
    .map((name) => name.trim());
  const images = (Array.isArray(imageUrl) ? imageUrl : [imageUrl])
    .filter((url) => typeof url === "string" && url.trim())
    .flatMap((value) => {
      try {
        const url = new URL(value.trim(), SITE_URL);
        return /^https?:$/.test(url.protocol) &&
          (/^https?:\/\//i.test(value.trim()) || value.startsWith("/")) ? [url.href] : [];
      } catch {
        return [];
      }
    });
  const addressFields = Object.fromEntries(Object.entries({
    streetAddress: address?.streetAddress,
    addressLocality: address?.city,
    addressRegion: address?.region,
    postalCode: address?.postalCode,
    addressCountry: address?.country,
  }).filter(([, value]) => typeof value === "string" && value.trim() &&
    !/^(?:N\/A|0+)$/i.test(value.trim())).map(([key, value]) => [key, value.trim()]));
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name,
    description,
    ...(images.length && { image: images }),
    url: hotelUrl,
    ...(Object.keys(addressFields).length && {
      address: { "@type": "PostalAddress", ...addressFields },
    }),
    ...(numericPrice !== null && { priceRange: `INR ${numericPrice}` }),
    ...(Number(starRating) >= 1 && Number(starRating) <= 5 && {
      starRating: {
        "@type": "Rating",
        ratingValue: String(starRating),
        bestRating: "5"
      }
    }),
    ...(validAmenities.length > 0 && {
      amenityFeature: validAmenities.map((a) => ({
        "@type": "LocationFeatureSpecification",
        name: a,
        value: true
      }))
    }),
    ...(numericPrice !== null && {
      offers: {
        "@type": "Offer",
        price: String(numericPrice),
        priceCurrency: "INR",
        url: hotelUrl,
      },
    }),
  };
}

// ✅ SIGHTSEEING / ATTRACTION
export function hasValidSightseeingSlug(slug) {
  return typeof slug === "string" && /^[\p{L}\p{N}_-]+$/u.test(slug) &&
    !/^(?:undefined|null)$/i.test(slug);
}

export function buildSightseeingPlaceSchema({
  slug,
  name,
  description,
  imageUrl,
  destinationName
}) {
  if (!hasValidSightseeingSlug(slug)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    description,
    image: imageUrl,
    url: `${SITE_URL}/sightseeing/${slug}`,
    locatedInPlace: {
      "@type": "Place",
      name: destinationName
    }
  };
}

// ✅ BREADCRUMB
export function buildBreadcrumbList(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`
    }))
  };
}

// ✅ IMAGE OBJECT
export function buildImageObject({ url, width, height }) {
  return {
    "@type": "ImageObject",
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    width,
    height
  };
}

// FAQ identity belongs to its page, which need not be a tour detail.
export function buildFAQSchema(faqs = [], pagePath) {
  if (!Array.isArray(faqs) || faqs.length === 0 || typeof pagePath !== "string" ||
      !/^\/(?:tours\/[^/?#]+|grouptour(?:\/[^/?#]+)?|destinations\/[^/?#]+)\/?$/.test(pagePath) ||
      /\/(?:undefined|null)(?:\/|$)/.test(pagePath)) return null;

  const pageUrl = `${SITE_URL}${pagePath.replace(/\/$/, "")}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": (faq.answer || "").replace(/<\/?[^>]+(>|$)/g, ""),
      },
    })),
  };
}

export function buildItemListSchema({
  name = "Item List",
  items = [],
  itemType = "Thing",
  getItemSchema
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => {
      let schema = {
        "@type": itemType,
        name: item.name,
        description: item.meta_description || item.excerpt || "",
        image: item.featured_image?.image || "https://via.placeholder.com/600x400",
        url: `${SITE_URL}/${itemType.toLowerCase()}s/${item.slug}`
      };

      if (typeof getItemSchema === "function") {
        schema = getItemSchema(item, schema);
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        item: schema // ✅ Only item, no separate url!
      };
    })
  };
}
