import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Update deprecated images config to remotePatterns to clear the terminal warning
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  
  // Whitelist exactly your current ngrok URL so the browser can actually download the new code snippet
  allowedDevOrigins: [
    "tawniest-nonmutually-tanya.ngrok-free.dev", // Your current ngrok URL
  ],
};

export default nextConfig;
