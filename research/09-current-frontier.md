---
layout: research
title: Current Frontier 2025–2026
---

# Recurrence, cellular reasoning, and ARC

Recent work on Neural Cellular Automata, recurrent latent depth, cellular reasoning tasks, and ARC-style abstraction makes several baselines unavoidable. Iterative latent computation is already an active research direction; a persistent pixel field needs to isolate what spatial address, memory, topology, or internal cell structure contributes beyond recurrence itself.

## Neural Cellular Automata for ARC-AGI

Kevin Xu and Risto Miikkulainen apply gradient-trained NCA update rules to ARC-AGI transformations. The system learns iterative local transformations from training examples and applies them to test inputs.

- [UT Austin publication record](https://www.cs.utexas.edu/~ai-lab/pub-view.php?PubID=128129)
- [arXiv](https://arxiv.org/abs/2506.15746)

Abstract grid transformation is therefore not an empty niche for computational-pixel research. A stronger contribution must go beyond showing that local recurrent cells can solve grid tasks and instead test persistent semantic state, alternative cell primitives, memory, learned organization, multiscale structure, or causal reasoning traces.

## ARC-NCA and neighboring methods

ARC Prize's 2025 paper awards included **ARC-NCA: Towards Developmental Solutions to the Abstraction and Reasoning Corpus**, alongside work on tiny recursive models and vector-symbolic approaches.

- [ARC Prize 2025 competition and paper awards](https://arcprize.org/competitions/2025)

The convergence is technically important: recurrence, cellular dynamics, and vector-symbolic representations can all be aimed at abstract transformation problems. Their differences need to be measured rather than blurred under a single “reasoning” label.

## Recurrent latent reasoning

Geiping et al., **Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach**, repeatedly apply a recurrent block to increase latent computational depth at test time.

- [NeurIPS 2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/3b01972cf31e6fa0fe29e4b8b5c2a0a1-Abstract-Conference.html)

Recurrence can therefore be treated as a controllable compute budget rather than only as sequence memory. A spatial field adds another variable: the latent state is not only recurrent but addressable and locally or hierarchically organized.

A fair comparison asks whether that organization improves performance per unit of state or compute beyond a nonspatial recurrent block.

## Cellular reasoning depth

Rodkin et al., **Beyond Memorization: Extending Reasoning Depth with Recurrence, Memory and Test-Time Compute Scaling**, use controlled cellular-automata-derived tasks with train/test rules separated to reduce memorization. They report that deeper reasoning remains difficult and that recurrence, memory, and additional test-time computation improve effective reasoning depth while leaving important limits.

- [ACL Anthology — Findings of ACL 2026](https://aclanthology.org/2026.findings-acl.2103/)

The experimental lesson is stronger than a vague “reasoning” score. Construct tasks where required computation depth is known, train on a limited range, and measure accuracy as the required depth exceeds training.

## ARC-AGI-2

ARC-AGI-2 was introduced as a harder abstraction and reasoning benchmark intended to stress current systems.

- [ARC-AGI-2](https://arcprize.org/arc-agi/2)

It is a late-stage target for a new architecture. Early mechanism tests are better served by generated tasks with known rules, controlled difficulty, and exact intermediate states.

## Consequences for experimental design

### Recurrent depth must be measured explicitly

Whenever recurrence is used, report performance versus update count rather than treating depth as an implementation detail.

### NCA is a direct baseline

A learned local vector field should be compared with a standard NCA or recurrent-convolution formulation under the same task and resource accounting.

### Grid reasoning requires stronger differentiation

ARC-oriented NCA work already exists. Spatial fields therefore need to earn their additional claims through memory, semantic persistence, internal structure, learned topology, multiresolution state, or inspectable computation.

### Controlled synthetic tasks remain essential

If required depth and intermediate states are known, mechanism failures can be localized. A single aggregate benchmark score cannot reveal whether a model learned the intended computation or exploited a shortcut.

### Small recursive networks are strong controls

If a compact recurrent model solves the same task with fewer resources and no persistent spatial field, spatial structure has not yet justified its cost.

## A defensible escalation of task difficulty

```text
four-way spatial relation
    ↓
local field + topology controls
    ↓
longer relation composition
    ↓
shortest-path trace prediction
    ↓
multiresolution or persistent-memory task
    ↓
systematic compositional generalization
    ↓
ARC-style abstract transformation
```

The useful escalation is in **difficulty of the computation and strength of the controls**, not simply in grid resolution.
