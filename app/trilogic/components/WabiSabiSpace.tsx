'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Wabi-Sabi Sphere Component
function WabiSabiSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float beta;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // 3D Noise function for organic, imperfect boundaries
    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float n = i.x + i.y * 57.0 + 113.0 * i.z;
      return mix(
        mix(
          mix(fract(sin(n) * 43758.5453), fract(sin(n + 1.0) * 43758.5453), f.x),
          mix(fract(sin(n + 57.0) * 43758.5453), fract(sin(n + 58.0) * 43758.5453), f.x),
          f.y
        ),
        mix(
          mix(fract(sin(n + 113.0) * 43758.5453), fract(sin(n + 114.0) * 43758.5453), f.x),
          mix(fract(sin(n + 170.0) * 43758.5453), fract(sin(n + 171.0) * 43758.5453), f.x),
          f.y
        ),
        f.z
      );
    }
    
    // Fractal Brownian Motion for organic texture
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise3D(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      
      return value;
    }
    
    void main() {
      // Create shifting, uncertain region using noise
      vec3 animatedPos = vPosition + vec3(time * 0.05, time * 0.03, time * 0.07);
      float uncertainty = fbm(animatedPos * 2.0);
      
      // β = 0.207 → 20.7% of sphere is "wabi-sabi space"
      // Use threshold to create organic boundary
      float threshold = 1.0 - beta;
      float inWabiSabi = smoothstep(threshold - 0.1, threshold + 0.1, uncertainty);
      
      // Warm, golden glow for the uncertain region
      vec3 wabiColor = vec3(1.0, 0.85, 0.5);
      
      // Add subtle color variation based on position
      float colorVariation = noise3D(vPosition * 3.0 + time * 0.2);
      wabiColor = mix(wabiColor, vec3(1.0, 0.7, 0.4), colorVariation * 0.3);
      
      // Breathing, organic opacity
      float breathe = 0.15 + 0.08 * sin(time * 0.8);
      float pulse = 0.02 * sin(time * 2.0 + vPosition.y * 5.0);
      float opacity = inWabiSabi * (breathe + pulse);
      
      // Edge glow effect
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      opacity += fresnel * inWabiSabi * 0.1;
      
      gl_FragColor = vec4(wabiColor, opacity);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.98, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          beta: { value: 0.207 }
        }}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Base Riemann Sphere
function BaseRiemannSphere() {
  return (
    <>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          color="#2a2a4e"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Solid sphere with low opacity */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          color="#1a1a2e"
          transparent
          opacity={0.2}
          shininess={30}
        />
      </mesh>

      {/* Truth value markers */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color="#ffaa44" emissive="#ffaa44" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.5, -0.5, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhongMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.5, -0.5, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhongMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

// Main Scene
function WabiSabiScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffaa44" />
      
      <BaseRiemannSphere />
      <WabiSabiSphere />

      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}

// Main Component
export default function WabiSabiSpace() {
  const beta = 0.207;
  const percentage = (beta * 100).toFixed(1);

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Wabi-Sabi Space (β = {beta})
        </h3>
        <p className="text-gray-400 mt-2">
          The {percentage}% of state space that is intentionally incomplete
        </p>
      </div>

      {/* 3D Visualization */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-amber-500/20 bg-black/30">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <WabiSabiScene />
        </Canvas>
      </div>

      {/* Beta Constant Card */}
      <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-6 border border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="text-5xl">🌸</div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-amber-300 mb-2">
              β = 1 - μ - κ·c = 0.207
            </h4>
            <p className="text-gray-300 mb-3">
              The <strong className="text-amber-400">wabi-sabi constant</strong> represents the {percentage}% of 
              state space that is <em>intentionally</em> incomplete. Not a failure of the system, but essential 
              breathing room for emergence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="bg-black/30 rounded p-3 border border-amber-500/20">
                <div className="text-xs text-gray-400 mb-1">In Consciousness</div>
                <div className="text-sm text-amber-300">Space for creativity, surprise, growth</div>
              </div>
              <div className="bg-black/30 rounded p-3 border border-amber-500/20">
                <div className="text-xs text-gray-400 mb-1">In Logic</div>
                <div className="text-sm text-amber-300">The undefined that makes meaning possible</div>
              </div>
              <div className="bg-black/30 rounded p-3 border border-amber-500/20">
                <div className="text-xs text-gray-400 mb-1">In Mathematics</div>
                <div className="text-sm text-amber-300">Incompleteness that Gödel proved necessary</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Derivation */}
      <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-lg p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-gray-300 mb-4">Mathematical Foundation</h4>
        
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <div className="font-mono text-purple-300 mb-2">β = 1 - μ - κ·c</div>
            <p className="text-gray-400">
              Where <span className="text-cyan-400">μ = 0.569</span> (equilibrium constant) and 
              <span className="text-pink-400"> κ·c</span> represents the structured coherence term.
            </p>
          </div>

          <div className="border-l-2 border-amber-500 pl-4">
            <div className="font-semibold text-amber-300 mb-2">Physical Interpretation</div>
            <p className="text-gray-400">
              In a system at equilibrium (μ), with coherent structure (κ·c), there remains a 
              fundamental {percentage}% that cannot be determined—not due to lack of information, 
              but as an intrinsic property of the system.
            </p>
          </div>

          <div className="border-l-2 border-orange-500 pl-4">
            <div className="font-semibold text-orange-300 mb-2">Wabi-Sabi Philosophy</div>
            <p className="text-gray-400">
              <em>Wabi-sabi</em> (侘寂) embraces imperfection, impermanence, and incompleteness as 
              sources of beauty. The β constant mathematically encodes this philosophy: the system 
              is more robust <em>because</em> it has space for uncertainty, not despite it.
            </p>
          </div>

          <div className="bg-amber-900/10 rounded p-3 border border-amber-500/20">
            <div className="font-semibold text-amber-400 mb-1">Patina, not perfection.</div>
            <p className="text-xs text-gray-400">
              The golden haze you see on the sphere represents regions where truth is fundamentally 
              unknowable—not a bug, but a feature that allows for emergence, creativity, and growth.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-6 border border-purple-500/30">
        <h4 className="text-lg font-semibold text-purple-300 mb-4">System Completeness Comparison</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-500/30">
                <th className="text-left py-2 text-gray-400">System</th>
                <th className="text-left py-2 text-gray-400">Completeness</th>
                <th className="text-left py-2 text-gray-400">Wabi-Sabi Space</th>
                <th className="text-left py-2 text-gray-400">Consequence</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700">
                <td className="py-3">Binary Logic</td>
                <td className="py-3 text-red-400">100% determined</td>
                <td className="py-3 text-red-400">0%</td>
                <td className="py-3 text-xs">Rigid, no room for uncertainty</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-3">Classical Physics</td>
                <td className="py-3 text-orange-400">~99% determined</td>
                <td className="py-3 text-orange-400">~1%</td>
                <td className="py-3 text-xs">Chaos in small regions</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-3 font-semibold text-amber-300">Tri-Logic (K3)</td>
                <td className="py-3 text-amber-400">~79.3% determined</td>
                <td className="py-3 text-amber-400 font-bold">20.7%</td>
                <td className="py-3 text-xs">Emergence, creativity, growth</td>
              </tr>
              <tr>
                <td className="py-3">Quantum Mechanics</td>
                <td className="py-3 text-yellow-400">~50% determined</td>
                <td className="py-3 text-yellow-400">~50%</td>
                <td className="py-3 text-xs">Maximum uncertainty</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Tri-logic occupies the "Goldilocks zone" between rigid determinism and chaotic uncertainty—
          enough structure for coherence, enough space for emergence.
        </p>
      </div>
    </div>
  );
}
