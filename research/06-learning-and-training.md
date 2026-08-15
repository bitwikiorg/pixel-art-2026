---
layout: research
title: Learning and Training
---

# How a multidimensional field learns

<div class="plain-box"><strong>Plain English:</strong> the field begins with random neural weights. Examples produce predictions; errors are differentiated backward through every recurrent update; gradient descent changes the shared rule so future fields evolve more usefully.</div>

## Backpropagation through the field

Suppose the model produces

```text
F_0 → F_1 → … → F_T → prediction
```

All recurrent transitions are differentiable. The loss gradient flows backward from the prediction through `F_T`, then through each prior update to the writer and shared update parameters.

This is essentially **backpropagation through time (BPTT)** applied to a spatial recurrent state.

Background: [Backpropagation — Wikipedia](https://en.wikipedia.org/wiki/Backpropagation) · [Recurrent neural networks — Scholarpedia](https://www.scholarpedia.org/article/Recurrent_neural_networks).

## Why weight sharing matters

If the same update network `Uθ` is reused at every cell and recurrent step, learning discovers one general local algorithm rather than a separate parameter set for each address and time point.

This can produce strong parameter efficiency, but it also creates an optimization challenge: the same transformation must remain useful over many iterations.

## The live relation task

The browser experiment generates examples containing two locations:

- marker A;
- marker B;
- target label: LEFT, RIGHT, ABOVE or BELOW.

Training distances are shorter than a second evaluation range. This gives a tiny demonstration of **distance generalization**: can a recurrent local rule trained on nearby pairs transfer to farther pairs?

The task is deliberately simple. Its purpose is to expose the training mechanics in a browser, not to establish a research result.

## Better training tasks

### Relation chains
Train on 2–4 relations and evaluate on chains of 5–8.

### Shortest path
Generate random mazes with exact BFS traces.

### Cellular-rule induction
Give input/output examples from unknown cellular-automata rules, then evaluate multi-step prediction on unseen rules.

### CLUTRR
Move to longer kinship relation composition. [CLUTRR paper](https://arxiv.org/abs/1908.06177).

## Training recurrent depth

A useful strategy is to sample the number of recurrent steps:

```text
T_train ~ Uniform{8, ..., 16}
```

Then evaluate:

```text
T_test ∈ {4, 8, 16, 24, 32, 48, 64}
```

This produces a **compute curve** rather than a single accuracy score.

Questions:

- Does more recurrence improve difficult examples?
- Is there a stable fixed point?
- Does the model degrade if run too long?
- Can it generalize to more recurrent depth than it saw while training?

## Stability and residual updates

Pure repeated nonlinear updates can explode, vanish or oscillate. Helpful mechanisms include:

- residual state updates;
- learned gates;
- normalization;
- gradient clipping;
- randomizing recurrent depth;
- stochastic cell updates;
- training from intermediate state pools.

Growing NCA used state pools in some experiments to train persistent/regenerative behavior rather than only one-shot trajectories.

## Learned layout versus supplied layout

There are two conceptually different training problems.

### Supplied layout
The experimenter decides where information goes. This isolates field dynamics and is the best place to debug.

### Learned layout
The network must learn where to write entities or facts. This is necessary to study whether semantic organization can emerge.

Do not mix the two conclusions. A model that reasons well on a human-designed spatial arrangement has not yet learned its own semantic geography.

## Role specialization

If the project explicitly allocates role channels, a practical decomposition is:

```text
x = [content | role | recurrent memory]
```

For example:

```text
48 content + 8 role + 8 memory = 64 dimensions
```

But an undifferentiated 64-dimensional state is an essential control. Any explicit partition should demonstrate that it improves learning, stability, interpretability or transfer.

## Optimization defaults for the research prototype

A reasonable starting configuration:

| Setting | Initial value |
|---|---:|
| field | 16×16 for debugging; 32×32 main |
| cell width | 32–64 |
| update hidden width | 128 |
| local neighborhood | 3×3 |
| recurrent updates | 8–16 sampled |
| optimizer | AdamW |
| learning rate | ~3e-4 |
| gradient clip | 1.0 |
| seeds | ≥5 for serious comparisons |

These are starting points, not standards.

## What to log

For each run, save more than final accuracy:

- training/validation loss;
- accuracy versus recurrent step;
- hidden-state snapshots;
- update-magnitude maps;
- gradient norms;
- parameter count;
- inference compute;
- wall-clock time;
- probe results;
- intervention results;
- random seed and configuration.

A good lab should make the **trajectory of computation** inspectable, not only its score.
