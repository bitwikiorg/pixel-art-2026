---
layout: research
title: Pixel Photon primitive map
kicker: Carrier · representation · computation · memory
---

# Pixel Photon primitive map

The lab now uses a strict progression:

```text
bit
→ carrier
→ interpretation
→ state
→ computation
→ memory
→ composition
→ learning / reasoning
```

The purpose is to keep the source information visible while richer machinery is added. A 16×16 binary field starts with exactly **256 source bits**. A later tensor, hypervector, attention state or memory matrix may allocate much more state, but that extra state is measured rather than treated as free information.

[Run the Binary Pixel Photon Carrier]({{ '/carrier/' | relative_url }}).

## The working primitive set

| Primitive | What the browser actually does | Status | Main measurement |
|---|---|---|---|
| Binary carrier | click black/white pixels; pack 256 bits into 32 bytes and hex | live | exact round trip, entropy, CRC |
| Benign data pixelizer | UTF-8 → length header + bytes → pixels → UTF-8 | live | exact decode |
| Corruption channel | independent bit flips with raw vs Hamming(7,4) path | live | source Hamming error after transmission |
| Bitwise/spatial compute | NOT, mirror, shift and binary dilation | live | exact transformed field |
| Associative memory | classical bipolar Hopfield storage and iterative recall | live | distance to nearest stored pattern |
| Visual motif codec | exact 2×2 motif dictionary + tile IDs | live | dictionary bits + index bits vs raw bits |
| Hypervector field | bind x, y and bit-value hypervectors; bundle; query coordinate | live | query score / crosstalk / state cost |
| Pixel → sound | binary frequency-shift keying of the exact bitstream | live | representation/transduction |
| Pixel interpretation sandbox | scalar, vector, tensor, neural unit, inner tokens, memory, subfield | live mechanics | state size and dynamics |
| Learned Local Vector Field | shared local recurrent neural rule trained on relations | live learned model | accuracy by distance/depth |
| Vector / tensor / micro-transformer ladder | CPU PyTorch reference models | trainable reference | state, parameters, runtime, task accuracy |

## 1. Pixels as a data channel

### Exact binary and PNG

The first laboratory object should remain boring enough to audit: one address, one bit. The W3C PNG specification supports 1-bit grayscale images, making true binary raster serialization a natural standards-based extension of the current browser bit packing.

**Next implementation:** export/import a genuine 1-bit grayscale PNG while preserving the live 256-bit ledger.

- W3C PNG specification: https://www.w3.org/TR/png-3/
- Ward Cunningham `encode-png`: https://github.com/WardCunningham/encode-png
- Pixelizator: https://github.com/apolikamixitos/Pixelizator
- Text-Image Encoder/Decoder: https://github.com/IN4111/Text-Image-Encoder-Decoder
- PythonPixelArtTransformer: https://github.com/Zero-AI-Hub/PythonPixelArtTransformer

### Text through the visual channel

`pxpipe` and the PIXEL language-model line illustrate two different ideas. `pxpipe` renders text as imagery to exploit a model's visual input channel, trading exactness against input cost. PIXEL trains a language model directly on rendered text patches rather than a fixed token vocabulary.

For this lab the useful experiment is not “pixels magically compress text.” It is:

```text
same information
→ UTF-8 bytes
→ 1-bit glyph bitmap
→ grayscale page
→ learned visual representation
```

Measure exact recovery, semantic recovery, byte cost and model-input cost separately.

- pxpipe: https://github.com/teamchong/pxpipe
- PIXEL: https://github.com/xplip/pixel
- Language Modelling with Pixels: https://arxiv.org/abs/2207.06991

### Compute directly on pixel storage

`GTP` / text2shader motivates treating a pixel texture as directly searchable/operable data. WebGPU storage textures make a browser-native compute field possible.

**Current browser baseline:** NOT, shift, mirror and dilation on the 1-bit field.

**Next implementation:** WebGPU + JavaScript side-by-side for XOR, Hamming distance, motif search, convolution, dilation/erosion and neighborhood queries.

- GTP: https://github.com/byteface/GTP
- WGSL: https://www.w3.org/TR/WGSL/

The attack-oriented PixelCode-Attack repository is relevant only to the generic byte↔pixel transport mechanism. This lab deliberately limits that branch to harmless text, JSON, generated patterns, checksums and error-correction experiments.

- PixelCode-Attack: https://github.com/S3N4T0R-0X0/PixelCode-Attack

## 2. Pixels as learned representations

### Masked reconstruction

Masked Autoencoders and Pixio motivate a simple binary learning problem before large vision models are involved:

```text
true 16×16 bitmap
→ hide 25 / 50 / 75%
→ small model
→ reconstruct missing bits
```

The experiment should compare a feed-forward CNN, recurrent local field and pixel-token Transformer under matched small budgets.

- Masked Autoencoders: https://arxiv.org/abs/2111.06377
- Pixio: https://github.com/facebookresearch/pixio

### Visual motifs and discrete codes

The live 2×2 motif codec is intentionally simple. Being-VL's visual-BPE work suggests the next step: recursively learn repeated visual structures rather than fixing tile size. VQ-VAE and learned compression provide the discrete-code and bit-accounting baselines.

**Current:** exact fixed 2×2 dictionary.

**Next:** learned/recursive motif merges, then compare against RLE, DEFLATE, quadtree coding and VQ.

- Being-VL-0 / visual BPE: https://github.com/BeingBeyond/Being-VL-0
- From Pixels to Tokens: https://arxiv.org/abs/2410.02155
- VQ-VAE: https://arxiv.org/abs/1711.00937
- Scale hyperprior compression: https://arxiv.org/abs/1802.01436
- TACO: https://github.com/effl-lab/TACO

## 3. Pixels as computational agents

### Neural Cellular Automata

NCA is the strongest prior-art baseline for vector-valued local computational cells. The distinction for Pixel Photon is therefore not “a cell has hidden channels.” It is the broader type system and the comparison of alternative internal objects.

- Growing Neural Cellular Automata: https://distill.pub/2020/growing-ca/
- Self-classifying MNIST Digits: https://distill.pub/2020/selforg/mnist/

### Inner attention vs field attention

“Transformer inside a pixel” must be split into two experiments:

1. **Inner Transformer:** several latent tokens live inside one persistent address; self-attention mixes them; a compact message crosses to neighbors.
2. **Field Transformer:** each outer pixel is itself a token and attention occurs between addresses.

Transformer in Transformer is direct prior art for nested inner/outer attention, so the research target is persistence, memory, recursive reuse and resource-controlled comparisons—not merely putting attention inside a patch.

- Transformer in Transformer: https://arxiv.org/abs/2103.00112
- lucidrains implementation: https://github.com/lucidrains/transformer-in-transformer
- PixelTransformer: https://github.com/shubhtuls/PixelTransformer
- PixelTransformer paper: https://proceedings.mlr.press/v139/tulsiani21a.html
- PixelRNN: https://arxiv.org/abs/1601.06759

### Local + global correction

PRDiT suggests a useful architectural primitive independent of its original application:

```text
local persistent computation
+
periodic global correction / attention
```

That is a better experiment than forcing every long-range dependency to propagate one cell at a time.

- PRDiT: https://github.com/Fredy-Zhang/PRDiT
- TransformerConvs: https://github.com/BjBodner/TransformerConvs
- nanoDiT: https://github.com/sayakpaul/nanoDiT

## 4. Memory, robustness and causal purpose

### Associative memory

The live Hopfield primitive makes a binary bitmap an attractor state. It should later be compared with modern Hopfield/attention memory and multidimensional persistent fields under equal stored-state budgets.

- Hopfield 1982: https://authors.library.caltech.edu/records/w41x7-8bn13
- Hopfield layers: https://github.com/ml-jku/hopfield-layers
- Simple binary-image Hopfield reference: https://github.com/StrozhDima/neural-network-hopfield-s

### Damage and regeneration

NCA demonstrates learned regeneration after damage. Pixel Photon should compare:

```text
raw redundancy
Hamming / ECC
Hopfield recall
neural reconstruction
NCA regeneration
persistent multidimensional memory
```

These mechanisms solve different recovery problems and should not be collapsed into one score.

### Causal pixel inspection

A hidden-state color is not an explanation. Every learned experiment should progressively expose:

```text
visible carrier
internal state
messages received
attention weights
memory state
next state
output influence
```

and interventions:

```text
mute cell
freeze cell
swap cell
zero memory
replace hidden state while preserving visible bit
```

- Neural-network visualizer: https://github.com/cpldcpu/neural-network-visualizer
- Interpreting neural networks: https://github.com/CarlosFontaneli/interpreting-neural-networks
- ROI attention-map example: https://github.com/sagieppel/Focusing-attention-of-Fully-convolutional-neural-networks-on-Region-of-interest-ROI-input-map-

## 5. Hyperdimensional and geometric state

The live hypervector experiment binds coordinate and bit-value roles into a distributed 4,096-D bipolar representation. It is deliberately allowed to make mistakes: crosstalk and finite capacity are part of the experiment.

Next tests:

- dimensions: 64 → 256 → 1,024 → 4,096 → 16,384;
- number of bundled addresses;
- corruption robustness;
- translation/rotation role operators;
- exact coordinate queries;
- storage cost in bits/bytes;
- comparison with ordinary bitmaps and learned vectors.

- HDC/VSA survey I: https://arxiv.org/abs/2111.06077
- HDC/VSA survey II: https://arxiv.org/abs/2112.15424

Hyperbolic geometry stays a separate choice. It enters when an experiment contains a real hierarchy; it is not a synonym for high dimensionality.

- Poincaré Embeddings: https://arxiv.org/abs/1705.08039

## 6. Spatial address does not have to remain sensor aligned

NOVA3R is useful as a counterexample to an overly literal pixel grid: useful visual computation need not remain permanently aligned to original sensor pixels. PixelREPA likewise suggests aligning hidden visual representations to external semantic targets.

A mature MPF may distinguish:

```text
physical image coordinate
≠ computational field address
≠ semantic coordinate
```

- NOVA3R: https://github.com/wrchen530/nova3r
- PixelREPA: https://github.com/kaist-cvml/PixelREPA
- PoseAwareVT: https://github.com/dominickrei/PoseAwareVT

## 7. Cross-domain interpretation

The live FSK experiment already maps the exact source bitstream into sound. A richer experiment can map image row → frequency and pixel intensity → amplitude, then reconstruct a spatial field from a spectrogram.

- pixelsound: https://github.com/tuomastik/pixelsound
- Image/ASCII/pixel-art transformer: https://github.com/ViniciusCestarii/Image-Transformer-to-ASCII-and-PixelArt

This branch tests a core Pixel Photon idea:

> Same information does not imply the same representation or interpreter.

## 8. Pixel Genome

0xmons is best treated as generative/aesthetic inspiration rather than a scientific baseline. The standalone lab experiment should be reproducible and independent:

```text
seed / latent genome
→ 16×16 creature
→ mutate
→ cross
→ interpolate
→ quantize
→ damage
→ regenerate
```

Version 1 can be deterministic procedural generation. Version 2 can train a tiny VAE. Version 3 can grow the creature from a seed using NCA dynamics.

- 0xmons: https://github.com/c0mput3rxz/0xmons

## 9. True recursion

Pooling is not enough to justify “fractal.” A recursive experiment should literally implement:

```text
8×8 outer field
→ click cell
4×4 inner field
→ click cell
4×4 inner-inner field
```

The same update interface should operate at every level, with child→parent summaries and parent→child context. The measurement is whether recursive operator reuse buys useful capacity or storage efficiency relative to a flat system.

## 10. Controls that make the architecture zoo scientific

The same task should compare:

| Control | What it isolates |
|---|---|
| flattened MLP | no spatial inductive bias |
| feed-forward CNN | ordinary spatial processing |
| recurrent CNN | local recurrence without stronger MPF interpretation |
| NCA | established vector-cell local dynamics |
| pixel-token Transformer | global attention between addresses |
| graph message passing | topology without Cartesian pixels |
| MPF vector field | persistent vector cells |
| tensor cell | internal factorization |
| inner-transformer cell | attention inside persistent cells |
| hybrid local/global field | local state + periodic global correction |

Every result should report at least:

```text
source bits
stored state bits
parameters
approximate compute / runtime
training examples
seeds
exact reconstruction if relevant
task metric
```

Comparisons should be repeated under equal state size, roughly equal parameter count and roughly equal inference compute. Those are different experiments.

## 11. Repository triage

Many supplied repositories are useful as implementation or interface baselines without being central prior art. Simple CNN/MNIST/SegNet/pathfinding projects generally treat pixels as inputs *to* a network rather than asking what the computational object *at the pixel address* can be. They remain useful for controls and educational visualization.

Examples include:

- https://github.com/HauShianChin/8x8-pixel-neural-network
- https://github.com/Albert-LZG/Pixel-Recurrent-Neural-Network
- https://github.com/NathanLaCrosse/Pixel-Recurrent-Neural-Networks
- https://github.com/nisharaichur/SegNet-Encoder-Decoder-Architecture-for-Image-Segmentation
- https://github.com/Manning1999/Neural-Network-Pathfinding
- https://github.com/suryam144/Image-Fill-Neural-Network
- https://github.com/MossBeachBrothers/FPGA-Neural-Network

Their role in this lab is **baseline, interface inspiration or implementation comparison**, not evidence for the distinctive MPF thesis.

## Current implementation priority

1. **Binary carrier** — live now.
2. **Text transport + corruption/ECC** — live now.
3. **Associative memory** — live now.
4. **Exact motif codec** — live now.
5. **Hypervector field** — live now.
6. **WebGPU texture compute** — next browser primitive.
7. **Masked binary reconstruction** — next learned benchmark.
8. **Resource-controlled primitive ladder** — strengthen current vector/tensor/transformer work.
9. **Inner vs field Transformer** — controlled persistent-state comparison.
10. **True recursive field** — same operator/interface across nested scales.
11. **Pixel Genome** — standalone generative experiment.
12. **Semantic geography / non-pixel-aligned field** — learned address organization.
13. **Damage/regeneration suite** — compare ECC, associative, neural and NCA recovery.
14. **Field Album** — persistent fields interacting as higher-order units.

The unifying question is no longer “can a recurrent grid solve a task?” It is:

> **What computational object should occupy an address, how should many such objects interact, and what representation, memory, compression, robustness or reasoning becomes possible for the measured cost?**
