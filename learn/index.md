---
layout: research
title: Foundations
description: A clarity-first introduction to computational pixels, from binary carriers to color, structured state, communication, memory, and measured resource cost.
---

# From one bit to a computational field

A computational pixel has three parts:

1. **Address** — where the state lives.
2. **Carrier state** — the finite values stored there.
3. **Interpretation** — what those values mean and what operations may act on them.

The simplest useful case is a black-and-white pixel. Richer cases change the carrier while keeping the address explicit.

<div class="progression">
  <div class="progression-card"><small>01 · ONE BIT</small><h3>Black / white</h3><p>`0` or `1`. Exact source information, exact packing, exact decoding.</p></div>
  <div class="progression-card color-stage"><small>02 · COLOR</small><h3>RGB or palette index</h3><div class="color-bar" aria-hidden="true"></div><p>A larger finite alphabet. RGB888 carries 24 stored bits; indexed color carries an index plus palette accounting.</p></div>
  <div class="progression-card"><small>03 · RICHER STATE</small><h3>Vector, tensor, tokens, memory</h3><p>More internal structure becomes available, but every component still has finite precision and cost.</p></div>
</div>

## Binary gives exact ground truth

A 16×16 black-and-white field has 256 addresses. If black means `0` and white means `1`, every address contributes exactly one source bit.

The same source can be viewed as:

- a visible bitmap;
- a matrix of zeros and ones;
- a row-major bit stream;
- packed bytes;
- hexadecimal data.

Those views are different interpretations of the same finite source. [Binary Pixel Carrier]({{ '/carrier/' | relative_url }}) tests the round-trip directly.

## Color expands the carrier

Color changes the size and structure of the local state.

| Carrier | Example | Stored cost |
|---|---|---:|
| binary | black / white | 1 bit |
| four-color index | `0`, `1`, `2`, or `3` | 2 bits + palette |
| RGB888 | `(44, 167, 145)` | 24 bits |
| RGBA8888 | `(44, 167, 145, 192)` | 32 bits |

A four-color index does not need a full RGB tuple at every address, but the palette must be counted unless it is shared or deterministically derived from state already counted.

Color also has many useful descriptions: hue, saturation, chroma, lightness, XYZ, Lab, LCH, OKLab, chromaticity, color difference, and others. These are **not automatically extra independent channels**. Many are transformations or measurements derived from the same underlying stimulus or stored color.

Physical light introduces another layer: spectral distribution, radiance, irradiance, wavelength content, polarization, coherence, illumination direction, reflectance, and material response. Those quantities are not recoverable uniquely from an ordinary RGB code.

[Color, Light, and Pixel State]({{ '/research/11-color-light-state/' | relative_url }}) defines these layers separately.

## Four questions prevent information double-counting

<div class="family-list">
  <div class="family-row"><h3>What is stored?</h3><p>Count the finite carrier bits: channels, indices, integers, floats, token IDs, memory values, hashes, or other state.</p></div>
  <div class="family-row"><h3>What is derived?</h3><p>Hue, Lab coordinates, gradients, distances, entropy, and other deterministic measurements can be recomputed from stored state and required metadata.</p></div>
  <div class="family-row"><h3>What is measured externally?</h3><p>Spectra, polarization, illumination geometry, material reflectance, and similar physical quantities require sensors, models, or supplied data.</p></div>
  <div class="family-row"><h3>What meaning is assigned?</h3><p>A color or number can represent confidence, class, relation, memory address, instruction, uncertainty, or another semantic role when an encoder and decoder define that interpretation.</p></div>
</div>

## Pixel encoding can be tokenizer-like

A tokenizer converts a source into finite symbols or IDs that a larger model can operate on. A pixel encoder can perform the same kind of boundary operation when it maps source information into a finite local code.

<div class="parallel-schema">
  <div class="schema-label">TEXT</div><div><strong>Source</strong>text or bytes</div><div><strong>Encode</strong>token IDs</div><div><strong>Compute</strong>network state</div><div><strong>Decode</strong>output symbols</div>
  <div class="schema-label">PIXEL FIELD</div><div><strong>Source</strong>bits, color, measurements</div><div><strong>Encode</strong>local pixel state</div><div><strong>Compute</strong>field interactions</div><div><strong>Decode</strong>image, data, action</div>
</div>

The analogy has a boundary. Raw RGB, an fp32 vector, or a tensor is not automatically a token. Token-like behavior requires a defined mapping, vocabulary, codebook, quantizer, or equivalent finite coding rule.

## A pixel can contain a smaller computational object

The local object can be simple or internally structured:

| Local object | What changes |
|---|---|
| integer | one finite scalar replaces one bit |
| RGB / indexed color | visible state has multiple code values or channels |
| hash fragment | local state can act as an identifier or routing key |
| vector | several channels share one outer address |
| tensor | internal axes are preserved for an operator to exploit |
| token set | several internal tokens interact before communicating outward |
| memory object | fast and persistent components have different temporal roles |
| micro-network | a small learned operator lives inside one outer address |
| subfield | one outer address contains another addressable field |

Self-similarity becomes a meaningful description only when structure is genuinely reused across levels. A scalar pixel is not a miniature copy of a neural network. A recursively reused subfield operator or repeated micro-network can be.

[Pixel Interpretation Sandbox]({{ '/experiment/interpretation/' | relative_url }}) compares finite state types and fixed-rule active states.

## Internal state and communication are separate choices

Changing what a pixel stores does not determine how pixels communicate.

Possible communication mechanisms include:

- nearest-neighbor or convolutional messages;
- graph edges;
- sparse long-range links;
- windowed or global attention;
- learned routing;
- regional summaries;
- parent/child messages across scales.

Two fields can have the same local state and different communication topology. A fair experiment changes one factor at a time or explicitly measures their interaction.

## Time turns a field into a process

Repeated updates can propagate information beyond one local neighborhood and support iterative computation. More update steps also cost runtime and can create convergence, oscillation, instability, or oversmoothing.

Recurrence is therefore a mechanism to test, not a definition of a computational pixel.

## Memory requires delayed retrieval

Persistent memory needs more than hidden activation during one forward pass. A useful protocol contains four events:

<div class="parallel-schema">
  <div class="schema-label">MEMORY</div><div><strong>Write</strong>present information</div><div><strong>Remove</strong>take source away</div><div><strong>Delay</strong>add time or interference</div><div><strong>Query</strong>measure retrieval</div>
</div>

Retention duration, retrieval accuracy, capacity, overwrite behavior, corruption tolerance, and stored-state cost then become measurable.

## Compression requires complete accounting

A representation is not compressed merely because it looks compact or uses a high-dimensional latent state. Compression means the complete description is smaller for an acceptable reconstruction or task utility.

Useful mechanisms can include:

- palette indices;
- motif dictionaries;
- vector quantization;
- predictive residuals;
- sparsity;
- low-rank or factorized state;
- multiscale summaries;
- entropy coding;
- reusable recursive rules.

Palettes, codebooks, metadata, shared parameters, interpreters, and hidden persistent state are part of the accounting when reproduction depends on them.

## Geometry changes relationships, not dimension count

Dimensionality asks how many coordinates a representation contains. Geometry asks how distance and relationship are defined.

A high-dimensional Euclidean vector is not automatically hyperbolic. A low-dimensional Poincaré representation can be hyperbolic. Hyperbolic geometry is most relevant when the target relationships are genuinely hierarchical and an equal-dimensional Euclidean control is available.

## Central research question

> **What finite computational object should occupy an address, how should many such objects interact, and what representation, memory, robustness, compression, computation, or learning is obtained for the measured cost?**

Negative results are informative. Extra dimensions, memory, routing, recursion, or geometry that increase state and compute without improving the measured task narrow the useful design space.

<details class="technical-section technical-foundation">
<summary>Technical section: formal definitions, equations, and accounting</summary>
<div class="technical-intro">The symbols below formalize the concepts above. Each expression names a state, transformation, or resource that must be defined before quantitative comparisons are made.</div>
<div class="deep-dive-body" markdown="1">

### Computational pixel

A compact model is:

```text
pixel = address + carrier state + interpretation
```

For a two-dimensional field:

```text
F[i,j] = O_ij
```

`(i,j)` is the outer address and `O_ij` is the finite object stored there.

### Binary source accounting

For a 16×16 one-bit field:

```text
16 × 16 = 256 source bits
256 bits ÷ 8 = 32 packed bytes
```

Exact recovery requires zero Hamming distance between the original and decoded 256-bit source.

### Stored color versus visible projection

An RGB carrier can literally store:

```text
O_ij = [R, G, B]
```

A richer internal object can instead be mapped to display color:

```text
visible(i,j) = P(O_ij)
```

`P` is then a projection or decoder. The visible RGB square does not fully specify `O_ij` unless the mapping is one-to-one and all required information is retained.

### Derived coordinates

A deterministic color transform can change coordinates without adding source information:

```text
RGB → XYZ → Lab → LCH
```

For cylindrical Lab coordinates:

```text
C = sqrt(a² + b²)
h = atan2(b, a)
```

`C` and `h` reorganize `a` and `b`; they are not additional independent channels unless separately stored.

### State examples

```text
vector:       x_ij ∈ R^D
tensor:       X_ij ∈ R^(A×B×C)
internal set: X_ij ∈ R^(K×D)
memory:       x_ij = [fast | slow | gates]
subfield:     F_outer[i,j] = F_inner^(i,j)
```

Every physical implementation uses finite precision even when real-number notation is convenient mathematically.

### Recurrence

Repeated updates form a state trajectory:

```text
F_0 → F_1 → F_2 → ... → F_T
```

`T` is part of the compute budget. Increasing `T` can change effective communication distance as well as runtime.

### Complete resource ledger

A useful bit ledger is:

```text
B_system
= B_carrier
+ B_hidden
+ B_metadata
+ B_codebook
+ B_topology
+ B_interpreter
+ B_parameters,amortized
```

Terms that are universal and truly shared can be amortized under an explicit rule; instance-specific resources cannot be silently omitted.

### Compression objective

Compression is evaluated through a rate–distortion or rate–utility relationship:

```text
stored bits ↔ reconstruction quality
stored bits ↔ retained task performance
```

A larger latent representation may improve robustness, separability, or computation while still increasing the complete storage rate.

</div>
</details>
