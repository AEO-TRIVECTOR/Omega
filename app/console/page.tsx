'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { QuasarLogo } from '../../components/QuasarLogo'

export default function ConsolePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 cosmic-grid opacity-[0.035]" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-8"
        >
          {/* Logo */}
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-quasar-ring opacity-30 blur-2xl" />
            <QuasarLogo size={120} className="drop-shadow-[0_0_60px_rgba(6,182,212,0.25)]" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand via-brand-purple to-brand-pink bg-clip-text text-transparent">
            Trivector Console
          </h1>

          {/* Description */}
          <div className="cosmic-surface p-8 max-w-xl">
            <p className="text-lg text-gray-300 mb-4">
              The Trivector Console is currently under development.
            </p>
            <p className="text-sm text-gray-400">
              Soon you'll be able to compose vector-native agents, connect providers, 
              and deploy deterministic AI systems with quantum-ready infrastructure.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid gap-4 md:grid-cols-2 w-full max-w-xl text-left">
            <div className="cosmic-surface p-4">
              <div className="text-brand mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Agent Orchestration</h3>
              <p className="text-xs text-gray-400">Build and deploy vector-native AI agents</p>
            </div>
            <div className="cosmic-surface p-4">
              <div className="text-brand-purple mb-2">🔒</div>
              <h3 className="font-semibold mb-1">Secure Channels</h3>
              <p className="text-xs text-gray-400">Post-quantum encryption by default</p>
            </div>
            <div className="cosmic-surface p-4">
              <div className="text-brand-pink mb-2">📊</div>
              <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
              <p className="text-xs text-gray-400">Observe inference flows and metrics</p>
            </div>
            <div className="cosmic-surface p-4">
              <div className="text-brand mb-2">🌐</div>
              <h3 className="font-semibold mb-1">Multi-Provider</h3>
              <p className="text-xs text-gray-400">Connect any LLM or vector database</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/" className="btn-primary">
              ← Back to Home
            </Link>
            <Link href="/trilogic" className="btn-ghost">
              Explore Tri-Logic Visualizer
            </Link>
          </div>

          {/* Status */}
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
            <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
            <span>In Active Development</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-10 border-t border-white/5 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Trivector.ai • Crafted with restraint</p>
      </footer>
    </div>
  )
}
