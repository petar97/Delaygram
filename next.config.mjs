/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/delaygram/' : '',
  basePath: isProd ? '/delaygram' : '',
  output: 'export'
};

export default nextConfig;
