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
      <div className="relative z-10 flex flex-col h-full items-center justify-center">
        {/* Main title - elegant serif with golden color */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-amber-200/90 tracking-[0.2em] uppercase mb-6 text-center">
          AEO Trivector
        </h1>
        
        {/* Subtitle - soft blue with wide spacing */}
        <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.4em] uppercase text-sky-300/70 mb-24 md:mb-32">
          The Event Horizon
        </p>
        
        {/* Enter CTA - minimal, blue */}
        <Link 
          href="#enter"
          className="text-sm md:text-base font-light tracking-[0.5em] uppercase text-sky-300/80 hover:text-sky-200 transition-colors duration-500"
        >
          Enter
        </Link>
        
        {/* Down arrow indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <svg 
            className="w-4 h-4 md:w-5 md:h-5 text-sky-300/50 animate-pulse"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </main>
  )
}
