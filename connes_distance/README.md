# connes_distance

Connes distance for finite spectral triples derived from a Markov chain (ICF v2.1 Addendum B).

## Math
- L = P − I, π stationary ((P^T − I) π = 0, sum π=1, π>0)
- L_sym = ½ ( Π^{1/2} L Π^{-1/2} + Π^{-1/2} L^T Π^{1/2} )
- −L_sym = U diag(λ) U^T, λ ≥ 0
- D = U diag(1 / (ε + λ)) U^T
- d(ρ_i, ρ_j) = sup_{||[D, a]|| ≤ 1} |f_i − f_j|, a = diag(f)

## Usage
See tests for examples. Run `cargo test` and `cargo bench`.
