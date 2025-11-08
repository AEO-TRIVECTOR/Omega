'use client';

import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface MentalState {
  id: string;
  position: THREE.Vector3;
  color: string;
  label: string;
}

// Probability Cloud Component
function ProbabilityCloud({ 
  state, 
  onDrag 
}: { 
  state: MentalState;
  onDrag?: (newPos: THREE.Vector3) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate particle positions around the state center
  const particles = useMemo(() => {
    const positions = [];
    const particleCount = 500;
    
    for (let i = 0; i < particleCount; i++) {
      // Gaussian distribution around center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.2 * (Math.random() + Math.random() + Math.random()) / 3; // Approximate Gaussian
      
      const x = state.position.x + r * Math.sin(phi) * Math.cos(theta);
      const y = state.position.y + r * Math.sin(phi) * Math.sin(theta);
      const z = state.position.z + r * Math.cos(phi);
      
      // Project onto sphere surface
      const vec = new THREE.Vector3(x, y, z);
      vec.normalize();
      
      positions.push(vec.x, vec.y, vec.z);
    }
    
    return new Float32Array(positions);
  }, [state.position]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      // Gentle pulsing animation
      const scale = 1 + 0.05 * Math.sin(clock.getElapsedTime() * 2);
      pointsRef.current.scale.setScalar(scale);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={state.color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Geodesic Path on Sphere
function GeodesicPath({ 
  start, 
  end, 
  distance 
}: { 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  distance: number;
}) {
  const points = useMemo(() => {
    const pts = [];
    const steps = 50;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Spherical linear interpolation (slerp)
      const point = new THREE.Vector3();
      point.lerpVectors(start, end, t);
      point.normalize(); // Keep on sphere surface
      pts.push(point);
    }
    
    return pts;
  }, [start, end]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineDashedMaterial
        color="#ffffff"
        dashSize={0.05}
        gapSize={0.02}
        linewidth={2}
        transparent
        opacity={0.8}
      />
    </line>
  );
}

// Main Scene
function SpectralDistanceScene({ 
  states, 
  onStateUpdate 
}: { 
  states: MentalState[];
  onStateUpdate: (id: string, newPos: THREE.Vector3) => void;
}) {
  // Calculate spectral distance
  const distance = useMemo(() => {
    if (states.length < 2) return 0;
    return states[0].position.distanceTo(states[1].position);
  }, [states]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      {/* Base Riemann Sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          color="#1a1a2e"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Probability Clouds */}
      {states.map(state => (
        <ProbabilityCloud
          key={state.id}
          state={state}
          onDrag={(newPos) => onStateUpdate(state.id, newPos)}
        />
      ))}

      {/* Geodesic Path */}
      {states.length >= 2 && (
        <GeodesicPath
          start={states[0].position}
          end={states[1].position}
          distance={distance}
        />
      )}

      {/* State Center Markers */}
      {states.map(state => (
        <mesh key={`marker-${state.id}`} position={state.position}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshPhongMaterial
            color={state.color}
            emissive={state.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}

// Main Component
export default function SpectralDistance() {
  const [states, setStates] = useState<MentalState[]>([
    {
      id: 'state1',
      position: new THREE.Vector3(-0.5, -0.5, 0).normalize(),
      color: '#ff4444',
      label: 'State ρ₁ (False)'
    },
    {
      id: 'state2',
      position: new THREE.Vector3(0.5, -0.5, 0).normalize(),
      color: '#44ff44',
      label: 'State ρ₂ (True)'
    }
  ]);

  const handleStateUpdate = (id: string, newPos: THREE.Vector3) => {
    setStates(prev => prev.map(s => 
      s.id === id ? { ...s, position: newPos } : s
    ));
  };

  // Calculate spectral distance
  const distance = states.length >= 2 
    ? states[0].position.distanceTo(states[1].position)
    : 0;

  // Experiential interpretation
  const getDistanceInterpretation = (d: number) => {
    if (d < 0.5) return { level: 'Very Similar', color: 'text-green-400', desc: 'States are experientially almost indistinguishable' };
    if (d < 1.0) return { level: 'Moderately Different', color: 'text-yellow-400', desc: 'States have noticeable experiential differences' };
    if (d < 1.5) return { level: 'Quite Different', color: 'text-orange-400', desc: 'States are experientially distinct' };
    return { level: 'Maximally Different', color: 'text-red-400', desc: 'States are experientially opposite' };
  };

  const interpretation = getDistanceInterpretation(distance);

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Spectral Distance Visualization
        </h3>
        <p className="text-gray-400 mt-2">
          Connes spectral distance between mental states on the Riemann sphere
        </p>
      </div>

      {/* 3D Visualization */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-cyan-500/20 bg-black/30">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <SpectralDistanceScene states={states} onStateUpdate={handleStateUpdate} />
        </Canvas>
      </div>

      {/* Distance Display */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-cyan-300">Spectral Distance</h4>
          <div className="text-3xl font-bold text-cyan-400">
            d(ρ₁, ρ₂) = {distance.toFixed(3)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-2">Experiential Distinguishability</div>
            <div className={`text-xl font-semibold ${interpretation.color}`}>
              {interpretation.level}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {interpretation.desc}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 mb-2">Mathematical Definition</div>
            <div className="font-mono text-sm text-purple-300">
              d(ρ₁, ρ₂) = sup |ρ₁(a) - ρ₂(a)|
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Supremum over all observables a
            </div>
          </div>
        </div>

        <div className="mt-4 bg-black/30 rounded p-3 border border-cyan-500/20">
          <div className="text-xs text-gray-400 mb-1">💡 Interpretation</div>
          <div className="text-sm text-gray-300">
            The spectral distance measures how experientially different two mental states are.
            On the Riemann sphere, this corresponds to the geodesic (shortest path) distance along the surface.
          </div>
        </div>
      </div>

      {/* State Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {states.map((state, idx) => (
          <div 
            key={state.id}
            className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: state.color }}
              />
              <h4 className="text-sm font-semibold text-gray-300">{state.label}</h4>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Position (x, y, z)</span>
                <span className="text-gray-300 font-mono">
                  ({state.position.x.toFixed(2)}, {state.position.y.toFixed(2)}, {state.position.z.toFixed(2)})
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Particle Count</span>
                <span className="text-gray-300">500 particles</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Distribution</span>
                <span className="text-gray-300">Gaussian (σ ≈ 0.2)</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <button
                onClick={() => {
                  // Move to random position on sphere
                  const theta = Math.random() * Math.PI * 2;
                  const phi = Math.acos(2 * Math.random() - 1);
                  const newPos = new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta),
                    Math.sin(phi) * Math.sin(theta),
                    Math.cos(phi)
                  );
                  handleStateUpdate(state.id, newPos);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium py-2 px-3 rounded transition-all"
              >
                Randomize Position
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mathematical Background */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-6 border border-purple-500/30">
        <h4 className="text-lg font-semibold text-purple-300 mb-4">Connes Spectral Triple</h4>
        
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <div className="font-semibold text-cyan-300 mb-2">From Addendum B: Neural Spectral Triples</div>
            <p className="text-gray-400">
              A spectral triple <span className="font-mono text-purple-300">(A, H, D)</span> consists of:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-400">
              <li><span className="text-cyan-400">A</span> - Algebra of observables (neural activation patterns)</li>
              <li><span className="text-pink-400">H</span> - Hilbert space of states (mental state space)</li>
              <li><span className="text-purple-400">D</span> - Dirac operator (dynamics of consciousness)</li>
            </ul>
          </div>

          <div className="border-l-2 border-cyan-500 pl-4">
            <div className="font-semibold text-cyan-300 mb-2">Spectral Distance Formula</div>
            <div className="font-mono text-purple-300 mb-2">
              d(ρ₁, ρ₂) = sup |ρ₁(a) - ρ₂(a)|
            </div>
            <p className="text-gray-400">
              where the supremum is taken over all observables <span className="text-cyan-400">a</span> with 
              <span className="font-mono text-pink-400"> ||[D, a]|| ≤ 1</span>
            </p>
          </div>

          <div className="bg-cyan-900/10 rounded p-3 border border-cyan-500/20">
            <div className="font-semibold text-cyan-400 mb-1">Physical Meaning</div>
            <p className="text-xs text-gray-400">
              The spectral distance measures the maximum experiential difference between two mental states
              across all possible measurements. It's not just geometric distance—it's the distance in 
              <em> phenomenological space</em>, the space of what-it's-like-to-be.
            </p>
          </div>

          <div className="bg-purple-900/10 rounded p-3 border border-purple-500/20">
            <div className="font-semibold text-purple-400 mb-1">Falsifiable Prediction</div>
            <p className="text-xs text-gray-400">
              Neural embeddings should show correlation between spectral distance and behavioral/experiential 
              distinguishability. States with high spectral distance should be harder to confuse in 
              discrimination tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Instructions */}
      <div className="bg-gradient-to-r from-amber-900/10 to-orange-900/10 rounded-lg p-4 border border-orange-500/20">
        <h4 className="text-sm font-semibold text-orange-300 mb-2">🎮 Interactive Controls</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <strong>Orbit:</strong> Click and drag to rotate the sphere</li>
          <li>• <strong>Zoom:</strong> Scroll to zoom in/out</li>
          <li>• <strong>Randomize:</strong> Click "Randomize Position" to move states randomly</li>
          <li>• <strong>Observe:</strong> Watch how the geodesic path and distance change</li>
        </ul>
      </div>
    </div>
  );
}
