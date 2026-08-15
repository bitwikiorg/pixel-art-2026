---
layout: research
title: Pixel Photon Primitive Map
---

# Pixel Photon primitives

A binary field supplies an exact information baseline:

```text
16 × 16 addresses = 256 source bits
```

Every additional mechanism—redundancy, high-dimensional state, dictionary entries, neural weights, memory matrices, routing state, or a shared interpreter—changes the resource budget. The useful question is what capability that added resource buys.

## Binary carrier

A black-and-white field can be represented exactly as a bit matrix, row-major bitstream, packed bytes, or hexadecimal. [Binary Pixel Carrier]({{ '/carrier/' | relative_url }}) checks those transformations bit-for-bit.

This establishes a controlled source before richer state is introduced. PNG 1-bit grayscale, text/image codecs, Pixelizator, `encode-png`, and PythonPixelArtTransformer belong to the same broad lineage of treating visual cells as explicit data carriers.

`pxpipe` and PIXEL extend the question toward representation channels: semantically similar content can travel as bytes, glyph pixels, or learned visual patches, but exactness, model cost, and task utility are different quantities.

## Redundancy and reliability

[Corruption & Error Correction]({{ '/experiment/reliability/' | relative_url }}) compares 256 raw bits with 448 Hamming(7,4)-encoded bits under independent bit flips.

The result isolates one mechanism:

```text
extra transmitted redundancy → improved correction of some errors
```

Error correction should remain distinct from other forms of recovery:

```text
ECC decoding
Hopfield attractor recall
learned masked reconstruction
NCA regeneration
persistent-state repair
```

Each uses different stored information and solves a different problem.

## Reusable visual motifs

[Visual Motif Codec]({{ '/experiment/motif-codec/' | relative_url }}) partitions a binary field into 2×2 tiles, stores unique motifs once, and replaces repeated tiles with dictionary indices.

The essential accounting is

```text
total code = dictionary + indices + metadata
```

Repeated structure can make the total code smaller than the raw bitmap; random or motif-rich fields can make it larger.

Learned visual-BPE methods such as Being-VL and discrete latent methods such as VQ-VAE motivate a stronger next step: learn reusable visual units while counting the codebook and side information required to decode them.

## Distributed hypervector representation

[Hypervector Field]({{ '/experiment/hypervector/' | relative_url }}) binds x-coordinate, y-coordinate, and bit-value hypervectors and bundles all address-value pairs into one high-dimensional vector.

The representation is approximate. Query accuracy depends on dimensionality because superposition creates crosstalk among many bound items.

```text
higher dimension → typically lower crosstalk
higher dimension → more derived state
```

The original 256 source bits remain the independent source information. The hypervector and role codebook are representational resources, not free compression.

## Alternative internal pixel objects

[Pixel Interpretation Sandbox]({{ '/experiment/interpretation/' | relative_url }}) keeps the 12×12 outer address space fixed while replacing the object at every address:

```text
scalar
vector
tensor
fixed neural state
internal token set
fast/slow memory
3×3 subfield
```

The fixed rules make structural differences inspectable without confounding them with training. Usefulness requires later matched learned comparisons.

Neural Cellular Automata are the central baseline for learned vector-valued local cells; hidden channels and recurrent local updates are already established mechanisms.

## Internal attention versus field attention

Transformer in Transformer provides direct prior art for nested inner and outer attention. Two computational placements remain worth separating:

```text
INTERNAL-TOKEN PIXEL
multiple tokens inside one outer address
self-attention mixes internal tokens
one compact object communicates outward

FIELD TRANSFORMER
one token represents one outer address
attention mixes different addresses
```

These factorizations have different scaling and different inductive biases. A meaningful comparison needs persistence, task performance, parameter count, state size, and compute rather than a visual analogy between patches and pixels.

PixelTransformer provides another contrast: sparse observed samples can support probabilistic queries at arbitrary coordinates. This motivates separating a known carrier value from model state that predicts or reasons about that value.

## Learned local vector state

[Learned Local Vector Field]({{ '/experiment/learned-local-field/' | relative_url }}) uses a 12-dimensional vector per address and a shared recurrent 3×3 update to predict the relation between two markers.

It establishes a trainable recurrent-field pipeline and exposes accuracy by marker distance. Its closest conventional explanations are recurrent convolution and NCA, so those remain mandatory controls for stronger conclusions.

## Direct computation on the field

[WebGPU Pixel Compute]({{ '/experiment/webgpu/' | relative_url }}) applies NOT, binary dilation, and neighborhood edge detection to a 64×64 binary field using both a JavaScript CPU reference and WGSL/WebGPU.

A GPU output is considered correct only when all 4,096 addresses match the CPU reference. The current implementation uses storage buffers and reports end-to-end submission plus readback time; it is not a kernel-only speed benchmark.

GTP/text2shader motivates the broader idea that a two-dimensional texture or field can be transformed directly as data rather than treated only as a display surface.

## Learned reconstruction

[Masked Binary Reconstruction]({{ '/experiment/masked-reconstruction/' | relative_url }}) hides pixels in structured 16×16 binary fields and compares a deterministic local-majority rule with a 745-parameter convolutional network.

The network receives both observed value and visibility state:

```text
input pixel = [observed bit, visibility flag]
```

Its headline metric is accuracy on held-out **hidden** pixels. Masked Autoencoders and Pixio motivate much larger versions of the same missing-information question, but the present model is intentionally a conventional convolutional control rather than an MPF advantage claim.

## Resource-controlled primitive comparison

[Primitive Resource Benchmark]({{ '/experiment/primitive-benchmark/' | relative_url }}) compares vector, tensor, and internal-token cells on the same relation task.

Three budgets must remain separate:

```text
equal scalar state
approximately equal parameters
approximately equal compute
```

Completed equal-state runs show substantial seed and optimization variance. The correct conclusion is that isolated best runs are not stable architecture evidence.

Stronger controls include feed-forward CNN, recurrent CNN, NCA, pixel-token Transformer, graph message passing, and empirical equal-runtime protocols.

## Associative memory

[Associative Pixel Memory]({{ '/experiment/memory/' | relative_url }}) interprets a 16×16 field as 256 bipolar Hopfield spins. Stored patterns modify a dense weight matrix; corrupted states then relax under sequential asynchronous updates.

The important storage distinction is

```text
visible field state ≠ memory weights
```

The fully connected weight matrix contains the associative memory. The 2D arrangement is only a display organization in this baseline, so recovery cannot be attributed to spatial topology.

A stronger learned persistent-memory task needs explicit write, delay or interference, and query phases.

## Local plus global computation

Architectures such as PRDiT motivate a hybrid primitive:

```text
frequent local persistent updates
+
periodic global correction or attention
```

This can reduce long communication paths without paying full global attention at every step. The useful comparison is against pure local recurrence and pure global attention under similar compute.

## Computational address beyond sensor coordinates

NOVA3R and PixelREPA are reminders that hidden visual computation does not have to remain permanently aligned with input pixels.

Three coordinate systems may differ:

```text
physical sensor coordinate
computational field address
semantic coordinate
```

Learned semantic geography is therefore an empirical topology question. It should be compared with fixed Cartesian, graph, and permutation-invariant alternatives.

## Procedural generative description

[Pixel Genome]({{ '/experiment/pixel-genome/' | relative_url }}) uses a 128-bit genome plus a shared interpreter to generate a 24×24, 576-bit binary creature.

Mutation and crossover alter the description. Damage alters only the raster. Regeneration reconstructs the raster from the persistent genome.

The 128/576 ratio applies only inside the restricted family defined by the interpreter. The interpreter is side information, so the mechanism is not a universal 128-bit compressor for arbitrary images.

## True recursive fields

A stronger recursive primitive literally contains active fields inside outer addresses and passes messages across levels:

```text
outer field
  ↕
inner field at each address
  ↕
inner addresses
```

A reusable interface or update operator across levels is the important property. Pooling or a feature pyramid alone does not establish recursion.

The measurement should target scale generalization, adaptive computation, or storage efficiency compared with a flat architecture.

## Causal inspection

Rich internal state requires more than color projection. Useful observables include

```text
visible carrier
internal state
messages received
attention or gates
next state
output influence
```

Causal evidence comes from perturbations such as muting, freezing, swapping, erasing memory, or preserving the visible carrier while replacing hidden state. Functional roles become credible when predicted interventions change behavior consistently.

## Research lineages

High-value comparison points include:

- PNG 1-bit grayscale and exact binary codecs;
- Hopfield associative memory;
- Growing NCA and Self-classifying NCA;
- PIXEL and masked visual reconstruction;
- VQ-VAE and learned compression with explicit codebooks;
- Being-VL visual BPE;
- HDC/VSA surveys;
- Transformer in Transformer;
- PixelTransformer and PixelRNN;
- GTP/text2shader and WebGPU/WGSL;
- PixelREPA, NOVA3R, and local/global vision architectures.

## Unresolved high-value comparisons

```text
internal-token attention vs field attention
→ fully converged equal-parameter and equal-compute controls
→ learned persistent write-delay-query memory
→ true recursive field with operator reuse
→ semantic topology controls
→ quantized rate–utility fields
→ hierarchy-specific hyperbolic tests
→ interacting persistent field memory
```

Each step should earn its additional state and compute against a simpler alternative.
