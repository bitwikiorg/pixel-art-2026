---
layout: research
title: References
---

# References

Peer-reviewed research, standards, specifications, and technical documentation provide the evidence and implementation basis. Creative projects, games, artworks, and aesthetic examples are treated separately as inspiration and are not part of the research bibliography.

## Information, coding, and memory

### Shannon — A Mathematical Theory of Communication (1948)
**Relevance:** finite information, coding, entropy, and communication-channel foundations.

- [Bell System Technical Journal DOI](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x)

### Hamming — Error Detecting and Error Correcting Codes (1950)
**Relevance:** explicit redundancy and block error correction used by the reliability baseline.

- [Bell System Technical Journal DOI](https://doi.org/10.1002/j.1538-7305.1950.tb00463.x)

### Hopfield — Neural networks and physical systems with emergent collective computational abilities (1982)
**Relevance:** associative memory, attractor dynamics, and the dense weight storage used by the Hopfield experiment.

- [PNAS](https://www.pnas.org/doi/10.1073/pnas.79.8.2554)

### Attractor networks
**Relevance:** academic background for recurrent fixed points and content-addressable memory.

- [Scholarpedia](https://www.scholarpedia.org/article/Attractor_network)

## Color, colorimetry, light, and compositing

### CIE — Colorimetry, 4th Edition (CIE 015:2018)
**Relevance:** standard basis for tristimulus colorimetry, chromaticity, reference conditions, and color-difference work.

- [CIE publication](https://www.cie.co.at/publications/colorimetry-4th-edition)

### ISO/CIE 11664 series
**Relevance:** standardized definitions and formulae for CIE tristimulus values, CIELAB, CIELUV, chromaticity coordinates, and CIEDE2000 color differences.

- [ISO/CIE 11664-3 · tristimulus values](https://www.cie.co.at/publications/colorimetry-part-3-cie-tristimulus-values-2)
- [ISO/CIE 11664-5 · CIELUV and u′,v′](https://www.cie.co.at/publications/colorimetry-part-5-cie-1976-luv-colour-space-and-u-v-uniform-chromaticity-scale-1)
- [ISO/CIE 11664-6 · CIEDE2000](https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula-1)

### CIE International Lighting Vocabulary
**Relevance:** controlled terminology for hue, lightness, chroma, saturation, radiometry, photometry, wavelength, transmittance, and related optical quantities.

- [CIE e-ILV](https://www.cie.co.at/e-ilv)

### W3C — CSS Color Module Level 4
**Relevance:** explicit computational definitions and conversions among sRGB, linear RGB, HSL, Lab, LCH, OKLab, OKLCH, XYZ, alpha, and gamut handling.

- [W3C specification](https://www.w3.org/TR/css-color-4/)

### W3C — Compositing and Blending Level 1
**Relevance:** alpha compositing, premultiplied color, source/backdrop roles, layer order, and blend operations.

- [W3C specification](https://www.w3.org/TR/compositing-1/)

### NIST — color and optical measurement
**Relevance:** measurement-oriented connections between physical optical quantities and colorimetric coordinates.

- [CIE Fundamentals for Color Measurements](https://www.nist.gov/publications/cie-fundamentals-color-measurements-0)
- [Principles of Optical Radiometry and Measurement Uncertainty](https://www.nist.gov/publications/principles-optical-radiometry-and-measurement-uncertainty)
- [Optical Polarization Metrology](https://www.nist.gov/programs-projects/optical-polarization-metrology)
- [Fundamental Physical Constants](https://physics.nist.gov/cuu/Constants/introduction.html)

## Local recurrent fields and cellular computation

### Mordvintsev et al. — Growing Neural Cellular Automata (2020)
**Relevance:** multidimensional cell state, local perception, a shared learned update rule, recurrence, damage, and regeneration.

- [Distill](https://distill.pub/2020/growing-ca/)
- [Cellular automata · Scholarpedia](https://www.scholarpedia.org/article/Cellular_automata)

### Randazzo et al. — Self-classifying MNIST Digits (2020)
**Relevance:** local NCA cells coordinate to solve a global classification problem.

- [Distill](https://distill.pub/2020/selforg/mnist/)

### Sandler et al. — Image Segmentation via Cellular Automata (2020)
**Relevance:** learned local cellular computation applied to semantic segmentation.

- [arXiv](https://arxiv.org/abs/2008.04965)

## Spatial memory, topology, and organization

### Parisotto & Salakhutdinov — Neural Map (2017)
**Relevance:** persistent spatially structured two-dimensional learned memory.

- [arXiv](https://arxiv.org/abs/1702.08360)

### Kohonen network / Self-Organizing Map
**Relevance:** high-dimensional observations organized on a lower-dimensional topographic grid.

- [Scholarpedia](https://www.scholarpedia.org/article/Kohonen_network)

### Battaglia et al. / Distill — graph message passing background
**Relevance:** a grid is one graph topology among many; graph message passing supplies a direct control for claims about Cartesian spatial organization.

- [A Gentle Introduction to Graph Neural Networks · Distill](https://distill.pub/2021/gnn-intro/)

## Learned specialization and discrete representation

### Locatello et al. — Object-Centric Learning with Slot Attention (2020)
**Relevance:** internal slots can learn specialized object-like roles without fixed spatial addresses.

- [arXiv](https://arxiv.org/abs/2006.15055)

### van den Oord, Vinyals & Kavukcuoglu — Neural Discrete Representation Learning / VQ-VAE (2017)
**Relevance:** learned codebooks and vector quantization inside neural representations.

- [arXiv](https://arxiv.org/abs/1711.00937)

### Razavi, van den Oord & Vinyals — VQ-VAE-2 (2019)
**Relevance:** hierarchical quantized latent representations and multiscale discrete state.

- [arXiv](https://arxiv.org/abs/1906.00446)

### He et al. — Masked Autoencoders Are Scalable Vision Learners (2022)
**Relevance:** masked reconstruction as a representation-learning objective; the lab's binary reconstruction model is intentionally a much smaller conventional control.

- [arXiv](https://arxiv.org/abs/2111.06377)

## Nested and pixel-oriented Transformer architectures

### Han et al. — Transformer in Transformer (2021)
**Relevance:** separate inner-token and outer-token attention provides direct prior art for distinguishing computation inside one outer address from attention between addresses.

- [arXiv](https://arxiv.org/abs/2103.00112)
- [NeurIPS proceedings](https://papers.nips.cc/paper/2021/hash/854d9fca60b4bd07f9bb215d59ef5561-Abstract.html)

### PixelTransformer (2021)
**Relevance:** coordinate-conditioned probabilistic pixel prediction provides a comparison point for sparse observations and arbitrary spatial queries.

- [arXiv](https://arxiv.org/abs/2103.15813)

### Rust et al. — Language Modelling with Pixels / PIXEL (2022)
**Relevance:** language represented directly through rendered pixels, useful for separating carrier modality from learned task representation.

- [arXiv](https://arxiv.org/abs/2207.06991)
- [OpenReview](https://openreview.net/forum?id=FkSp8VW8RjH)

## Hyperbolic representation

### Nickel & Kiela — Poincaré Embeddings (2017)
**Relevance:** hyperbolic embeddings for tree-like semantic hierarchies.

- [arXiv](https://arxiv.org/abs/1705.08039)

### Ganea, Bécigneul & Hofmann — Hyperbolic Neural Networks (2018)
**Relevance:** neural operations designed for hyperbolic spaces rather than treating curved coordinates as ordinary Euclidean vectors.

- [NeurIPS proceedings](https://proceedings.neurips.cc/paper/2018/hash/dbab2adc8f9d078009ee3fa810bea142-Abstract.html)

## Vector-Symbolic and Hyperdimensional Computing

### Kleyko et al. — A Survey on Hyperdimensional Computing (2021/2022)
**Relevance:** high-dimensional distributed representations, binding, bundling, and similarity retrieval.

- [arXiv](https://arxiv.org/abs/2111.06077)

### Plate — Holographic Reduced Representations (1995)
**Relevance:** foundational vector-symbolic binding using circular convolution.

- [PubMed](https://pubmed.ncbi.nlm.nih.gov/18263348/)

### Hersche et al. — Neuro-vector-symbolic Architecture for Raven's Progressive Matrices (2022)
**Relevance:** high-dimensional symbolic operations participating in relational reasoning.

- [arXiv](https://arxiv.org/abs/2203.04571)

## Generative encodings and artificial life

### Stanley — Compositional Pattern Producing Networks: A Novel Abstraction of Development (2007)
**Relevance:** peer-reviewed indirect genotype-to-phenotype encoding in which compact networks generate spatial patterns.

- [DOI](https://doi.org/10.1007/s10710-007-9028-8)

### Sims — Evolving Virtual Creatures (1994)
**Relevance:** seminal genetic encoding of both generated morphology and neural control in simulated physical environments.

- [ACM DOI](https://doi.org/10.1145/192161.192167)

### Stanley & Miikkulainen — Evolving Neural Networks through Augmenting Topologies (2002)
**Relevance:** foundational neuroevolution research on inherited network structure, mutation, crossover, speciation, and selection.

- [MIT Press DOI](https://doi.org/10.1162/106365602320169811)

## Reasoning, recurrence, and controlled depth

### Geiping et al. — Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach (NeurIPS 2025)
**Relevance:** recurrent application of a shared block increases latent computational depth at test time.

- [NeurIPS proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/3b01972cf31e6fa0fe29e4b8b5c2a0a1-Abstract-Conference.html)

### Rodkin et al. — Beyond Memorization: Extending Reasoning Depth with Recurrence, Memory and Test-Time Compute Scaling (Findings of ACL 2026)
**Relevance:** controlled cellular-automata-derived tasks test recurrence, memory, and additional computation for multi-step reasoning.

- [ACL Anthology](https://aclanthology.org/2026.findings-acl.2103/)

### Xu & Miikkulainen — Neural Cellular Automata for ARC-AGI (2025)
**Relevance:** gradient-trained NCA update rules applied to ARC-style abstract transformations.

- [UT Austin publication record](https://www.cs.utexas.edu/~ai-lab/pub-view.php?PubID=128129)
- [arXiv](https://arxiv.org/abs/2506.15746)

### ARC-AGI-2
**Relevance:** late-stage abstraction and reasoning benchmark after mechanism-level controls are reliable.

- [ARC-AGI-2](https://arcprize.org/arc-agi/2)

## Controlled reasoning benchmarks

- [bAbI](https://research.facebook.com/downloads/babi/) — controlled textual reasoning tasks.
- [CLUTRR](https://arxiv.org/abs/1908.06177) — compositional kinship reasoning and length generalization.
- [CLEVR](https://cs.stanford.edu/people/jcjohns/clevr/) — compositional visual reasoning.
- [RAVEN](https://arxiv.org/abs/1903.02741) — Raven-style visual analogical reasoning.

## Implementation specifications and frameworks

### WebGPU and WGSL
**Relevance:** actual browser GPU API and shader language used by the WebGPU experiment.

- [WebGPU specification](https://www.w3.org/TR/webgpu/)
- [WGSL specification](https://www.w3.org/TR/WGSL/)

### TensorFlow.js
**Relevance:** browser learning runtime used by the learned local field and masked reconstruction experiments.

- [TensorFlow.js API](https://js.tensorflow.org/api/latest/)

### PyTorch
**Relevance:** reference implementation used for the resource-controlled primitive benchmark and offline model experiments.

- [PyTorch documentation](https://pytorch.org/docs/stable/index.html)
