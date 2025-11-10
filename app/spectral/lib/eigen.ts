/**
 * Symmetric Eigenvalue Decomposition using Jacobi Algorithm
 * 
 * Computes eigenvalues and eigenvectors of a symmetric matrix using
 * iterative Jacobi rotations. This is numerically stable and accurate
 * for small to medium-sized matrices (n ≲ 200).
 * 
 * Complexity: O(n³) with typical convergence in 5-10 sweeps
 */

export function symmetricEigenJacobi(
  Ain: number[][],
  tol = 1e-12,
  maxSweeps = 100
): { values: number[]; vectors: number[][] } {
  const n = Ain.length;
  // Defensive copy
  const A: number[][] = Array.from({ length: n }, (_, i) => Ain[i].slice());
  // Initialize V as identity (eigenvectors)
  const V: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  // Quick symmetry check (optional but helpful)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const diff = Math.abs(A[i][j] - A[j][i]);
      if (diff > 1e-9) {
        throw new Error(
          `symmetricEigenJacobi: matrix not symmetric (|A[${i},${j}] - A[${j},${i}]|=${diff})`
        );
      }
    }
  }

  const offdiagNorm = () => {
    let s = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) s += A[i][j] * A[i][j];
    }
    return Math.sqrt(s);
  };

  let sweep = 0;
  while (sweep++ < maxSweeps) {
    let converged = true;

    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const app = A[p][p];
        const aqq = A[q][q];
        const apq = A[p][q];
        if (Math.abs(apq) <= tol * Math.sqrt(app * app + aqq * aqq)) continue;

        converged = false;

        // Compute Jacobi rotation
        const tau = (aqq - app) / (2 * apq);
        const t = Math.sign(tau) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;

        // Apply rotation to A (p,q plane)
        // Update diagonal entries
        const appNew = c * c * app - 2 * s * c * apq + s * s * aqq;
        const aqqNew = s * s * app + 2 * s * c * apq + c * c * aqq;
        A[p][p] = appNew;
        A[q][q] = aqqNew;
        A[p][q] = 0;
        A[q][p] = 0;

        for (let r = 0; r < n; r++) {
          if (r !== p && r !== q) {
            const arp = A[r][p];
            const arq = A[r][q];
            const Arp = c * arp - s * arq;
            const Arq = s * arp + c * arq;
            A[r][p] = Arp;
            A[p][r] = Arp;
            A[r][q] = Arq;
            A[q][r] = Arq;
          }
        }

        // Accumulate eigenvectors: V := V * J(p,q)
        for (let r = 0; r < n; r++) {
          const vrp = V[r][p];
          const vrq = V[r][q];
          V[r][p] = c * vrp - s * vrq;
          V[r][q] = s * vrp + c * vrq;
        }
      }
    }
    if (converged || offdiagNorm() < tol) break;
  }

  const values = Array.from({ length: n }, (_, i) => A[i][i]);

  // Normalize eigenvectors columns (numerical hygiene)
  for (let j = 0; j < n; j++) {
    let norm = 0;
    for (let i = 0; i < n; i++) norm += V[i][j] * V[i][j];
    norm = Math.sqrt(norm);
    if (norm > 0) for (let i = 0; i < n; i++) V[i][j] /= norm;
  }

  // Sort by descending eigenvalue, reorder vectors accordingly
  const idx = values.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0]).map(([, i]) => i);
  const sortedValues = idx.map(i => values[i]);
  const sortedVectors = Array.from({ length: n }, (_, r) => idx.map(j => V[r][j]));

  return { values: sortedValues, vectors: sortedVectors };
}
