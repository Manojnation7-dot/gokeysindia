/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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

async redirects() {
  return [
    {
      source: '/trip/:slug*',
      destination: '/tours/:slug*',
      permanent: true,
    },
    {
      // match only single-segment slugs (not empty, not blog, not tours, not group-tour)
      source: '/:slug((?!blog$|tours$|group-tour$).+)',
      destination: '/blog/:slug',
      permanent: true,
    },
  ];
},
};

export default nextConfig;



