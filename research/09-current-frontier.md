---
layout: research
title: Current Frontier 2025–2026
---

# Current frontier: recurrence, cellular reasoning and ARC

<div class="plain-box"><strong>Why this page exists:</strong> MPF is not developing in isolation. Recent work has renewed interest in recursive/recurrent latent computation, test-time depth, and Neural Cellular Automata on abstract reasoning tasks.</div>

## Neural Cellular Automata for ARC-AGI (2025)

Kevin Xu and Risto Miikkulainen apply gradient-trained NCA update rules to ARC-AGI transformations. The system learns iterative local transformations from training examples and applies them to test inputs.

- [UT Austin publication page](https://www.cs.utexas.edu/~ai-lab/pub-view.php?PubID=128129)
- [arXiv](https://arxiv.org/abs/2506.15746)

**Relevance to MPF:** abstract grid transformation is already an active NCA research direction. A pixel-field project therefore needs to go beyond “NCA can solve grid tasks” toward persistent semantic state, memory, hierarchy, learned organization or reasoning traces.

## ARC-NCA and the ARC Prize ecosystem (2025)

ARC Prize's 2025 paper awards included **ARC-NCA: Towards Developmental Solutions to the Abstraction and Reasoning Corpus**, alongside work on tiny recursive models and vector-symbolic approaches.

- [ARC Prize 2025 competition / paper awards](https://arcprize.org/competitions/2025)

This is useful evidence that three neighboring directions—recursive latent computation, NCA and vector-symbolic methods—are converging on similar abstract-reasoning questions.

## Recurrent latent reasoning (NeurIPS 2025)

Geiping et al., **Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach**, repeatedly apply a recurrent block to increase latent computational depth at test time.

- [NeurIPS 2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/3b01972cf31e6fa0fe29e4b8b5c2a0a1-Abstract-Conference.html)

**Relevance to MPF:** recurrence is not merely an old RNN idea. It is again being studied as a way to allocate more internal computation without representing every reasoning step as output tokens. MPF adds a persistent spatial state to that general recurrent-depth idea.

## Cellular-automata reasoning depth (ACL 2026)

Rodkin et al., **Beyond Memorization: Extending Reasoning Depth with Recurrence, Memory and Test-Time Compute Scaling**, use controlled cellular-automata-derived tasks with train/test rules separated to reduce memorization. They report that deeper reasoning remains difficult and that recurrence, memory and additional test-time computation improve effective reasoning depth, though limits remain.

- [ACL Anthology — Findings of ACL 2026](https://aclanthology.org/2026.findings-acl.2103/)

**Relevance to MPF:** this provides a useful experimental style. Rather than asking vaguely whether a network “reasons,” construct tasks where required computational depth is known and measure accuracy as depth increases.

## ARC-AGI-2

ARC-AGI-2 was introduced in 2025 as a harder abstraction/reasoning benchmark intended to stress current systems.

- [ARC-AGI-2](https://arcprize.org/arc-agi/2)

It is a later-stage target for MPF, not a first task. The early model should use generated problems where the correct intermediate computation is known.

## What this changes about the MPF roadmap

The current literature makes several priorities clearer:

### 1. Recurrent depth should be a first-class axis
Always report performance versus update count.

### 2. NCA is a baseline, not only inspiration
A local recurrent MPF should be compared directly with a standard NCA formulation.

### 3. Abstract grid reasoning is no longer an empty niche
ARC-oriented NCA work exists. MPF should emphasize semantic persistence, multiresolution state, memory and inspectable computation.

### 4. Controlled synthetic tasks remain valuable
If a task exposes exact reasoning depth or intermediate states, it can tell us more about the mechanism than a single aggregate benchmark score.

### 5. Small recursive networks deserve serious comparison
If a tiny recurrent network solves the same task with fewer resources and no persistent field, the field has not added useful structure yet.

## A good near-term progression

```text
browser relation demo
    ↓
PyTorch local field + shuffled controls
    ↓
longer relation composition
    ↓
shortest-path trace task
    ↓
multiresolution field
    ↓
CLUTRR / CellARC-like systematic generalization
    ↓
ARC-style abstract transformation
```

The project should scale **complexity of the question**, not merely grid size.
