---
layout: research
title: Start Here
---

# Multidimensional Pixel Fields, from zero to neural network

<div class="plain-box"><strong>One-sentence version:</strong> an MPF is a grid where every location contains a learned vector, the same neural update rule is reused across locations and time, and computation happens as the whole field changes.</div>

The original research question is whether a persistent 2D field of learned states can become more than an ordinary activation tensor: a working memory in which **position, state, neighborhood, scale and change** all participate in computation.

## 1. Cell: one location, many numbers {#cell}

### Plain English

A normal image pixel is usually described by a few channel values such as red, green and blue. An MPF cell is different. Its position still looks like a pixel address, but inside that address is a vector of learned numbers.

If the field is 32×32 and every cell has 64 values, the field has 1,024 spatial addresses and 65,536 scalar state values.

### Technical model

We write the field as

```text
F_t ∈ R^(H × W × D)
```

and one cell as

```text
F_t[i,j] = x_ij^(t) ∈ R^D
```

`D` is the cell-state width. The coordinates `(i,j)` say **where** the state lives; the vector `x` says **what state is there**.

Learn more: [Vector (Wikipedia)](https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)) · [Embedding (Wikipedia)](https://en.wikipedia.org/wiki/Embedding) · [Tensor (Wikipedia)](https://en.wikipedia.org/wiki/Tensor)

## 2. Local rule: cells communicate with neighbors {#local-rule}

### Plain English

A cell does not need to inspect the entire field. It can look at a small neighborhood—often a 3×3 patch centered on itself—and use that local evidence to decide how to update its state.

The important engineering idea is **weight sharing**: every cell can use the same small neural network. We are not storing a different program inside every location.

### Technical model

A simple recurrent update is

```text
x_ij^(t+1) = x_ij^t + gθ(x_ij^t, N_ij(F_t))
```

where `N_ij` summarizes the neighborhood and `gθ` is a learned neural function whose parameters `θ` are shared across the grid.

This is very close to **Neural Cellular Automata (NCA)**. Growing Neural Cellular Automata used multidimensional cell states, local perception and a learned shared update rule. [Read the Distill article](https://distill.pub/2020/growing-ca/). For the classical idea of a cellular automaton, see [Scholarpedia: Cellular automata](https://www.scholarpedia.org/article/Cellular_automata).

A graph-neural-network view is also useful: the grid is a regular graph and each update is a round of message passing. [Distill: A Gentle Introduction to Graph Neural Networks](https://distill.pub/2021/gnn-intro/).

## 3. Recurrence: the same computation continues through time {#recurrence}

### Plain English

One local update can only move information a short distance. Repeating the rule lets effects propagate farther.

With a 3×3 neighborhood, a signal can only directly reach adjacent cells in one step. After several recurrent steps, distant parts of the field can influence one another indirectly.

### Technical model

```text
F_0 → F_1 → F_2 → … → F_T
```

The same learned transition can be reused at every `t`. This is recurrence: later states depend on earlier states, and effective computational depth can grow without introducing a new independent set of weights for every step.

Related reading: [Scholarpedia: Recurrent neural networks](https://www.scholarpedia.org/article/Recurrent_neural_networks) · [Self-classifying MNIST Digits](https://distill.pub/2020/selforg/mnist/).

## 4. Field: persistent working state

A normal feed-forward activation is often temporary: data passes through a layer and onward. MPF is interested in a stronger design in which the field itself remains the machine's working state for multiple updates, and potentially persists between episodes.

That connects the project to learned external memory. [Neural Map](https://arxiv.org/abs/1702.08360) is especially relevant because it stores learned information in a persistent 2D memory. MPF pushes in a different direction: computation should occur **inside** the field through repeated shared updates, rather than treating the grid mainly as a passive memory to read and write.

## 5. Hierarchy: cells can form regions {#hierarchy}

### Plain English

Local communication is cheap, but it can be slow for long-distance problems. A multiresolution field adds summaries at larger scales:

```text
32×32 cells → 8×8 regions → 4×4 super-regions → global state
```

A fine scale can preserve detail while a coarse scale carries context farther.

### Technical question

Do regional summaries reduce the number of recurrent steps, improve generalization, or organize the representation more cleanly? If not, a flat recurrent field is simpler and should be preferred.

The word **fractal** should be reserved for a later architecture that genuinely reuses the same representational/update rule across multiple scales. Until then, **multiresolution** or **hierarchical** is the precise term.

## 6. Training: the rule is learned, not hand-written {#training}

The live neural-field experiment uses supervised learning. Examples contain two marked locations, A and B, and a target relation such as LEFT or ABOVE. The network begins with random weights.

During training:

1. an encoder writes the markers into the field;
2. a shared local neural rule updates the hidden field several times;
3. the field is pooled into a small readout;
4. the prediction is compared with the correct label;
5. backpropagation computes how the weights contributed to the error;
6. an optimizer updates those weights.

That is an ordinary differentiable neural-network training loop. The unusual part is the **state architecture**: a persistent, spatially addressable recurrent field.

Try it: [Train the browser neural field]({{ '/experiment/' | relative_url }}).

## 7. What comes after the first neural field?

The main research directions branch from the same core mechanism:

- **semantic topology** — can the learned arrangement itself become meaningful?
- **purposeful roles** — do cells or regions develop stable computational specializations?
- **multiresolution reasoning** — can fine and coarse states exchange information usefully?
- **persistent memory** — can a field be stored, retrieved, edited and reused?
- **vector quantization** — can stored field state be represented with discrete codes? [VQ-VAE](https://arxiv.org/abs/1711.00937)
- **hyperbolic hierarchy** — do hierarchy-related channels benefit from a non-Euclidean metric? [Poincaré embeddings](https://arxiv.org/abs/1705.08039)
- **vector-symbolic operations** — can high-dimensional binding/composition be embedded inside field state?

<div class="note-box"><strong>Where to go next:</strong> use the <a href="{{ '/research/' | relative_url }}">Research Library</a> as a map. Each card answers a different question and links the primary literature behind it.</div>
