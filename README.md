# Pixel Neural Net Lab — Multidimensional Pixel Fields

A public research library and interactive neural-field laboratory exploring **Multidimensional Pixel Fields (MPF)**: persistent spatial neural states in which every grid location contains a learned vector and computation occurs through repeated field updates.

## Website

https://bitwikiorg.github.io/pixel-art-2026/

The site is organized as:

- **Start here** — intuitive-to-technical introduction;
- **Lab** — trainable TensorFlow.js recurrent field + dynamics sandbox;
- **Research** — card-based library by topic;
- **Glossary** — concise definitions with primary / Scholarpedia / Wikipedia references;
- **Code** — reproducible browser and PyTorch prototypes.

## Trainable browser lab

The browser model is a real small neural network:

```text
markers → learned field writer → shared local 3×3 neural update
        → recurrent field evolution → weak max-pooled readout
```

Weights are trained in the browser with TensorFlow.js. Hidden cell state is projected to RGB only for visualization.

## PyTorch reference

```bash
pip install torch
python experiments/mpf_relations.py --epochs 20 --steps 6
```

Compare a per-step topology permutation:

```bash
python experiments/mpf_relations.py --topology per_step --epochs 20 --steps 6
```

See [`experiments/README.md`](experiments/README.md).

## Research direction

The basic primitive has close precedent in Neural Cellular Automata. The larger program studies whether a recurrent spatial field can become a useful **semantic workspace and persistent memory**, with experimentally separable questions about topology, multiresolution communication, specialization, quantization, geometry, robustness and reasoning depth.

Primary starting references:

- Mordvintsev et al., *Growing Neural Cellular Automata* — https://distill.pub/2020/growing-ca/
- Randazzo et al., *Self-classifying MNIST Digits* — https://distill.pub/2020/selforg/mnist/
- Parisotto & Salakhutdinov, *Neural Map* — https://arxiv.org/abs/1702.08360
- van den Oord et al., *VQ-VAE* — https://arxiv.org/abs/1711.00937
- Nickel & Kiela, *Poincaré Embeddings* — https://arxiv.org/abs/1705.08039

## Site validation

Every push to `main` runs:

- JavaScript syntax checks;
- a production Jekyll build;
- rendered-link / Liquid validation.

GitHub Pages deploys from `main` only.
