---
layout: experiment
title: Primitive Resource Benchmark
exp_id: "10"
status: "RECORDED MULTI-SEED REFERENCE"
category: "Benchmark"
question: "How do vector, tensor, and inner-token pixel states behave when the resource constraint is stated explicitly instead of hidden inside the architecture?"
explanation: "All three models solve the same 12×12 spatial relation task, but equal state and approximate equal parameter count are different comparisons. The values below are recorded outputs from the checked-in PyTorch benchmark, not browser-generated placeholders. Repeated seeds expose optimization variance that a single successful run can hide."
deck: "Compare vector, tensor, and inner-token pixels under declared resource budgets and repeated seeds."
source: "same 12×12 relation dataset"
interpretation: "vector vs 2D tensor vs inner-token micro-transformer"
learned: "Yes · PyTorch CPU reference"
measure: "state scalars, parameters, near/far accuracy across seeds; runtime in equal-parameter smoke"
shows: "Architecture comparisons change when the resource constraint changes, and seed variance can dominate one-off smoke results."
does_not_show: "A universal winner. Equal-state, equal-parameter and equal-compute experiments answer different questions; equal-compute is not yet completed."
steps:
  - label: "Fix the comparison rule"
    text: "Equal-state fixes scalar state per outer pixel. Approximate equal-parameter matching instead chooses model sizes nearest a common trainable-parameter target."
  - label: "Repeat optimization"
    text: "Train the same task under seeds 7, 17, and 29 rather than promoting the strongest isolated run."
  - label: "Record resources with accuracy"
    text: "The checked-in JSON records model dimensions, parameter count and near/far accuracy. The equal-parameter smoke additionally records empirical inference and training time."
technical: |
  Equal state controls representational scalar count per outer address but allows trainable parameters and operator cost to differ. Approximate equal parameters controls model size more directly but allows internal state size and compute to differ. Neither protocol equalizes FLOPs automatically.

  The completed equal-state audit uses 16 scalar state values per pixel, six recurrent updates, 12 epochs, 1,536 train examples, 384 test examples, and seeds 7, 17, and 29. Sample standard deviation is reported because three independent optimization runs can differ sharply at this scale.

  The equal-parameter JSON is deliberately a short six-epoch smoke test with 768 train examples and 192 test examples near a 4,000-parameter target. Most models remain undertrained, so it validates the matching machinery rather than providing an architecture ranking.
---

## Different budgets answer different scientific questions

| Protocol | Held constant | Allowed to change |
|---|---|---|
| **Equal state** | scalar state values per outer pixel | parameters, operators, runtime |
| **Approx. equal parameters** | trainable parameter count near a target | scalar state size, operators, runtime |
| **Approx. equal compute** | FLOPs or measured inference cost | state and parameter allocation |

Equal parameters do not imply equal compute. A transformer-style internal operation may spend its parameter budget differently from a vector or tensor update.

## Audited equal-state result

Recorded file: `experiments/results/equal-state-audit.json`.

Protocol: **16 state scalars/address · 6 recurrent steps · 12 epochs · 1,536 train · 384 test · seeds 7/17/29**.

| Cell interpretation | Parameters | Distance 2–4 | Distance 5–8 |
|---|---:|---:|---:|
| 16D vector | 4,036 | 87.8% ± 10.6 | 35.8% ± 12.8 |
| 4×4 tensor | 4,588 | 78.7% ± 11.5 | 49.1% ± 11.9 |
| 2×8D inner-token attention | 3,396 | 55.0% ± 25.4 | 31.8% ± 6.3 |

The variance is large enough to change the interpretation of a one-seed result. The tensor has the highest mean farther-distance score in these runs, but its parameter count and compute are not matched to the other models, so that observation does not establish tensor superiority. Runtime was not retained in this equal-state audit file and is therefore not displayed as if it had been measured there.

## Approximate equal-parameter smoke result

Recorded file: `experiments/results/equal-params-smoke.json`.

Protocol: **6 recurrent steps · 6 epochs · 768 train · 192 test · seeds 7/17/29 · target ≈4,000 parameters**.

| Cell interpretation | State | Parameters | Distance 2–4 | Distance 5–8 | Inference µs/example | Train seconds |
|---|---:|---:|---:|---:|---:|---:|
| vector | 16 | 4,036 | 35.1% ± 7.0 | 38.0% ± 3.0 | 62.9 | 1.26 |
| tensor | 16 | 4,588 | 30.0% ± 1.1 | 37.2% ± 4.7 | 128.4 | 2.02 |
| inner-token · 2×9D | 18 | 4,261 | 28.8% ± 2.8 | 31.1% ± 4.3 | 311.9 | 5.20 |

Most runs remain near chance or poorly optimized. The useful result is diagnostic: parameter matching alone does not rescue an undertrained protocol, and unstable optimization should not be converted into a winner table.

## Exact reproduction commands

These commands match the checked-in protocol settings rather than relying on script defaults:

```bash
python experiments/benchmark_primitives.py \
  --protocol equal-state --state 16 --steps 6 --epochs 12 \
  --train 1536 --test 384 --seeds 7,17,29 \
  --out experiments/results/equal-state-rerun.json

python experiments/benchmark_primitives.py \
  --protocol equal-params --target-params 4000 --steps 6 --epochs 6 \
  --train 768 --test 192 --seeds 7,17,29 \
  --out experiments/results/equal-params-rerun.json
```

A stronger comparison needs a fully converged repeated equal-parameter protocol, followed by an empirical equal-runtime or equal-compute protocol and conventional CNN, recurrent CNN, NCA, pixel-token Transformer, and graph-message-passing controls.
