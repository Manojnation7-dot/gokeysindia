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

  async rewrites() {
  return [
    {
      source: '/trip/:slug*',
      destination: 'https://api.gokeys.in/trip/:slug*', // Let Django handle redirection
    },
    {
      source: '/:slug',
      destination: 'https://api.gokeys.in/:slug', // Existing rewrite
    },
  ];
}
};

export default nextConfig;
s


