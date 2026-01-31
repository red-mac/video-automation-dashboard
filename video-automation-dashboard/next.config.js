/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/healthz',
      },
    ];
  },
};

module.exports = nextConfig;