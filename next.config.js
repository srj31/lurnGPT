/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "media.licdn.com",
      },
      {
        hostname: "images5.alphacoders.com",
      },
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "cdn.shopify.com",
      },
      {
        hostname: "c1.wallpaperflare.com",
      },
      {
        hostname: "media-cldnry.s-nbcnews.com",
      },
    ],
  },
};

module.exports = nextConfig;
