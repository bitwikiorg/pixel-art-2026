---
layout: research
title: "01 · Prior Art and Novelty Boundary"
---

# Prior art and novelty boundary

The MPF proposal sits at the intersection of several established research lines. No single ingredient should be claimed as novel.

## Closest architectural precedents

### Neural Cellular Automata

Neural Cellular Automata already use regular grids in which each cell contains a multidimensional hidden state and all cells share a learned local update rule. Growing NCA and later classification/segmentation work show that local recurrent interactions can support coherent global behavior.

**Implication:** “each pixel is a learned vector” is not a novelty claim. MPF must show a new objective or inductive bias: persistent semantic organization, reasoning dynamics, multiscale recurrence, semantic memory, or operational compression.

### Neural Map and spatial learned memory

Neural Map introduced a persistent two-dimensional learned memory for reinforcement learning.

**Implication:** persistent 2D memory is also prior art. MPF needs computation *inside* the field and causal dependence on its organization.

### VQ-VAE and hierarchical quantized latents

VQ-VAE established learned discrete latent codebooks. VQ-VAE-2 established hierarchical quantized latent representations.

**Implication:** learned codebooks and multilevel latent grids are not novel. MPF compression must be measured against them at matched bitrate and utility.

### Slot Attention and object-centric representations

Slot Attention demonstrates that learned representational units can specialize around entities or objects without assigning fixed semantic labels by hand.

**Implication:** “purposeful” MPF regions must be supported by stability and causal intervention, not merely visual probes.

### Hyperdimensional / Vector-Symbolic Computing

VSA/HDC systems represent structured information using high-dimensional vectors and operations such as binding, bundling, permutation, and similarity. Neuro-vector-symbolic systems have been used for Raven-style reasoning.

**Implication:** compositional high-dimensional reasoning exists independently of MPF. The distinctive question is whether persistent spatial organization improves or complements these operations.

### Hyperbolic representation learning

Poincaré and Lorentz embeddings, hyperbolic neural networks, and hyperbolic graph networks provide well-developed machinery for representing hierarchical structures.

**Implication:** hyperbolicity is an optional geometry experiment, not a definition of the field.

### Learned compression and Information Bottleneck

Information Bottleneck theory asks how to preserve task-relevant information while discarding irrelevant information. Learned neural codecs make rate explicit through quantization and entropy models.

**Implication:** “semantic compression” must become a rate–utility experiment with actual bits.

## What may remain distinctive

A defensible contribution could be the **integration and causal validation** of:

1. persistent spatial addresses;
2. high-dimensional learned cell states;
3. local recurrent computation;
4. multiscale bidirectional communication;
5. stable learned role specialization;
6. persistent memory across episodes;
7. optional vector-symbolic operations;
8. optional hyperbolic hierarchy channels;
9. explicit rate–utility optimization;
10. mechanistic intervention on regions during reasoning.

The strongest paper is therefore not “a new kind of pixel.” It is evidence that **a structured recurrent latent workspace has a useful inductive bias that survives fair controls**.

## Novelty-killing controls

The theory substantially weakens if any of these controls match the proposed system:

- a cell-position permutation with no stable topology;
- a flat recurrent vector with the same total state;
- a ConvGRU with matched compute;
- a Transformer with matched parameters or FLOPs;
- a regular NCA with the same local rule;
- random region groupings instead of spatial hierarchy;
- a powerful decoder that solves the task without meaningful field dynamics.

A negative result is useful. If only recurrence matters, call it a recurrent latent model. If only persistent addresses matter, call it structured memory. If hierarchy matters but 2D geometry does not, drop the pixel metaphor.
