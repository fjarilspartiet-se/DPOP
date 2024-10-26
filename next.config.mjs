// next.config.mjs

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  webpack: (config, { isServer }) => {
    // Custom webpack config here if needed
    return config;
  },
  // Enable experimental features if needed
  experimental: {
    // appDir: true,
  },
};

export default nextConfig;
