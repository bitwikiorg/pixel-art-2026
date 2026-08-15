# Pixel Photon reference experiments

Browser experiments prioritize inspectability and short runtimes. This directory contains CPU reference models and benchmark scripts used when training or repeated comparisons would be awkward in a static GitHub Pages lab.

## `mpf_relations.py` — learned local vector field

A 12×12-style recurrent field with vector-valued state, shared local update and four-way LEFT/RIGHT/ABOVE/BELOW readout.

```bash
python experiments/mpf_relations.py --epochs 20 --steps 6
```

Topology modes are controls for this particular recurrent-grid architecture; they are not generic proofs about “spatial meaning.”

## `pixel_primitives.py` — vector / tensor / inner-token cells

Train one interpretation at a time on the same relation task:

```bash
python experiments/pixel_primitives.py --mode vector --scalars 16
python experiments/pixel_primitives.py --mode tensor --scalars 16
python experiments/pixel_primitives.py --mode transformer --scalars 16
```

Holding scalar state per address constant is an **equal-state** comparison. Parameter count and inference cost still differ.

## `benchmark_primitives.py` — explicit resource protocols

```bash
python experiments/benchmark_primitives.py \
  --protocol equal-state --state 16 --seeds 7,17,29

python experiments/benchmark_primitives.py \
  --protocol equal-params --target-params 4000 --seeds 7,17,29
```

The benchmark reports each seed plus mean/sample standard deviation. Equal-state, equal-parameter and equal-compute protocols answer different questions. Current code implements the first two and reports empirical inference time; it does not claim parameter matching equals FLOP matching.

Machine-readable audit results live in `experiments/results/`.

## `masked_binary.py` — missing-bit reconstruction control

A tiny conventional convolutional network predicts hidden pixels in deterministic synthetic 16×16 binary fields and is compared with a local-majority baseline.

```bash
python experiments/masked_binary.py --epochs 12 --mask 0.5
```

This is intentionally **not** an MPF model. It establishes a learned reconstruction baseline before richer persistent-cell architectures are compared.

## Reporting standard

For learned experiments report together:

- task/data distribution;
- held-out metric;
- state scalars/address;
- trainable parameters;
- recurrent/update depth;
- training examples and optimizer;
- random seeds;
- empirical runtime or compute estimate;
- relevant conventional controls;
- failures/variance, not only best seeds.

For compression/memory experiments also report all stored bits, codebooks/side information and reconstruction/retrieval error.
