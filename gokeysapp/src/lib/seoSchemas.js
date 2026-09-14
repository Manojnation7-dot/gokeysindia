/**
 * seoSchemas.js
 * --------------------------------------------
 * Gokeys India - DRY Schema.org JSON-LD helpers
 * with auto SITE_URL prefixing.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gokeys.in";

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
  reviewCount = "161",
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
export function buildWebsiteSchema({ name, searchUrlPattern }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}${searchUrlPattern}`,
      "query-input": "required name=search_term_string"
    }
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
  name,
  description,
  imageUrl,
  pricingTiers = [],   // pass tourData.pricing (the full array)
  rating,               // pass tourData.rating
  reviewsCount,         // pass tourData.reviews_count
  itineraryItems = [],
}) {
  const tourUrl = `${SITE_URL}/tours/${slug}`;

  const offers = (pricingTiers || [])
    .filter((tier) => tier && (tier.price || tier.discount_price))
    .map((tier) => ({
      "@type": "Offer",
      name: `${capitalize(tier.package_type)} Package`,
      price: String(tier.discount_price || tier.price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      priceValidUntil: tier.price_valid_until || defaultValidUntil(),
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
    ...(rating && reviewsCount
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

function defaultValidUntil() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6); // rolling 6-month validity window
  return d.toISOString().split("T")[0];
}

// ✅ HOTEL
export function buildHotelSchema({
   destinationSlug,
  slug,
  name,
  description,
  imageUrl,
  address = {},
  priceRange,
  telephone,
  starRating,
  amenities
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name,
    description,
    image: Array.isArray(imageUrl) ? imageUrl : [imageUrl],
    url: `${SITE_URL}/hotels/${destinationSlug}/${slug}`, 
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress || "N/A",
      addressLocality: address.city || "N/A",
      addressRegion: address.region || "Uttarakhand",
      postalCode: address.postalCode || "000000",
      addressCountry: address.country || "IN"
    },
    priceRange: priceRange || "₹1000 - ₹50000",
    telephone: telephone || "+91-9045916770",
    ...(starRating && {
      starRating: {
        "@type": "Rating",
        ratingValue: String(starRating),
        bestRating: "5"
      }
    }),
    ...(amenities?.length > 0 && {
      amenityFeature: amenities.map((a) => ({
        "@type": "LocationFeatureSpecification",
        name: a,
        value: true
      }))
    }),
    offers: {
      "@type": "Offer",
      price: priceRange?.replace(/[^0-9]/g, "") || "1000",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock"
    }
  };
}

// ✅ SIGHTSEEING / ATTRACTION
export function buildSightseeingPlaceSchema({
  slug,
  name,
  description,
  imageUrl,
  destinationName
}) {
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

// ✅ FAQ SCHEMA (already correct — /tours/ URL, linked to #tour)
export function buildFAQSchema(faqs = [], slug) {
  if (!faqs || faqs.length === 0) return null;

  const tourUrl = `${SITE_URL}/tours/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${tourUrl}#faq`,
    "mainEntityOfPage": { "@id": `${tourUrl}#tour` },
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