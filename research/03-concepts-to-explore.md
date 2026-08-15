---
layout: research
title: "03 · Concepts to Explore"
---

# Concepts to explore

These are branches of the MPF program. They should not all be implemented at once.

## 1. Learned semantic geography

Can the write mechanism discover where information should live instead of receiving a human-designed layout?

Compare oracle placement, soft learned placement, and unconstrained placement.

## 2. Stable addresses vs Cartesian geometry

A fixed random graph may provide persistent addresses without meaningful x/y geometry. Test regular grid neighbors against fixed random neighbors and learned content-addressed neighbors.

This determines whether the true object is a **pixel field**, a **persistent graph**, or a **recurrent set**.

## 3. Role channels

Reserve a small subset of cell dimensions for slowly changing role identity while the remaining dimensions hold fast-changing content.

Question: does separating *what this location does* from *what it currently contains* improve specialization and interpretability?

## 4. Fast state / slow state

Give each cell two timescales:

- fast working state updated every reasoning step;
- slow memory state updated only when confidence is high.

This could turn a field from working memory into persistent learned memory.

## 5. Semantic neighborhoods

Physical neighbors and semantic neighbors need not be identical.

Test a dual graph:

- local Cartesian edges for cheap diffusion;
- sparse learned semantic edges for distant but related concepts.

## 6. Product geometry

A cell need not live in one geometry. Use Euclidean content channels plus hyperbolic hierarchy channels.

The research question is not “is hyperbolic better?” but “which kinds of information benefit from which geometry?”

## 7. Vector-symbolic operations inside cells

Introduce differentiable binding/bundling/permutation operations from VSA/HDC as explicit tools available to the recurrent update.

This might help a field represent role–filler relationships without storing every relation in a separate location.

## 8. Quantized persistent memory

Keep active computation continuous, but quantize fields when they are stored between episodes.

This avoids injecting quantization error at every recurrent step while still testing the “semantic album” memory idea.

## 9. Semantic albums

Treat one field as an episode or coherent knowledge object. An album is then a collection of fields with an index for retrieval and inter-field communication.

Questions:

- how are fields retrieved?
- can fields be merged?
- can one field write to another?
- can repeated structure be shared across fields?

## 10. Field consolidation

Periodically compress many episodic fields into a higher-level field.

This resembles memory consolidation: detailed instances remain available while recurring structure is summarized.

## 11. Self-contained fields

Use three levels of self-containment:

1. **interpreter-dependent** — only latent state is stored;
2. **instance-self-contained** — a shared interpreter/codebook is allowed, but every instance-specific bit travels with the field;
3. **strict self-describing** — schema/codebook/decoding metadata are encoded inside the artifact.

Start with level 2. Level 3 is a separate research problem.

## 12. Shared-scale recurrence

Run the same update operator on cells, regions, and super-regions.

If successful, this supplies a rigorous version of the “fractal” intuition: computational law is reused across scale.

## 13. Conditional computation

Not every cell should update every step.

Learn a gate so only active or uncertain regions spend compute. Measure solved-task utility per cell-update.

This could make the field computationally sparse.

## 14. Attractor reasoning

Train solved field configurations to become stable attractors. After reaching an answer, the system should remain correct for extra update steps and potentially recover after perturbation.

## 15. Counterfactual field editing

If a region represents a causal factor, edit that region and observe whether the downstream reasoning changes predictably.

This is simultaneously an interpretability test and a possible interface for controllable AI reasoning.

## 16. Learned read/write codecs

Instead of treating language tokens or visual features as the field itself, train explicit codecs:

`input → field` and `field → output`.

Then keep the decoder deliberately weak during early experiments so it cannot hide the reasoning outside the field.

## 17. Test-time compute scaling

Train with a variable number of recurrent steps and evaluate far beyond the training horizon.

A useful algorithmic field should ideally improve with additional steps until convergence rather than collapse outside the trained depth.

## 18. Topological phase transitions

Vary neighborhood density and long-range edge count. There may be regimes where information propagation becomes dramatically easier or where local specialization collapses into global homogenization.

## 19. Learned information routing

Give cells explicit send/receive gates or routing vectors. Measure whether routing structure becomes sparse, hierarchical, or task-specific.

## 20. Cognitive-neuroscience bridge without biological claims

Use cognitive neuroscience as a source of **computational questions**, not biological equivalence:

- persistent working state;
- topographic organization;
- recurrent inference;
- multiple timescales;
- hierarchical abstraction;
- distributed vs localized representations.

The class contribution can compare these computational motifs while remaining explicit that MPF is an engineered architecture.

## Highest-value order

1. topology causality;
2. recurrence-depth scaling;
3. hierarchy;
4. causal role specialization;
5. quantized persistent memory;
6. semantic albums;
7. VSA integration;
8. hyperbolic hierarchy;
9. strict self-description.
