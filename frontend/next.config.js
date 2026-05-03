/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'www.google.com'],
  },
  experimental: {
    turbopack: {
      root: '.',
    },
  },
}

export default nextConfig;
