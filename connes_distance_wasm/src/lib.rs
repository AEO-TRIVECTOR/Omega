use connes_distance::{Conditioning, SpectralTriple};
use nalgebra::DMatrix;
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
pub struct SpectralTripleResult {
    pub n: usize,
    pub stationary: Vec<f64>,
    pub eigenvalues: Vec<f64>,
    pub dirac: Vec<f64>,
    pub distances: Vec<f64>,
    pub conditioning: Conditioning,
}

#[wasm_bindgen]
pub fn compute_spectral_triple(transition_flat: &[f64], n: usize, epsilon: f64) -> Result<JsValue, JsValue> {
    let p = DMatrix::from_row_slice(n, n, transition_flat);
    let st = SpectralTriple::from_transition(p, epsilon).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let dmat = st.compute_dirac_operator();
    let cond = st.conditioning();

    let mut distances = vec![0.0f64; n * n];
    for i in 0..n {
        for j in 0..n {
            distances[i * n + j] = if i == j { 0.0 } else { st.connes_distance(i, j).map_err(|e| JsValue::from_str(&e.to_string()))? };
        }
    }

    let lsym = {
        let mut pi_sqrt = DMatrix::<f64>::zeros(n, n);
        let mut pi_isqrt = DMatrix::<f64>::zeros(n, n);
        for i in 0..n {
            let s = st.stationary[i].sqrt();
            pi_sqrt[(i, i)] = s;
            pi_isqrt[(i, i)] = 1.0 / s;
        }
        let l1 = &pi_sqrt * &st.generator * &pi_isqrt;
        let l2 = &pi_isqrt * st.generator.transpose() * &pi_sqrt;
        (l1 + l2) * 0.5
    };
    let ev = nalgebra::SymmetricEigen::new(-lsym);

    let res = SpectralTripleResult {
        n,
        stationary: st.stationary.as_slice().to_vec(),
        eigenvalues: ev.eigenvalues.as_slice().to_vec(),
        dirac: dmat.as_slice().to_vec(),
        distances,
        conditioning: cond,
    };
    serde_wasm_bindgen::to_value(&res).map_err(|e| JsValue::from_str(&format!("serde error: {e}")))
}

#[wasm_bindgen]
pub fn connes_distance_pair(transition_flat: &[f64], n: usize, i: usize, j: usize, epsilon: f64) -> Result<f64, JsValue> {
    let p = DMatrix::from_row_slice(n, n, transition_flat);
    let st = SpectralTriple::from_transition(p, epsilon).map_err(|e| JsValue::from_str(&e.to_string()))?;
    st.connes_distance(i, j).map_err(|e| JsValue::from_str(&e.to_string()))
}
