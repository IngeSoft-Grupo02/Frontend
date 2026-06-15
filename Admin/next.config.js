const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/admin',
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
};

module.exports = nextConfig;
