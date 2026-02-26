
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/munsec',
  trailingSlash: true,
  images: { 
    unoptimized: true 
  }
};

module.exports = nextConfig;
