---
layout: research
title: "00 · Research Thesis"
---

# Research thesis

## Core question

> Can a persistent, spatially addressable, multiresolution field of learned multidimensional states acquire purposeful computational roles and serve as a useful substrate for machine reasoning?

An MPF is a recurrent state tensor:

`F_t ∈ R^(H×W×D)`

with cell state `x_ij^(t) = F_t[i,j]` and shared update dynamics:

`x_ij^(t+1) = x_ij^(t) + gθ(x_ij, local(F_t), region(F_t), global(F_t), q)`.

The important concept is persistence. The field is not merely an intermediate activation map; it is intended to be the machine's working state.

## What a cell is

A cell may contain unconstrained learned dimensions or partitions such as:

- semantic/content state;
- learned role state;
- recurrent working memory;
- confidence or control state;
- routing / communication state;
- hierarchy-specific state.

Those labels are architectural hypotheses, not biological claims and not requirements that humans hand-label neurons.

## What "pixel" means

The word pixel refers to **addressability and visualization**, not information capacity. RGB/hex/HSL are alternative descriptions of visible color. The actual computational primitive is the high-dimensional state vector. A fixed 64→3 projection can render the state as color for inspection.

## Strong form of the hypothesis

A publishable MPF result should establish at least one causal advantage from the field organization itself:

- persistent topology improves out-of-distribution reasoning;
- multiscale communication reduces recurrent steps or compute;
- stable regions develop causally identifiable computational roles;
- field dynamics expose faithful intermediate reasoning state;
- distributed state permits semantic damage recovery;
- quantized hierarchical fields improve task utility per stored bit.

## Compression claim

A 32×32×64 fp16 field occupies 128 KiB before compression. Therefore the grid is not intrinsically compact.

Compression can only come from mechanisms such as quantization, entropy coding, sparsity, shared codebooks, low-rank structure, recursive rule reuse, predictive coding, or hierarchical abstraction.

The correct dependent variable is **rate–utility**, not visual compactness.

## "Fractal" claim

Use **multiresolution** or **hierarchical** by default.

Reserve *fractal* for a demonstrated case where substantially the same computational/representational rule is recursively reused across cell, region, field, and possibly album scales, with measurable parameter, storage, or generalization benefit.

## Hyperbolic claim

Hyperbolic geometry is not another embedding dimension. It is a choice of geometry for distances and transformations. It should be tested only where hierarchical structure predicts an advantage, with matched Euclidean controls.

## North star

MPF asks whether **position, state, neighborhood, scale, and temporal transformation can jointly become a learned representational language** for AI memory and reasoning.
