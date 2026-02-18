'use client'

// Optimized black hole visualization with React Three Fiber
// Unified metric state system with mobile performance tuning
// Based on Perplexity code review recommendations

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMetricState } from '@/hooks/useMetricState'
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

// ============================================================
// CAMERA DRIFT - Metric-synchronized Lissajous motion
// ============================================================

function CameraDrift({ metricState }: { metricState: any }) {
  const initialPos = useRef<THREE.Vector3 | null>(null)

  useFrame(({ camera }) => {
    if (!initialPos.current) {
      initialPos.current = camera.position.clone()
    }

    // Metric-synchronized Lissajous drift
    const orbitalPhase = metricState.orbital // 60s period
    const breathingPhase = metricState.breathing // 45s period
    
    // Subliminal amplitude, synchronized with metric evolution
    camera.position.x = initialPos.current.x + Math.sin(orbitalPhase * Math.PI * 2) * 0.03
    camera.position.y = initialPos.current.y + Math.cos(breathingPhase * Math.PI * 2) * 0.02

    // Very subtle roll synchronized with metric
    camera.rotation.z = Math.sin(metricState.metric * Math.PI * 2 * 0.5) * 0.002

    camera.lookAt(0, 0, 0)
  })

  return null
}

// ============================================================
// STAR FIELD - Simple GPU-based stars with twinkle
// ============================================================

function StarField({ visible = true }: { visible?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const [positions, sizes, randoms] = useMemo(() => {
    const count = 2000
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const rnd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 50 * (0.3 + 0.7 * Math.random())

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      sz[i] = Math.pow(Math.random(), 2.5) * 2
      rnd[i] = Math.random()
    }
    return [pos, sz, rnd]
  }, [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.01
    }
  })

  if (!visible) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float aSize;
          attribute float aRandom;
          varying float vRandom;
          
          void main() {
            vRandom = aRandom;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (250.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying float vRandom;
          
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            float alpha = 1.0 - smoothstep(0.0, 1.0, d);
            alpha *= alpha;
            
            float twinkle = sin(uTime * (1.2 + vRandom * 2.5) + vRandom * 6.28) * 0.2 + 0.8;
            gl_FragColor = vec4(vec3(1.0), alpha * 0.4 * twinkle);
          }
        `}
        uniforms={{
          uTime: { value: 0 },
        }}
      />
    </points>
  )
}

// ============================================================
// PHOTON RING - Simplified unified version
// ============================================================

function PhotonRing({
  metricState,
  ringRadius,
  rotation,
  intensity = 1.0,
  visible = true,
}: {
  metricState: any
  ringRadius: number
  rotation: [number, number, number]
  intensity?: number
  visible?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    
    // Breathing effect synchronized with metric state
    const breathScale = 1.0 + Math.sin(metricState.breathing * Math.PI * 2) * 0.02
    meshRef.current.scale.setScalar(breathScale)
    
    // Subtle intensity pulsing
    const material = meshRef.current.material as THREE.ShaderMaterial
    if (material.uniforms) {
      material.uniforms.uIntensity.value = intensity * (0.9 + Math.sin(metricState.metric * Math.PI * 2) * 0.1)
    }
  })

  if (!visible) return null

  return (
    <mesh ref={meshRef} rotation={rotation}>
      <torusGeometry args={[ringRadius, 0.08, 16, 64]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uIntensity;
          varying vec2 vUv;
          
          void main() {
            // Doppler-like brightness variation
            float brightness = 0.5 + 0.5 * sin(vUv.x * 6.28);
            vec3 color = vec3(1.0, 0.95, 0.85) * uIntensity * brightness;
            float alpha = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
            gl_FragColor = vec4(color, alpha * 0.8);
          }
        `}
        uniforms={{
          uIntensity: { value: intensity },
        }}
      />
    </mesh>
  )
}

// ============================================================
// SCENE - Main scene with unified metric state
// ============================================================

function Scene({ phase = 2 }: { phase?: number }) {
  const { state: metricState } = useMetricState()
  const { viewport, camera } = useThree()
  
  // Detect mobile for performance tuning
  const isMobile = viewport.width < 8 // R3F viewport units

  // Responsive ring radius
  const ringRadius = useMemo(() => {
    const vFOV = (camera.fov * Math.PI) / 180
    const viewportHeight = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z)
    return viewportHeight * 0.45
  }, [viewport.width, viewport.height, camera.fov, camera.position.z])

  const tiltRad = (42 * Math.PI) / 180

  return (
    <>
      {/* Camera drift - metric synchronized */}
      <CameraDrift metricState={metricState} />

      {/* Star field */}
      <StarField visible={phase >= 1} />

      {/* Photon rings group - positioned down for "standing at rim" effect */}
      <group position={[0, -1.2, 0]}>
        {/* Primary photon ring (n=0) */}
        <PhotonRing
          metricState={metricState}
          ringRadius={ringRadius}
          rotation={[tiltRad, 0, 0]}
          intensity={1.2}
          visible={phase >= 2}
        />
        
        {/* Secondary ghost ring (n=1) */}
        <PhotonRing
          metricState={metricState}
          ringRadius={ringRadius * 0.985}
          rotation={[tiltRad, 0, 0]}
          intensity={0.3}
          visible={phase >= 2}
        />
      </group>

      {/* Post-processing - mobile-optimized */}
      <EffectComposer disableNormalPass>
        <Bloom 
          intensity={isMobile ? 0.6 : 1.0} 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
        {!isMobile && <Noise opacity={0.15} />}
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}

// ============================================================
// MAIN COMPONENT - Canvas wrapper with mobile DPR tuning
// ============================================================

export default function AccretionDiskVisualization() {
  return (
    <Canvas
      dpr={[1, 1.5]} // Mobile-optimized DPR
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 8] }}
    >
      <Suspense fallback={null}>
        <Scene phase={2} />
      </Suspense>
    </Canvas>
  )
}
