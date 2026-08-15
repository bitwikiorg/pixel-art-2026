---
layout: research
title: Experimental Method
---

# Experimental method

<div class="plain-box"><strong>Principle:</strong> one experiment should answer one primary question. The Experiment Atlas is the canonical registry. This page defines how experiments are measured and promoted from demonstration to evidence.</div>

## Canonical atlas

| ID | Experiment | Evidence class | Primary question |
|---|---|---|---|
| 01 | Binary Pixel Carrier | exact | Can image, bits and bytes round-trip exactly? |
| 02 | Corruption & Error Correction | exact | What does redundancy buy under corruption? |
| 03 | Associative Pixel Memory | dynamics/memory | Can a corrupted field return toward a stored attractor? |
| 04 | Visual Motif Codec | exact | When does repeated spatial structure reduce total bits? |
| 05 | Hypervector Field | deterministic representation | How accurately can distributed state retrieve address/value bindings? |
| 06 | Pixel Interpretation Sandbox | mechanics | How do alternative cell objects behave under explicit fixed rules? |
| 07 | Learned Local Vector Field | learned | Can a shared local recurrent vector field learn a spatial task? |
| 08 | WebGPU Pixel Compute | exact CPU/GPU control | Can the field be directly operated on as compute-addressed state? |
| 09 | Masked Binary Reconstruction | learned + baseline | Can a tiny learned model infer hidden bits better than a local rule? |
| 10 | Primitive Resource Benchmark | benchmark | How do vector/tensor/inner-token cells compare under explicit budgets and seeds? |
| 11 | Pixel Genome | procedural baseline | What can a compact description + shared interpreter generate inside a restricted family? |
| A1 | Original Field Dynamics | archive mechanics | How do the original hand-designed dynamics respond to interventions? |

[Open the Experiment Atlas]({{ '/experiment/' | relative_url }}). The registry source is `_data/experiments.json` and CI validates its code/test paths and rendered URLs.

## Evidence labels

**EXACT** means a deterministic result is checked bit-for-bit/address-by-address. **MECHANICS** means real state transitions occur but no objective trained them. **LEARNED** means parameters were optimized and evaluated on held-out data. **BENCHMARK** adds repeated controlled comparisons. **PROCEDURAL BASELINE** means a deterministic generative interpreter rather than learned AI.

## Common experiment contract

```text
SOURCE            independent input information
INTERPRETATION    state associated with an address
OPERATION         deterministic or learned rule
OUTPUT            produced object/decision
MEASUREMENT       numeric result
RESOURCE LEDGER   bits, state, parameters, side info, runtime
BOUNDARY          conclusion the experiment does not license
```

## Exact-code standards

Property tests should establish advertised behavior, not merely prove that code executes. Current examples include:

- random bitstream → bytes → bitstream identity;
- standard CRC-32 vector (`123456789` → `CBF43926`);
- exhaustive single-bit Hamming(7,4) correction;
- exact motif codec round-trips;
- Hopfield energy non-increase under sequential asynchronous updates;
- complete-field hypervector query accuracy;
- CPU reference equality for WebGPU operators;
- deterministic Pixel Genome reproduction.

DOM smoke tests remain useful, but they are not algorithmic evidence.

## Learned-model standards

Report training/test distribution, held-out metric, parameters, state size/address, update depth, optimizer/training examples, seeds, runtime, baselines and failure/variance. Browser models may be smaller than CPU references; their results must not be silently combined unless protocols actually match.

## The relation task is a baseline, not a flagship result

Experiment 07 predicts LEFT/RIGHT/ABOVE/BELOW for two aligned markers. Repeated 3×3 convolution naturally expands receptive radius, so success has a conventional recurrent-convolution explanation. This verifies the trainable field pipeline; it does not require the broader thesis.

A more diagnostic view is:

```text
accuracy A(distance, update_steps)
```

rather than one aggregate “far accuracy.”

## Resource matching

Experiment 10 separates three questions:

1. **equal state** — same scalar state values per outer address;
2. **approximately equal parameters** — similar trainable parameter counts;
3. **approximately equal compute** — similar FLOPs or measured inference cost.

These are different experiments. The current reference implements the first two and reports empirical runtime; it does not pretend parameter matching equalizes FLOPs.

## Controls for stronger conclusions

A mature task suite should include flattened MLP, feed-forward CNN, recurrent CNN, NCA, pixel-token Transformer, graph message passing, MPF vector field, tensor cell, inner-transformer cell and hybrid local/global field controls.

## Compression protocol

Count carrier bits + metadata + dictionary/codebook + side information + persistent hidden state + model cost under a declared amortization rule. Then report exact reconstruction or distortion/task utility. A high-dimensional latent is not compression by itself.

## Memory protocol

Memory requires `write → remove source → delay/interference → query`. Report capacity, corruption, retrieval accuracy, interference, overwrite and stored-state cost. ECC, Hopfield recall, neural reconstruction and NCA regeneration solve different recovery problems and should not be collapsed into one score.

## Causal inspection

Future learned-cell inspectors should support interventions such as mute, freeze, swap, zero memory, replace hidden state while preserving visible carrier, and measure output change. Hidden-state color alone is not an explanation.

## Promotion path

```text
specified question
→ deterministic/mechanics prototype
→ property tests
→ learned task if appropriate
→ controls
→ repeated-seed benchmark
→ stronger interpretation only if results survive controls
```

A clean negative or unstable result is more useful than a stronger story than the data supports.
