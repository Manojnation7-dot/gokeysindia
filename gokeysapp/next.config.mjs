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
      source: '/api/:path*',
      destination: 'https://api.gokeys.in/api/:path*',
    },
    {
      source: '/media/:path*',
      destination: 'https://api.gokeys.in/media/:path*',
    },
    ];
  }
};

export default nextConfig;



