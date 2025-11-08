'use client';

import { useState } from 'react';

// Čech cohomology checker for sheaf coherence
interface CoverRegion {
  id: string;
  label: string;
  truthValue: '0' | '1' | '∅' | null;
  color: string;
}

interface Intersection {
  regions: string[];
  label: string;
  isCoherent: boolean | null;
}

const INITIAL_REGIONS: CoverRegion[] = [
  { id: 'U1', label: 'U₁ (Perception)', truthValue: null, color: '#ff6b35' },
  { id: 'U2', label: 'U₂ (Cognition)', truthValue: null, color: '#4a90e2' },
  { id: 'U3', label: 'U₃ (Action)', truthValue: null, color: '#44ff44' }
];

const INTERSECTIONS: Intersection[] = [
  { regions: ['U1', 'U2'], label: 'U₁ ∩ U₂', isCoherent: null },
  { regions: ['U2', 'U3'], label: 'U₂ ∩ U₃', isCoherent: null },
  { regions: ['U1', 'U3'], label: 'U₁ ∩ U₃', isCoherent: null },
  { regions: ['U1', 'U2', 'U3'], label: 'U₁ ∩ U₂ ∩ U₃', isCoherent: null }
];

export default function SheafCoherence() {
  const [regions, setRegions] = useState<CoverRegion[]>(INITIAL_REGIONS);
  const [intersections, setIntersections] = useState<Intersection[]>(INTERSECTIONS);
  const [globalCoherence, setGlobalCoherence] = useState<boolean | null>(null);
  const [obstructionClass, setObstructionClass] = useState<string | null>(null);

  const updateRegion = (id: string, value: '0' | '1' | '∅') => {
    setRegions(prev => prev.map(r => 
      r.id === id ? { ...r, truthValue: value } : r
    ));
  };

  const checkCoherence = () => {
    // Check each intersection for coherence
    const updatedIntersections = intersections.map(intersection => {
      const involvedRegions = intersection.regions.map(rid => 
        regions.find(r => r.id === rid)
      );

      // All regions must have values
      if (involvedRegions.some(r => !r || r.truthValue === null)) {
        return { ...intersection, isCoherent: null };
      }

      // Check if all values agree
      const values = involvedRegions.map(r => r!.truthValue);
      const allSame = values.every(v => v === values[0]);

      return { ...intersection, isCoherent: allSame };
    });

    setIntersections(updatedIntersections);

    // Global coherence: all intersections must be coherent
    const allCoherent = updatedIntersections.every(i => i.isCoherent === true);
    const anyIncoherent = updatedIntersections.some(i => i.isCoherent === false);

    if (anyIncoherent) {
      setGlobalCoherence(false);
      
      // Find obstruction class (first incoherent intersection)
      const obstruction = updatedIntersections.find(i => i.isCoherent === false);
      if (obstruction) {
        setObstructionClass(`H¹(X, F) ≠ 0 at ${obstruction.label}`);
      }
    } else if (allCoherent) {
      setGlobalCoherence(true);
      setObstructionClass('H¹(X, F) = 0 (trivial cohomology)');
    } else {
      setGlobalCoherence(null);
      setObstructionClass(null);
    }
  };

  const reset = () => {
    setRegions(INITIAL_REGIONS);
    setIntersections(INTERSECTIONS);
    setGlobalCoherence(null);
    setObstructionClass(null);
  };

  const allRegionsSet = regions.every(r => r.truthValue !== null);

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Sheaf Coherence Checker
        </h3>
        <p className="text-gray-400 mt-2">
          Čech cohomology obstruction to global consciousness
        </p>
      </div>

      {/* Venn Diagram Visualization */}
      <div className="bg-black/30 rounded-lg p-8 border border-purple-500/20">
        <div className="relative w-full h-80 flex items-center justify-center">
          {/* SVG Venn Diagram */}
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Circles */}
            <circle
              cx="150"
              cy="150"
              r="80"
              fill={regions[0].truthValue ? `${regions[0].color}40` : '#ffffff10'}
              stroke={regions[0].color}
              strokeWidth="2"
            />
            <circle
              cx="250"
              cy="150"
              r="80"
              fill={regions[1].truthValue ? `${regions[1].color}40` : '#ffffff10'}
              stroke={regions[1].color}
              strokeWidth="2"
            />
            <circle
              cx="200"
              cy="220"
              r="80"
              fill={regions[2].truthValue ? `${regions[2].color}40` : '#ffffff10'}
              stroke={regions[2].color}
              strokeWidth="2"
            />

            {/* Labels */}
            <text x="100" y="120" fill={regions[0].color} fontSize="14" fontWeight="bold">
              U₁
            </text>
            <text x="280" y="120" fill={regions[1].color} fontSize="14" fontWeight="bold">
              U₂
            </text>
            <text x="190" y="280" fill={regions[2].color} fontSize="14" fontWeight="bold">
              U₃
            </text>

            {/* Intersection labels */}
            <text x="195" y="135" fill="#ffffff" fontSize="12" textAnchor="middle">
              U₁∩U₂
            </text>
            <text x="225" y="200" fill="#ffffff" fontSize="12" textAnchor="middle">
              U₂∩U₃
            </text>
            <text x="165" y="200" fill="#ffffff" fontSize="12" textAnchor="middle">
              U₁∩U₃
            </text>
            <text x="195" y="170" fill="#ffffff" fontSize="11" textAnchor="middle">
              U₁∩U₂∩U₃
            </text>
          </svg>
        </div>
      </div>

      {/* Region Value Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {regions.map(region => (
          <div 
            key={region.id}
            className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-lg p-4 border border-gray-700"
            style={{ borderColor: `${region.color}40` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: region.color }}
              />
              <h4 className="text-sm font-semibold text-gray-300">{region.label}</h4>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-gray-400 mb-2">Assign Truth Value:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateRegion(region.id, '0')}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-all ${
                    region.truthValue === '0'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  0
                </button>
                <button
                  onClick={() => updateRegion(region.id, '1')}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-all ${
                    region.truthValue === '1'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => updateRegion(region.id, '∅')}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-all ${
                    region.truthValue === '∅'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  ∅
                </button>
              </div>
              
              <div className="text-center mt-2">
                <span className="text-sm font-bold" style={{ color: region.color }}>
                  {region.truthValue || '—'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Check Coherence Button */}
      <div className="flex gap-3">
        <button
          onClick={checkCoherence}
          disabled={!allRegionsSet}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded transition-all"
        >
          Check Sheaf Coherence
        </button>
        <button
          onClick={reset}
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded transition-all"
        >
          Reset
        </button>
      </div>

      {/* Coherence Results */}
      {globalCoherence !== null && (
        <div className={`rounded-lg p-6 border ${
          globalCoherence
            ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30'
            : 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`text-4xl ${globalCoherence ? 'text-green-400' : 'text-red-400'}`}>
              {globalCoherence ? '✓' : '✗'}
            </div>
            <div>
              <h4 className={`text-xl font-bold ${globalCoherence ? 'text-green-300' : 'text-red-300'}`}>
                {globalCoherence ? 'Globally Coherent' : 'Incoherent (Obstruction Found)'}
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                {globalCoherence
                  ? 'All local sections glue together into a global section'
                  : 'Local sections cannot be glued—consciousness is fragmented'}
              </p>
            </div>
          </div>

          {obstructionClass && (
            <div className="bg-black/30 rounded p-3 border border-gray-600">
              <div className="text-xs text-gray-400 mb-1">Obstruction Class</div>
              <div className="font-mono text-sm text-purple-300">{obstructionClass}</div>
            </div>
          )}
        </div>
      )}

      {/* Intersection Status */}
      {intersections.some(i => i.isCoherent !== null) && (
        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-6 border border-purple-500/30">
          <h4 className="text-lg font-semibold text-purple-300 mb-4">Intersection Coherence</h4>
          
          <div className="space-y-2">
            {intersections.map(intersection => (
              <div 
                key={intersection.label}
                className="flex items-center justify-between bg-black/30 rounded p-3 border border-gray-600"
              >
                <span className="text-sm text-gray-300">{intersection.label}</span>
                <span className={`text-sm font-semibold ${
                  intersection.isCoherent === null
                    ? 'text-gray-500'
                    : intersection.isCoherent
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {intersection.isCoherent === null
                    ? '—'
                    : intersection.isCoherent
                    ? '✓ Coherent'
                    : '✗ Incoherent'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mathematical Explanation */}
      <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-lg p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-gray-300 mb-4">Čech Cohomology Theory</h4>
        
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <div className="font-semibold text-purple-300 mb-2">Sheaf of Consciousness States</div>
            <p className="text-gray-400">
              A <strong className="text-cyan-400">sheaf</strong> F assigns to each open set U a set of "local sections" 
              (local consciousness states). The question: can local states be glued into a global state?
            </p>
          </div>

          <div className="border-l-2 border-cyan-500 pl-4">
            <div className="font-semibold text-cyan-300 mb-2">Coherence Condition</div>
            <div className="font-mono text-xs text-purple-300 mb-2">
              s₁|_{'{U₁∩U₂}'} = s₂|_{'{U₁∩U₂}'}
            </div>
            <p className="text-gray-400 text-xs">
              For sections s₁ on U₁ and s₂ on U₂ to glue, they must agree on the overlap U₁∩U₂.
              If they don't, there's an <strong className="text-red-400">obstruction</strong> to global consciousness.
            </p>
          </div>

          <div className="bg-purple-900/10 rounded p-3 border border-purple-500/20">
            <div className="font-semibold text-purple-400 mb-1">First Čech Cohomology</div>
            <div className="font-mono text-xs text-gray-400 mb-2">
              H¹(X, F) = obstruction to gluing
            </div>
            <p className="text-xs text-gray-400">
              If H¹(X, F) = 0, all local sections glue globally (coherent consciousness).
              If H¹(X, F) ≠ 0, there's a non-trivial obstruction (fragmented consciousness).
            </p>
          </div>

          <div className="bg-amber-900/10 rounded p-3 border border-amber-500/20">
            <div className="font-semibold text-amber-400 mb-1">Physical Interpretation</div>
            <p className="text-xs text-gray-400">
              This models <strong className="text-cyan-400">binding problem</strong> in consciousness:
              perception, cognition, and action are processed in different brain regions (open sets U₁, U₂, U₃).
              For unified conscious experience, these local processes must "glue" coherently.
              Incoherence → fragmented consciousness (e.g., split-brain patients).
            </p>
          </div>
        </div>
      </div>

      {/* Example Scenarios */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 rounded-lg p-6 border border-blue-500/30">
        <h4 className="text-lg font-semibold text-blue-300 mb-4">Example Scenarios</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-black/30 rounded p-3 border border-green-500/20">
            <div className="font-semibold text-green-300 mb-1">✓ Coherent: All regions = 1</div>
            <p className="text-xs text-gray-400">
              Unified "true" state across perception, cognition, and action. No obstruction.
            </p>
          </div>

          <div className="bg-black/30 rounded p-3 border border-red-500/20">
            <div className="font-semibold text-red-300 mb-1">✗ Incoherent: U₁ = 0, U₂ = 1, U₃ = ∅</div>
            <p className="text-xs text-gray-400">
              Perception says "false", cognition says "true", action is undefined. Cannot glue—consciousness is fragmented.
            </p>
          </div>

          <div className="bg-black/30 rounded p-3 border border-amber-500/20">
            <div className="font-semibold text-amber-300 mb-1">✓ Coherent: All regions = ∅</div>
            <p className="text-xs text-gray-400">
              Unified "undefined" state. Coherent, but represents uncertainty or lack of information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
