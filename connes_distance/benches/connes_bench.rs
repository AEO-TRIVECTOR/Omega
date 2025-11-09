use connes_distance::SpectralTriple;
use criterion::{criterion_group, criterion_main, Criterion};
use nalgebra::DMatrix;
use rand::{rngs::StdRng, Rng, SeedableRng};

fn random_stochastic(n: usize, seed: u64) -> DMatrix<f64> {
    let mut rng = StdRng::seed_from_u64(seed);
    let mut p = DMatrix::<f64>::zeros(n, n);
    for i in 0..n {
        let mut s = 0.0;
        for j in 0..n {
            let v = rng.gen::<f64>();
            p[(i, j)] = v;
            s += v;
        }
        for j in 0..n { p[(i, j)] /= s; }
    }
    p
}

fn bench_connes(c: &mut Criterion) {
    let p = random_stochastic(30, 1337);
    let st = SpectralTriple::from_transition(p, 1e-3).unwrap();

    c.bench_function("dirac_operator_n30", |b| {
        b.iter(|| { let _ = st.compute_dirac_operator(); })
    });

    c.bench_function("connes_distance_pairs_n30", |b| {
        b.iter(|| {
            let _ = st.connes_distance(0, 5).unwrap();
            let _ = st.connes_distance(7, 19).unwrap();
        })
    });
}

criterion_group!(benches, bench_connes);
criterion_main!(benches);
