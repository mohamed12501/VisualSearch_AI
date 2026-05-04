/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
  // In Next.js 16, some ignore options might have moved or are default
  // We'll keep them as top-level if experimental/eslint are deprecated
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig;
