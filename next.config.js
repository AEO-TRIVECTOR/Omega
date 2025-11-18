/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static page generation to avoid SSR context errors
  experimental: {
    isrMemoryCacheSize: 0,
  },
  webpack: (config) => {
    // Enable async WebAssembly; preserve any existing experiments
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

module.exports = nextConfig;
