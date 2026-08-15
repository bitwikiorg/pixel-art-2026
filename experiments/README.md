# MPF experiments

This directory contains executable research prototypes behind the Pixel Neural Net Lab.

## `mpf_relations.py`

A compact PyTorch reference model for a recurrent multidimensional pixel field.

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

### Install

```bash
python -m venv .venv
source .venv/bin/activate
pip install torch
```

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

After the pipeline is stable, move toward 32×32×48–64 cells, relation chains, shortest-path traces, multiresolution regional state, and multiple random seeds.

## What to record

For comparisons, keep the dataset generator, optimizer, parameter budget and evaluation data fixed. Report:

- training accuracy/loss;
- near-distance test accuracy;
- longer-distance test accuracy;
- recurrent steps;
- parameter count;
- device and wall-clock time;
- random seed.

The next extension should output state traces and intervention maps so the computation can be inspected, not only scored.
