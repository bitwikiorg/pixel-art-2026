---
layout: research
title: Concepts to Explore
---

# Concepts to explore

This page is a branching map. MPF is not defined by one recurrent-grid implementation. The project can vary the **object inside a pixel**, the **relationships between pixels**, and the **larger structures made from fields**.

## Pixel interpretation itself

Before asking how a field communicates, ask what one address contains.

Possible computational pixels include:

- scalar state;
- flat vector state;
- structured tensor state;
- shared neural unit;
- multiple latent tokens with internal attention;
- fast/slow memory object;
- vector-symbolic object;
- subfield;
- recursively nested object.

These are not only changes in dimensionality. They change the internal computation available at one spatial address.

A useful comparison ladder is:

```text
scalar
→ vector
→ tensor
→ neural unit
→ micro-transformer
→ memory object
→ subfield
```

[Run the current interpretation sandbox]({{ '/experiment/interpretation/' | relative_url }}).

## Semantic topology {#semantic-topology}

**Idea:** the organization of computational pixels might become part of the representation.

Possible neighborhood structures:

- physical 2D neighbors;
- fixed random graph neighbors;
- learned content-based neighbors;
- hybrid local + long-range edges;
- multiscale parent/child links;
- dynamic routing between addresses.

Key distinction:

```text
stable address ≠ 2D geometry ≠ semantic neighborhood
```

An experiment should separate those three.

Related background: [Kohonen Self-Organizing Maps](https://www.scholarpedia.org/article/Kohonen_network) and [Graph Neural Networks](https://distill.pub/2021/gnn-intro/).

## Purposeful cell and region roles

A pixel state can be entirely distributed, but it is worth testing whether training produces recurring functional types.

Candidate roles include:

- entity/state storage;
- relation integration;
- routing;
- uncertainty;
- temporal memory;
- coarse context;
- query-conditioned control.

The form of specialization can depend on the pixel primitive. A vector may specialize through subspaces; a tensor through factors; a micro-transformer through internal tokens or heads; a subfield through inner regions.

Related work: [Slot Attention](https://arxiv.org/abs/2006.15055).

## Tensor structure inside a pixel

A tensor-valued pixel can have the same scalar count as a flat vector while imposing a different internal organization.

Examples:

```text
R^64
versus
R^(8×8)
```

Possible tensor-specific operations:

- internal convolution;
- separable transforms;
- low-rank factorization;
- attention over axes;
- sparse slices;
- scale-specific factors.

This is useful only if the architecture respects the tensor structure rather than immediately flattening it.

## Attention inside versus between pixels

There are at least two distinct ways to introduce Transformers.

### Micro-transformer pixel

```text
one address = K internal tokens
attention occurs inside the pixel
```

### Field Transformer

```text
one address = one token
attention occurs between pixels
```

A hybrid can combine internal attention, local outer communication and occasional region-level attention.

The important research question is **where attention should live**.

## Multiresolution representation

Represent computation at several scales:

```text
cell → region → super-region → field
```

Questions:

- Does coarse state reduce communication distance?
- Can fine detail be reconstructed from coarse summaries plus local state?
- Can a query selectively activate only the scale it needs?
- Can the same update module operate at every scale?

If the same transform is genuinely reused recursively across scales, terms such as **scale-reused** or eventually **fractal** become technically meaningful. Otherwise use **multiresolution**.

## Field inside field

The stronger recursive interpretation treats one outer address as a complete inner field:

```text
F_outer[i,j] = F_inner^(i,j)
```

Now computation can occur:

- inside each subfield;
- between outer addresses;
- upward from inner summaries;
- downward from outer context.

This is different from ordinary multiresolution pooling because the inner object remains an active computational field.

## Learned routing

Some tasks may require occasional long-range communication.

Options:

- sparse learned edges;
- routing channels inside each pixel;
- region-to-region attention;
- global broadcast every `k` steps;
- content-addressed memory lookup;
- dynamic field-to-field messages.

The goal is to measure which routing structures are useful rather than assume local or global communication is always preferable.

## Persistent memory

A pixel or a whole field can be treated as a memory object that continues to exist after one forward pass.

Experiments:

- save and restore a field;
- resume computation from stored state;
- retrieve one field from a collection by similarity;
- merge information from two fields;
- update a field without catastrophic corruption;
- consolidate many fields into a coarse summary field.

Related work: [Neural Map](https://arxiv.org/abs/1702.08360).

## Albums: fields of fields

A higher-level collection can contain multiple fields representing episodes, hypotheses, modalities or time points.

```text
internal pixel object → pixel → region → field → album
```

The album is another level at which the interpretation can change: a whole field can become one object inside a larger structure.

## Vector quantization

A stored vector or tensor can be replaced partly or wholly by learned codebook indices.

```text
continuous active state → quantized stored state → restored active state
```

Product VQ can split a state into sub-vectors and quantize each separately. Tensor pixels may support structured or factorized codebooks. Report codebook cost and side information. Start with [VQ-VAE](https://arxiv.org/abs/1711.00937).

## Predictive / multiscale compression

Rather than storing every fine state independently, store coarse state plus residual detail only where needed.

Possible mechanisms:

- low-rank tensor state;
- learned residual coding;
- sparse exception maps;
- entropy models;
- repeated-pattern dictionaries;
- shared recursive rules;
- query-dependent reconstruction.

The measurement is a rate–utility curve, not visual compactness.

## Hyperbolic hierarchy

A physical grid can remain Euclidean while some semantic state uses hyperbolic distance.

A conservative first variant:

```text
pixel state = [ordinary content | hierarchy coordinates]
```

Only hierarchy-related coordinates use a Poincaré or Lorentz geometry. Compare against an equal-dimensional Euclidean version on explicitly hierarchical data.

Primary reference: [Poincaré Embeddings](https://arxiv.org/abs/1705.08039).

## Vector-Symbolic / Hyperdimensional state

A pixel, region or field can contain a high-dimensional vector designed for operations such as binding, bundling and permutation.

Possible synthesis:

- VSA encodes entity + relation composition;
- spatial topology provides persistent location or routing;
- memory preserves bound structures;
- regions provide multiscale context;
- recurrence, attention or other dynamics can manipulate the state.

This is a separate representational axis and should be compared directly with ordinary learned vectors rather than treated as an automatic upgrade.

## Attractor-like computation

Any recurrent variant may learn stable states that act like memories or solutions. Instead of reading after a fixed number of steps, the system could stop when change becomes small or a learned halting signal fires.

Related reading: [Scholarpedia: Attractor network](https://www.scholarpedia.org/article/Attractor_network).

## Adaptive computation

Different problems may need different amounts or types of computation.

Possible adaptive choices include:

- number of recurrent steps;
- which pixels activate;
- whether an inner subfield expands;
- whether regional attention is invoked;
- whether another stored field is retrieved.

## Learned coordinate systems

The field does not have to keep a fixed interpretation of position. It may learn a coordinate system or soft transport mechanism that moves representations to useful regions.

Questions:

- Can positions remain stable enough for memory while content moves?
- Can a learned writer discover useful neighborhoods?
- Should coordinates be absolute, relative or content-addressed?
- Can topology itself depend on the current task?

## Mechanistic visualization

RGB projection is only the beginning. Richer pixels require richer inspection tools:

- tensor slices;
- internal token views;
- attention matrices;
- fast versus slow memory traces;
- inner-subfield views;
- update-magnitude heatmaps;
- local message norm;
- region-to-region flow;
- probe accuracy by location;
- intervention sensitivity maps;
- PCA/UMAP trajectories;
- role-consistency maps across seeds;
- damage/recovery curves;
- accuracy versus computation depth.

The central interpretability problem is simple: **the possible internal state can grow much faster than a human can directly inspect it**. Visualization therefore has to select useful projections and pair them with causal interventions.
