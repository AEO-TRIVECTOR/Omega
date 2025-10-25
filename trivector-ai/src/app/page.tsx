'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-black to-cosmic-gray900">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Trivector.AI
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 font-light">
            Data Visualization, 3D Graphics & Machine Learning
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            Building interactive data experiences with modern web technologies.
            Powered by React, Next.js, D3.js, Three.js, and advanced ML capabilities.
          </p>

          {/* Contact CTA */}
          <div className="flex flex-col items-center gap-6">
            <p className="text-gray-400">Contact us:</p>
            <a
              href="mailto:link@trivector.ai"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-lg font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-glowCyan hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              link@trivector.ai
            </a>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="container mx-auto px-6 pb-32">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-cosmic-gray900/40 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-white font-semibold mb-2">Data Viz</h3>
            <p className="text-gray-500 text-sm">D3.js visualizations</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-cosmic-gray900/40 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-white font-semibold mb-2">3D Graphics</h3>
            <p className="text-gray-500 text-sm">Three.js & React</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-cosmic-gray900/40 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-white font-semibold mb-2">Machine Learning</h3>
            <p className="text-gray-500 text-sm">ML matrix operations</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Trivector.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
