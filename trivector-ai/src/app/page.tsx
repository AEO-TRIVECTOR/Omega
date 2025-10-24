'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-black via-cosmic-gray900 to-cosmic-gray800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto px-6 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Trivector.AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Advanced Data Visualization, 3D Graphics & Machine Learning
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Transform complex data into interactive insights with cutting-edge visualization
              technology and machine learning capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Core Capabilities
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-cosmic-gray900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-8 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-glowCyan">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Data Visualization</h3>
              <p className="text-gray-400">
                Powered by D3.js for creating dynamic, interactive data visualizations
                that reveal patterns and insights in complex datasets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cosmic-gray900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/40 transition-all duration-300 hover:shadow-glowPurple">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">3D Graphics</h3>
              <p className="text-gray-400">
                Immersive 3D experiences built with Three.js and React Three Fiber,
                bringing spatial data and models to life in your browser.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-cosmic-gray900/50 backdrop-blur-sm border border-pink-500/20 rounded-lg p-8 hover:border-pink-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Machine Learning</h3>
              <p className="text-gray-400">
                Advanced matrix operations and ML capabilities for data analysis,
                pattern recognition, and predictive modeling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-cosmic-gray900/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Built with Modern Technology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-2">⚛️</div>
              <p className="text-gray-300 font-medium">React 18</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">▲</div>
              <p className="text-gray-300 font-medium">Next.js 14</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-300 font-medium">D3.js</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-gray-300 font-medium">Three.js</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Interested in collaboration or have questions? We'd love to hear from you.
            </p>
            <a
              href="mailto:link@trivector.ai"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-glowCyan"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              link@trivector.ai
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Trivector.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
