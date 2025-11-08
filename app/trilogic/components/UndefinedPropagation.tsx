'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// K3 Logic Truth Tables
const K3_AND: Record<string, string> = {
  '0,0': '0', '0,1': '0', '0,∅': '0',
  '1,0': '0', '1,1': '1', '1,∅': '∅',
  '∅,0': '0', '∅,1': '∅', '∅,∅': '∅'
};

const K3_OR: Record<string, string> = {
  '0,0': '0', '0,1': '1', '0,∅': '∅',
  '1,0': '1', '1,1': '1', '1,∅': '1',
  '∅,0': '∅', '∅,1': '1', '∅,∅': '∅'
};

const K3_NOT: Record<string, string> = {
  '0': '1',
  '1': '0',
  '∅': '∅'  // Undefined stays undefined!
};

type TruthValue = '0' | '1' | '∅';
type Operation = 'AND' | 'OR' | 'NOT';

interface OperationStep {
  operation: Operation;
  operand1: TruthValue;
  operand2?: TruthValue;
  result: TruthValue;
  infectionZone: number; // 0-1, how much ∅ has spread
}

// Infection Zone Visualization Component
function InfectionSphere({ infectionZone }: { infectionZone: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.infection.value = infectionZone;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float infection;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Noise function for organic spread
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }
    
    void main() {
      // Create shifting, spreading infection pattern
      float n = noise(vPosition + time * 0.2);
      float spread = smoothstep(0.0, infection, n);
      
      // Undefined color: warm golden-orange
      vec3 undefinedColor = vec3(1.0, 0.7, 0.2);
      
      // Pulsing, breathing opacity
      float pulse = 0.2 + 0.1 * sin(time * 2.0);
      float opacity = spread * (pulse + infection * 0.3);
      
      gl_FragColor = vec4(undefinedColor, opacity);
    }
  `;

  return (
    <mesh ref={meshRef} scale={1.02}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          infection: { value: infectionZone }
        }}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Main Visualization Scene
function PropagationScene({ operations }: { operations: OperationStep[] }) {
  const currentInfection = operations.length > 0 
    ? operations[operations.length - 1].infectionZone 
    : 0;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      {/* Base Riemann Sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          color="#1a1a2e"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Infection Zone */}
      <InfectionSphere infectionZone={currentInfection} />

      {/* Truth Value Markers */}
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

      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}

// Operation Builder UI
export default function UndefinedPropagation() {
  const [operations, setOperations] = useState<OperationStep[]>([]);
  const [operand1, setOperand1] = useState<TruthValue>('∅');
  const [operand2, setOperand2] = useState<TruthValue>('0');
  const [operation, setOperation] = useState<Operation>('AND');

  const executeOperation = () => {
    let result: TruthValue;
    
    if (operation === 'NOT') {
      result = K3_NOT[operand1] as TruthValue;
    } else if (operation === 'AND') {
      result = K3_AND[`${operand1},${operand2}`] as TruthValue;
    } else {
      result = K3_OR[`${operand1},${operand2}`] as TruthValue;
    }

    // Calculate infection zone: how many operations touched ∅
    const hasUndefined = operand1 === '∅' || operand2 === '∅' || result === '∅';
    const prevInfection = operations.length > 0 ? operations[operations.length - 1].infectionZone : 0;
    const newInfection = hasUndefined ? Math.min(1, prevInfection + 0.2) : prevInfection;

    const newOp: OperationStep = {
      operation,
      operand1,
      operand2: operation !== 'NOT' ? operand2 : undefined,
      result,
      infectionZone: newInfection
    };

    setOperations([...operations, newOp]);
  };

  const reset = () => {
    setOperations([]);
  };

  const infectionPercentage = operations.length > 0 
    ? Math.round(operations[operations.length - 1].infectionZone * 100) 
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
          Undefined Propagation Visualizer
        </h3>
        <p className="text-gray-400 mt-2">
          Watch how ∅ (undefined) spreads through logical operations like an infection
        </p>
      </div>

      {/* 3D Visualization */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-purple-500/20 bg-black/30">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <PropagationScene operations={operations} />
        </Canvas>
      </div>

      {/* Infection Meter */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-orange-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Infection Zone</span>
          <span className="text-lg font-bold text-orange-400">{infectionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-orange-500 to-amber-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${infectionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {infectionPercentage === 0 && "No undefined values yet"}
          {infectionPercentage > 0 && infectionPercentage < 50 && "∅ is starting to spread..."}
          {infectionPercentage >= 50 && infectionPercentage < 100 && "∅ infection spreading rapidly!"}
          {infectionPercentage === 100 && "Complete ∅ saturation - undefined everywhere"}
        </p>
      </div>

      {/* Operation Builder */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-6 border border-purple-500/30">
        <h4 className="text-lg font-semibold text-purple-300 mb-4">Build Logical Expression</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Operand 1 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Operand 1</label>
            <select
              value={operand1}
              onChange={(e) => setOperand1(e.target.value as TruthValue)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="0">0 (False)</option>
              <option value="1">1 (True)</option>
              <option value="∅">∅ (Undefined)</option>
            </select>
          </div>

          {/* Operation */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as Operation)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="AND">∧ AND</option>
              <option value="OR">∨ OR</option>
              <option value="NOT">¬ NOT</option>
            </select>
          </div>

          {/* Operand 2 (if not NOT) */}
          {operation !== 'NOT' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Operand 2</label>
              <select
                value={operand2}
                onChange={(e) => setOperand2(e.target.value as TruthValue)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="0">0 (False)</option>
                <option value="1">1 (True)</option>
                <option value="∅">∅ (Undefined)</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={executeOperation}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2 px-4 rounded transition-all"
          >
            Execute Operation
          </button>
          <button
            onClick={reset}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Operation History */}
      {operations.length > 0 && (
        <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Operation Chain</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {operations.map((op, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">#{idx + 1}</span>
                <span className={op.operand1 === '∅' ? 'text-orange-400 font-bold' : 'text-gray-300'}>
                  {op.operand1}
                </span>
                <span className="text-purple-400">{op.operation === 'AND' ? '∧' : op.operation === 'OR' ? '∨' : '¬'}</span>
                {op.operand2 && (
                  <span className={op.operand2 === '∅' ? 'text-orange-400 font-bold' : 'text-gray-300'}>
                    {op.operand2}
                  </span>
                )}
                <span className="text-gray-500">=</span>
                <span className={op.result === '∅' ? 'text-orange-400 font-bold' : 'text-gray-300'}>
                  {op.result}
                </span>
                {op.result === '∅' && (
                  <span className="text-xs text-orange-500 ml-2">⚠ Infection!</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-gradient-to-r from-amber-900/10 to-orange-900/10 rounded-lg p-4 border border-orange-500/20">
        <h4 className="text-sm font-semibold text-orange-300 mb-2">💡 Key Insight</h4>
        <p className="text-sm text-gray-300">
          In K3 logic, <span className="text-orange-400 font-bold">∅ (undefined)</span> propagates through most operations.
          Once undefined enters a logical expression, it tends to "infect" the result—similar to how <code className="text-pink-400">NaN</code> spreads in floating-point arithmetic.
          This isn't a bug—it's a feature that preserves uncertainty through computation.
        </p>
      </div>
    </div>
  );
}
