'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-light text-amber-200/90 tracking-[0.2em] uppercase mb-4">
          Error
        </h1>
        <p className="text-[#5DADE2]/80 tracking-[0.3em] uppercase text-sm mb-8">
          Something went wrong
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 border-2 border-[#5DADE2] text-[#5DADE2] hover:bg-[#5DADE2]/10 text-sm tracking-[0.3em] uppercase transition-all duration-300 font-mono"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
