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
        {/* Top section - Title and subtitle grouped together above the black hole */}
        <div className="pt-12 md:pt-16 lg:pt-20 text-center flex flex-col items-center gap-4 md:gap-6">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-amber-200/90 tracking-[0.2em] uppercase px-4">
            AEO Trivector
          </h1>
          
          {/* Subtitle directly under title - both against dark top area */}
          <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.45em] uppercase text-sky-300/80 drop-shadow-[0_0_15px_rgba(125,211,252,0.5)]">
            The Event Horizon
          </p>
        </div>
        
        {/* Spacer - allows the black hole to occupy center */}
        <div className="flex-1" />
        
        {/* Bottom section - Enter CTA positioned below the disk against dark area */}
        <div className="pb-16 md:pb-20 flex flex-col items-center gap-5">
          {/* Enter text link - minimal, no border for cleaner look */}
          <Link 
            href="#enter"
            className="group relative text-sm md:text-base font-light tracking-[0.5em] uppercase text-sky-300/90 hover:text-sky-100 transition-all duration-500"
          >
            <span className="relative z-10">Enter</span>
            {/* Animated underline on hover */}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-sky-300/60 group-hover:w-full transition-all duration-500" />
          </Link>
          
          {/* Down arrow indicator */}
          <svg 
            className="w-4 h-4 text-sky-300/50"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </main>
  )
}
