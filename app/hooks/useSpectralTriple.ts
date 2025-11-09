'use client';

import { useEffect, useState } from 'react';

export interface SpectralTripleResult {
  n: number;
  stationary: number[];          // length n
  eigenvalues: number[];         // Dirac/Laplacian spectrum (as returned by wasm)
  dirac: number[];               // flattened n x n (if exported by wasm)
  distances: number[];           // flattened n x n Connes distances
  conditioning: {
    spectral_gap: number;
    epsilon: number;
    max_commutator_norm: number;
    ill_conditioned: boolean;
  };
}

let wasmModule: any = null;
let wasmLoading: Promise<any> | null = null;

async function loadWasmModule() {
  if (wasmModule) return wasmModule;
  if (wasmLoading) return wasmLoading;
  
  if (typeof window === 'undefined') {
    return null;
  }

  wasmLoading = (async () => {
    try {
      // Use fetch + WebAssembly.instantiate for better control
      const wasmPath = '/wasm/connes_distance_wasm_bg.wasm';
      const jsPath = '/wasm/connes_distance_wasm.js';
      
      // Dynamically create script tag to load the JS wrapper
      const response = await fetch(jsPath);
      const jsCode = await response.text();
      
      // Create a blob URL and import it
      const blob = new Blob([jsCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      
      const module = await import(/* webpackIgnore: true */ url);
      await module.default(wasmPath);
      
      wasmModule = module;
      return module;
    } catch (e) {
      console.error('Failed to load WASM:', e);
      wasmLoading = null;
      throw e;
    }
  })();
  
  return wasmLoading;
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
        const wasm = await loadWasmModule();
        if (!wasm || cancelled) return;
        
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(P), epsilon]);

  return { result, error, loading };
}

export async function getWasmModule(): Promise<any> {
  return loadWasmModule();
}

export function unpackSquare(flat: number[], n: number) {
  const M: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) M[i][j] = flat[i * n + j];
  return M;
}
