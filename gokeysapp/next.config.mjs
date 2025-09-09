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
        permanent: true, // This is a 301 redirect
      },
      {
        source: '/:slug((?!blog$).*)',
        destination: '/blog/:slug',
        permanent: true,
      },
      // ... add all other redirects here
    ];
  },
};

export default nextConfig;



