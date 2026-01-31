// Next.js config
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/api/sse/:path*',
        headers: [
          { key: 'Content-Type', value: 'text/event-stream' },
          { key: 'Cache-Control', value: 'no-cache' },
          { key: 'Connection', value: 'keep-alive' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;