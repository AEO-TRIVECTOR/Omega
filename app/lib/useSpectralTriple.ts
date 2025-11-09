import { useEffect, useState } from 'react';

export interface SpectralTripleResult {
  n: number;
  stationary: number[];
  eigenvalues: number[];
  dirac: number[];
  distances: number[];
  conditioning: {
    spectral_gap: number;
    epsilon: number;
    max_commutator_norm: number;
    ill_conditioned: boolean;
  };
}

let wasmReady: Promise<any> | null = null;
async function initWasm() {
  if (!wasmReady) {
    // Use webpackIgnore to prevent webpack from trying to bundle this at build time
    // The WASM module will be loaded at runtime from the public folder
    // @ts-ignore
    wasmReady = import(/* webpackIgnore: true */ '/wasm/connes_distance_wasm.js').then(m => m.default().then(() => m));
  }
  return wasmReady;
}

export function useSpectralTriple(P: number[][], epsilon = 0.001) {
  const [result, setResult] = useState<SpectralTripleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const wasm = await initWasm();
        const n = P.length;
        const flat = new Float64Array(P.flat());
        const out: SpectralTripleResult = wasm.compute_spectral_triple(flat, n, epsilon);
        if (!cancelled) setResult(out);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [JSON.stringify(P), epsilon]);

  return { result, error, loading };
}

// Expose module for validation helper
export async function getWasmModule(): Promise<any> {
  // Use webpackIgnore to prevent webpack from trying to bundle this at build time
  // @ts-ignore
  const mod = await import(/* webpackIgnore: true */ '/wasm/connes_distance_wasm.js').then(m => m.default().then(() => m));
  return mod;
}

export function unpackSquare(flat: number[], n: number) {
  const M: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) M[i][j] = flat[i * n + j];
  return M;
}
