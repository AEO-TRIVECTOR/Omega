import React from 'react';

interface Props {
  distances: number[][];
  labels: string[];
}

export function DistanceHeatmap({ distances, labels }: Props) {
  const n = distances.length;
  const flat = distances.flat();
  const maxDist = Math.max(1e-12, ...flat);

  return (
    <div className="rounded-2xl p-4 border border-neutral-700 space-y-2">
      <h3 className="text-lg font-semibold">Connes Distance Matrix d(ρᵢ, ρⱼ)</h3>
      <div className="overflow-auto">
        <table className="text-xs md:text-sm">
          <thead>
            <tr>
              <th className="p-1 pr-2"></th>
              {labels.map((l, j) => (
                <th key={j} className="p-1 px-2 text-center opacity-60">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {distances.map((row, i) => (
              <tr key={i}>
                <th className="p-1 pr-2 text-right opacity-60">{labels[i]}</th>
                {row.map((d, j) => {
                  const alpha = d === 0 ? 0.1 : 0.2 + 0.8 * (d / maxDist);
                  return (
                    <td
                      key={j}
                      title={`d(${labels[i]}, ${labels[j]}) = ${d.toFixed(6)}`}
                      className="p-0"
                      style={{ backgroundColor: `rgba(255, 100, 100, ${alpha})` }}
                    >
                      <div className="px-2 py-1 text-center">{d.toFixed(3)}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs opacity-70">Larger = harder to confuse states.</p>
    </div>
  );
}
