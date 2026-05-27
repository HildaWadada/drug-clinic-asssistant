/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api/* requests to the FastAPI backend
  // This way the browser never calls localhost:8000 directly
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
