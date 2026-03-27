"use client"

import dynamicImport from "next/dynamic"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

// Client-only BlackHoleEntrance with SSR disabled
const BlackHoleEntrance = dynamicImport(
  () => import("@/components/entrance/BlackHoleEntrance"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black">
        <span className="text-xs text-white/40 tracking-[0.3em] uppercase font-mono">
          Initializing spacetime manifold…
        </span>
      </div>
    ),
  },
)

export default function Home() {
  const router = useRouter()

  const handleEnter = useCallback(() => {
    router.push("/manifold")
  }, [router])

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <BlackHoleEntrance onEnter={handleEnter} />
    </main>
  )
}
