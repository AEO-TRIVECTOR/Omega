/**
 * Classical MDS in R^3 (allocation-friendly, no external math deps).
 * Input: symmetric distance matrix D (n x n) → Output: X (n x 3).
 */
export type Vec3 = [number, number, number];

export function mdsClassical3D(dist: number[][]): Vec3[] {
  const n = dist.length;
  if (n === 0) return [];
  // D^2
  const D2 = new Float64Array(n * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const d = dist[i][j] ?? 0;
    D2[i*n + j] = d * d;
  }

  // Double centering: B = -0.5 * (D2 - rowMean - colMean + grandMean)
  const rowMean = new Float64Array(n);
  const colMean = new Float64Array(n);
  let grand = 0;
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += D2[i*n + j];
    rowMean[i] = s / n;
    grand += s;
  }
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += D2[i*n + j];
    colMean[j] = s / n;
  }
  grand /= (n * n);

  const B = new Float64Array(n * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    B[i*n + j] = -0.5 * (D2[i*n + j] - rowMean[i] - colMean[j] + grand);
  }

  // Utilities
  const matVec = (m: Float64Array, x: Float64Array) => {
    const y = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0, base = i*n;
      for (let j = 0; j < n; j++) s += m[base + j] * x[j];
      y[i] = s;
    }
    return y;
  };
  const dot = (a: Float64Array, b: Float64Array) => {
    let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s;
  };
  const norm = (a: Float64Array) => Math.sqrt(dot(a, a));
  const scale = (a: Float64Array, c: number) => { for (let i = 0; i < a.length; i++) a[i] *= c; };

  function topEigen(m: Float64Array, iters = 256, tol = 1e-9) {
    let v = new Float64Array(n);
    for (let i = 0; i < n; i++) v[i] = Math.random() - 0.5;
    let vn = norm(v); if (vn === 0) { v[0] = 1; vn = 1; }
    scale(v, 1 / vn);

    let lambda = 0;
    for (let k = 0; k < iters; k++) {
      const y = matVec(m, v);
      const yn = norm(y);
      if (yn === 0) break;
      scale(y, 1 / yn);
      const newLambda = dot(v, matVec(m, v)); // Rayleigh
      // convergence in direction
      let diff = 0;
      for (let i = 0; i < n; i++) { const d = y[i] - v[i]; diff += d*d; }
      v = y;
      lambda = newLambda;
      if (Math.sqrt(diff) < tol) break;
    }
    return { v, lambda };
  }

  // Deflation (rank-1): M <- M - λ v v^T
  function deflate(m: Float64Array, v: Float64Array, lambda: number) {
    for (let i = 0; i < n; i++) {
      const vi = v[i], row = i*n;
      for (let j = 0; j < n; j++) m[row + j] -= lambda * vi * v[j];
    }
  }

  const M = new Float64Array(B);
  const eigs: { v: Float64Array; lambda: number }[] = [];
  const kmax = Math.min(3, n);
  for (let k = 0; k < kmax; k++) {
    const { v, lambda } = topEigen(M);
    eigs.push({ v, lambda });
    deflate(M, v, lambda);
  }

  const X: Vec3[] = Array.from({ length: n }, () => [0,0,0]);
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) {
    const lam = eigs[k]?.lambda ?? 0;
    X[i][k] = lam > 0 ? Math.sqrt(lam) * (eigs[k].v[i] ?? 0) : 0;
  }
  return X;
}

export function normalizeToUnitBox(points: Vec3[]): { pts: Vec3[], scale: number, min: Vec3, max: Vec3 } {
  if (points.length === 0) return { pts: [], scale: 1, min: [0,0,0], max: [0,0,0] };
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const [x,y,z] of points) {
    if (x < min[0]) min[0] = x; if (x > max[0]) max[0] = x;
    if (y < min[1]) min[1] = y; if (y > max[1]) max[1] = y;
    if (z < min[2]) min[2] = z; if (z > max[2]) max[2] = z;
  }
  const size: Vec3 = [max[0]-min[0], max[1]-min[1], max[2]-min[2]];
  const scale = Math.max(1e-12, Math.max(size[0], Math.max(size[1], size[2])));
  const pts = points.map(([x,y,z]) => [
    (x - min[0]) / scale - 0.5,
    (y - min[1]) / scale - 0.5,
    (z - min[2]) / scale - 0.5,
  ] as Vec3);
  return { pts, scale, min, max };
}
