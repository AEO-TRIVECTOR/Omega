"use client"

import Link from "next/link"

export default function ManifoldPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <h1 
        className="mb-6 text-center"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          letterSpacing: "0.15em",
          color: "rgba(255, 255, 255, 0.85)",
          textTransform: "uppercase",
        }}
      >
        AEO Trivector
      </h1>
      <p
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 200,
          fontSize: "clamp(0.65rem, 1.5vw, 0.9rem)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.4)",
          marginBottom: "3rem",
        }}
      >
        Attractor Architecture
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "0.75rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(255, 200, 120, 0.5)",
          textDecoration: "none",
          borderBottom: "1px solid rgba(255, 200, 120, 0.2)",
          paddingBottom: "4px",
        }}
      >
        ← Return to Entrance
      </Link>
    </main>
  )
}
