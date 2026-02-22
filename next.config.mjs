import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  typescript: {
    ignoreBuildErrors: true,
  },
  // Vercel handles image optimization automatically
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Fix: Replace Pages Router error pages with noop to prevent build errors
      // This is a workaround for Next.js 14 bug where it tries to generate Pages Router
      // fallback error pages even in pure App Router projects
      const noopPath = resolve(__dirname, 'lib/noop.js')
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /next[\\/]dist[\\/]pages[\\/]_error/,
          noopPath
        ),
        new webpack.NormalModuleReplacementPlugin(
          /next[\\/]dist[\\/]pages[\\/]_document/,
          noopPath
        )
      )
    }
    return config
  },
}

export default nextConfig
