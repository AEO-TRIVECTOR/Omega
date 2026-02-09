import AccretionDiskVisualization from "@/components/accretion-disk-visualization"
import Link from "next/link"

const VERSION = "3.0";

export default function Home() {
  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Version Indicator */}
      <div className="fixed top-2 left-2 text-white/30 text-[10px] font-mono z-[9999]">
        v{VERSION}
      </div>

      {/* Black Hole Background - Full Viewport */}
      <div className="absolute inset-0 z-0">
        <AccretionDiskVisualization />
      </div>

      {/* Centered Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        {/* Title */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-amber-200/90 tracking-[0.2em] uppercase text-center mb-4">
          AEO Trivector
        </h1>
        
        {/* Subtitle */}
        <div className="text-sm sm:text-base md:text-lg tracking-[0.5em] uppercase text-[#5DADE2]/80 text-center mb-12">
          Attractor Architecture
        </div>

        {/* Enter Button */}
        <Link 
          href="/manifold"
          className="px-12 py-4 border-2 border-[#5DADE2] text-[#5DADE2] hover:bg-[#5DADE2]/10 text-sm tracking-[0.3em] uppercase transition-all duration-300 font-mono"
        >
          Enter
        </Link>
      </div>
    </main>
  )
}
