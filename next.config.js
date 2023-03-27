/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.clerk.dev", pathname: "**" },
    ],
  },
};

module.exports = nextConfig;
