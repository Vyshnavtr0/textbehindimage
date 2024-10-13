/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'textbehindimage.rexanwong.xyz',
          port: '',
          pathname: '/_next/**',
        },
      ],
    },
  }
export default nextConfig;
