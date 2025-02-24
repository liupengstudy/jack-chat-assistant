/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['api.openai.com'],
  },
  // 优化构建大小
  webpack: (config, { isServer }) => {
    // 只在服务端构建时进行优化
    if (isServer) {
      // 排除不必要的依赖
      config.externals = [...(config.externals || []), {
        'node-fetch': 'node-fetch',
        'https-proxy-agent': 'https-proxy-agent',
      }];
    }
    return config;
  },
  // 优化输出
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Cloudflare Pages specific configuration
  experimental: {
    runtime: 'edge',
  },
}

module.exports = nextConfig 