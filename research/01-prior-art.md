---
layout: research
title: Research Neighborhood
---

# Research neighborhood

Most ingredients required for Multidimensional Pixel Fields already exist in established machine learning and information-processing systems. The useful question is not whether multidimensional cells, recurrence, memory, quantization, or learned topology are possible. It is which combinations produce a measurable advantage after strong baselines and resource costs are controlled.

## Neural Cellular Automata

[Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/) places a multidimensional state in every grid cell and repeatedly applies a learned local update rule. Neighboring cells communicate locally, yet training can produce coherent global growth and regeneration.

[Self-classifying MNIST Digits](https://distill.pub/2020/selforg/mnist/) moves beyond image growth: local cells collectively classify the global digit and converge on a label. This demonstrates that learned cellular systems can perform distributed semantic computation.

For MPF, NCA is therefore a baseline rather than merely inspiration. Hidden vector channels, shared local updates, recurrence, persistence, and regeneration cannot by themselves establish a distinct contribution.

Stronger hypotheses involve persistent semantic workspace, explicit memory, alternative cell primitives, multiresolution communication, learned topology, rate–utility analysis, or tasks where internal computation can be inspected causally.

## Classical cellular automata

A [cellular automaton](https://www.scholarpedia.org/article/Cellular_automata) is a spatial system in which local transition rules generate global dynamics. Classical CA makes the distinction between a **local rule** and **emergent global computation** unusually clear.

Neural cellular automata replace the hand-written transition table with differentiable learned functions, but the same conceptual warning remains: visually complex global behavior does not automatically reveal what information is being represented or what task has been solved.

## Neural Map and persistent spatial memory

[Neural Map: Structured Memory for Deep Reinforcement Learning](https://arxiv.org/abs/1702.08360) uses a persistent two-dimensional learned memory so information can retain stable spatial addresses over long time intervals.

The overlap with persistent pixel fields is direct: both give learned information an addressable spatial substrate. A stronger MPF memory result must establish what is gained when computation occurs throughout the field rather than when an external controller merely writes to and reads from a spatial memory map.

## Self-Organizing Maps and semantic neighborhood

The [Kohonen Self-Organizing Map](https://www.scholarpedia.org/article/Kohonen_network) maps high-dimensional observations to an ordered grid while encouraging nearby grid units to represent nearby regions of the data distribution.

This is an important precedent for semantic organization on a two-dimensional lattice. It also provides a useful control: if learned semantic geography is proposed, the result should be compared with established topographic mapping methods rather than treating organized neighborhoods as novel by default.

## Graph Neural Networks and message passing

A regular pixel grid is a graph with a specific connectivity pattern. [A Gentle Introduction to Graph Neural Networks](https://distill.pub/2021/gnn-intro/) provides the general message-passing view: nodes aggregate information from connected neighbors and update their states.

That view separates two hypotheses:

```text
stable connectivity is useful
```

from

```text
2D Cartesian geometry is specifically useful
```

A fixed random graph, learned graph, torus, sparse long-range graph, or attention network can test whether the Cartesian arrangement itself matters.

## Recurrent convolutional networks

A recurrent convolution repeatedly applies shared local kernels to a hidden spatial tensor. A minimal learned vector field can therefore be mathematically close to an established recurrent CNN.

This similarity is useful because it supplies mature baselines. A distinctive result must come from an experimentally isolated property such as persistent addressability, alternative internal pixel structure, multiscale recursion, learned routing, or unusually efficient memory—not from recurrence plus convolution alone.

## Slot Attention and learned specialization

[Slot Attention](https://arxiv.org/abs/2006.15055) learns a set of internal slots that can specialize around objects or entities.

Slot systems show that functional specialization can emerge without assigning semantic roles by hand. Their slots are typically permutation-symmetric rather than embedded at persistent spatial addresses, making them a useful comparison for any hypothesis that stable location improves specialization or memory.

## Vector quantization and discrete latent state

[VQ-VAE](https://arxiv.org/abs/1711.00937) replaces continuous latent vectors with codebook entries. [VQ-VAE-2](https://arxiv.org/abs/1906.00446) adds hierarchical latent scales.

These methods are direct precedents for compressed persistent pixel state. A field becomes a compression method only when the total representation rate—including codebooks, indices, metadata, and model cost under a declared amortization rule—is lower for a chosen reconstruction quality or task utility.

## Hyperbolic representation learning

[Poincaré Embeddings](https://arxiv.org/abs/1705.08039) showed that negatively curved space can represent tree-like hierarchical data efficiently.

The relevant hypothesis for MPF is narrow: hierarchy-related components of pixel or region state may benefit from hyperbolic geometry when the target relationships are genuinely hierarchical. Hyperbolic geometry is a metric choice, not an extra dimension and not a free source of storage capacity.

## Hyperdimensional computing and vector-symbolic architectures

Vector-symbolic architectures encode entities and relations in high-dimensional distributed vectors and use operations such as binding, bundling, permutation, and similarity-based retrieval. A broad technical entry point is [A Survey on Hyperdimensional Computing](https://arxiv.org/abs/2111.06077).

A field can provide stable spatial address and routing while VSA operations provide explicit compositional algebra. The combination is only informative when compared directly with ordinary learned vectors and when the high-dimensional codebook and derived state are counted as resources.

## The integration question

A less standard combination would contain several properties at once:

- a persistent field as active working state;
- local and multiscale communication;
- stable or learned spatial organization;
- internal cell structures beyond flat vectors;
- explicit write, delay, interference, and retrieval;
- inspectable reasoning or computation traces;
- quantization or storage of the resulting state;
- interaction between multiple persistent fields.

The correct controls include simpler recurrent grids, recurrent CNNs, NCA, graph networks, spatial memory maps, slot models, Transformers, vector databases, and external-memory architectures. Integration becomes scientifically meaningful only if the added structure survives those comparisons.

## Core references

1. [Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/)
2. [Self-classifying MNIST Digits](https://distill.pub/2020/selforg/mnist/)
3. [Scholarpedia: Cellular automata](https://www.scholarpedia.org/article/Cellular_automata)
4. [Neural Map](https://arxiv.org/abs/1702.08360)
5. [Scholarpedia: Kohonen network](https://www.scholarpedia.org/article/Kohonen_network)
6. [Distill: GNN introduction](https://distill.pub/2021/gnn-intro/)
7. [VQ-VAE](https://arxiv.org/abs/1711.00937)
8. [Poincaré Embeddings](https://arxiv.org/abs/1705.08039)
9. [HDC/VSA survey](https://arxiv.org/abs/2111.06077)
