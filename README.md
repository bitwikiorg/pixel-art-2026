# Pixel Photon Lab — Multidimensional Pixel Fields

Pixel Photon Lab is a public research library and experiment atlas for one broad question:

> **What computational object should occupy a pixel address, how should many such objects interact, and what useful representation, memory, compression, computation or reasoning is obtained for the measured cost?**

The project begins with a strict foundation:

```text
16 × 16 binary field = 256 source bits = 32 packed bytes
```

From that known carrier, experiments add reliability, memory, dictionaries, high-dimensional representations, learned state, GPU computation and generative interpreters while accounting for the extra state and parameters they require.

## Website

https://bitwikiorg.github.io/pixel-art-2026/

## Site structure

- **Start here** — binary ground truth → computational pixel → field;
- **Experiment Atlas** — isolated, numbered experiments with one primary question each;
- **Research** — thesis, prior art, methodology and open questions;
- **Glossary** — concise terminology and source links;
- **Code** — browser primitives plus CPU reference/benchmark models.

## Canonical experiments

The source of truth is `_data/experiments.json`.

Current atlas:

1. Binary Pixel Carrier
2. Corruption & Error Correction
3. Associative Pixel Memory
4. Visual Motif Codec
5. Hypervector Field
6. Pixel Interpretation Sandbox
7. Learned Local Vector Field
8. WebGPU Pixel Compute
9. Masked Binary Reconstruction
10. Primitive Resource Benchmark
11. Pixel Genome
A1. Original Field Dynamics (archive/mechanics)

Every experiment identifies its source information, interpretation, operation, measurement, evidence class, and boundary.

## Evidence discipline

The site separates:

- **EXACT** deterministic operators/codecs;
- **MECHANICS** fixed-rule dynamics;
- **LEARNED** optimized models with held-out tests;
- **BENCHMARK** repeated controlled comparisons;
- **PROCEDURAL BASELINE** deterministic generative interpreters.

A larger state is not automatically more information. Resource accounting distinguishes source bits, hidden state, metadata/side information and shared model parameters.

## Python references

```bash
pip install -r experiments/requirements.txt
python experiments/mpf_relations.py --epochs 20 --steps 6
python experiments/pixel_primitives.py --mode tensor
python experiments/benchmark_primitives.py --protocol equal-state
python experiments/masked_binary.py
```

## Validation

CI performs:

- JavaScript syntax checks over all JS source/tests;
- behavioral/property tests for deterministic primitives;
- Python syntax and lint checks;
- experiment-registry validation;
- production Jekyll build;
- rendered internal-link and fragment validation;
- stale-lab/duplicate-ID checks.

GitHub Pages deploys from `main`.
