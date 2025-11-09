import React from 'react';

interface Props {
  eigenvalues: number[];
  spectralGap: number;
}

export function EigenvalueSpectrum({ eigenvalues, spectralGap }: Props) {
  const mixingTime = spectralGap > 0 ? 1 / spectralGap : Infinity;
  const maxAbs = Math.max(1e-12, ...eigenvalues.map(Math.abs));

  return (
    <div className="rounded-2xl p-4 border border-neutral-700 space-y-3">
      <h3 className="text-lg font-semibold">Eigenvalue Spectrum of −L<span className="opacity-60">sym</span></h3>
      <div className="flex items-end gap-2 h-40">
        {eigenvalues.map((lam, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-6 md:w-8 bg-neutral-400/60 rounded"
              style={{ height: `${(Math.abs(lam) / maxAbs) * 100}%` }}
              title={`λ${i} = ${lam.toExponential(3)}`}
            />
            <div className="text-[10px] md:text-xs mt-1 opacity-70">λ{i}</div>
          </div>
        ))}
      </div>
      <div className="text-sm">
        <div><b>Gap (λ₁ − λ₀):</b> {Number.isFinite(spectralGap) ? spectralGap.toExponential(3) : '—'}</div>
        <div><b>Mixing time ≈</b> {Number.isFinite(mixingTime) ? mixingTime.toFixed(2) : '∞'} steps</div>
        <div className="text-xs opacity-70">
          {spectralGap > 0.1 ? '✓ Fast mixing'
            : spectralGap > 0.01 ? '⚠️ Moderate mixing'
            : '⚠️ Slow mixing / metastable basins'}
        </div>
      </div>
    </div>
  );
}
