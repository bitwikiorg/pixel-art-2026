---
layout: research
title: Learning and Training
---

# How computational pixels can learn

<div class="plain-box"><strong>Plain English:</strong> there is no single MPF training rule because there is no single pixel interpretation. A vector field can learn through recurrent backpropagation; a tensor pixel can learn structured internal operators; a micro-transformer can learn attention; a memory pixel can learn gates; a semantic field can learn where information should live.</div>

The current browser neural field demonstrates one concrete training loop. The larger research program asks which parts of a computational pixel should be learned and which architectural biases are useful.

## The current trained baseline

The live relation model uses

```text
F_0 → F_1 → … → F_T → prediction
```

with vector-valued pixels and differentiable recurrent updates. The loss gradient flows backward through the readout, every field state and the shared local update.

This is **backpropagation through time (BPTT)** applied to a spatial recurrent representation.

Background: [Backpropagation — Wikipedia](https://en.wikipedia.org/wiki/Backpropagation) · [Recurrent neural networks — Scholarpedia](https://www.scholarpedia.org/article/Recurrent_neural_networks).

## What changes when the pixel interpretation changes?

| Pixel interpretation | What can be learned? |
|---|---|
| vector | embeddings, local update, writer, routing |
| tensor | tensor factors, structured kernels, low-rank/internal transforms |
| neural unit | shared MLP or expert selection |
| micro-transformer | Q/K/V/O projections, internal token states, neighbor interface |
| memory object | write/read/forget gates, persistence policy |
| subfield | inner update, outer update, cross-scale communication |
| semantic/topographic pixel | coordinates, write locations, graph edges, routing |
| quantized pixel | codebooks, assignments, entropy model |

The training objective should match the interpretation. A tensor should not be introduced merely to flatten it immediately and run the same vector operation.

## Weight sharing is an experimental variable

A field can reuse one computational rule across many addresses:

```text
shared θ across pixels
```

This keeps parameter count manageable and may encourage reusable local computation.

But there are intermediate possibilities:

- one universal shared rule;
- one shared rule conditioned by a learned role vector;
- a small shared mixture of experts;
- different rules by scale;
- the same rule reused recursively across scales.

The project should compare these rather than assume maximum sharing is always best.

## Training the live vector relation task

The browser experiment generates two locations:

- marker A;
- marker B;
- target label: LEFT, RIGHT, ABOVE or BELOW.

Training distances are shorter than one evaluation range. This creates a tiny test of whether local recurrent computation transfers to farther examples.

The task is intentionally small. It demonstrates mechanics; it is not evidence that one pixel interpretation is generally superior.

## Training tensor pixels

A useful first comparison holds scalar state constant.

```text
vector model: 64 scalars / pixel

tensor model: 8×8 = 64 scalars / pixel
```

The tensor model should use operations that preserve or exploit its internal axes, such as separable transforms, low-rank mixing, internal convolution or attention over tensor factors.

Measure whether the structure improves:

- task accuracy;
- data efficiency;
- longer-depth generalization;
- compression or low-rank structure;
- interpretability of internal factors.

## Training micro-transformer pixels

A small cell can hold

```text
K internal tokens × D dimensions
```

and share one attention block across all outer addresses.

For the first model keep `K` very small. Otherwise the cost becomes

```text
outer_pixels × O(K²)
```

before outer-field communication is counted.

Compare it against:

- a flat vector with similar scalar state;
- a shared MLP neural pixel with similar parameters;
- a field Transformer that performs attention between outer addresses instead.

## Training memory objects

A memory experiment must require persistence. Otherwise a model can ignore the memory channels.

A simple task structure is:

```text
WRITE phase
→ distractor / computation phase
→ QUERY phase
```

Learned gates can control:

```text
write
retain
read
forget
```

Evaluate retention length, interference, overwrite, selective recall and recovery after damage.

## Training recursive fields

A field-inside-field model has at least two communication processes:

```text
inner dynamics
outer dynamics
```

and a third interface:

```text
inner ↔ outer
```

The most interesting version reuses the same or related update rule at multiple scales. Train with multiple field sizes and depths so recursion is not tied to one fixed geometry.

## Learned layout versus supplied layout

There are two different research questions.

### Supplied layout

The experimenter decides where information goes. This isolates the computational mechanism and is the best starting point for debugging.

### Learned layout

The model learns where to write entities, relations or memory. This is required to study emergent semantic geography.

A successful model on a human-designed layout has not yet learned its own topology.

## Role specialization

A vector state can be partitioned explicitly:

```text
x = [content | role | memory | routing | confidence]
```

but the project should also test an undifferentiated state as a control.

For tensor, transformer and memory pixels, specialization may instead emerge as:

- tensor axes or factors;
- internal tokens;
- attention heads;
- memory slots;
- subregions;
- expert selection.

Interpretability is therefore tied to the pixel primitive itself.

## Recurrence depth when recurrence is used

For recurrent architectures, sample or vary update depth and measure a compute curve:

```text
performance versus recurrent updates
```

Questions include:

- Does more computation help harder examples?
- Does the state converge, oscillate or degrade?
- Can the model run longer than it was trained?
- Can adaptive halting reduce unnecessary compute?

Do not force these questions onto non-recurrent experiments.

## Better task families

### Relation chains
Train on short relation compositions and test longer chains.

### Shortest path
Use exact BFS wavefronts as ground-truth intermediate states.

### Cellular-rule induction
Infer rules from examples and execute them for multiple steps.

### Persistent-memory tasks
Write facts, remove the source, delay, then query.

### Hierarchical tasks
Use explicit tree-like data for multiresolution or hyperbolic experiments.

### CLUTRR
Test longer relational composition. [CLUTRR paper](https://arxiv.org/abs/1908.06177).

## Optimization defaults are architecture-specific

The current vector-field prototype can begin around:

| Setting | Initial value |
|---|---:|
| field | 12×12 browser; 16×16–32×32 research |
| vector width | 12 browser; 32–64 research |
| local neighborhood | 3×3 |
| recurrent updates | 6 browser; 8–16 research |
| optimizer | Adam / AdamW |
| gradient clip | 1.0 |

Tensor and Transformer pixels need smaller outer grids or internal sizes at first because their per-pixel computation is larger.

## What to log across interpretations

For each trained experiment record:

- task performance;
- training/validation loss;
- parameter count;
- scalar state per pixel;
- outer field size;
- internal tensor/token/subfield shape;
- update depth;
- approximate compute;
- wall-clock time;
- stored bits when persistence matters;
- state snapshots and projections;
- probes and intervention maps;
- random seed and full configuration.

The purpose is to compare **computational interpretations**, not only final scores.
