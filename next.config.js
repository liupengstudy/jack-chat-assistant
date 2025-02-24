/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['api.openai.com'],
  },
  // Cloudflare Pages specific configuration
  experimental: {
    runtime: 'edge',
  },
}

module.exports = nextConfig 