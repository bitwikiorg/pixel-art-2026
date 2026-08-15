---
layout: research
title: Learning and Training
---

# Learning with computational pixels

There is no single training rule for Multidimensional Pixel Fields because the object at an address is not fixed. A vector field can learn recurrent local updates; a tensor cell can learn structured operators; an internal-token cell can learn attention; a memory object can learn write and retention gates; a semantic field can learn where information should be placed.

The objective must match the mechanism being tested.

## Recurrent vector-field learning

A learned recurrent field follows

```text
F_0 → F_1 → … → F_T → prediction
```

A differentiable loss at the output sends gradients backward through the readout, every intermediate field state, and the shared update rule. This is backpropagation through time applied to a spatial state tensor.

Background: [Backpropagation](https://en.wikipedia.org/wiki/Backpropagation) · [Recurrent neural networks](https://www.scholarpedia.org/article/Recurrent_neural_networks).

## What can be learned under different pixel interpretations?

| Pixel interpretation | Learnable components |
|---|---|
| vector | embeddings, local update, writer, routing |
| tensor | tensor factors, structured kernels, low-rank transforms |
| neural unit | shared MLP, gates, expert selection |
| internal token set | Q/K/V/O projections, token state, neighbor interface |
| memory object | write/read/forget gates, retention policy |
| subfield | inner update, outer update, cross-scale interface |
| semantic/topographic pixel | coordinates, write locations, graph edges, routing |
| quantized pixel | codebooks, assignments, entropy model |

A tensor representation should not be introduced only to flatten it immediately and apply the same vector operation. If the internal structure never affects computation, the experiment has not isolated tensor factorization as a mechanism.

## Weight sharing

A field can reuse one parameter set across many addresses:

```text
same θ at every pixel
```

Weight sharing reduces parameter growth and can encourage reusable local computation, but several intermediate designs are possible:

- one universal shared rule;
- one shared rule conditioned on a learned role vector;
- a small mixture of shared experts;
- separate rules by scale;
- one rule reused recursively across scales.

Each choice trades parameter efficiency against specialization.

## Spatial-relation training

A controlled relation task places marker A and marker B on a grid and predicts one of four labels:

```text
LEFT
RIGHT
ABOVE
BELOW
```

Shorter marker separations require fewer local communication steps than longer separations. Training and evaluation can therefore be stratified by distance.

The informative quantity is

```text
accuracy(distance, recurrent steps)
```

because a high aggregate score can hide failure at longer communication distances.

## Tensor-valued cells

A first controlled comparison can hold scalar state constant:

```text
vector: 64 scalars / pixel

tensor: 8×8 = 64 scalars / pixel
```

The tensor model should use operations that preserve or exploit internal axes, such as separable transforms, low-rank mixing, tensor-factor attention, or internal convolution.

Useful measurements include:

- task accuracy;
- sample efficiency;
- generalization to greater depth or distance;
- rank or factor structure;
- runtime;
- compressibility;
- stability across seeds.

## Internal-token cells

An address can contain

```text
K internal tokens × D dimensions
```

with one shared attention block reused across outer addresses.

Per-address self-attention introduces roughly `O(K²)` token interactions, so `K` should remain small in early comparisons. A fair benchmark should include:

- a flat vector with similar scalar state;
- a shared MLP cell with similar parameters;
- a field Transformer that attends between outer addresses instead.

The scientific question is where attention earns its cost.

## Learned memory

Memory training must create a reason to retain information. A simple protocol is

```text
WRITE
→ distractor / delay
→ QUERY
```

Learned gates may control

```text
write
retain
read
forget
```

Evaluation should vary delay length, interference, number of stored items, overwrite pressure, and corruption. Stored-state bits are part of the result.

## Recursive fields

A field-inside-field model has at least three trainable communication processes:

```text
inner dynamics
outer dynamics
inner ↔ outer interface
```

The strongest version reuses the same or related update rule across scales. Training should include multiple sizes and hierarchy depths so the model cannot simply memorize one fixed geometry.

A critical generalization test is whether the learned operator transfers to larger unseen scales.

## Supplied versus learned layout

A supplied layout fixes where information lives. This is valuable when isolating the behavior of the update mechanism.

A learned layout makes placement itself part of the model. Soft assignment can learn where entities, relations, or memories should occupy the field.

Success with a human-designed layout therefore does not establish learned semantic geography. The placement mechanism needs its own control.

## Functional specialization

State can be partitioned explicitly:

```text
x = [content | role | memory | routing | confidence]
```

or left undifferentiated so specialization must emerge.

Different primitives offer different places for specialization:

- vector subspaces;
- tensor factors;
- internal tokens;
- attention heads;
- memory slots;
- subregions;
- expert selection.

A probe can detect correlations with candidate roles, but causal interventions are needed to establish that the role matters to behavior.

## Recurrent depth as a compute budget

When recurrence is used, performance should be measured against actual update count:

```text
performance versus recurrent updates
```

Relevant questions include:

- Does more computation help harder examples?
- Does the state converge, oscillate, or degrade?
- Can the model run longer than the depths seen during training?
- Can adaptive halting reduce average compute?

Non-recurrent models should not be forced into this framing; compute depth is only one architectural axis.

## Task families with interpretable difficulty

### Relation chains

Compose short relations during training and test on longer unseen chains.

### Shortest path

Use exact breadth-first-search wavefronts as known intermediate computation states.

### Cellular-rule induction

Infer a transition rule from examples, then execute it for multiple steps.

### Persistent-memory tasks

Write facts, remove the source, delay, inject interference, then query.

### Hierarchical tasks

Use explicit trees or nested structures for multiresolution and hyperbolic comparisons.

### CLUTRR

Relational composition can be tested at longer chain lengths. [CLUTRR](https://arxiv.org/abs/1908.06177) provides a relevant benchmark lineage.

## Practical optimization variables

A small recurrent vector baseline can begin near:

| Setting | Example value |
|---|---:|
| field | 12×12 interactive; 16×16–32×32 larger runs |
| vector width | 12 interactive; 32–64 larger runs |
| local neighborhood | 3×3 |
| recurrent updates | 6 interactive; 8–16 larger runs |
| optimizer | Adam / AdamW |
| gradient clip | 1.0 |

Tensor and internal-token cells generally require smaller outer fields or internal sizes at first because their per-address operator cost is larger.

## What to record

Every trained comparison should retain enough information to reproduce both the score and the resource budget:

- task metric and loss;
- train/test distribution;
- parameter count;
- scalar state per address;
- outer field size;
- internal tensor, token, or subfield shape;
- recurrent or operator depth;
- approximate compute and wall-clock time;
- stored bits when persistence matters;
- state snapshots and intervention outputs;
- random seed and full configuration.

The comparison target is the computational interpretation and its cost, not the final score in isolation.
