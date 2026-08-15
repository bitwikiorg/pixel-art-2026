---
layout: research
title: Geometry and Vector-Symbolic State
---

# Geometry, hyperbolic hierarchy and vector-symbolic state

<div class="plain-box"><strong>Plain English:</strong> the 2D grid tells us which cells are physically adjacent, but the vectors inside those cells can live in a very different mathematical space. That gives the project two independent notions of “nearby”: grid-near and meaning-near.</div>

## Physical geometry versus semantic geometry

A cell has a physical coordinate `(i,j)`, but its vector state can also define a semantic distance.

```text
physical distance: distance between grid addresses
semantic distance: distance between learned vectors
```

These do not need to agree.

Possible architecture:

- local 2D neighbors for cheap communication;
- learned semantic neighbors for occasional long-range communication;
- hierarchical parent/child connections across scales.

## Hyperbolic geometry

Hyperbolic space has negative curvature. Its volume grows rapidly with radius, which makes it a natural candidate for embedding branching structures.

[Poincaré Embeddings](https://arxiv.org/abs/1705.08039) demonstrated strong results on hierarchical symbolic data.

Important precision:

- hyperbolic geometry is not “4D”;
- it does not create storage capacity for free;
- not all semantic data is hierarchical;
- optimization is more complex than ordinary Euclidean vectors.

## A conservative hybrid MPF

Do not make every cell fully hyperbolic first. Split state:

```text
x_ij = [e_ij | h_ij]
```

where:

- `e` is ordinary Euclidean content used by the recurrent computation;
- `h` is a smaller hierarchy representation trained with hyperbolic distance.

Compare `h` against an equal-dimensional Euclidean hierarchy representation.

Tasks should contain explicit tree structure: taxonomies, nested relations, or hierarchical retrieval.

## Hyperbolic neighborhood versus physical neighborhood

A useful later mechanism is to add sparse edges to semantically close hyperbolic neighbors while preserving local grid connections.

Then test:

```text
local grid only
vs
local + Euclidean semantic neighbors
vs
local + hyperbolic semantic neighbors
```

This makes geometry a measurable routing choice.

## Vector-Symbolic Architectures (VSA) / Hyperdimensional Computing (HDC)

VSA/HDC represents information with high-dimensional vectors and defines algebraic operations that preserve distributed structure.

Common ideas:

- **binding** — combine two items into a representation of their relationship;
- **bundling / superposition** — combine several vectors;
- **permutation** — encode order or role;
- **similarity** — retrieve related structures.

Start with [A Survey on Hyperdimensional Computing](https://arxiv.org/abs/2111.06077) and Plate's [Holographic Reduced Representations](https://pubmed.ncbi.nlm.nih.gov/18263348/).

## Why combine VSA with a field?

One possible synthesis:

```text
cell vector        = local distributed representation
field position     = persistent address / routing context
VSA operations     = explicit composition
recurrent updates  = iterative refinement
region hierarchy   = coarse context
```

For example, a cell can bind an entity vector with a relation vector, while neighboring cells propagate context that determines which bindings should interact.

## What to test

### Binding inside cells
Compare ordinary learned concatenation/MLP composition with an explicit VSA binding operation.

### Spatial retrieval
Ask whether a bound representation is easier to retrieve when related structures occupy stable field neighborhoods.

### Generalization
VSA operations are attractive partly because they can encode compositional structure. Test longer unseen relation chains and novel entity combinations.

### Robustness
High-dimensional distributed codes can be noise tolerant. Compare cell-state corruption with ordinary dense latent representations.

## Keep the layers conceptually separate

The field, hyperbolic geometry and VSA are three different ideas:

1. **field** — where state persists and communicates;
2. **geometry** — how distances/relationships inside state are measured;
3. **VSA** — how high-dimensional structures are algebraically composed.

Combining them only becomes informative after each has a clean control.
