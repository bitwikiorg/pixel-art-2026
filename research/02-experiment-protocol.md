---
layout: research
title: Experimental Program
---

# Experimental program

<div class="plain-box"><strong>Plain English:</strong> the lab is a sequence of questions. Each experiment changes one part of the field and observes what happens to learning, generalization, computation or memory.</div>

The browser demo is the first executable model, not the final experiment. The larger research program should move from tiny controlled tasks to harder reasoning and memory settings.

## Lab 1 — Trainable local recurrent field

**Question:** can a shared local neural rule learn a global spatial relation?

The live TensorFlow.js model writes two marked locations into a 12×12 field, performs several recurrent convolutional updates and predicts LEFT / RIGHT / ABOVE / BELOW.

What this teaches:

- cell state is learned, not assigned a semantic color;
- the same local weights can be reused over space and time;
- recurrence gives local communication more effective range;
- intermediate hidden states can be visualized.

[Run it in the browser]({{ '/experiment/' | relative_url }}).

## Lab 2 — Persistent address versus shuffled state

Use the same trained local model, but permute cell locations between recurrent updates.

Three versions are informative:

| Version | What stays stable? | What it probes |
|---|---|---|
| Persistent grid | position + neighborhood | full field organization |
| Fixed random permutation | stable address, altered Cartesian placement | addressability versus specific geometry |
| New permutation each step | no stable address | whether recurrence depends on persistent locations |

A useful result does not have to be “the grid wins.” If a fixed random graph works as well as 2D coordinates, the project should describe the useful mechanism as persistent graph structure rather than specifically pixels.

## Lab 3 — Recurrence depth

Train with a range of update counts and evaluate with more or fewer recurrent steps.

Plot:

```text
accuracy versus number of recurrent updates
```

Questions:

- Does performance improve as information gets more time to propagate?
- Does it saturate?
- Does running far beyond training destabilize the field?
- Do longer-distance examples benefit more from extra recurrent depth?

This connects directly to current work on recurrent latent computation and test-time depth.

## Lab 4 — Multiresolution field

Add regional summaries:

```text
32×32 cells → 8×8 regions → 4×4 super-regions → global
```

Compare:

- local-only field;
- local + region;
- local + region + global;
- equal-size randomly grouped regions.

This separates the benefit of **coarse communication capacity** from the benefit of **spatially meaningful hierarchy**.

## Lab 5 — Shortest-path / wavefront computation

Give the model an obstacle grid plus start and goal locations. Ask for path existence, shortest distance or first action.

This task is useful because a classical breadth-first search produces a ground-truth wavefront over time. The learned field can be compared against that computational trace.

Caution: pathfinding naturally favors spatial architectures, so it should be paired with non-spatial relation tasks.

## Lab 6 — Symbolic relational composition

Use arbitrary entities and facts such as:

```text
A is left of B
B is above C
C is right of D
```

and ask for a relation that requires composition.

Train on short chains and evaluate on longer unseen chains. This tests whether recurrent depth supports systematic composition rather than only geometric lookup.

Useful later benchmarks include [bAbI](https://research.facebook.com/downloads/babi/) and [CLUTRR](https://arxiv.org/abs/1908.06177).

## Lab 7 — Learned semantic layout

There are two different input regimes:

### Oracle layout
A human decides where entities are written. This is excellent for debugging.

### Learned layout
An encoder produces item embeddings and learns where/how to write them into the field.

The second is essential if the project wants to study whether a useful semantic geography can emerge rather than being supplied by the experimenter.

## Lab 8 — Functional specialization

Observe whether locations or regions develop consistent functions across examples and random training seeds.

Useful measurements:

- activation patterns by task factor;
- linear probes for entity/relation/intermediate state;
- intervention maps;
- region-to-role consistency across seeds;
- selective damage versus equal-size random damage.

A readable visualization should distinguish **correlation** (“this region is active”) from **causal contribution** (“editing this region selectively changes this computation”).

## Lab 9 — Persistence, damage and recovery

Delete or corrupt a region after the field has formed useful state, then continue recurrent updates.

Measure a recovery curve:

```text
performance after damage versus additional update steps
```

Growing NCA provides a strong precedent for self-repair in pattern-forming systems. The open question is whether analogous recovery can occur for semantic or reasoning state.

## Lab 10 — Stored state and quantization

Quantize a trained field between episodes. Compare:

- fp16 state;
- int8 state;
- VQ codebook indices;
- product VQ;
- sparse / top-k state;
- flat quantized latent baseline.

Report **actual stored bits** and task utility after reconstruction or resumption.

## Experimental fairness

Different architectures spend resources differently, so report at least three views:

1. similar trainable parameter count;
2. similar inference computation;
3. similar stored representation bits.

These controls are interpretive tools. They keep the experiment readable: when something changes, we can say more precisely *what* changed.

## A practical first research suite

A compact serious study can start with four models:

- NCA-style local recurrent grid;
- MPF-Local;
- MPF-Hier;
- shuffled-state MPF.

and three task families:

- spatial relations;
- shortest path;
- CLUTRR-style relational composition.

Measure accuracy, longer-depth generalization, accuracy versus recurrent steps, compute, and region interventions.
