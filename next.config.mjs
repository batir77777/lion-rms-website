import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
    ],
    qualities: [75, 85],
  },
  async redirects() {
    return [
      {
        source: "/ai-automation",
        destination: "https://www.liondigital.org",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
