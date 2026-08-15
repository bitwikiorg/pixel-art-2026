---
layout: research
title: Start Here
---

# Start with one bit

<div class="plain-box"><strong>Core idea:</strong> Pixel Photon Lab studies what happens when a spatial address is treated as a finite information carrier whose interpretation can be changed deliberately. We begin with a black/white bit because its information budget is exact. Only then do we add vectors, tensors, memories, neural rules, attention, and recursive fields.</div>

## 1. Ground truth: a binary pixel field

Take a 16×16 black/white image:

```text
black = 0
white = 1
16 × 16 = 256 source bits = 32 packed bytes
```

The bitmap, row-major bitstream and packed bytes are different views of the same finite object. [Open Experiment 01: Binary Pixel Carrier]({{ '/carrier/' | relative_url }}).

This gives the laboratory an accounting reference. When a later experiment creates a 4,096-dimensional hypervector or a 256×256 Hopfield matrix, that additional state is visible in the ledger rather than mistaken for free information.

## 2. Pixel = address + carrier state + interpretation

```text
pixel = address + carrier state + interpretation
```

An address tells us **where** the object lives. The carrier state is what is physically represented in the experiment. The interpretation says what that state means or how it participates in computation.

A binary carrier can become a signed state, coordinate/value tuple, vector, tensor, hypervector binding, neural state, token set, memory state or subfield. A richer interpretation can be computationally useful, but it does not manufacture new independent source information.

## 3. Why the photon analogy is useful—and where it stops

“Pixel Photon” is a computational analogy. A photon is not adequately described as a colored dot; physical information systems can use degrees of freedom such as frequency, phase, polarization, momentum and path/spatial modes. Likewise, the visible value of a computational pixel need not exhaust the state associated with its address.

This is **not** a claim that photons store arbitrary software state or infinite classical information. Every implementation here has finite bits, finite parameters, finite compute and finite measurements.

> **One visible projection can correspond to a richer finite computational object. The architecture space is open-ended; implementations are not infinite.**

## 4. The experiment sequence

```text
01  exact carrier
02  reliability / error correction
03  associative memory
04  exact motif coding
05  distributed hypervector representation
06  alternative pixel interpretations
07  learned local vector field
08  direct GPU pixel computation
09  learned masked reconstruction
10  controlled primitive benchmark
11  generative Pixel Genome
A1  original hand-designed field mechanics
```

[Browse the Experiment Atlas]({{ '/experiment/' | relative_url }}).

Every experiment states its source information, interpretation, operation, evidence level, measurement and boundary. This is the defense against a visually interesting demo being mistaken for scientific evidence.

## 5. The interpretation ladder

### Scalar
`x_ij ∈ R` — one value at one address.

### Vector
`x_ij ∈ R^D` — a multidimensional state. Neural Cellular Automata are a major prior-art family for learned vector-valued local cells.

### Tensor
`X_ij ∈ R^(A×B×C)` — a structured internal array. A meaningful test uses operations that respect those axes and compares against a flat vector under a declared resource budget.

### Neural pixel
`x_ij' = fθ(x_ij, message_ij)` — the address has state and a shared learned rule updates many addresses. Shared weights are system cost, not free information stored in each pixel.

### Micro-transformer pixel
`X_ij ∈ R^(K×D)` — several latent tokens exist **inside one address**. This differs from a field Transformer, where outer addresses are tokens and attention occurs **between** addresses.

### Memory object
A cell can maintain fast state, slow state, confidence or routing information. A real memory experiment requires write → delay/interference → query.

### Subfield / recursive object
`F_outer[i,j] = F_inner^(i,j)` — one address contains another field. “Recursive” becomes meaningful when an interface/operator is actually reused across levels; ordinary pooling is not enough.

[Open Experiment 06: Pixel Interpretation Sandbox]({{ '/experiment/interpretation/' | relative_url }}).

## 6. Communication is independent of pixel type

What a pixel contains does not determine how pixels communicate. Candidate mechanisms include local convolution, graph messages, sparse long-range links, global/windowed attention, regional summaries, learned routing and parent/child messages in recursive fields.

This separation matters. A vector pixel with global attention and a transformer pixel with only nearest-neighbor messages are different systems even if both contain high-dimensional state.

## 7. Time is another independent axis

A field may evolve `F_0 → F_1 → … → F_T`. Repeated updates can propagate information, maintain working state or implement iterative computation. But recurrence is one design choice, not the definition of MPF.

## 8. What counts as evidence?

- **EXACT** — deterministic codec/operator checked against an exact reference;
- **DYNAMICAL / MECHANICS** — executable fixed-rule evolution, not a learned result;
- **LEARNED** — parameters optimized against a task with held-out evaluation;
- **BENCHMARK** — repeated controlled comparison across architectures/resources;
- **PROCEDURAL BASELINE** — deterministic generative interpreter, not learned AI.

A learned model solving a task proves only that **that model under that protocol** learned the task. It does not establish superiority until relevant controls are run.

## 9. The information ledger

```text
source carrier bits
+ hidden / persistent state bits
+ metadata
+ codebook / side information
+ shared model parameters (under a declared amortization rule)
= accounted system resources
```

For neural experiments we also report update depth, runtime, training examples and seeds. For compression we report total stored bits and reconstruction fidelity. For memory we report recovery versus corruption. For reasoning, later tasks need known intermediate traces.

## 10. The research question

> **One pixel. Many possible universes.**

Technical version:

> **What computational object should occupy an address, how should many such objects interact, and what representation, memory, compression, robustness, computation or reasoning becomes possible for the measured cost?**

Next: [Experiment Atlas]({{ '/experiment/' | relative_url }}).
