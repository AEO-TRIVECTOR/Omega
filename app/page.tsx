import AccretionDiskVisualization from "@/components/accretion-disk-visualization"
import Link from "next/link"

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Visualization Background */}
      <div className="absolute inset-0">
        <AccretionDiskVisualization />
      </div>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top section - Title positioned above the black hole */}
        <div className="pt-16 md:pt-20 lg:pt-24 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-amber-200/90 tracking-[0.2em] uppercase text-center px-4">
            AEO Trivector
          </h1>
        </div>
        
        {/* Middle section - Subtitle positioned above center */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-12">
          {/* Subtitle with subtle glow effect */}
          <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.45em] uppercase text-sky-300/80 drop-shadow-[0_0_12px_rgba(125,211,252,0.4)]">
            The Event Horizon
          </p>
        </div>
        
        {/* Bottom section - Enter CTA with visual emphasis */}
        <div className="pb-20 md:pb-24 flex flex-col items-center gap-6">
          {/* Enter button with border and glow */}
          <Link 
            href="#enter"
            className="group relative px-12 py-3 border border-sky-400/30 rounded-full text-sm md:text-base font-light tracking-[0.5em] uppercase text-sky-300/90 hover:text-white hover:border-sky-300/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(125,211,252,0.25)]"
          >
            <span className="relative z-10">Enter</span>
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          
          {/* Down arrow indicator */}
          <svg 
            className="w-4 h-4 md:w-5 md:h-5 text-sky-300/40 animate-bounce"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </main>
  )
}
