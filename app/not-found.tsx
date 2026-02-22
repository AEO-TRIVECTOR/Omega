'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-light text-amber-200/90 tracking-[0.2em] uppercase mb-4">
          404
        </h1>
        <p className="text-[#5DADE2]/80 tracking-[0.3em] uppercase text-sm mb-8">
          Page Not Found
        </p>
        <Link 
          href="/"
          className="px-8 py-3 border-2 border-[#5DADE2] text-[#5DADE2] hover:bg-[#5DADE2]/10 text-sm tracking-[0.3em] uppercase transition-all duration-300 font-mono inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
