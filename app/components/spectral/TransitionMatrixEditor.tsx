import React from 'react';

type Props = {
  matrix: number[][];
  onChange: (m: number[][]) => void;
  labels?: string[];
  onLabelsChange?: (l: string[]) => void;
  maxN?: number;
};

export function TransitionMatrixEditor({
  matrix, onChange, labels,
  onLabelsChange, maxN = 10
}: Props) {
  const n = matrix.length;

  function setN(newN: number) {
    const N = Math.min(maxN, Math.max(2, Math.floor(newN)));
    if (N === n) return;
    const next = Array.from({ length: N }, (_, i) =>
      Array.from({ length: N }, (_, j) => (i === j ? 1 : 0))
    );
    onChange(next);
    if (labels && onLabelsChange) {
      const nextLabels = Array.from({ length: N }, (_, i) => labels[i] ?? `State ${i+1}`);
      onLabelsChange(nextLabels);
    }
  }

  function updateEntry(i: number, j: number, value: number) {
    const v = isFinite(value) ? Math.max(0, value) : 0;
    const next = matrix.map(r => r.slice());
    next[i][j] = v;
    onChange(next);
  }

  function normalizeRow(i: number) {
    const next = matrix.map(r => r.slice());
    const s = next[i].reduce((a, b) => a + b, 0);
    if (s > 0) next[i] = next[i].map(x => x / s);
    else next[i][i] = 1;
    onChange(next);
  }

  function normalizeAll() {
    const next = matrix.map(r => r.slice());
    for (let i = 0; i < n; i++) {
      let s = next[i].reduce((a, b) => a + b, 0);
      if (s > 0) next[i] = next[i].map(x => x / s);
      else next[i][i] = 1;
    }
    onChange(next);
  }

  const rowSum = (i: number) => matrix[i].reduce((a, b) => a + b, 0);
  const rowOk = (i: number) => Math.abs(rowSum(i) - 1) < 1e-9;

  return (
    <div className="rounded-2xl p-4 border border-neutral-700 space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm opacity-80">States (2–{maxN})</label>
        <input
          type="number"
          className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 w-20"
          min={2} max={maxN} value={n}
          onChange={e => setN(parseInt(e.target.value || '3', 10))}
        />
        <button
          onClick={normalizeAll}
          className="ml-auto px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-sm"
          title="Normalize all rows to sum to 1"
        >
          Normalize All Rows
        </button>
      </div>

      <div className="overflow-auto">
        <table className="text-sm">
          <thead>
            <tr>
              <th className="p-1 pr-3 text-left opacity-60">row \\ col</th>
              {Array.from({ length: n }, (_, j) => (
                <th key={j} className="p-1 px-2 text-center opacity-60">{j+1}</th>
              ))}
              <th className="p-1 px-2 text-center opacity-60">∑ row</th>
              <th className="p-1 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <th className="p-1 pr-3 text-left opacity-60">{i+1}</th>
                {row.map((val, j) => (
                  <td key={j} className="p-1">
                    <input
                      type="number" step="0.01" min="0"
                      className="w-24 px-2 py-1 rounded bg-neutral-900 border border-neutral-700"
                      value={Number.isFinite(val) ? val : 0}
                      onChange={e => updateEntry(i, j, parseFloat(e.target.value))}
                    />
                  </td>
                ))}
                <td className={`p-1 px-2 text-center ${rowOk(i) ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {rowSum(i).toFixed(6)}
                </td>
                <td className="p-1 px-2">
                  <button
                    onClick={() => normalizeRow(i)}
                    className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-600"
                  >
                    Normalize
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs opacity-70">Rows must be stochastic (sum to 1).</p>
      </div>
    </div>
  );
}
