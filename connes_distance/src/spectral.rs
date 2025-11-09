use nalgebra::{DMatrix, DVector, SymmetricEigen, SVD};
use rand::{rngs::StdRng, Rng, SeedableRng};
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConnesError {
    #[error("matrix must be square (got {rows}x{cols})")]
    NotSquare { rows: usize, cols: usize },
    #[error("rows must sum to ~0 for generator L (max |row-sum| = {max_abs})")]
    RowSumsNotZero { max_abs: f64 },
    #[error("rows must sum to ~1 for transition P (max |row-sum-1| = {max_abs})")]
    RowSumsNotOne { max_abs: f64 },
    #[error("stationary distribution must be strictly positive")]
    StationaryNonPositive,
    #[error("stationary distribution must sum to 1 (got {sum})")]
    StationaryNotNormalized { sum: f64 },
    #[error("epsilon must be > 0 (got {0})")]
    NonPositiveEpsilon(f64),
    #[error("state index out of range: {idx} (n={n})")]
    StateOutOfRange { idx: usize, n: usize },
}

#[derive(Clone, Debug, Serialize)]
pub struct Conditioning {
    pub spectral_gap: f64,
    pub epsilon: f64,
    pub max_commutator_norm: f64,
    pub ill_conditioned: bool,
}

#[derive(Clone, Debug)]
pub struct SpectralTriple {
    pub generator: DMatrix<f64>,
    pub stationary: DVector<f64>,
    pub epsilon: f64,
}

impl SpectralTriple {
    pub fn new(generator: DMatrix<f64>, stationary: DVector<f64>, epsilon: f64) -> Result<Self, ConnesError> {
        Self::validate_generator(&generator)?;
        Self::validate_stationary(&stationary)?;
        if epsilon <= 0.0 { return Err(ConnesError::NonPositiveEpsilon(epsilon)); }
        Ok(Self { generator, stationary, epsilon })
    }

    pub fn from_generator(generator: DMatrix<f64>, epsilon: f64) -> Result<Self, ConnesError> {
        Self::validate_generator(&generator)?;
        let pi = Self::left_nullspace_prob(&generator.transpose())?;
        Self::new(generator, pi, epsilon)
    }

    pub fn from_transition(transition: DMatrix<f64>, epsilon: f64) -> Result<Self, ConnesError> {
        Self::validate_transition(&transition)?;
        let (n, _) = transition.shape();
        let l = &transition - DMatrix::<f64>::identity(n, n);
        let pi = Self::left_nullspace_prob(&(transition.transpose() - DMatrix::<f64>::identity(n, n)))?;
        Self::new(l, pi, epsilon)
    }

    pub fn compute_dirac_operator(&self) -> DMatrix<f64> {
        let lsym = self.symmetrized_generator();
        let SymmetricEigen { eigenvalues, eigenvectors } = SymmetricEigen::new(-lsym);
        let n = eigenvalues.len();
        let mut d = DMatrix::<f64>::zeros(n, n);
        for i in 0..n {
            let lam = eigenvalues[i].max(0.0);
            d[(i, i)] = 1.0 / (self.epsilon + lam);
        }
        &eigenvectors * d * eigenvectors.transpose()
    }

    pub fn connes_distance(&self, state_i: usize, state_j: usize) -> Result<f64, ConnesError> {
        let n = self.generator.nrows();
        if state_i >= n { return Err(ConnesError::StateOutOfRange { idx: state_i, n }); }
        if state_j >= n { return Err(ConnesError::StateOutOfRange { idx: state_j, n }); }
        if state_i == state_j { return Ok(0.0); }

        let dmat = self.compute_dirac_operator();

        let mut c = DVector::<f64>::zeros(n);
        c[state_i] = 1.0; c[state_j] = -1.0;

        let (lc, _) = self.lipschitz(&dmat, &c);
        let mut best = if lc > 1e-15 { (c.dot(&c) / lc).abs() } else { 0.0 };

        let restarts = 8usize;
        let iters = 600usize;
        let lr = 0.5f64;
        let mut rng = StdRng::seed_from_u64(42);

        for _ in 0..restarts {
            let mut f = DVector::<f64>::from_fn(n, |_r, _c| rng.gen::<f64>() * 2.0 - 1.0);
            let (mut lf, mut m) = self.lipschitz(&dmat, &f);
            if lf < 1e-12 {
                for k in 0..n { f[k] += (k as f64 + 1.0) * 1e-3; }
                (lf, m) = self.lipschitz(&dmat, &f);
            }

            for _ in 0..iters {
                if lf <= 1e-15 { break; }
                let g = Self::lipschitz_subgradient(&dmat, &m);
                let num = c.dot(&f);
                let grad = (&c * lf - &g * num) / (lf * lf);
                f += grad.scale(lr);

                let (new_lf, new_m) = self.lipschitz(&dmat, &f);
                if new_lf > 1.0 { f /= new_lf; }
                lf = new_lf; m = new_m;
            }

            let (lf_fin, _) = self.lipschitz(&dmat, &f);
            let val = (c.dot(&f) / lf_fin.max(1.0)).abs();
            if val > best { best = val; }
        }

        Ok(best)
    }

    pub fn conditioning(&self) -> Conditioning {
        let lsym = self.symmetrized_generator();
        let SymmetricEigen { eigenvalues, .. } = SymmetricEigen::new(-lsym);
        let lambda_0 = *eigenvalues.get(0).unwrap_or(&0.0);
        let lambda_1 = *eigenvalues.get(1).unwrap_or(&0.0);
        let gap = (lambda_1 - lambda_0).max(0.0);
        let lambda0_bad = lambda_0.abs() > 1e-8;
        let ill = lambda0_bad || gap < 1e-8 || gap < 1e-2 * self.epsilon;
        Conditioning { spectral_gap: gap, epsilon: self.epsilon, max_commutator_norm: 0.0, ill_conditioned: ill }
    }

    fn validate_generator(l: &DMatrix<f64>) -> Result<(), ConnesError> {
        let (r, c) = l.shape();
        if r != c { return Err(ConnesError::NotSquare { rows: r, cols: c }); }
        let mut max_abs: f64 = 0.0;
        for i in 0..r { max_abs = max_abs.max(l.row(i).sum().abs()); }
        if max_abs > 1e-9 { return Err(ConnesError::RowSumsNotZero { max_abs }); }
        Ok(())
    }

    fn validate_transition(p: &DMatrix<f64>) -> Result<(), ConnesError> {
        let (r, c) = p.shape();
        if r != c { return Err(ConnesError::NotSquare { rows: r, cols: c }); }
        let mut max_abs: f64 = 0.0;
        for i in 0..r { max_abs = max_abs.max((p.row(i).sum() - 1.0).abs()); }
        if max_abs > 1e-9 { return Err(ConnesError::RowSumsNotOne { max_abs }); }
        Ok(())
    }

    fn validate_stationary(pi: &DVector<f64>) -> Result<(), ConnesError> {
        if pi.iter().any(|&x| x <= 0.0) { return Err(ConnesError::StationaryNonPositive); }
        let sum = pi.sum();
        if (sum - 1.0).abs() > 1e-9 { return Err(ConnesError::StationaryNotNormalized { sum }); }
        Ok(())
    }

    fn left_nullspace_prob(a: &DMatrix<f64>) -> Result<DVector<f64>, ConnesError> {
        let svd = SVD::new(a.clone(), true, true);
        let vt = svd.v_t.as_ref().expect("V^T requested");
        let (mut idx, mut min_s) = (0usize, f64::INFINITY);
        for (k, &s) in svd.singular_values.iter().enumerate() { if s < min_s { min_s = s; idx = k; } }
        let v = vt.row(idx).transpose();
        let n = v.len();
        let mut pi = v.clone_owned();
        let floor = 1e-15;
        for i in 0..n { if pi[i] < floor { pi[i] = floor; } }
        let sum = pi.sum();
        let pi = pi.scale(1.0 / sum);
        Self::validate_stationary(&pi)?;
        Ok(pi)
    }

    fn symmetrized_generator(&self) -> DMatrix<f64> {
        let n = self.generator.nrows();
        let mut pi_sqrt = DMatrix::<f64>::zeros(n, n);
        let mut pi_isqrt = DMatrix::<f64>::zeros(n, n);
        for i in 0..n {
            let s = self.stationary[i].sqrt();
            pi_sqrt[(i, i)] = s;
            pi_isqrt[(i, i)] = 1.0 / s;
        }
        let l1 = &pi_sqrt * &self.generator * &pi_isqrt;
        let l2 = &pi_isqrt * self.generator.transpose() * &pi_sqrt;
        (l1 + l2) * 0.5
    }

    fn spectral_norm(m: &DMatrix<f64>) -> f64 {
        let svd = SVD::new(m.clone(), false, false);
        svd.singular_values.iter().fold(0.0, |a, &s| a.max(s))
    }

    fn lipschitz(&self, d: &DMatrix<f64>, f: &DVector<f64>) -> (f64, DMatrix<f64>) {
        let n = f.len();
        let mut diagf = DMatrix::<f64>::zeros(n, n);
        for i in 0..n { diagf[(i, i)] = f[i]; }
        let m = d * &diagf - &diagf * d;
        (Self::spectral_norm(&m), m)
    }

    fn lipschitz_subgradient(dirac: &DMatrix<f64>, m: &DMatrix<f64>) -> DVector<f64> {
        let n = dirac.nrows();
        let svd = SVD::new(m.clone(), true, true);
        if svd.u.is_none() || svd.v_t.is_none() { return DVector::zeros(n); }
        let u = svd.u.unwrap().column(0).into_owned();
        let v = svd.v_t.unwrap().row(0).transpose().into_owned();
        let ut_d = u.transpose() * dirac;
        let d_v = dirac * &v;
        let mut g = DVector::<f64>::zeros(n);
        for k in 0..n { g[k] = ut_d[(0, k)] * v[k] - u[k] * d_v[k]; }
        g
    }
}
