---
layout: research
title: References
---

# Reference library

The reading list is ordered from **closest architectural ancestors** to later extensions. “Accessible” sources are included alongside primary papers so the site works as a learning environment rather than only a bibliography.

## Essential: local recurrent fields

### Mordvintsev et al. — Growing Neural Cellular Automata (2020)
**Why it matters:** closest architectural ancestor: multidimensional cell states, local perception, a shared learned update rule, recurrence and regeneration.

- [Primary interactive article — Distill](https://distill.pub/2020/growing-ca/)
- [Cellular automata — Scholarpedia](https://www.scholarpedia.org/article/Cellular_automata)

### Randazzo et al. — Self-classifying MNIST Digits (2020)
**Why it matters:** shows local NCA cells coordinating to solve a global classification problem; the interactive demonstration is implemented with TensorFlow.js.

- [Primary interactive article — Distill](https://distill.pub/2020/selforg/mnist/)

### Sandler et al. — Image Segmentation via Cellular Automata (2020)
**Why it matters:** another example of learned local cellular computation applied to a semantic task.

- [arXiv](https://arxiv.org/abs/2008.04965)

## Spatial memory and organization

### Parisotto & Salakhutdinov — Neural Map (2017)
**Why it matters:** persistent spatially structured 2D learned memory.

- [arXiv](https://arxiv.org/abs/1702.08360)

### Kohonen & Honkela — Kohonen network / Self-Organizing Map
**Why it matters:** classic high-dimensional-to-2D topological organization.

- [Scholarpedia](https://www.scholarpedia.org/article/Kohonen_network)
- [Wikipedia](https://en.wikipedia.org/wiki/Self-organizing_map)

### Battaglia et al. / Distill GNN introduction
**Why it matters:** message passing provides a general graph view of local field computation.

- [A Gentle Introduction to Graph Neural Networks — Distill](https://distill.pub/2021/gnn-intro/)

## Learned specialization

### Locatello et al. — Object-Centric Learning with Slot Attention (2020)
**Why it matters:** learned slots can develop object-like specialization without assigning one fixed meaning to each slot in advance.

- [arXiv](https://arxiv.org/abs/2006.15055)

## Discrete representation and compression

### van den Oord, Vinyals & Kavukcuoglu — Neural Discrete Representation Learning (VQ-VAE, 2017)
**Why it matters:** learned discrete codebooks and vector quantization inside a neural representation.

- [arXiv](https://arxiv.org/abs/1711.00937)

### Razavi, van den Oord & Vinyals — VQ-VAE-2 (2019)
**Why it matters:** hierarchical quantized latent representations; important prior art for any multiscale discrete MPF.

- [arXiv](https://arxiv.org/abs/1906.00446)

### Rate–distortion theory
**Why it matters:** conceptual foundation for measuring representation rate against reconstruction/distortion. MPF uses the analogous idea of rate versus task utility.

- [Wikipedia overview](https://en.wikipedia.org/wiki/Rate%E2%80%93distortion_theory)

## Hyperbolic representation

### Nickel & Kiela — Poincaré Embeddings (2017)
**Why it matters:** strong motivation for testing hyperbolic geometry on tree-like semantic hierarchies.

- [arXiv](https://arxiv.org/abs/1705.08039)

### Ganea, Bécigneul & Hofmann — Hyperbolic Neural Networks (2018)
**Why it matters:** neural operations designed for hyperbolic spaces rather than treating hyperbolic coordinates like ordinary Euclidean vectors.

- [NeurIPS proceedings](https://proceedings.neurips.cc/paper/2018/hash/dbab2adc8f9d078009ee3fa810bea142-Abstract.html)

## Vector-Symbolic / Hyperdimensional Computing

### Kleyko et al. — A Survey on Hyperdimensional Computing (2021/2022)
**Why it matters:** broad technical introduction to high-dimensional distributed representations and vector-symbolic operations.

- [arXiv](https://arxiv.org/abs/2111.06077)

### Plate — Holographic Reduced Representations (1995)
**Why it matters:** foundational vector-symbolic binding using circular convolution.

- [PubMed record](https://pubmed.ncbi.nlm.nih.gov/18263348/)

### Hersche et al. — Neuro-vector-symbolic Architecture for Raven's Progressive Matrices (2022)
**Why it matters:** concrete example of high-dimensional symbolic operations participating in relational reasoning.

- [arXiv](https://arxiv.org/abs/2203.04571)

## Reasoning and recurrence: recent context

### Geiping et al. — Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach (NeurIPS 2025)
**Why it matters:** recurrent application of a shared block is used to increase latent computational depth at test time.

- [NeurIPS proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/3b01972cf31e6fa0fe29e4b8b5c2a0a1-Abstract-Conference.html)

### Rodkin et al. — Beyond Memorization: Extending Reasoning Depth with Recurrence, Memory and Test-Time Compute Scaling (Findings of ACL 2026)
**Why it matters:** controlled cellular-automata-derived tasks show the importance and limits of recurrent depth, memory and additional computation for multi-step reasoning.

- [ACL Anthology](https://aclanthology.org/2026.findings-acl.2103/)

## NCA and abstract reasoning: recent context

### Xu & Miikkulainen — Neural Cellular Automata for ARC-AGI (2025)
**Why it matters:** applies gradient-trained NCA update rules to ARC-style abstract transformations.

- [UT Austin project page](https://www.cs.utexas.edu/~ai-lab/pub-view.php?PubID=128129)
- [arXiv](https://arxiv.org/abs/2506.15746)

### ARC-NCA — Towards Developmental Solutions to the Abstraction and Reasoning Corpus (2025)
**Why it matters:** another current attempt to connect NCA-style computation with ARC abstraction/reasoning.

- [ARC Prize 2025 paper awards / context](https://arcprize.org/competitions/2025)

### ARC-AGI-2
**Why it matters:** modern benchmark context for abstraction and reasoning; useful later, not as the first debugging benchmark.

- [ARC-AGI-2](https://arcprize.org/arc-agi/2)

## Benchmarks worth adding later

- [bAbI](https://research.facebook.com/downloads/babi/) — controlled textual reasoning tasks.
- [CLUTRR](https://arxiv.org/abs/1908.06177) — compositional kinship reasoning and length generalization.
- [CLEVR](https://cs.stanford.edu/people/jcjohns/clevr/) — compositional visual reasoning.
- [RAVEN](https://arxiv.org/abs/1903.02741) — Raven-style visual analogical reasoning.

## General background links

- [Recurrent neural networks — Scholarpedia](https://www.scholarpedia.org/article/Recurrent_neural_networks)
- [Attractor network — Scholarpedia](https://www.scholarpedia.org/article/Attractor_network)
- [Convolutional neural network — Wikipedia](https://en.wikipedia.org/wiki/Convolutional_neural_network)
- [Backpropagation — Wikipedia](https://en.wikipedia.org/wiki/Backpropagation)
- [Gradient descent — Wikipedia](https://en.wikipedia.org/wiki/Gradient_descent)
