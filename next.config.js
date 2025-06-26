/** @type {import('next').NextConfig} */
const createPWA = require("@ducanh2912/next-pwa").default;

const withPWA = createPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "infinitech-api3.site",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**.herokuapp.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**.railway.app",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
        pathname: "/storage/**",
      },
    ],
    domains: [
      "localhost",
      "infinitech-api3.site",
    ],
  },
};

module.exports = withPWA(nextConfig);
