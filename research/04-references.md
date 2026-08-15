---
layout: research
title: References
---

# References

Architectural ancestors are paired with measurement standards and primary technical sources where useful.

## Color, colorimetry, light, and compositing

### CIE — Colorimetry, 4th Edition (CIE 015:2018)
**Relevance:** standard basis for tristimulus colorimetry, chromaticity, reference conditions, and color-difference work.

- [CIE publication](https://www.cie.co.at/publications/colorimetry-4th-edition)

### ISO/CIE 11664 series
**Relevance:** standardized definitions and formulae for CIE tristimulus values, CIELAB, CIELUV, chromaticity coordinates, and CIEDE2000 color differences.

- [CIE tristimulus values — ISO/CIE 11664-3](https://www.cie.co.at/publications/colorimetry-part-3-cie-tristimulus-values-2)
- [CIELUV and u′,v′ — ISO/CIE 11664-5](https://www.cie.co.at/publications/colorimetry-part-5-cie-1976-luv-colour-space-and-u-v-uniform-chromaticity-scale-1)
- [CIEDE2000 — ISO/CIE 11664-6](https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula-1)

### CIE International Lighting Vocabulary
**Relevance:** controlled terminology for hue, lightness, chroma, saturation, radiometry, photometry, wavelength, transmittance, and related optical quantities.

- [CIE e-ILV](https://www.cie.co.at/e-ilv)

### W3C — CSS Color Module Level 4
**Relevance:** explicit modern computational definitions and conversions among sRGB, linear RGB, HSL, HWB, Lab, LCH, OKLab, OKLCH, XYZ, alpha, and gamut handling.

- [W3C Recommendation-track specification](https://www.w3.org/TR/css-color-4/)

### W3C — Compositing and Blending Level 1
**Relevance:** alpha compositing, premultiplied color, source/backdrop roles, layer order, and blend operations.

- [W3C specification](https://www.w3.org/TR/compositing-1/)

### NIST — CIE Fundamentals for Color Measurements
**Relevance:** measurement-oriented treatment of colorimetry and the connection from physical spectral measurements to CIE coordinates.

- [NIST publication](https://www.nist.gov/publications/cie-fundamentals-color-measurements-0)

### NIST — Optical radiometry and polarization metrology
**Relevance:** rigorous definitions and measurement practices for radiometric quantities and polarization, which must remain distinct from ordinary RGB state.

- [Principles of Optical Radiometry and Measurement Uncertainty](https://www.nist.gov/publications/principles-optical-radiometry-and-measurement-uncertainty)
- [Optical Polarization Metrology](https://www.nist.gov/programs-projects/optical-polarization-metrology)
- [Fundamental Physical Constants](https://physics.nist.gov/cuu/Constants/introduction.html)

## Procedural pixel engineering inspirations

These implementations are creative mechanism references rather than performance baselines. Their value is the way compact rules, fields, palettes, and layers construct visible pixels.

### Deep-Fold — SpriteGenerator
**Relevance:** seeded spatial generation, enforced bilateral symmetry, random walks, local cellular-automaton cleanup, procedural palettes, neighborhood-conditioned color, and connected-region filling form a transparent morphogenetic pipeline.

- [Source](https://github.com/Deep-Fold/SpriteGenerator)
- [Interactive Pixel Sprite Generator](https://deep-fold.itch.io/pixel-sprite-generator)

### Deep-Fold — Pixel Planets
**Relevance:** shader-driven generation exposes seed, time, lighting, pixel scale, color arrays, and independently toggleable layers. It provides a concrete example of a shared renderer generating many raster states from a smaller structured description.

- [Source](https://github.com/Deep-Fold/PixelPlanets)
- [Interactive Pixel Planet Generator](https://deep-fold.itch.io/pixel-planet-generator)

### Deep-Fold — Pixel Space Background Generator
**Relevance:** palette control, pixel scale, compositional layers, transparency, and seamless tiling connect procedural rendering to multiscale state, alpha compositing, and periodic boundary conditions.

- [Interactive generator](https://deep-fold.itch.io/space-background-generator)

### Deep-Fold — StarScapes
**Relevance:** noise-derived vector fields steer particles that deposit visible traces. The causal field and the rendered image are different state objects, making it a strong conceptual reference for vector-valued pixels and accumulated temporal output.

- [Source](https://github.com/Deep-Fold/Starscapes)
- [Interactive StarScapes](https://deep-fold.itch.io/starscapes)

### Deep-Fold — Particle Soup
**Relevance:** interacting particles produce a changing visible projection, illustrating the distinction between hidden dynamical state and raster observation.

- [Interactive Particle Soup](https://deep-fold.itch.io/particle-soup)

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
