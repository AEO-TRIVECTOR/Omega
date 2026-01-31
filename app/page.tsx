import AccretionDiskVisualization from "@/components/accretion-disk-visualization"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Visualization Background */}
      <div className="absolute inset-0">
        <AccretionDiskVisualization />
      </div>

      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.4)_70%,_rgba(0,0,0,0.7)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="px-6 py-6 md:px-12 md:py-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-medium text-white/90 tracking-wide">AEO Trivector</h1>
            <Button
              variant="outline"
              className="bg-white/5 text-white/80 border-white/15 hover:bg-white/10 hover:text-white hover:border-white/25 backdrop-blur-md transition-all duration-300 text-sm tracking-wide"
            >
              Contact
            </Button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Frosted glass backdrop for text legibility */}
            <div className="relative px-8 py-12 md:px-16 md:py-16 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5">
              {/* Micro-headline */}
              <p className="text-xs md:text-sm font-medium tracking-[0.35em] uppercase text-sky-300/70 mb-6">
                The Event Horizon
              </p>
              
              {/* Main title */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-[1.1] tracking-tight">
                AEO Trivector
              </h2>
              
              {/* Shortened, high-signal tagline */}
              <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                Real-time gravitational lensing simulations.
                <br className="hidden sm:block" />
                <span className="text-white/50">Photorealistic. Physics-accurate.</span>
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 text-sm font-medium px-8 h-11 tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white/80 border-white/20 hover:bg-white/5 hover:text-white hover:border-white/30 backdrop-blur-sm text-sm font-medium px-8 h-11 tracking-wide transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-6 md:px-12 md:py-8">
          <div className="max-w-7xl mx-auto text-center text-white/40 text-xs tracking-wide">
            <p>© 2025 AEO Trivector LLC. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
