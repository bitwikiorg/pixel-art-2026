---
layout: research
title: Research Neighborhood
---

# The research neighborhood

<div class="plain-box"><strong>Plain English:</strong> most ingredients of MPF already exist somewhere in machine learning. The interesting work is understanding what each neighboring field contributes, then testing combinations that are not already standard.</div>

## Neural Cellular Automata — the closest structural ancestor

[Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/) places a multidimensional state in every grid cell and repeatedly applies a learned local update rule. Its cells communicate with nearby cells and can learn robust global behavior from local computation.

[Self-classifying MNIST Digits](https://distill.pub/2020/selforg/mnist/) goes further toward semantic computation: local cells collectively classify the global digit and converge on a label. This is particularly important for MPF because it shows that NCA is not limited to growing pictures.

**What MPF adds as a research direction:** persistent semantic workspace, explicit reasoning tasks, multiresolution state, stored memory, topology studies, rate–utility analysis, and stronger investigation of learned functional specialization.

## Classical cellular automata

A [cellular automaton](https://www.scholarpedia.org/article/Cellular_automata) is a discrete spatial system where local neighborhood rules produce global dynamics. Classical CA is useful background because it makes the distinction between **local transition rule** and **global emergent computation** unusually clear.

Neural CA replaces a hand-written transition table with differentiable learned functions.

## Neural Map — persistent 2D learned memory

[Neural Map: Structured Memory for Deep Reinforcement Learning](https://arxiv.org/abs/1702.08360) uses a persistent spatially structured 2D memory to store information over long time intervals.

**Connection:** both systems give learned information stable spatial addresses.

**Difference:** MPF is interested in recurrent computation occurring throughout the field itself, not only in a memory map being written and queried by an external controller.

## Self-Organizing Maps — semantic neighborhood on a 2D lattice

The [Kohonen Self-Organizing Map](https://www.scholarpedia.org/article/Kohonen_network) maps high-dimensional data onto a regular grid while encouraging topological ordering.

**Connection:** it is a major precedent for the idea that a 2D neighborhood can reflect structure in a high-dimensional representation.

**Difference:** SOM is primarily a mapping/organization method; MPF studies recurrent task computation in a persistent state field.

## Graph Neural Networks — a general message-passing view

A grid is a graph with regular connectivity. From this viewpoint, an MPF update is message passing over a graph with shared node dynamics. [A Gentle Introduction to Graph Neural Networks](https://distill.pub/2021/gnn-intro/) is a useful bridge.

This viewpoint is important because a positive result from stable connectivity may not imply that **2D Cartesian geometry** is special. A fixed random graph or learned semantic graph can be used as a control.

## Recurrent convolutional networks

A recurrent convolution can repeatedly apply the same local kernels to a hidden spatial tensor. In implementation terms, a minimal MPF can look extremely close to this established family.

That is useful, not embarrassing: it gives strong baselines and mature tooling. The project becomes more specific when position, persistence, multiscale structure and learned semantic organization are themselves studied as computational variables.

## Slot Attention — learned specialization

[Slot Attention](https://arxiv.org/abs/2006.15055) learns a set of internal slots that can specialize around objects or entities.

**Connection:** it demonstrates that useful internal specialization can emerge from task training.

**Difference:** slots are typically permutation-symmetric rather than persistently embedded in a 2D spatial workspace.

## Vector quantization — discrete latent state

[VQ-VAE](https://arxiv.org/abs/1711.00937) learns discrete codebook representations. [VQ-VAE-2](https://arxiv.org/abs/1906.00446) adds hierarchical latent scales.

These are direct precedents for any MPF storage/compression experiment. A field only becomes a compression method when actual representation bits—including codebooks and instance-specific side information—are counted.

## Hyperbolic representation learning

[Poincaré Embeddings](https://arxiv.org/abs/1705.08039) showed that hyperbolic space can efficiently represent hierarchical symbolic data. This motivates a narrow MPF experiment in which hierarchy-related state uses hyperbolic distance or a hyperbolic manifold.

Hyperbolic geometry is a **metric/geometric choice**, not an extra dimension and not a source of free storage capacity.

## Hyperdimensional / Vector-Symbolic Computing

Vector-symbolic architectures encode entities and relations in high-dimensional vectors and support operations such as binding, bundling and similarity-based retrieval. A useful overview is [A Survey on Hyperdimensional Computing](https://arxiv.org/abs/2111.06077).

A later MPF variant could place vector-symbolic representations inside persistent spatial cells, using the field for routing and memory while VSA operations provide explicit composition.

## Where the integration may be less explored

The combination worth investigating is not any one component above. It is a persistent system where:

- a recurrent field is the active working state;
- local and multiscale communication coexist;
- stable spatial organization can itself be learned and measured;
- regions may develop persistent computational functions;
- reasoning traces remain inside the field over time;
- the same field can later be stored, retrieved, quantized or composed with other fields.

That integration must still be compared with simpler recurrent grids, graph networks, memory maps, slot models and Transformers.

## Reading order

1. [Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/)
2. [Self-classifying MNIST Digits](https://distill.pub/2020/selforg/mnist/)
3. [Scholarpedia: Cellular automata](https://www.scholarpedia.org/article/Cellular_automata)
4. [Neural Map](https://arxiv.org/abs/1702.08360)
5. [Scholarpedia: Kohonen network](https://www.scholarpedia.org/article/Kohonen_network)
6. [Distill: GNN introduction](https://distill.pub/2021/gnn-intro/)
7. [VQ-VAE](https://arxiv.org/abs/1711.00937)
8. [Poincaré Embeddings](https://arxiv.org/abs/1705.08039)
