import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracing: true,
    outputFileTracingExcludes: {
      "**/*.test.{js,ts,jsx,tsx}": ["**"],
      "**/__mocks__/**": ["**"],
      "**/*.map": ["**"],
      "**/test/**": ["**"],
      "**/tests/**": ["**"]
    }
  } as any
};

export default nextConfig;
