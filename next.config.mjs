/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.buymeacoffee.com',
        port: '',
        pathname: '/buttons/v2/**',
      },
    ],
  },
  // Add this line:
  experimental: { images: { allowFutureImage: true } },
}

// Add this at the end of the file
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default nextConfig;
