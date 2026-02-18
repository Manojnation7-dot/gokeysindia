/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {

      unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.gokeys.in',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
  return [
    {
      source: '/trip/:slug*',
      destination: 'https://api.gokeys.in/trip/:slug*', // Let Django handle redirection
    },
    // {
    //   source: '/:slug',
    //   destination: 'https://api.gokeys.in/:slug', // Existing rewrite
    // },
  ];
},
 // 🔀 ALL SEO redirects here (permanent allowed)
  async redirects() {
    return [
     {
  source: '/hill-stations-near-rishikesh',
  destination: '/blog/hill-stations-near-rishikesh',
  permanent: true,
},
{
  source: '/national-parks-in-uttarakhand',
  destination: '/blog/complete-guide-to-national-parks-in-uttarakhand-wildlife-trekking-safari-adventures',
  permanent: true,
},
{
  source: '/camping-in-shivpuri-rishikesh',
  destination: '/blog/camping-in-shivpuri-rishikesh',
  permanent: true,
},
{
  source: '/trek-to-explore-kagbhusandi-lake',
  destination: '/blog/kagbhusandi-lake-trek-complete-guide',
  permanent: true,
},
{
  source: '/munsiyari-himalayan-hill-station-munsiyari-sightseeing',
  destination: '/blog/munsiyari-travel-guide',
  permanent: true,
},
{
  source: '/kotdwar-city',
  destination: '/blog/kotdwar-travel-guide',
  permanent: true,
},
{
  source: '/mukteshwar-hill-station-kumaon-uttarakhand',
  destination: '/blog/mukteshwar-hill-station-kumaon-uttarakhand',
  permanent: true,
},
{
  source: '/khirsu-a-hill-station-in-pauri-garhwal-uttarakhand',
  destination: '/blog/khirsu-travel-guide-discover-uttarakhands-hidden-himalayan-paradise',
  permanent: true,
},
{
  source: '/explore-gopeshwar-uttarakhand',
  destination: '/blog/gopeshwar-uttarakhand-complete-travel-guide',
  permanent: true,
},
{
  source: '/panch-kedar-in-uttarakhand-details',
  destination: '/blog/guide-to-panch-kedar-uttarakhand',
  permanent: true,
},
{
  source: '/devprayag-the-place-of-holy-river-ganga',
  destination: '/blog/devprayag-travel-guide-ganga-river-truly-begins',
  permanent: true,
},
{
  source: '/lansdowne-travel-guide-places-to-visit-in-lansdowne',
  destination: '/blog/lansdowne-travel-guide-places-to-visit',
  permanent: true,
},
{
  source: '/char-dham-yatra-registration-e-pass-online',
  destination: '/blog/char-dham-yatra-registration-e-pass-online',
  permanent: true,
},
{
  source: '/adi-badri-temple-uttarakhand-travel-guide',
  destination: '/blog/adi-badri-temple-complete-travel-guide',
  permanent: true,
},
{
  source: '/almora-travel-guide-almora-hill-station-in-uttarakhand',
  destination: '/blog/almora-travel-guide',
  permanent: true,
},
{
  source: '/lakhamandal-history-accommodations-time-to-visit-nearby-places',
  destination: '/blog/lakhamandal-temple-guide',
  permanent: true,
},
{
  source: '/tehri-garhwal-history-and-information',
  destination: '/blog/tehri-garhwal-travel-guide-complete-tourist-information',
  permanent: true,
},
{
  source: '/kedarkantha-trek-details-route-map-and-package',
  destination: '/blog/kedarkantha-trek-2025-complete-guide',
  permanent: true,
},
{
  source: '/tiger-falls-chakrata-highest-direct-water-fall-in-india',
  destination: '/blog/tiger-falls-chakrata-highest-direct-water-fall-in-india',
  permanent: true,
},
{
  source: '/top-15-hill-stations-to-visit-in-garhwal-uttarakhand',
  destination: '/blog/top-15-best-hill-stations-in-garhwal-uttarakhand',
  permanent: true,
},
{
  source: '/char-dham-yatra-2025-tour-package-from-haridwar',
  destination: '/blog/char-dham-yatra-2026-complete-guide-haridwar',
  permanent: true,
},
{
  source: '/mahasu-devta-temple-hanol',
  destination: '/blog/mahasu-devta-temple-hanol',
  permanent: true,
},
{
  source: '/char-dham-yatra-2023',
  destination: '/blog/char-dham-yatra-2023',
  permanent: true,
},
{
  source: '/route-map-of-char-dham-yatra',
  destination: '/blog/route-map-of-char-dham-yatra',
  permanent: true,
},
{
  source: '/exploring-the-enchanting-niti-valley',
  destination: '/blog/exploring-the-enchanting-niti-valley',
  permanent: true,
},
{
  source: '/chakrata-travel-guide-places-to-visit-in-chakrata',
  destination: '/blog/chakrata-travel-guide-places-to-visit-in-chakrata',
  permanent: true,
},
{
  source: '/online-permit-for-gaumukh-trekking-details-gangotri-national-park',
  destination: '/blog/online-permit-for-gaumukh-trekking-details-gangotri-national-park',
  permanent: true,
},
{
  source: '/vaishno-devi-yatra-details-distance-from-trek-route-map',
  destination: '/blog/vaishno-devi-yatra-details-distance-from-trek-route-map',
  permanent: true,
},
{
  source: '/panch-prayag-uttarakhand-panch-prayag-tour-route-map',
  destination: '/blog/panch-prayag-uttarakhand-panch-prayag-tour-route-map',
  permanent: true,
},
{
  source: '/chopta-tungnath-chandrashila-trek-blog',
  destination: '/blog/chopta-tungnath-chandrashila-trek-blog',
  permanent: true,
},
{
  source: '/vasudhara-falls-travel-guide',
  destination: '/blog/vasudhara-falls-travel-guide',
  permanent: true,
},
{
  source: '/deoria-tal-trek-details-and-travel-guide',
  destination: '/blog/deoria-tal-trek-details-and-travel-guide',
  permanent: true,
},
{
  source: '/haridwar-travel-guide-best-places-to-visit-in-haridwar',
  destination: '/blog/haridwar-travel-guide-best-places-to-visit-in-haridwar',
  permanent: true,
},
{
  source: '/ganges-ghats-in-haridwar',
  destination: '/blog/ganges-ghats-in-haridwar',
  permanent: true,
},
{
  source: '/auli-weather-snowfall-temperature-guide',
  destination: '/blog/auli-weather-snowfall-temperature-guide',
  permanent: true,
},
{
  source: '/best-places-to-stay-in-auli',
  destination: '/blog/best-places-to-stay-in-auli',
  permanent: true,
},
{
  source: '/char-dham-yatra-2025-tour-details-packages',
  destination: '/blog/char-dham-yatra-2025-tour-details-packages',
  permanent: true,
},
{
  source: '/adi-kailash-and-om-parvat-tour-details-2024-2025',
  destination: '/blog/adi-kailash-and-om-parvat-tour-details-2024-2025',
  permanent: true,
},
{
  source: '/top-5-winter-tour-destination-in-uttarakhand-for-2025-own-experience',
  destination: '/blog/top-5-winter-tour-destination-in-uttarakhand-for-2025-own-experience',
  permanent: true,
},
{
  source: '/12-jyotirlingas-tour-program-for-36-days',
  destination: '/blog/12-jyotirlingas-tour-program-for-36-days',
  permanent: true,
},
{
  source: '/budha-kedar-temple-5th-dham-in-uttarakhand',
  destination: '/blog/budha-kedar-temple-5th-dham-in-uttarakhand',
  permanent: true,
},
{
  source: '/12-jyotirlinga-name-places-map-image',
  destination: '/blog/12-jyotirlinga-name-places-map-image',
  permanent: true,
},

// Tours
{
  source: '/trip/rishikesh-mussoorie-dhanaulti-tour-package',
  destination: '/tours/rishikesh-mussoorie-dhanaulti-tour-package',
  permanent: true,
},
{
  source: '/trip/auli-nainital-kausani-almora-8-days-tour',
  destination: '/tours/auli-nainital-kausani-almora-8-days-tour',
  permanent: true,
},
{
  source: '/trip/auli-chopta-6-days-tour-from-haridwar',
  destination: '/tours/auli-chopta-6-days-tour-package-from-haridwar',
  permanent: true,
},
{
  source: '/trip/mussoorie-nainital-6-days-tour',
  destination: '/tours/mussoorie-nainital-6-days-tour-package-from-haridwar',
  permanent: true,
},
{
  source: '/trip/kedarnath-deoria-tal-sari-village-tour-package-6-days',
  destination: '/tours/kedarnath-deoria-tal-sari-village-tour-package',
  permanent: true,
},
  {
      source: '/tours/kedarnath-deoria-tal-sari-village-tour-package-6-days',
      destination: '/tours/kedarnath-deoria-tal-sari-village-tour-package',
      permanent: true,
    },

    {
      source: '/tours/gangotri-3-days-tour-package-haridwar',
      destination: '/tours/gangotri-3-days-tour-from-haridwar',
      permanent: true,
    },

     {
      source: '/trip/gangotri-3-days-tour-package-haridwar',
      destination: '/tours/gangotri-3-days-tour-from-haridwar',
      permanent: true,
    },

{
  source: '/trip/panch-kedar-trek-tour-package',
  destination: '/tours/panch-kedar-tour-package',
  permanent: true,
},
{
  source: '/trip/badrinath-mussoorie-trip-6-days',
  destination: '/tours/badrinath-mussoorie-6-days-trip',
  permanent: true,
},
{
  source: '/trip/chakrata-mussoorie-tour-package',
  destination: '/tours/chakrata-mussoorie-tour-package',
  permanent: true,
},
{
  source: '/trip/auli-chopta-5-days-tour-package',
  destination: '/tours/auli-chopta-5-days-tour-package',
  permanent: true,
},
{
  source: '/trip/kedar-kantha-trek-5-nights-6-days',
  destination: '/tours/kedar-kantha-trek-5-nights-6-days',
  permanent: true,
},
{
  source: '/trip/kedar-kantha-trek-4n-5d-tour',
  destination: '/tours/kedar-kantha-trek-5-nights-6-days',
  permanent: true,
},
{
  source: '/trip/mussoorie-dhanaulti-kanatal-4-days-tour',
  destination: '/tours/mussoorie-dhanaulti-kanatal-4-days-tour',
  permanent: true,
},
{
  source: '/trip/haridwar-rishikesh-neelkanth-tour-for-2-days',
  destination: '/tours/haridwar-rishikesh-neelkanth-tour-for-2-days',
  permanent: true,
},
{
  source: '/trip/harsil-valley-tour-3-days',
  destination: '/tours/harsil-valley-tour-3-days',
  permanent: true,
},
{
  source: '/trip/gangotri-and-yamunotri-dham-tour-package',
  destination: '/tours/gangotri-yamunotri-yatra-5-day',
  permanent: true,
},
{
  source: '/trip/char-dham-yatra-package-ahmedabad',
  destination: '/tours/char-dham-yatra-package-ahmedabad',
  permanent: true,
},
{
  source: '/trip/char-dham-yatra-from-delhi-12-days',
  destination: '/tours/char-dham-yatra-from-delhi-12-days',
  permanent: true,
},
{
  source: '/trip/char-dham-yatra-2025-tour-package-from-haridwar',
  destination: '/tours/char-dham-yatra-2025-tour-package-from-haridwar',
  permanent: true,
},
{
  source: '/trip/badrinath-dham-yatra-tour-package',
  destination: '/tours/badrinath-dham-yatra-tour-package',
  permanent: true,
},

// Destinations
{
  source: '/badrinath-dham',
  destination: '/destinations/badrinath',
  permanent: true,
},
{
  source: '/gangotri-dham',
  destination: '/destinations/gangotri',
  permanent: true,
},
{
  source: '/haridwar',
  destination: '/destinations/haridwar',
  permanent: true,
},
{
  source: '/kedarnath-dham',
  destination: '/destinations/kedarnath',
  permanent: true,
},
{
  source: '/nainital-tour-packages',
  destination: '/destinations/nainital',
  permanent: true,
},
{
  source: '/mussoorie-tour-packages',
  destination: '/destinations/mussoorie',
  permanent: true,
},
{
  source: '/yamunotri-dham',
  destination: '/destinations/yamunotri',
  permanent: true,
},

{
  source: '/trip/badrinath-kedarnath-yatra',
  destination: '/tours/kedarnath-badrinath-yatra-do-dham-tour',
  permanent: true,
},

    {
        source: "/web-stories/:path*",
        destination: "https://old.gokeys.in/web-stories/:path*",
        permanent: true, 
      },
    ];
  },
};

export default nextConfig;



