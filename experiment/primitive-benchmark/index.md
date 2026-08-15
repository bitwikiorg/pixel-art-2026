---
layout: experiment
title: Primitive Resource Benchmark
exp_id: "10"
status: "MULTI-SEED REFERENCE"
category: "Benchmark"
question: "How do vector, tensor, and inner-token pixel states behave when the resource constraint is stated explicitly instead of hidden inside the architecture?"
explanation: "All three models solve the same 12×12 spatial relation task, but equal state, equal parameter count, and equal compute are different comparisons. Repeated seeds expose optimization variance that a single successful run can hide."
deck: "Compare vector, tensor, and inner-token pixels under declared resource budgets and repeated seeds."
source: "same 12×12 relation dataset"
interpretation: "vector vs 2D tensor vs two-token micro-transformer"
learned: "Yes · PyTorch CPU reference"
measure: "state scalars, parameters, runtime, multi-seed accuracy"
shows: "Architecture comparisons change when the resource constraint changes, and seed variance can dominate one-off smoke results."
does_not_show: "A universal winner. Equal-state, equal-parameter and equal-FLOP experiments answer different questions; the current benchmark reports the first two plus runtime."
steps:
  - label: "Fix the comparison rule"
    text: "Equal-state fixes scalar state per outer pixel. Approximate equal-parameter matching instead chooses model sizes near a common trainable-parameter target."
  - label: "Repeat optimization"
    text: "Train the same task under several random seeds rather than promoting the strongest isolated run."
  - label: "Report resources with accuracy"
    text: "Keep state size, parameter count, empirical inference time, training time, near-distance accuracy, and far-distance accuracy visible together."
technical: |
  Equal state controls representational scalar count per outer address but allows trainable parameters and operator cost to differ. Approximate equal parameters controls model size more directly but allows internal state size and compute to differ. Neither protocol equalizes FLOPs automatically.

  The completed equal-state audit uses 16 scalar state values per pixel, six recurrent updates, 12 epochs, and seeds 7, 17, and 29. Sample standard deviation is reported because three independent optimization runs can differ sharply at this scale.

  The equal-parameter JSON is deliberately a short six-epoch smoke test near 4,000 parameters. Most models remain undertrained, so it validates the matching machinery rather than providing an architecture ranking.
---

## Different budgets answer different scientific questions

| Protocol | Held constant | Allowed to change |
|---|---|---|
| **Equal state** | scalar state values per outer pixel | parameters, operators, runtime |
| **Approx. equal parameters** | trainable parameter count near a target | scalar state size, operators, runtime |
| **Approx. equal compute** | FLOPs or measured inference cost | state and parameter allocation | 

Equal parameters do not imply equal compute. A transformer-style internal operation may spend its parameter budget very differently from a vector MLP or tensor factorization.

## Audited equal-state result

The completed protocol fixes **16 scalar state values per outer pixel**, six recurrent updates, 12 epochs, and three seeds. Accuracy is mean ± sample standard deviation:

| Cell interpretation | Parameters | Distance 2–4 | Distance 5–8 |
|---|---:|---:|---:|
| 16D vector | 4,036 | 87.8% ± 10.6 | 35.8% ± 12.8 |
| 4×4 tensor | 4,588 | 78.7% ± 11.5 | 49.1% ± 11.9 |
| 2×8D inner-token attention | 3,396 | 55.0% ± 25.4 | 31.8% ± 6.3 |

The variance is large enough to change the interpretation of a one-seed result. One inner-token seed remained essentially at chance while the other two learned substantially more. The tensor has the highest mean farther-distance score in these runs, but its parameter count and compute are not matched to the other models, so that observation does not establish tensor superiority.

Machine-readable values are stored in `experiments/results/equal-state-audit.json`.

## Approximate equal-parameter smoke result

`experiments/results/equal-params-smoke.json` targets roughly 4,000 trainable parameters with a short six-epoch run. The selected configurations are approximately:

```text
vector       16D      4,036 parameters
tensor       4×4      4,588 parameters
inner-token  18 state 4,236 parameters
```

Most runs remain near chance or poorly optimized. The useful result is therefore diagnostic: parameter matching alone does not rescue an undertrained protocol, and unstable optimization should not be converted into a winner table.

## Reproduction

```bash
python experiments/benchmark_primitives.py \
  --protocol equal-state --state 16 --seeds 7,17,29

python experiments/benchmark_primitives.py \
  --protocol equal-params --target-params 4000 --seeds 7,17,29
```

A stronger comparison needs a fully converged repeated equal-parameter protocol, followed by an empirical equal-runtime or equal-compute protocol and conventional CNN, recurrent CNN, NCA, pixel-token Transformer, and graph-message-passing controls.
