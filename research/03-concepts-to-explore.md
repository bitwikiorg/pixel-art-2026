---
layout: research
title: Open Mechanisms
---

# Open mechanisms

The broad object `F[i,j] = O_ij` leaves several independent choices unresolved: what one address contains, how addresses communicate, how state persists, how scales interact, how representations are compressed, and how geometry or routing changes computation.

## What one address contains

### Tensor structure inside a pixel

A tensor-valued pixel can use the same scalar count as a flat vector while imposing an internal factorization.

```text
flat vector:  x_ij ∈ R^64
structured:   X_ij ∈ R^(8×8)
```

The tensor becomes a distinct hypothesis only if the operator respects its axes—for example through separable transforms, low-rank factors, internal convolution, structured sparsity, or attention over axes.

**Measurement:** compare equal-state vector and tensor cells on accuracy, sample efficiency, runtime, generalization, and compressibility.

**Failure condition:** the tensor gives no consistent benefit once scalar state, parameters, compute, and optimization are controlled.

### Internal attention

A micro-transformer pixel contains several tokens inside one outer address:

```text
X_ij ∈ R^(K×D)
```

Self-attention mixes those `K` internal tokens before a compact message leaves the address.

A field Transformer uses a different factorization:

```text
one outer address = one token
attention occurs between addresses
```

**Measurement:** compare internal attention, outer-field attention, and local vector updates under matched state, parameters, and compute.

**Failure condition:** internal attention adds cost without improving tasks that require within-address factorization or compositional state.

### Memory objects

One address can contain state with different time constants or learned access rules:

```text
x_ij = [fast state | slow state | write gate | read gate]
```

Fast state may support transient computation while slow state preserves information through interference.

**Measurement:** write information, remove the source, inject distractors, delay, then query. Report retention, interference, overwrite, and stored-state cost.

**Failure condition:** ordinary recurrent hidden state or an external key-value memory retains the same information more efficiently.

### Field inside field

An outer address may contain an active inner field:

```text
F_outer[i,j] = F_inner^(i,j)
```

Computation can occur inside each subfield, between outer addresses, upward through summaries, and downward through contextual messages.

Pooling alone is not enough. A stronger recursive system reuses the same or closely related interface or update rule across several levels.

**Measurement:** train on some field sizes or hierarchy depths and test on larger unseen scales.

**Failure condition:** a flat model with comparable resources generalizes equally well or better.

## How addresses communicate

### Semantic topology

A spatial address can have at least three distinct properties:

```text
stable identity
≠ Cartesian coordinate
≠ semantic neighborhood
```

Possible connectivity includes physical 2D neighbors, fixed random graphs, learned content-based neighbors, local plus sparse long-range edges, parent/child links, or dynamic routing.

**Measurement:** keep cell state and update rule fixed while changing only the connectivity pattern. Compare Cartesian grid, torus, scrambled fixed graph, learned graph, and attention-based communication.

**Failure condition:** performance depends only on communication capacity and not on stable or semantic arrangement.

Related background: [Kohonen Self-Organizing Maps](https://www.scholarpedia.org/article/Kohonen_network) and [Graph Neural Networks](https://distill.pub/2021/gnn-intro/).

### Learned routing

Local communication is cheap but slow over long distances. Global attention is direct but expensive. Sparse routing can occupy the middle ground.

Candidate mechanisms include:

- learned long-range edges;
- routing channels stored inside each pixel;
- region-to-region attention;
- periodic global broadcast;
- content-addressed memory lookup;
- dynamic field-to-field messages.

**Measurement:** plot task accuracy against communication cost, message distance, and number of active long-range edges.

**Failure condition:** a simpler fixed sparse pattern or periodic global operator gives the same result.

### Local plus global computation

A field can combine frequent local updates with occasional global correction:

```text
local → local → local → global → local → ...
```

This can reduce the number of recurrent steps required to move information across a large field.

**Measurement:** hold approximate compute constant while varying the ratio of local to global operations.

**Failure condition:** pure local recurrence or pure global attention dominates at the same cost.

## Scale and hierarchy

### Multiresolution state

Computation can occur simultaneously at cell, region, and field scales:

```text
cell → region → super-region → field
```

Coarse state can move information over larger effective distances, while fine state preserves detail.

Questions include whether coarse summaries reduce communication depth, whether fine detail can be reconstructed from coarse state plus residuals, and whether queries can activate only the resolution they require.

**Measurement:** accuracy or reconstruction quality versus compute and stored state at each scale.

**Failure condition:** ordinary pooling or a flat larger-receptive-field model gives the same behavior.

### Recursive operator reuse

Recursion becomes stronger when the same interface is reused across levels:

```text
U(field)
U(region)
U(inner field)
```

The attraction is not visual self-similarity but parameter reuse and scale generalization.

**Measurement:** train at limited depths or sizes and evaluate beyond the training hierarchy.

**Failure condition:** performance collapses outside the trained scale or requires level-specific parameters.

## Functional specialization

A distributed field may develop stable computational roles even when no roles are assigned by hand.

Possible roles include:

- content storage;
- relation integration;
- routing;
- uncertainty estimation;
- temporal memory;
- coarse context;
- query-conditioned control.

The form of specialization depends on the primitive: vector subspaces, tensor factors, internal tokens, attention heads, memory slots, experts, or subregions can each specialize differently.

**Measurement:** train probes across examples and seeds, then intervene on candidate role-bearing components.

**Failure condition:** apparent roles disappear under causal intervention or vary randomly across seeds.

Related work: [Slot Attention](https://arxiv.org/abs/2006.15055).

## Persistence beyond one field

### Persistent field memory

A complete field can be serialized after computation and restored later:

```text
compute → save F_T → delay → restore → continue or query
```

The important question is whether the stored field preserves useful working information that would be expensive to reconstruct from the original input.

**Measurement:** retained task performance, restart latency, storage bits, and degradation after quantization or corruption.

**Failure condition:** storing a smaller ordinary latent vector preserves the same useful information.

### Semantic Album

A collection of persistent fields can become a higher-order memory:

```text
A = {F_1, F_2, ..., F_n}
```

Fields may represent episodes, hypotheses, modalities, or time points and can be retrieved, compared, merged, or consolidated.

**Measurement:** retrieval accuracy, composition quality, interference, update cost, and total storage compared with vector databases or key-value memory.

**Failure condition:** field structure adds no benefit beyond storing one embedding per item.

## Compression and discrete state

### Vector quantization

Continuous state can be replaced with learned codebook indices:

```text
continuous state → code index → restored state
```

Product quantization can split a large vector or tensor into factors and quantize them separately.

**Measurement:** total bits include indices, codebooks, metadata, and any residuals. Plot rate against reconstruction distortion or retained task utility.

**Failure condition:** the representation saves latent bytes but loses the advantage once codebook and side-information costs are counted.

Primary reference: [VQ-VAE](https://arxiv.org/abs/1711.00937).

### Predictive multiscale coding

Fine state can be predicted from coarser state and only the residual stored:

```text
fine state = predicted from parent + encoded residual
```

Sparse exception maps, low-rank factors, entropy models, motif dictionaries, and recursive prediction can all exploit repeated structure.

**Measurement:** total accounted rate versus exact recovery, distortion, or task utility.

**Failure condition:** raw quantization or a standard codec gives a better rate–utility curve.

## Geometry of meaning

### Hyperbolic hierarchy

A physical grid can remain Euclidean while selected semantic coordinates use hyperbolic distance:

```text
pixel state = [ordinary content | hierarchy coordinates]
```

Negatively curved spaces are attractive for tree-like structures because distance can represent branching hierarchies efficiently.

**Measurement:** compare equal-dimensional Euclidean and hyperbolic hierarchy state on data with explicit tree structure.

**Failure condition:** no hierarchy-specific advantage appears, or the benefit disappears on matched Euclidean controls.

Primary reference: [Poincaré Embeddings](https://arxiv.org/abs/1705.08039).

### Vector-symbolic / hyperdimensional state

High-dimensional distributed vectors support operations such as binding, bundling, permutation, and similarity retrieval.

A field can combine VSA algebra with stable spatial address and routing:

```text
VSA composition
+ spatial persistence
+ local or global communication
```

**Measurement:** compare compositional generalization, retrieval noise, corruption tolerance, and memory cost against ordinary learned vectors.

**Failure condition:** high-dimensional expansion increases state without improving the measured compositional or robustness task.

## Adaptive computation

Different inputs may require different amounts of computation.

A system can adapt:

- recurrent depth;
- number of active pixels;
- whether an inner subfield expands;
- whether regional or global attention runs;
- whether another stored field is retrieved.

**Measurement:** accuracy versus actual compute used per example, not only maximum configured depth.

**Failure condition:** adaptive mechanisms learn to use the maximum budget everywhere or add overhead without reducing average compute.

## Learned coordinate systems

Representations do not have to remain aligned to sensor pixels. A learned writer can place content into persistent computational addresses or create soft semantic neighborhoods.

Questions include whether positions remain stable enough for memory, whether content should move between addresses, and whether coordinates should be absolute, relative, or content-addressed.

**Measurement:** compare fixed physical coordinates, learned placements, graph layouts, and permutation-invariant controls.

**Failure condition:** learned layout is unstable across examples or offers no advantage over nonspatial memory.

## Causal inspection of rich pixels

High-dimensional state grows faster than direct human inspection. Useful views include tensor slices, internal tokens, attention matrices, fast/slow memory traces, inner subfields, update magnitude, message norm, region flow, probe accuracy, and low-dimensional trajectories.

Visualization alone remains descriptive. Stronger interpretation comes from intervention:

```text
observe candidate role
→ mute / freeze / swap / erase it
→ measure predicted behavioral change
```

A causal role is credible when the intervention changes the output in a repeatable and mechanism-specific way.
