# Pixel Neural Net Lab — Multidimensional Pixel Fields

A public research library and interactive laboratory exploring a deliberately broad computational primitive:

> **A pixel is a spatial address whose internal interpretation is not fixed.**

A pixel can be interpreted as a scalar, vector, tensor, neural unit, micro-transformer, memory object, subfield, or something recursively larger. The project compares those interpretations rather than defining MPF as one recurrent-grid architecture.

The visible color is only a human-facing projection of whatever computational state exists behind the address.

## Website

https://bitwikiorg.github.io/pixel-art-2026/

The site is organized as:

- **Start here** — the broad pixel-as-computational-object idea;
- **Lab** — Pixel Universe + learned vector field + original dynamics sandbox;
- **Research** — card-based library by primitive, architecture, memory, topology, geometry and literature;
- **Glossary** — concise definitions with primary / Scholarpedia / Wikipedia references;
- **Code** — browser experiments, runtime smoke tests and PyTorch reference models.

## Pixel Universe browser lab

The pure-JavaScript interpretation lab keeps a 12×12 visible grid fixed while changing what each address contains:

```text
scalar
→ vector
→ 4×4 tensor
→ shared neural unit
→ micro-transformer with internal attention
→ fast/slow memory object
→ 3×3 subfield inside each pixel
```

These are small executable dynamics models intended to expose the computational primitive. They are not all trained research models.

## Trainable vector-field baseline

The existing TensorFlow.js model remains a real small neural network:

```text
markers → learned field writer → vector-valued pixels
        → shared local 3×3 neural update
        → recurrent field evolution → weak max-pooled readout
```

This is one point in the larger design space: **vector pixel + local communication + shared learned update + recurrence**.

## Original field dynamics

The original hand-designed multidimensional field is preserved for direct experiments with locality, persistence, hierarchy, topology permutation, damage and recovery dynamics.

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

The project studies what happens when **what is inside a pixel**, **how pixels communicate**, and **how fields compose across time and scale** are all treated as experimental variables.

Current and planned comparisons include:

- scalar vs vector vs tensor pixel state;
- flat vector vs structured tensor at equal scalar count;
- shared neural-unit pixels vs micro-transformer pixels;
- attention inside pixels vs attention between pixels;
- fast/slow memory objects;
- persistent topology vs changing topology;
- learned semantic geography;
- recursive field-inside-field structures;
- quantized / compressed pixel state;
- high-dimensional and vector-symbolic state;
- hyperbolic semantic geometry;
- damage and regeneration;
- persistent fields interacting as semantic albums.

The conceptual interpretation space is open-ended, but every real implementation is finite in state and compute. Human-visible RGB is always only a projection.

Primary starting references include:

- Mordvintsev et al., *Growing Neural Cellular Automata* — https://distill.pub/2020/growing-ca/
- Randazzo et al., *Self-classifying MNIST Digits* — https://distill.pub/2020/selforg/mnist/
- Parisotto & Salakhutdinov, *Neural Map* — https://arxiv.org/abs/1702.08360
- van den Oord et al., *VQ-VAE* — https://arxiv.org/abs/1711.00937
- Nickel & Kiela, *Poincaré Embeddings* — https://arxiv.org/abs/1705.08039

## Site validation

Every push to `main` runs:

- JavaScript syntax checks;
- Pixel Universe runtime smoke test;
- Python syntax checks;
- a production Jekyll build;
- rendered-link / Liquid validation.

GitHub Pages deploys from `main` only.
