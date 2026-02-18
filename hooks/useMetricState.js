'use client'

// hooks/useMetricState.js
// Unified metric state hook for Kerr black hole spacetime
// Provides shared metric evolution, turbulence seeds, and phase synchronization
// SSR-safe: turbulence seeds initialized only on client

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Unified metric state hook
 * 
 * Provides a single source of truth for all gravitational components:
 * - metric: 180s period (full Kerr spacetime evolution)
 * - orbital: 60s period (azimuthal phase for orbital motion)
 * - breathing: 45s period (radial pulsing/breathing)
 * - turbulenceSeeds: Synchronized random seeds for MRI-inspired turbulence
 * 
 * All components observing this state see the same spacetime from different worldlines.
 * 
 * SSR-safe: Avoids Math.random() during server-side rendering by initializing
 * turbulence seeds only after client mount.
 */
export function useMetricState() {
  // Track whether we're on the client
  const [isClient, setIsClient] = useState(false)

  const stateRef = useRef({
    metric: 0,
    orbital: 0,
    breathing: 0,
    turbulenceSeeds: {
      seed1: 0,
      seed2: 0,
      seed3: 0,
    },
  })

  useEffect(() => {
    setIsClient(true)
    // Safe to use Math.random on client only
    stateRef.current.turbulenceSeeds = {
      seed1: Math.random() * 1000,
      seed2: Math.random() * 1000,
      seed3: Math.random() * 1000,
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const s = stateRef.current
    s.metric = (t / 180) % 1
    s.orbital = (t / 60) % 1
    s.breathing = (t / 45) % 1
  })

  // During SSR, return deterministic defaults
  if (!isClient) {
    return {
      state: {
        metric: 0,
        orbital: 0,
        breathing: 0,
        turbulenceSeeds: {
          seed1: 0,
          seed2: 0,
          seed3: 0,
        },
      },
      api: {},
    }
  }

  return {
    state: stateRef.current,
    api: {},
  }
}
