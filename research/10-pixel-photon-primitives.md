---
layout: research
title: Pixel Photon Primitive Map
---

# Pixel Photon primitive map

The research program uses a strict progression so the source information remains visible as machinery is added:

```text
bit
→ carrier
→ reliability
→ interpretation
→ computation
→ memory
→ composition
→ learning / reasoning
```

A 16×16 binary field begins with **256 source bits**. Tensor state, hypervectors, neural weights, dictionaries and memory matrices are extra resources and must be counted separately.

## Carrier and channel

**Binary carrier** is the ground truth: black/white field ↔ bitstream ↔ packed bytes. [Experiment 01]({{ '/carrier/' | relative_url }}).

Related lineages include PNG 1-bit grayscale, text/image codecs, Pixelizator, `encode-png`, and PythonPixelArtTransformer. `pxpipe` and PIXEL broaden the question from exact byte transport to representation-channel tradeoffs: the same semantic source can be presented as bytes, glyph pixels or learned visual patches, but exactness and model cost must be measured separately.

The benign transport lesson from PixelCode-Attack is limited to generic byte↔pixel mapping. This lab does not reconstruct executables or loaders.

## Reliability

[Experiment 02]({{ '/experiment/reliability/' | relative_url }}) compares raw transmission against Hamming(7,4) under independent bit flips. It exposes the cost of redundancy and the code's actual correction limit instead of calling “noise resistance” an abstract property.

Later recovery comparisons should keep distinct mechanisms separate:

```text
ECC recovery
Hopfield attractor recall
learned masked reconstruction
NCA regeneration
persistent-state repair
```

They solve different problems.

## Distributed representation

[Experiment 05]({{ '/experiment/hypervector/' | relative_url }}) binds x-coordinate, y-coordinate and bit-value hypervectors and bundles the full field. It measures coordinate-query accuracy as dimension changes. The representation is deliberately approximate: crosstalk and capacity are part of the phenomenon.

This is the HDC/VSA branch of the project. It is one of the cleanest ways to test very high-dimensional state while retaining an exact binary source against which retrieval can be scored.

Hyperbolic geometry remains a different hypothesis and should enter only on genuinely hierarchical targets.

## Spatial coding and compression

[Experiment 04]({{ '/experiment/motif-codec/' | relative_url }}) is an exact fixed 2×2 dictionary codec. It counts metadata, dictionary entries and tile indices. Random fields can expand; repeated motifs can compress.

The next compression research layer is recursive/learned motif discovery, motivated by visual-BPE approaches such as Being-VL, and learned discrete representations such as VQ-VAE. These must still count codebooks and side information.

TACO and learned image-compression work motivate separating pixel fidelity, perceptual fidelity and task utility rather than calling all three “compression quality.”

## Pixel as computational agent

Neural Cellular Automata are the major established baseline for learned vector-valued local cells. Therefore “hidden channels in a pixel” is not the novelty target.

[Experiment 06]({{ '/experiment/interpretation/' | relative_url }}) is a mechanics sandbox that changes the object at each address: scalar, vector, tensor, tiny neural update, internal token attention, memory state or subfield. Its rules are fixed; it is not evidence that one interpretation is useful.

[Experiment 07]({{ '/experiment/learned-local-field/' | relative_url }}) is the learned vector-field baseline. It belongs near NCA/recurrent CNNs, not above them.

## Inner Transformer versus field Transformer

Transformer in Transformer (TNT) is direct prior art for nested inner/outer attention. The useful distinction for this project is therefore:

```text
INNER TRANSFORMER PIXEL
multiple persistent tokens inside one address
attention inside the address
compact message outside

FIELD TRANSFORMER
one token per outer address
attention between addresses
```

The distinctive research question is persistence, memory, recursive reuse and resource-controlled comparison—not merely placing attention inside an image patch.

PixelTransformer provides another useful contrast: sparse observed spatial samples can support probabilistic queries at arbitrary coordinates. That motivates future “known carrier vs model state about carrier” experiments.

## Direct compute on pixel-addressed state

[Experiment 08]({{ '/experiment/webgpu/' | relative_url }}) implements binary operators in a CPU reference and, where available, WGSL/WebGPU. A GPU result is accepted only when its output exactly matches the CPU field. Timing is end-to-end submit/readback timing, so the page does not imply that WebGPU must win on small arrays.

GTP/text2shader is useful inspiration for treating a 2D texture as data that is searched or transformed directly rather than merely visualized.

## Learned reconstruction

Masked Autoencoders and Pixio motivate learning from missing pixel content. [Experiment 09]({{ '/experiment/masked-reconstruction/' | relative_url }}) intentionally starts far smaller: structured 16×16 binary fields, a visibility mask, a local-majority baseline and a 745-parameter convolutional model scored **only on hidden pixels**.

This is a conventional learned reconstruction control, not an MPF win. Its role is to provide a trustworthy rung between exact binary primitives and richer persistent-cell architectures.

## Resource-controlled primitive ladder

[Experiment 10]({{ '/experiment/primitive-benchmark/' | relative_url }}) compares vector, tensor and inner-token cells under declared matching protocols. Equal state, equal parameters and equal compute are separate questions.

The audit found substantial seed/training instability in small relation-task runs. That is now treated as a result about the benchmark protocol: isolated best runs are not featured as stable architecture evidence.

Future controls should include MLP, feed-forward CNN, recurrent CNN, NCA, pixel-token Transformer and graph message passing.

## Memory

[Experiment 03]({{ '/experiment/memory/' | relative_url }}) uses a classical fully connected Hopfield network as a transparent associative-memory baseline. The field is treated as a bipolar attractor state; the browser reports Hamming distance and Hopfield energy.

A stronger persistent Pixel Photon memory experiment must add a real write → delay/interference → query task and compare against this baseline under explicit stored-state cost.

## Local plus global computation

PRDiT and related architectures motivate a useful general primitive:

```text
local persistent computation
+
periodic global correction / attention
```

This may be more efficient than forcing every long-range dependency to propagate one cell per recurrent step. It belongs after inner-vs-field attention is controlled.

## Computational address need not remain sensor-aligned

NOVA3R and PixelREPA are useful reminders that hidden visual computation need not remain permanently aligned to input pixels. A mature system may distinguish:

```text
physical image coordinate
≠ computational field address
≠ semantic coordinate
```

Learned semantic geography therefore remains an open topology experiment rather than an assumption.

## Pixel Genome

[Experiment 11]({{ '/experiment/pixel-genome/' | relative_url }}) is the audited first version inspired aesthetically by 0xmons: a **128-bit genome + shared procedural interpreter** generates a larger binary creature. Mutation, crossing, interpolation, damage and regeneration are deterministic operations.

The important scientific point is the accounting: the genome is not a universal 128-bit compressor for arbitrary images. It describes only the restricted family generated by the shared interpreter. Later versions can compare a learned VAE or NCA growth model against this procedural baseline.

## True recursion

Pooling is not enough. A future recursive lab should literally contain field-inside-field state with parent↔child messages and a reused interface/operator across levels. The measurement is whether recursive reuse improves generalization, adaptive computation or storage efficiency relative to a flat model.

## Causal inspection standard

A hidden-state color is not an explanation. Learned experiments should eventually expose:

```text
visible carrier
internal state
messages received
attention / gates if defined
next state
output influence
```

and allow interventions such as mute, freeze, swap or zero-memory. This is the path from named “roles” to causal evidence of roles.

## Research lineage

High-value references include:

- PNG 1-bit grayscale specification;
- Hopfield associative memory;
- Growing NCA and Self-classifying NCA;
- PIXEL and masked pixel reconstruction;
- VQ-VAE and learned compression/hyperpriors;
- Being-VL visual BPE;
- HDC/VSA surveys;
- Transformer in Transformer;
- PixelTransformer and PixelRNN;
- GTP/text2shader and WebGPU/WGSL;
- PixelREPA, NOVA3R and local/global vision architectures.

The many generic “pixel neural network” repositories remain useful for baselines, interface ideas and educational visualizations, but most treat pixels as ordinary **inputs to** a network rather than asking what computational object occupies a persistent address.

## Current boundary

The implemented atlas now covers exact carrier behavior, reliability, associative memory, motif coding, distributed representation, mechanics variants, a learned local field, direct GPU computation, masked reconstruction, a multi-seed primitive benchmark and a procedural Pixel Genome.

The next research tier—not yet promoted to live evidence—is:

```text
inner-vs-field Transformer
→ matched-compute control suite
→ learned persistent memory
→ true recursive field
→ semantic topology
→ quantized/rate–utility fields
→ hierarchy-specific hyperbolic tests
→ field albums
```
