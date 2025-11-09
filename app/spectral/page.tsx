'use client';

import React, { useMemo, useState } from 'react';
import { useSpectralTriple, unpackSquare } from '@/app/lib/useSpectralTriple';
import { TransitionMatrixEditor } from '@/app/components/TransitionMatrixEditor';
import { DistanceHeatmap } from '@/app/components/DistanceHeatmap';
import { EigenvalueSpectrum } from '@/app/components/EigenvalueSpectrum';
import { AddendumBValidation } from '@/app/components/AddendumBValidation';

const PRESETS: Record<string, { matrix: number[][], labels: string[] }> = {
  'Addendum B (3-state)': {
    matrix: [
      [0.95, 0.05, 0.00],
      [0.02, 0.94, 0.04],
      [0.00, 0.05, 0.95],
    ],
    labels: ['State 1', 'State 2', 'State 3'],
  },
  'Strong Separation': {
    matrix: [
      [0.99, 0.01, 0.00],
      [0.01, 0.98, 0.01],
      [0.00, 0.01, 0.99],
    ],
    labels: ['A', 'B', 'C'],
  },
  'Weak Separation': {
    matrix: [
      [0.70, 0.20, 0.10],
      [0.15, 0.70, 0.15],
      [0.10, 0.20, 0.70],
    ],
    labels: ['X', 'Y', 'Z'],
  },
};

export default function SpectralPage() {
  const [presetKey, setPresetKey] = useState<keyof typeof PRESETS>('Addendum B (3-state)');
  const [matrix, setMatrix] = useState<number[][]>(PRESETS[presetKey].matrix);
  const [labels, setLabels] = useState<string[]>(PRESETS[presetKey].labels);
  const [epsilon, setEpsilon] = useState(0.001);

  const { result, loading, error } = useSpectralTriple(matrix, epsilon);
  const distances2D = useMemo(() => {
    if (!result) return null;
    return unpackSquare(result.distances, result.n);
  }, [result]);

  function loadPreset(k: keyof typeof PRESETS) {
    setPresetKey(k);
    setMatrix(PRESETS[k].matrix);
    setLabels(PRESETS[k].labels);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold">Spectral Triple Geometry</h1>
        <p className="opacity-80">Compute Dirac operator and Connes distances for finite Markov models.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl p-4 border border-neutral-700 space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm opacity-80">Preset</label>
              <select
                className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700"
                value={presetKey}
                onChange={e => loadPreset(e.target.value as any)}
              >
                {Object.keys(PRESETS).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>

              <div className="ml-auto flex items-center gap-3">
                <label className="text-sm opacity-80">ε</label>
                <input
                  type="range" min="0.0001" max="0.01" step="0.0001"
                  value={epsilon}
                  onChange={e => setEpsilon(parseFloat(e.target.value))}
                />
                <span className="text-sm tabular-nums">{epsilon.toFixed(4)}</span>
              </div>
            </div>

            <TransitionMatrixEditor
              matrix={matrix}
              onChange={setMatrix}
              labels={labels}
              onLabelsChange={setLabels}
              maxN={10}
            />
          </div>

          {loading && (
            <div className="rounded-2xl p-4 border border-neutral-700">
              Computing spectral triple via WASM…
            </div>
          )}

          {error && (
            <div className="rounded-2xl p-4 border border-rose-700 bg-rose-950/40">
              <h3 className="font-semibold mb-1">Computation Error</h3>
              <pre className="text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {result && distances2D && <DistanceHeatmap distances={distances2D} labels={labels} />}
        </div>

        <aside className="space-y-4">
          {result && (
            <>
              {result.conditioning.ill_conditioned && (
                <div className="rounded-2xl p-4 border border-amber-700 bg-amber-900/20">
                  <div className="font-semibold">∅ Ill-conditioned</div>
                  <div className="text-sm opacity-80">
                    Tiny spectral gap or nonzero λ₀; results may be numerically fragile.
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-4 border border-neutral-700">
                <h3 className="font-semibold mb-2">Stationary Distribution π</h3>
                <div className="space-y-1 text-sm">
                  {result.stationary.map((pi, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-24 opacity-70">{labels[i]}</div>
                      <div className="flex-1 bg-neutral-800 rounded h-2 overflow-hidden">
                        <div className="bg-emerald-400 h-2" style={{ width: `${(pi * 100).toFixed(2)}%` }} />
                      </div>
                      <div className="w-20 text-right tabular-nums">{pi.toFixed(4)}</div>
                    </div>
                  ))}
                  <div className="text-xs opacity-70">
                    Sum: {result.stationary.reduce((a, b) => a + b, 0).toFixed(6)}
                  </div>
                </div>
              </div>

              <EigenvalueSpectrum
                eigenvalues={result.eigenvalues}
                spectralGap={result.conditioning.spectral_gap}
              />

              <AddendumBValidation />
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
