# MPF experiments

This directory contains executable research prototypes behind the Pixel Neural Net Lab.

The project no longer treats one recurrent vector grid as the definition of MPF. The reference experiments now separate two questions:

1. **Does persistent spatial field computation matter?** — `mpf_relations.py`
2. **What happens when the object inside each pixel changes?** — `pixel_primitives.py`

## Install

```bash
python -m venv .venv
source .venv/bin/activate
pip install torch
```

## `pixel_primitives.py`

A CPU-safe trainable comparison of three pixel interpretations on the same LEFT / RIGHT / ABOVE / BELOW relation task.

All three default modes use **16 scalar state values per outer pixel**:

| Mode | Internal pixel object | Scalar state / pixel |
|---|---|---:|
| `vector` | flat 16D vector | 16 |
| `tensor` | 4×4 latent tensor | 16 |
| `transformer` | 2 internal tokens × 8D | 16 |

The state budget is matched, but parameter count and compute are **not** identical. The script reports them so later work can add parameter- and FLOP-matched controls.

### Flat vector pixel

```bash
python experiments/pixel_primitives.py --mode vector
```

Uses a shared gated recurrent local update similar to the existing MPF-Local baseline.

### Tensor pixel

```bash
python experiments/pixel_primitives.py --mode tensor
```

Each outer address contains a 4×4 latent tensor. The update explicitly mixes the tensor's row and column axes in addition to outer-grid communication. It is therefore not merely a 16D vector renamed as a tensor.

### Micro-transformer pixel

```bash
python experiments/pixel_primitives.py --mode transformer
```

Each outer address contains two 8D latent tokens. A shared tiny self-attention rule operates **inside each pixel**, while a convolution communicates between outer addresses. This is deliberately different from a Field Transformer, where attention would operate **between pixels**.

### CPU smoke test observed during implementation

One fixed-seed run using the defaults (`12×12`, 16 scalars/pixel, 6 updates, 15 epochs, 2,048 training examples) produced:

| Mode | Parameters | Near-distance | Longer-distance | CPU training time* |
|---|---:|---:|---:|---:|
| vector | 4,036 | 100.0% | 35.5% | 7.8 s |
| tensor | 4,588 | 91.8% | 28.1% | 12.9 s |
| micro-transformer | 3,396 | 88.3% | 48.8% | 22.0 s |

\*Wall-clock times are environment-specific and are included only to show that the prototypes are practical CPU-scale experiments.

These numbers are **smoke tests, not research results**. They use one seed, unequal parameter counts and unequal operators. The useful result at this stage is that all three interpretations train end-to-end under the same finite scalar-state budget. The unexpectedly stronger farther-distance result in the transformer smoke run is a question for controlled repeated experiments, not evidence of superiority.

## `mpf_relations.py`

A compact PyTorch reference model for the recurrent vector-field baseline.

**Task:** two markers A and B are placed on a grid. The model predicts where B is relative to A: LEFT, RIGHT, ABOVE or BELOW.

**Architecture:**

```text
2-channel input
→ 1×1 writer into D-dimensional cell state
→ shared 3×3 local convolution
→ shared gated residual update
→ repeat T recurrent steps
→ global max pool
→ 4-way linear readout
```

The same update weights are reused at every cell and every recurrent step.

### Train the persistent field

```bash
python experiments/mpf_relations.py --epochs 20 --steps 6
```

### Compare a location-destroying control

```bash
python experiments/mpf_relations.py --topology per_step --epochs 20 --steps 6
```

`per_step` applies a fresh one-to-one permutation of cell states between recurrent updates. It preserves the number of cells and state values while removing stable spatial addressability.

### Fixed remapping control

```bash
python experiments/mpf_relations.py --topology fixed --epochs 20 --steps 6
```

This remaps the initial field once and keeps that altered layout stable during recurrent computation. It helps distinguish stable addressability from the particular Cartesian arrangement supplied by the task.

### Scale toward the research model

```bash
python experiments/mpf_relations.py --grid 16 --dim 32 --steps 10 --epochs 30
```

## What to measure next

The next controlled suite should run multiple seeds and report at least:

- task accuracy;
- near- versus farther-distance generalization;
- scalar state per pixel;
- trainable parameter count;
- inference FLOPs / measured runtime;
- recurrent/update steps;
- memory use;
- random seed;
- state traces and causal interventions.

The most useful immediate comparisons are:

```text
flat vector vs tensor at equal scalar state
neural-unit pixel vs micro-transformer pixel
micro-transformer pixel vs Field Transformer
```

After those are stable, move to persistent memory pixels, recursive field-inside-field models, learned topology, quantization and Semantic Albums.
