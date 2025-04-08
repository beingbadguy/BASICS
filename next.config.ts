import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "img.freepik.com",
      "images.unsplash.com",
      "res.cloudinary.com",
      "plus.unsplash.com",
    ], // Allow images from Freepik
  },
};

export default nextConfig;
