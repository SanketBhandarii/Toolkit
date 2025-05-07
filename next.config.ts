import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',  // Set this to your desired limit (e.g., 10 MB)
    },
  },
};

export default nextConfig;
