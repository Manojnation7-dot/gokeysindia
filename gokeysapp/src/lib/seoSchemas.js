/**
 * seoSchemas.js
 * --------------------------------------------
 * Gokeys India - DRY Schema.org JSON-LD helpers
 * with auto SITE_URL prefixing.
 */

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://gokeys.in";

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
  streetAddress = "Near Bus Stand",
  addressLocality = "Haridwar",
  addressRegion = "Uttarakhand",
  postalCode = "249401",
  addressCountry = "IN",
  telephone = "+91-9045916770",
  email = "gokeysindia@gmail.com",
  openingHours = "Mo-Su 09:00-20:00",
  priceRange = "₹1,000 - ₹50,0000",
} = {}) { 
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
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
    telephone,
    email,
    openingHours,
    priceRange,
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

// ✅ TOUR PACKAGE
export function buildTourSchema({
  slug,
  name,
  description,
  imageUrl,
  price,
  itineraryItems = []
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    image: imageUrl,
    touristType: "Group",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/tour/${slug}`,
      priceCurrency: "INR",
      price
    },
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
          description: item.description
        }
      }))
    }
  };
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

export function buildFAQSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<\/?[^>]+(>|$)/g, ""), // ✅ Strip HTML tags!
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