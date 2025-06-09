/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 注释掉此行，避免与动态 API 路由冲突
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
