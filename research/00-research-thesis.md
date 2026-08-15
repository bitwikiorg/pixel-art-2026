---
layout: research
title: Research Thesis
---

# Multidimensional Pixel Fields: research thesis

<div class="plain-box"><strong>Working thesis:</strong> treat a pixel as a spatially addressable information carrier whose computational object is a design variable. Then ask which combinations of state type, communication, memory, topology, scale, geometry and learning produce useful behavior for a measured resource cost.</div>

## General object

The smallest field is binary:

```text
B[i,j] = b_ij ∈ {0,1}
```

The broader family is:

```text
F[i,j] = O_ij
```

where `O_ij` is the finite computational object at address `(i,j)`: scalar, vector, tensor, neural state, latent token set, persistent memory, hypervector binding, subfield or recursively structured object.

When the object is richer than a display value:

```text
visible(i,j) = P(O_ij)
```

The visible square is a projection, not the complete storage object.

## The separation that matters most

Three quantities must not be conflated:

1. **source information** — independent information supplied to the system;
2. **computational state** — memory allocated by the representation;
3. **interpreter/model complexity** — rules, codebooks, weights and side information needed to use that state.

A 1-bit source expanded deterministically into a 4,096-dimensional vector has not become 4,096 independent source bits. Expansion may improve robustness, separability or compositional computation, but it costs state and interpreter complexity.

```text
B_system = B_carrier
         + B_hidden
         + B_metadata
         + B_side-info
         + B_model/amortized
```

## A field contributes more than cell contents

Representation can be carried jointly by:

```text
what is inside the pixel
+ where the pixel is
+ which addresses are neighbors
+ what region contains it
+ what scale it occupies
+ how it changes through time
```

Cell type and field organization are therefore separate experimental axes.

## Why this is not simply Neural Cellular Automata

NCA already establishes multidimensional vector cells, shared learned local rules, recurrence, persistence and regeneration. The research target cannot simply be “hidden channels in pixels” or “a recurrent grid.”

The broader variables are:

- bit vs vector vs tensor vs inner-token state;
- convolution vs graph messages vs attention;
- transient vs persistent memory;
- fixed Cartesian address vs learned semantic address;
- flat field vs actual field-inside-field recursion;
- continuous vs quantized/discrete state;
- Euclidean vs hierarchy-motivated hyperbolic geometry;
- one field vs interacting persistent fields.

## Pixel Photon as analogy

The analogy is narrow: what is visible need not be the complete state used by an information-processing system. It is **not** a claim that a photon contains arbitrary software, electric charge, or infinite recoverable information.

## Representation + memory + workspace + computation

A mature MPF system may combine representation, persistent memory, working state, computation, routing and hierarchy. No current browser experiment establishes all of these. The atlas deliberately decomposes them.

## Recurrence is optional

One mechanism is `F_0 → F_1 → … → F_T`. It can support local propagation, memory and test-time computation. But exact codecs, hypervector representations, field Transformers and procedural genomes can belong to the research program without recurrence.

## Recursion and scale

A genuine recursive field is operational:

```text
field → region → cell → inner field → inner cell
```

The stronger experiment reuses the same or closely related interface/operator across levels and measures whether reuse improves capacity, generalization or storage efficiency. “Fractal” is reserved for demonstrated recursive/self-similar reuse; otherwise **recursive**, **hierarchical** or **multiresolution** is more precise.

## Hyperdimensionality and hyperbolic geometry are different

- **dimensionality** asks how many coordinates/components a representation uses;
- **geometry** asks how distance and relationships are defined.

HDC/VSA and hyperbolic embeddings are different hypotheses and should be tested separately.

## Compression is not automatic

Richer raw state usually costs more storage. Compression becomes meaningful only when structure—quantization, shared codebooks, sparsity, low rank, prediction, recursive reuse or entropy coding—reduces the **total accounted rate** for a chosen fidelity or utility target.

## Falsifiable questions

- Does explicit tensor factorization help an equal-state flat vector?
- Does inner attention help a local MLP/convolution at comparable parameters and runtime?
- Does stable spatial addressability matter after controlling for generic recurrence?
- Can persistent state survive delay/interference better per stored bit than simple baselines?
- Can recursive operator reuse generalize across scale better than a flat model?
- Can learned semantic placement beat fixed Cartesian or graph baselines?
- Can quantization reduce stored rate while preserving utility?
- Does hyperbolic state help specifically when target structure is hierarchical?
- Can interacting persistent fields outperform ordinary external-memory controls on retrieval/composition tasks?

A negative result is useful if it identifies an interpretation that does not justify its cost.

## Current evidence boundary

The repository contains exact deterministic primitives, fixed-rule mechanics, small learned models and benchmark infrastructure. None is proof of a universal Pixel Photon architecture. The [Experiment Atlas]({{ '/experiment/' | relative_url }}) keeps these evidence classes separate.
