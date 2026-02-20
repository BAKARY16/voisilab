/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        protocol: 'https',
        hostname: 'api.fablab.voisilab.online',
      },
    ],
  },
  // Proxy les images du backend pour éviter les problèmes CORS
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500';
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ]
  },
}

export default nextConfig
