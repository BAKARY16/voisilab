/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3500',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3501',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'uvci.online',
      },
    ],
  },
  // Proxy les images du backend pour éviter les problèmes CORS
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3500/uploads/:path*',
      },
    ]
  },
}

export default nextConfig
