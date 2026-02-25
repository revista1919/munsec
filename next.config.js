/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { 
    unoptimized: true 
  },
  basePath: '/munsec',
  assetPrefix: '/munsec/',
};

module.exports = nextConfig;