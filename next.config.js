/** @type {import('next').NextConfig} */
const createPWA = require('@ducanh2912/next-pwa').default;

const withPWA = createPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'], // ✅ Correct placement inside nextConfig
  },
};

module.exports = withPWA(nextConfig);
