---
layout: research
title: Research Thesis
---

# Multidimensional Pixel Fields

A pixel can be modeled as a spatially addressable information carrier whose internal computational object is a design variable. The central question is which combinations of state type, communication, memory, topology, scale, geometry, and learning produce useful behavior for a measured resource cost.

## The general object

The smallest field is binary:

```text
B[i,j] = b_ij ∈ {0,1}
```

A broader field is

```text
F[i,j] = O_ij
```

where `O_ij` is the finite computational object at address `(i,j)`. It may be a scalar, vector, tensor, neural state, latent token set, persistent memory, hypervector binding, subfield, or recursively structured object.

When the internal object is richer than a display value,

```text
visible(i,j) = P(O_ij)
```

The visible square is then a projection of the stored state rather than the complete storage object.

## Source information, computational state, and interpreter complexity

Three quantities must remain separate:

1. **Source information** — independent information supplied to the system.
2. **Computational state** — memory allocated by the representation while it operates or persists.
3. **Interpreter or model complexity** — rules, codebooks, weights, metadata, and side information required to use that state.

A one-bit source expanded deterministically into a 4,096-dimensional vector has not become 4,096 independent source bits. The expansion may improve robustness, separability, retrieval, or compositional computation, but the larger vector and its interpreter still have to be paid for.

```text
B_system = B_carrier
         + B_hidden
         + B_metadata
         + B_side-info
         + B_model/amortized
```

## A field contributes more than cell contents

Representation can depend jointly on

```text
what is inside the pixel
+ where the pixel is
+ which addresses are neighbors
+ what region contains it
+ what scale it occupies
+ how it changes through time
```

The internal pixel type and the organization of the outer field are therefore separate variables.

A 64-dimensional vector cell on a fixed Cartesian grid is not the same system as the same vector cell on a random graph, under global attention, or inside a multiscale hierarchy.

## Neural Cellular Automata define an important baseline

Neural Cellular Automata already establish that grid cells can contain multidimensional vectors, share learned local rules, update recurrently, persist, and regenerate patterns. A research contribution cannot rest on hidden channels inside pixels or recurrence on a grid alone.

The broader design space includes:

- bit, vector, tensor, and internal-token state;
- convolution, graph messages, sparse routing, and attention;
- transient and persistent memory;
- fixed Cartesian addresses and learned semantic addresses;
- flat fields and genuine field-inside-field recursion;
- continuous and quantized state;
- Euclidean and hierarchy-motivated hyperbolic geometry;
- one field and interacting persistent collections of fields.

## Pixel Photon is a limited analogy

Photons can be characterized by more than perceived color: frequency, phase, polarization, momentum, helicity, path, and spatial modes can matter in physical systems. The computational analogy is only that an observed projection need not exhaust the state used by an information-processing system.

It does **not** imply that a photon contains arbitrary software state, electric charge, or infinite recoverable classical information. Every computational implementation has finite bits, finite parameters, finite compute, and finite measurement precision.

## Representation, memory, workspace, and computation can coexist

A mature field may combine several functions:

- representation of current content;
- persistent memory across time;
- working state for intermediate computation;
- communication and routing state;
- multiscale summaries;
- query-conditioned control.

These functions should not be assumed to emerge automatically from one large vector. Each requires a task or intervention that makes its contribution measurable.

## Recurrence is optional

One possible mechanism is

```text
F_0 → F_1 → … → F_T
```

Repeated updates can propagate information, maintain state, or allocate more test-time computation. Exact codecs, distributed representations, field Transformers, and procedural generative codes can still belong to the same broad computational-pixel design space without recurrence.

## Recursion requires an operational reuse pattern

A genuinely recursive field can contain active fields inside addresses:

```text
field → region → cell → inner field → inner cell
```

The stronger form reuses the same or closely related interface or update operator across levels. The empirical question is whether that reuse improves generalization across scale, adaptive computation, or storage efficiency compared with a flat model.

Terms such as **fractal** should be reserved for demonstrated recursive or self-similar operator reuse. Otherwise **recursive**, **hierarchical**, or **multiresolution** is more precise.

## High dimensionality and hyperbolic geometry are different axes

- **Dimensionality** asks how many coordinates a representation uses.
- **Geometry** asks how distances and relationships are defined.

A high-dimensional hypervector can be Euclidean or bipolar without being hyperbolic. A low-dimensional manifold can be hyperbolic without being high-dimensional. The two hypotheses require different controls.

## Compression is a rate question

Richer raw state usually increases storage. Compression becomes meaningful only when structure—quantization, shared codebooks, sparsity, low rank, prediction, recursive reuse, or entropy coding—reduces the **total accounted rate** for a chosen reconstruction fidelity or task utility.

A useful quantity is therefore not “dimensions per pixel” but something closer to

```text
useful performance / accounted stored bits
```

or a full rate–distortion or rate–utility curve.

## Falsifiable questions

- Does explicit tensor factorization help an equal-state flat vector?
- Does internal attention help a local MLP or convolution at comparable parameters and runtime?
- Does stable spatial addressability matter after controlling for generic recurrence?
- Can persistent state survive delay and interference better per stored bit than simple memory baselines?
- Can recursive operator reuse generalize across scale better than a flat model?
- Can learned semantic placement beat fixed Cartesian and graph baselines?
- Can quantization reduce stored rate while preserving useful behavior?
- Does hyperbolic state help specifically when the target structure is hierarchical?
- Can interacting persistent fields outperform ordinary external-memory controls on retrieval and composition tasks?

A negative result is informative when it shows that an interpretation or mechanism does not justify its additional cost.

## Present evidence boundary

Exact binary codecs and operators establish deterministic identities. Fixed-rule fields establish mechanics. Small learned models establish that specific objectives can be optimized under specific protocols. Multi-seed comparisons expose variance and resource sensitivity.

None of those results establishes a universal Pixel Photon architecture. Stronger conclusions require matched baselines, repeated optimization, explicit resource accounting, and tasks that isolate the proposed mechanism.
