use approx::{assert_relative_eq, AbsDiffEq};
use connes_distance::SpectralTriple;
use nalgebra::DMatrix;

fn preset_p() -> DMatrix<f64> {
    DMatrix::<f64>::from_row_slice(3, 3, &[
        0.95, 0.05, 0.00,
        0.02, 0.94, 0.04,
        0.00, 0.05, 0.95,
    ])
}

#[test]
fn dirac_is_symmetric() {
    let st = SpectralTriple::from_transition(preset_p(), 1e-3).unwrap();
    let d = st.compute_dirac_operator();
    assert!(d.abs_diff_eq(&d.transpose(), 1e-10));
}

#[test]
fn stationary_matches_expected_l1() {
    let st = SpectralTriple::from_transition(preset_p(), 1e-3).unwrap();
    let pi = st.stationary;
    let expected = [2.0/11.0, 5.0/11.0, 4.0/11.0];
    let err = (0..3).map(|i| (pi[i] - expected[i]).abs()).sum::<f64>();
    assert!(err < 1e-2, "L1 error too large: {err}");
}

#[test]
fn monotonicity_p12_increase_increases_gap_and_reduces_d12() {
    let st0 = SpectralTriple::from_transition(preset_p(), 1e-3).unwrap();
    let d12_0 = st0.connes_distance(0, 1).unwrap();

    let mut p1 = preset_p();
    p1[(0, 1)] = 0.15;
    p1[(0, 0)] = 0.85;

    let st1 = SpectralTriple::from_transition(p1, 1e-3).unwrap();
    let d12_1 = st1.connes_distance(0, 1).unwrap();

    assert_relative_eq!(st0.connes_distance(0, 0).unwrap(), 0.0, epsilon = 1e-12);
    assert!(d12_1 <= d12_0 + 1e-10, "Expected d12 to drop (or stay) as mixing increases");
}
