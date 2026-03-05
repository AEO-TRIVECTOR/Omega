/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  typescript: {
    ignoreBuildErrors: true,
  },
  // Turbopack is the default bundler in Next.js 16
  turbopack: {},
}

export default nextConfig
