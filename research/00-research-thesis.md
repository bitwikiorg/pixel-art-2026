---
layout: research
title: What is an MPF?
---

# What is a Multidimensional Pixel Field?

<div class="plain-box"><strong>Plain English:</strong> imagine a scratchpad made of many small locations. Each location stores a learned vector rather than a color. The locations repeatedly exchange information, so the scratchpad itself becomes part of the computation.</div>

## The central research question

Can a machine-learning system use a persistent two-dimensional field of high-dimensional learned states—not merely as an activation map, but as the actual workspace in which information is stored, organized and iteratively transformed?

The field is

```text
F_t ∈ R^(H × W × D)
```

with one cell

```text
F_t[i,j] = x_ij^(t) ∈ R^D.
```

A visible RGB pixel can be generated from that state for inspection, but RGB is not the computational limit. The original project formulation explicitly separates the **visible pixel** from the **multidimensional computational cell**.

## Why use a field at all?

A conventional model can already hold information in vectors or tensors. The reason to study a persistent field is more specific: a field gives every state both an **internal representation** and an **address**.

That creates several architectural possibilities:

- neighboring locations can communicate with a cheap local rule;
- stable position can act as working memory;
- regions can form larger computational units;
- coarse and fine representations can coexist;
- the same update rule can be reused over time;
- intermediate computation can be visualized and intervened on spatially.

None of those advantages is automatic. They are separate research questions.

## The shortest useful model

A minimal version contains four pieces:

1. **Writer** — converts the input into an initial field `F₀`.
2. **Local recurrent rule** — updates every cell from itself and nearby cells.
3. **Repeated updates** — produces `F₁, F₂, …, F_T`.
4. **Readout** — extracts a prediction from the final field.

A generic update can be written as

```text
x_ij^(t+1) = x_ij^t + gθ(x_ij^t, N_ij(F_t), q)
```

where `N_ij` is local neighborhood information, `q` is an optional task/query representation, and `gθ` is a learned function shared across space.

This basic mechanism is strongly related to [Neural Cellular Automata](https://distill.pub/2020/growing-ca/). MPF should therefore be understood as an architectural research program built **on top of** that lineage, not as the discovery that grid cells can contain vectors.

## What makes MPF a distinct research direction?

The project is interested in combining several properties in one persistent workspace:

### Semantic topology
The arrangement of states may become useful rather than incidental. Stable addresses, neighborhoods, regions or learned long-range connections may carry information.

### Purposeful specialization
Some locations or regions may develop persistent functions—entity memory, relation processing, routing, uncertainty, or other roles. These roles should emerge from training and be studied causally rather than assigned by aesthetic interpretation.

### Multiresolution organization
Cells can be summarized into regions, regions into super-regions, and coarse information can return to fine states. If the same rule can be reused across scales, the architecture becomes recursively organized.

### Persistence
The field can remain active across many recurrent updates and may eventually be stored and recalled as machine memory.

### Representation efficiency
A raw multidimensional field is not compressed. Compression becomes a separate engineering problem involving quantization, sparsity, shared codebooks, hierarchy, entropy coding or predictive reconstruction.

## How this differs from an image

The grid is convenient because it provides a regular neighborhood and is easy to visualize. But the research object is not “AI stored in a PNG.” A normal image format cannot directly hold a 64-dimensional float vector at every visible pixel.

A practical implementation is a tensor, for example:

```python
field.shape == [batch, height, width, channels]
```

Color is a human-facing projection of a few hidden channels.

## How this differs from a Transformer

A Transformer usually lets any token directly interact with any other through attention. A local field instead imposes locality and uses recurrent steps to propagate information. That can make communication scale differently, but it can also require many updates. The tradeoff is empirical.

Recent recurrent latent-reasoning work is relevant because it shows renewed interest in gaining computation by repeatedly applying a shared block rather than only producing more output tokens. See the [current frontier page]({{ '/research/09-current-frontier/' | relative_url }}).

## Working architecture map

```text
input / query
    ↓
field writer
    ↓
F₀ ─→ local perception ─→ shared update ─→ F₁
                              ↑             │
                              └──── repeat ─┘
                                    ↓
                          optional region levels
                                    ↓
                                 readout
```

The project becomes interesting when the **field itself** carries useful intermediate state, not merely when a powerful encoder or decoder happens to surround a decorative grid.

## Continue

- [Start Here: mechanism-by-mechanism]({{ '/learn/' | relative_url }})
- [Neural architecture]({{ '/research/05-neural-architecture/' | relative_url }})
- [Live neural field]({{ '/experiment/' | relative_url }})
- [Research neighborhood]({{ '/research/01-prior-art/' | relative_url }})
