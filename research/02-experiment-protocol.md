---
layout: research
title: "02 · Experiment Protocol"
---

# Experiment protocol

## Experiment 0 — the smallest decisive test

**Question:** does persistent spatial topology add computational value, or is the field only an ordinary tensor with a visual metaphor?

### Task

Generate synthetic relational problems with entities and directional relations.

Example:

> A is left of B.  
> B is above C.  
> C is right of D.  
> Where is A relative to D?

Train on relation chains of length 2–4. Test out of distribution on chains of length 5–8.

### Model A — persistent MPF

- field: 16×16 or 32×32;
- state width: D=48 or 64;
- local 3×3 communication;
- shared recurrent update network;
- 8–16 update steps during training;
- weak global pooling + MLP readout.

### Model B — topology-destroyed MPF

Keep everything identical except apply a new random permutation of cell identities after every recurrent update.

This preserves:

- total state variables;
- trainable parameter count;
- update network;
- number of recurrent steps;
- approximate compute;
- decoder.

It destroys persistent addressability.

### Model C — fixed random permutation

Apply one random permutation once and keep it fixed for the entire run.

Interpretation:

- if A > B but A ≈ C, **stable addressability matters**, but Cartesian geometry may not;
- if A > B and A > C, the learned spatial arrangement itself may matter;
- if A ≈ B ≈ C, the field organization is not yet earning its complexity.

## Metrics

Primary:

- exact-match task accuracy;
- length-OOD accuracy;
- accuracy versus recurrent update count;
- parameter count;
- measured inference MACs/FLOPs.

Secondary:

- convergence of field state;
- robustness to region deletion;
- linear-probe decodability of intermediate relations;
- targeted region-ablation effect.

## Evidence for field reasoning

Accuracy alone is insufficient.

For problems with known intermediate propositions, probe every recurrent step. A credible reasoning trace should show intermediate conclusions becoming available in the expected causal order.

Then intervene.

If a region appears to encode proposition P at step t, corrupt or patch that region and test whether logically downstream conclusions change selectively. This separates causal computation from post-hoc decodability.

## Experiment 1 — hierarchy

Compare:

- flat 32×32 field;
- 32×32 + 8×8 regions + 4×4 super-regions + global state;
- random groups with identical group sizes.

The hierarchical model earns its place only if it improves at least one of:

- OOD reasoning accuracy;
- number of recurrent steps required;
- compute at matched accuracy;
- robustness;
- representation rate.

## Experiment 2 — scale reuse

Use the same update rule at multiple resolutions.

This is the experiment that can justify **recursive** or eventually **fractal** terminology. If every scale requires independent parameters, call the system multiresolution instead.

## Experiment 3 — purposeful roles

Measure role stability across examples and random training seeds.

Evidence ladder:

1. information is linearly decodable from a region;
2. the same functional region recurs after seed alignment;
3. targeted ablation hurts the corresponding semantic factor more than random equal-area ablation;
4. patching the region transfers the predicted property while preserving unrelated properties.

## Experiment 4 — semantic rate–utility

Store trained field states using:

- fp16;
- int8;
- vector quantization;
- product quantization;
- entropy-coded quantized states;
- hierarchical VQ.

Count all instance-dependent bits.

Plot task utility against actual stored bits. Compare with flat continuous latents and VQ baselines.

## Experiment 5 — hyperbolic hierarchy

Use datasets with explicit taxonomic or tree structure.

Compare equal-dimensional Euclidean hierarchy channels with Poincaré/Lorentz hierarchy channels. Report downstream task score and hierarchy distortion.

Do not generalize a positive result beyond hierarchical data without evidence.

## Experiment 6 — damage and recovery

At an intermediate update:

- zero a contiguous region;
- randomly drop cells;
- inject state noise;
- patch in a region from another example.

Continue recurrence and measure task recovery over time.

Call this semantic regeneration only if task-relevant state recovers—not merely the rendered RGB pattern.

## Minimum publishable package

A disciplined first paper can be small:

- NCA baseline;
- MPF-local;
- MPF-hierarchical;
- shuffled MPF;
- synthetic relational reasoning;
- shortest path;
- CLUTRR;
- ≥5 independent seeds;
- parameter-matched and compute-matched reporting;
- causal region interventions.

If topology and hierarchy survive those controls, the larger compression, hyperbolic, memory, and album program becomes justified.
