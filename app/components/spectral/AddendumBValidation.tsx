'use client';

import React, { useState } from 'react';
import { getWasmModule } from '@/app/hooks/useSpectralTriple';

type Result = {
  passed: boolean;
  d12_base: number;
  d12_inc: number;
  gap_base: number;
  gap_inc: number;
};

export default function AddendumBValidation() {
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function run() {
    setBusy(true); setErr(null);
    try {
      const wasm = await getWasmModule();
      const eps = 1e-3;
      const n = 3;

      const P0 = [
        [0.95, 0.05, 0.00],
        [0.02, 0.94, 0.04],
        [0.00, 0.05, 0.95],
      ];
      const P1 = [
        [0.85, 0.15, 0.00],
        [0.02, 0.94, 0.04],
        [0.00, 0.05, 0.95],
      ];

      const r0 = wasm.compute_spectral_triple(new Float64Array(P0.flat()), n, eps);
      const r1 = wasm.compute_spectral_triple(new Float64Array(P1.flat()), n, eps);

      setRes({
        passed: r1.distances[0 * n + 1] <= r0.distances[0 * n + 1] + 1e-10,
        d12_base: r0.distances[0 * n + 1],
        d12_inc: r1.distances[0 * n + 1],
        gap_base: r0.conditioning.spectral_gap,
        gap_inc: r1.conditioning.spectral_gap,
      });
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl p-4 border border-neutral-700 space-y-2">
      <div className="flex items-center gap-2">
        <div className="font-semibold">Validate Addendum B Monotonicity</div>
        <button
          onClick={run}
          disabled={busy}
          className="ml-auto px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-sm"
        >
          {busy ? 'Running…' : 'Run'}
        </button>
      </div>

      {err && <div className="text-rose-400 text-sm">{err}</div>}

      {res && (
        <div className={`rounded p-3 text-sm ${res.passed ? 'bg-emerald-900/20 border border-emerald-700' : 'bg-rose-900/20 border border-rose-700'}`}>
          <div className="font-semibold mb-1">{res.passed ? '✓ Monotonicity Validated' : '⚠️ Validation Failed'}</div>
          <div>Base d₁₂ = {res.d12_base.toFixed(6)} → Increased-mixing d₁₂ = {res.d12_inc.toFixed(6)}</div>
          <div className="opacity-70">Gap: {res.gap_base.toExponential(3)} → {res.gap_inc.toExponential(3)}</div>
        </div>
      )}
    </div>
  );
}
