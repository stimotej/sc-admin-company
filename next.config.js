/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/poslodavci",
  assetPrefix: "/poslodavci/",
  swcMinify: true,
  images: {
    domains: ["161.53.174.14"],
  },
};

module.exports = nextConfig;
