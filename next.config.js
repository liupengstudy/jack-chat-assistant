/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['api.openai.com'],
  },
}

module.exports = nextConfig 