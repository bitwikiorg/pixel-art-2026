---
layout: research
title: Concepts to Explore
---

# Concepts to explore

This page is a branching map. None of these directions is required for the basic MPF. The useful order is to add one mechanism only when it answers a specific question.

## Semantic topology {#semantic-topology}

**Idea:** the organization of cells might become part of the representation.

Possible neighborhood structures:

- physical 2D neighbors;
- fixed random graph neighbors;
- learned content-based neighbors;
- hybrid local + long-range edges;
- multiscale parent/child links.

Key distinction:

```text
stable address ≠ 2D geometry ≠ semantic neighborhood
```

An experiment should separate those three.

Related background: [Kohonen Self-Organizing Maps](https://www.scholarpedia.org/article/Kohonen_network) and [Graph Neural Networks](https://distill.pub/2021/gnn-intro/).

## Purposeful cell and region roles

A cell state can be entirely distributed, but it is worth testing whether training produces recurring functional types.

Candidate roles include:

- entity/state storage;
- relation integration;
- routing;
- uncertainty;
- temporal memory;
- coarse context;
- query-conditioned control.

Do not hard-code these labels first. Measure whether stable functions emerge, then test them with interventions.

Related work: [Slot Attention](https://arxiv.org/abs/2006.15055).

## Multiresolution representation

Represent the same computation at several scales:

```text
cell → region → super-region → field
```

Questions:

- Does coarse state reduce communication distance?
- Can fine detail be reconstructed from coarse summaries plus local state?
- Can a query selectively activate only the scale it needs?
- Can the same update module operate at every scale?

If the same transform is genuinely reused recursively across scales, terms such as **scale-reused** or eventually **fractal** become technically meaningful. Otherwise use **multiresolution**.

## Learned routing

Local communication is deliberately constrained. Some tasks may require occasional long-range communication.

Options:

- sparse learned edges;
- routing channels inside each cell;
- region-to-region attention;
- global broadcast only every `k` steps;
- content-addressed memory lookup.

The goal is not to ban global communication, but to discover how little of it is needed.

## Persistent memory

A field can be treated as a memory object that continues to exist after one forward pass.

Experiments:

- save and restore a field;
- resume computation from a stored field;
- retrieve one field from a collection by similarity;
- merge information from two fields;
- update a field without catastrophic corruption;
- consolidate many fields into a coarse summary field.

Related work: [Neural Map](https://arxiv.org/abs/1702.08360).

## Albums: fields of fields

A higher-level collection can contain multiple fields representing episodes, hypotheses, modalities or time points.

```text
cell → region → field → album
```

An album is interesting only if interactions between fields add capabilities that one larger tensor or conventional memory does not already provide.

## Vector quantization

A stored cell vector can be replaced by an index into a learned codebook.

This makes a clean storage experiment:

```text
continuous active state → quantized stored state → restored active state
```

Product VQ can split a cell state into sub-vectors and quantize each separately. Report codebook cost and side information. Start with [VQ-VAE](https://arxiv.org/abs/1711.00937).

## Predictive / multiscale compression

Rather than storing every fine state independently, store coarse state plus residual detail only where needed.

Possible mechanisms:

- low-rank regional state;
- learned residual coding;
- sparse exception maps;
- entropy models;
- repeated-pattern dictionaries;
- query-dependent reconstruction.

The measurement is a rate–utility curve, not visual compactness.

## Hyperbolic hierarchy

A physical grid can remain Euclidean while some semantic channels use hyperbolic distance.

A conservative first variant:

```text
cell state = [Euclidean content | hierarchy coordinates]
```

Only the hierarchy coordinates use a Poincaré or Lorentz geometry. Compare against an equal-dimensional Euclidean version on explicitly hierarchical data.

Primary reference: [Poincaré Embeddings](https://arxiv.org/abs/1705.08039).

## Vector-Symbolic / Hyperdimensional state

A cell or region can contain a high-dimensional vector designed for operations such as binding and superposition.

Possible synthesis:

- VSA encodes entity + relation composition;
- field topology provides persistent location/routing;
- recurrence propagates and refines state;
- regions provide multiscale context.

This is a later experiment because it adds a second representational formalism. First establish the value of the recurrent field itself.

## Attractor-like computation

A recurrent field may learn stable states that act like memories or solutions. Instead of reading after a fixed number of steps, the system could stop when change becomes small or a learned halting signal fires.

Related reading: [Scholarpedia: Attractor network](https://www.scholarpedia.org/article/Attractor_network).

## Adaptive computation

Different problems may need different numbers of recurrent steps. A learned halting mechanism could let easy examples stop early while difficult examples continue.

This connects MPF to current research on test-time compute and recurrent latent reasoning.

## Learned coordinate systems

The grid does not have to keep a fixed interpretation. The field may learn a coordinate system or a soft transport mechanism that moves representations to useful regions.

Questions:

- Can positions remain stable enough for memory while content moves?
- Can a learned writer discover useful neighborhoods?
- Should coordinates be absolute, relative or content-addressed?

## Mechanistic visualization

Useful visualizations go beyond RGB projections:

- update-magnitude heatmaps;
- local message norm;
- region-to-region flow;
- probe accuracy by location;
- intervention sensitivity maps;
- PCA/UMAP trajectories of cell state;
- role-consistency maps across training seeds;
- damage/recovery curves;
- accuracy versus recurrent depth.

A visualization becomes most informative when it is paired with a causal perturbation.
