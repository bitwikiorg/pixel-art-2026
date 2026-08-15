---
layout: experiment
title: Primitive Resource Benchmark
exp_id: "10"
status: "MULTI-SEED REFERENCE"
category: "Benchmark"
deck: "Compare vector, tensor and inner-token pixels without collapsing distinct resource questions into one number. Equal-state and approximately equal-parameter protocols are reported separately, with empirical inference time and seed variance."
source: "same 12×12 relation dataset"
interpretation: "vector vs 2D tensor vs two-token micro-transformer"
learned: "Yes · PyTorch CPU reference"
measure: "state scalars, parameters, runtime, multi-seed accuracy"
shows: "Architecture comparisons change when the resource constraint changes, and seed variance can dominate one-off smoke results."
does_not_show: "A universal winner. Equal-state, equal-parameter and equal-FLOP experiments answer different questions; the current benchmark reports the first two plus runtime."
---

## Why this experiment exists

The earlier site displayed one fixed-seed table where the vector model reached 100% near-distance accuracy. That run was useful for proving the code could learn, but it was **not** a stable comparative result. Repeated runs show substantial seed and optimization variance, especially for the micro-transformer.

The benchmark now has two explicit protocols:

| Protocol | Held constant | Allowed to change |
|---|---|---|
| **Equal state** | scalar state values per outer pixel | parameters, operators, runtime |
| **Approx. equal parameters** | trainable parameter count near a target | scalar state size, operators, runtime |

Empirical inference latency is reported because equal parameters do not imply equal compute.

## Reproduce

```bash
python experiments/benchmark_primitives.py \
  --protocol equal-state --state 16 --seeds 7,17,29

python experiments/benchmark_primitives.py \
  --protocol equal-params --target-params 4000 --seeds 7,17,29
```

The machine-readable result files in `experiments/results/` are the source of any table shown here. A result is not promoted to the site unless all requested seeds finish.

## Interpretation discipline

A transformer seed that stays near chance is not hidden as a “failed run”; it is evidence that the optimization protocol is unstable at this scale. Likewise, a high single-seed score is not treated as superiority. The next benchmark extension is an approximately equal-inference-compute protocol plus conventional CNN/NCA controls.

## Audited equal-state runs

The first completed audit protocol fixes **16 scalar state values per outer pixel**, six recurrent updates, 12 epochs and three seeds. Accuracy is mean ± sample standard deviation:

| Cell interpretation | Parameters | Distance 2–4 | Distance 5–8 |
|---|---:|---:|---:|
| 16D vector | 4,036 | 87.8% ± 10.6 | 35.8% ± 12.8 |
| 4×4 tensor | 4,588 | 78.7% ± 11.5 | 49.1% ± 11.9 |
| 2×8D inner-token attention | 3,396 | 55.0% ± 25.4 | 31.8% ± 6.3 |

The variance is the important result. One transformer seed remained essentially at chance while the other two learned substantially more. The tensor had the highest mean farther-distance score in these runs, but parameters and compute are not matched, so that observation is **not** evidence of tensor superiority.

Machine-readable source: `experiments/results/equal-state-audit.json`.

## Approximate equal-parameter smoke protocol

The repository also contains `experiments/results/equal-params-smoke.json`, a deliberately short six-epoch optimization smoke run targeting roughly 4,000 parameters. Most models remained poorly trained. It is retained to document the matching machinery and a failure mode, not to rank architectures.

The next benchmark milestone is a fully converged, repeated **equal-parameter** protocol followed by an empirical equal-runtime/compute protocol and conventional CNN/NCA controls.
