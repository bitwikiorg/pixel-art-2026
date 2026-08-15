---
layout: research
title: References
---

# References

Architectural ancestors come first, followed by memory, organization, discrete representation, geometry, vector-symbolic computing, recurrence, and recent reasoning work. Primary papers are paired with accessible technical sources where useful.

## Local recurrent fields

### Mordvintsev et al. — Growing Neural Cellular Automata (2020)
**Relevance:** multidimensional cell states, local perception, a shared learned update rule, recurrence, and regeneration.

- [Primary interactive article — Distill](https://distill.pub/2020/growing-ca/)
- [Cellular automata — Scholarpedia](https://www.scholarpedia.org/article/Cellular_automata)

### Randazzo et al. — Self-classifying MNIST Digits (2020)
**Relevance:** local NCA cells coordinate to solve a global classification problem; the interactive demonstration is implemented with TensorFlow.js.

- [Primary interactive article — Distill](https://distill.pub/2020/selforg/mnist/)

### Sandler et al. — Image Segmentation via Cellular Automata (2020)
**Relevance:** learned local cellular computation applied to semantic segmentation.

- [arXiv](https://arxiv.org/abs/2008.04965)

## Spatial memory and organization

### Parisotto & Salakhutdinov — Neural Map (2017)
**Relevance:** persistent spatially structured two-dimensional learned memory.

- [arXiv](https://arxiv.org/abs/1702.08360)

### Kohonen & Honkela — Kohonen network / Self-Organizing Map
**Relevance:** high-dimensional data organized on a low-dimensional topographic grid.

- [Scholarpedia](https://www.scholarpedia.org/article/Kohonen_network)
- [Wikipedia](https://en.wikipedia.org/wiki/Self-organizing_map)

### Distill — A Gentle Introduction to Graph Neural Networks
**Relevance:** message passing provides a general graph interpretation of local field computation.

- [Distill](https://distill.pub/2021/gnn-intro/)

## Learned specialization

### Locatello et al. — Object-Centric Learning with Slot Attention (2020)
**Relevance:** learned slots can develop object-like specialization without assigning one fixed semantic meaning to every slot in advance.

- [arXiv](https://arxiv.org/abs/2006.15055)

## Discrete representation and compression

### van den Oord, Vinyals & Kavukcuoglu — Neural Discrete Representation Learning (VQ-VAE, 2017)
**Relevance:** learned discrete codebooks and vector quantization inside a neural representation.

- [arXiv](https://arxiv.org/abs/1711.00937)

### Razavi, van den Oord & Vinyals — VQ-VAE-2 (2019)
**Relevance:** hierarchical quantized latent representations and multiscale discrete state.

- [arXiv](https://arxiv.org/abs/1906.00446)

### Rate–distortion theory
**Relevance:** formal connection between representation rate and reconstruction distortion; rate–utility extends the same accounting idea to retained task performance.

- [Wikipedia overview](https://en.wikipedia.org/wiki/Rate%E2%80%93distortion_theory)

## Hyperbolic representation

### Nickel & Kiela — Poincaré Embeddings (2017)
**Relevance:** hyperbolic embeddings for tree-like semantic hierarchies.

- [arXiv](https://arxiv.org/abs/1705.08039)

### Ganea, Bécigneul & Hofmann — Hyperbolic Neural Networks (2018)
**Relevance:** neural operations designed for hyperbolic spaces rather than treating curved coordinates as ordinary Euclidean vectors.

- [NeurIPS proceedings](https://proceedings.neurips.cc/paper/2018/hash/dbab2adc8f9d078009ee3fa810bea142-Abstract.html)

## Vector-Symbolic and Hyperdimensional Computing

### Kleyko et al. — A Survey on Hyperdimensional Computing (2021/2022)
**Relevance:** high-dimensional distributed representations and vector-symbolic operations.

- [arXiv](https://arxiv.org/abs/2111.06077)

### Plate — Holographic Reduced Representations (1995)
**Relevance:** foundational vector-symbolic binding using circular convolution.

- [PubMed record](https://pubmed.ncbi.nlm.nih.gov/18263348/)

### Hersche et al. — Neuro-vector-symbolic Architecture for Raven's Progressive Matrices (2022)
**Relevance:** high-dimensional symbolic operations participating in relational reasoning.

- [arXiv](https://arxiv.org/abs/2203.04571)

## Reasoning and recurrence

### Geiping et al. — Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach (NeurIPS 2025)
**Relevance:** recurrent application of a shared block increases latent computational depth at test time.

- [NeurIPS proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/3b01972cf31e6fa0fe29e4b8b5c2a0a1-Abstract-Conference.html)

### Rodkin et al. — Beyond Memorization: Extending Reasoning Depth with Recurrence, Memory and Test-Time Compute Scaling (Findings of ACL 2026)
**Relevance:** controlled cellular-automata-derived tasks test the importance and limits of recurrent depth, memory, and additional computation for multi-step reasoning.

- [ACL Anthology](https://aclanthology.org/2026.findings-acl.2103/)

## NCA and abstract reasoning

### Xu & Miikkulainen — Neural Cellular Automata for ARC-AGI (2025)
**Relevance:** gradient-trained NCA update rules applied to ARC-style abstract transformations.

- [UT Austin publication record](https://www.cs.utexas.edu/~ai-lab/pub-view.php?PubID=128129)
- [arXiv](https://arxiv.org/abs/2506.15746)

### ARC-NCA — Towards Developmental Solutions to the Abstraction and Reasoning Corpus (2025)
**Relevance:** NCA-style computation applied to ARC abstraction and reasoning.

- [ARC Prize 2025 paper awards](https://arcprize.org/competitions/2025)

### ARC-AGI-2
**Relevance:** a harder abstraction and reasoning benchmark appropriate after controlled mechanism tests are reliable.

- [ARC-AGI-2](https://arcprize.org/arc-agi/2)

## Additional reasoning benchmarks

- [bAbI](https://research.facebook.com/downloads/babi/) — controlled textual reasoning tasks.
- [CLUTRR](https://arxiv.org/abs/1908.06177) — compositional kinship reasoning and length generalization.
- [CLEVR](https://cs.stanford.edu/people/jcjohns/clevr/) — compositional visual reasoning.
- [RAVEN](https://arxiv.org/abs/1903.02741) — Raven-style visual analogical reasoning.

## General background

- [Recurrent neural networks — Scholarpedia](https://www.scholarpedia.org/article/Recurrent_neural_networks)
- [Attractor network — Scholarpedia](https://www.scholarpedia.org/article/Attractor_network)
- [Convolutional neural network — Wikipedia](https://en.wikipedia.org/wiki/Convolutional_neural_network)
- [Backpropagation — Wikipedia](https://en.wikipedia.org/wiki/Backpropagation)
- [Gradient descent — Wikipedia](https://en.wikipedia.org/wiki/Gradient_descent)
